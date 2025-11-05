"use client";

import React from 'react';
import { useRouter } from "next/navigation";
import Link from "next/link";
import PageNameWhite from '../components/AppName';
import styles from "./login.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

const LoginPage = () => {
    const router = useRouter();

    const onSubmit = (e) => {
        e.preventDefault();
        router.push('/structures/str_home');
    };

    return (
        <div className="container">
            <div className={styles["connection-form"]}>
                <form className="forms" onSubmit={onSubmit}>
                    <h2 className={styles["log-title"]}>Connexion</h2>

                    <div className={styles["form-group"]}>
                        <label>Email</label>
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

                <div className={styles["shuffle-form"]}>
                    <p>Pas encore inscrit ? <Link href="/register">S'inscrire</Link></p>
                </div>
            </div>

            <div className={styles["app-name-form"]}>

                <PageNameWhite />

            </div>

        </div>
    );
};

export default LoginPage;
