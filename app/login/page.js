"use client";

import React, { useState } from 'react';
import AppName from '../components/AppName';
import styles from "./login.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useRouteTo } from "../utils/router";
import { useUser } from "@/app/utils/contexts/userContext";

const LoginPage = () => {
    const routeTo = useRouteTo();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const { loginUser } = useUser();

    const [revealPassword, setRevealPassword] = useState(false);

    const toggleRevealPassword = () => {
        setRevealPassword(!revealPassword);
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            if (data?.user && data?.session && data?.user_details) {
                loginUser({
                    user: data.user,
                    session: data.session,
                    user_details: data.user_details,
                    os_type_user: data.os_type_user,
                });
            }
            switch (data?.user_details?.os_type_user.code) {
                case 'Structure':
                    routeTo('/structure/home');
                    break;
                case 'Contributor':
                    routeTo('/contributor/home');
                    break;
                case 'Project':
                    routeTo('/project/home');
                    break;
                default:
                    routeTo('/');
            }
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className={styles["app-name-form"]}>
                <h1>Bienvenue sur SkailUp</h1>
                <p>Site en cours de construction</p>
                <div className={styles["app-name-bottomed"]} >
                    <AppName size={52} logo={"./skailup_logo_only.png"} />
                </div>
            </div>

            <div className={styles["connection-form"]}>
                <div className={styles["shuffle-form"]}>
                    <button type="submit" className="buttons-primary" onClick={() => routeTo("/login")}>Se connecter</button>
                    <button type="submit" className="buttons-unselected" onClick={() => routeTo('/register')}>S'inscrire</button>
                </div>
                <form className="forms" onSubmit={onSubmit}>
                    <h2 className={styles["log-title"]}>Connexion</h2>

                    {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

                    <div className={styles["form-group"]}>
                        <label>Mail</label>
                        <input
                            type="email"
                            className="inputs"
                            placeholder="Email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles["form-group"]}>
                        <div className={styles["password-label-container"]} onClick={toggleRevealPassword}>
                            <label>Mot de passe</label>
                            <div className={styles["reveal-password"]}>
                                <span><p>Afficher </p></span>
                                <span>{revealPassword ? <FontAwesomeIcon icon={faEyeSlash} className={styles["icons icons-gray-light"]} /> : <FontAwesomeIcon icon={faEye} className={styles["icons icons-gray-light"]} />}</span>
                            </div>
                        </div>
                        <input
                            type={revealPassword ? "text" : "password"}
                            className="inputs"
                            placeholder="Mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <a href="/#" className={styles["forgot-password"]}>Mot de passe oublié</a>
                    </div>

                    <button type="submit" className="buttons-primary" disabled={loading}>
                        {loading ? 'Connexion en cours...' : 'Se connecter'}
                    </button>
                </form>

            </div>

        </div >
    );
};

export default LoginPage;
