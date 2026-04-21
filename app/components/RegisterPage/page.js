"use client";

import React, { useState, useEffect } from "react";
import AppName from "../components/AppName";
import styles from "./register.module.css";
import { useRouteTo } from "../utils/router";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const RegisterPage = () => {
    const routeTo = useRouteTo();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        os_type_user: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [profileOptions, setProfileOptions] = useState([]);

    const fetchOsTypeUsers = async () => {
        const res = await fetch(`${API_URL}/os_type_users`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
            
            throw new Error("Impossible de charger les types de profil");
        }

        return res.json();
    };

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                const data = await fetchOsTypeUsers();
                if (!mounted) return;

                if (!Array.isArray(data)) return;

                const opts = data
                    .map((item) => {
                        const value = item?.id ?? item?.value;
                        const label =
                            item?.lang_fr ?? item?.display ?? item?.label ?? item?.name;

                        if (!value || !label) return null;
                        return { value, label };
                    })
                    .filter(Boolean);

                setProfileOptions(opts);

                if (opts.length > 0) {
                    setFormData((prev) => ({ ...prev, os_type_user: opts[0].value }));
                }
            } catch (e) {
                console.error(e);
                setError(e.message || "Erreur lors du chargement des profils");
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Les mots de passe ne correspondent pas");
            return;
        }

        if (!formData.os_type_user) {
            setError("Veuillez sélectionner un type de profil");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    os_type_user: formData.os_type_user, // UUID attendu
                }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data?.error || "Registration failed");
            }

            // si ton backend renvoie des tokens/session
            if (data?.session?.access_token) {
                localStorage.setItem("access_token", data.session.access_token);
            }
            if (data?.session?.refresh_token) {
                localStorage.setItem("refresh_token", data.session.refresh_token);
            }

            routeTo("/structures/str_home");
        } catch (err) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className={styles["app-name-form"]}>
                <h1>Bienvenue sur SkailUp</h1>
                <p>Site en cours de construction</p>
                <div className={styles["app-name-bottomed"]}>
                    <AppName size={52} logo={"./skailup_logo_only.png"} />
                </div>
            </div>

            <div className={styles["register-form"]}>
                <div className={styles["shuffle-form"]}>
                    <button
                        type="button"
                        className="buttons-unselected"
                        onClick={() => routeTo("/login")}
                    >
                        Se connecter
                    </button>
                    <button
                        type="button"
                        className="buttons-primary"
                        onClick={() => routeTo("/register")}
                    >
                        S'inscrire
                    </button>
                </div>

                <form className="forms" onSubmit={onSubmit}>
                    <h2 className={styles["form-title"]}>Inscription</h2>

                    <div className={styles["form-group"]}>
                        <label>Type de profil</label>
                        <select
                            className="inputs"
                            name="os_type_user"
                            value={formData.os_type_user}
                            onChange={handleChange}
                            disabled={profileOptions.length === 0}
                        >
                            {profileOptions.length === 0 ? (
                                <option value="">Chargement...</option>
                            ) : (
                                profileOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>

                    <div className={styles["form-group"]}>
                        <label>Email</label>
                        <input
                            type="email"
                            className="inputs"
                            placeholder="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles["form-group"]}>
                        <label>Mot de passe</label>
                        <input
                            type="password"
                            className="inputs"
                            placeholder="Mot de passe"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles["form-group"]}>
                        <label>Confirmation du mot de passe</label>
                        <input
                            type="password"
                            className="inputs"
                            placeholder="Mot de passe"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {error && <div className={styles["error-message"]}>{error}</div>}

                    <button type="submit" className="buttons-primary" disabled={loading}>
                        {loading ? "Inscription..." : "S'inscrire"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
