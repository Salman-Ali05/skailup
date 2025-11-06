"use client";

import React from 'react';
import { useRouter } from "next/navigation";
import AppName from '../components/AppName';
import styles from "./login.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

const LoginPage = () => {
    const router = useRouter();

    const onSubmit = (e) => {
        e.preventDefault();
        router.push('/structures/str_home');
    };

    const handleShuffleClick = (url) => {
        router.push(url);
    }

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
                    <button type="submit" className="buttons-primary" onClick={() => handleShuffleClick('/login')}>Se connecter</button>
                    <button type="submit" className="buttons-unselected" onClick={() => handleShuffleClick('/register')}>S'inscrire</button>
                </div>
                <form className="forms" onSubmit={onSubmit}>
                    <h2 className={styles["log-title"]}>Connexion</h2>

                    <div className={styles["form-group"]}>
                        <label>Mail</label>
                        <input type="email" className="inputs" placeholder="Email" name="email" />
                    </div>

                    <div className={styles["form-group"]}>
                        <div className={styles["password-label-container"]}>
                            <label>Mot de passe</label>
                            <div className={styles["reveal-password"]}>
                                <span><p>Afficher</p></span>
                                <span><FontAwesomeIcon icon={faEye} className={styles["icons icons-gray-light"]} /></span>
                            </div>
                        </div>
                        <input type="password" className="inputs" placeholder="Mot de passe" />
                        <a href="/#" className={styles["forgot-password"]}>Mot de passe oublié</a>
                    </div>

                    <button type="submit" className="buttons-primary">Se connecter</button>
                </form>

            </div>

        </div >
    );
};

export default LoginPage;
