"use client";

import React from 'react';
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppName from '../components/AppName';
import styles from "./register.module.css";

const RegisterPage = () => {
    const router = useRouter();

    const onSubmit = (e) => {
        e.preventDefault();
        router.push('/structures/str_home');
    };

    const handleShuffleClick = (url) => {
        router.push(url);
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
                    <button className="buttons-unselected" onClick={() => handleShuffleClick('/login')}>Se connecter</button>
                    <button className="buttons-primary" onClick={() => handleShuffleClick('/register')}>S'inscrire</button>
                </div>
                <form className="forms" onSubmit={onSubmit}>
                    <h2 className={styles["form-title"]}>Inscription</h2>

                    <div className={styles["form-group"]}>
                        <label>Type de profil</label>
                        <select className="inputs" name="type">
                            <option value="Structure">Structure</option>
                            <option value="Intervenant">Intervenant</option>
                            <option value="Projet">Projet</option>
                        </select>
                    </div>

                    <div className={styles["form-group"]}>
                        <label>Email</label>
                        <input type="email" className="inputs" placeholder="Email" name="email" />
                    </div>

                    <div className={styles["form-group"]}>
                        <label>Mot de passe</label>
                        <input type="password" className="inputs" placeholder="Mot de passe" />
                    </div>

                    <div className={styles["form-group"]}>
                        <label>Confirmation du mot de passe</label>
                        <input type="password" className="inputs" placeholder="Mot de passe" />
                    </div>

                    <button type="submit" className="buttons-primary">S'inscrire</button>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
