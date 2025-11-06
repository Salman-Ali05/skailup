"use client";

import React from 'react';
import AppName from '../components/AppName';
import styles from "./login.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { useRouteTo } from "../utils/router";


const LoginPage = () => {
    const routeTo = useRouteTo();
    const onSubmit = (e) => {
        e.preventDefault();
        routeTo('/structures/str_home');
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
