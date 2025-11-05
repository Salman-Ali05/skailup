"use client";

import React from 'react';
import { useRouter } from "next/navigation";
import Link from "next/link";
import PageNameWhite from '../components/AppName';
import styles from "./register.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

const RegisterPage = () => {
    const router = useRouter();

    const onSubmit = (e) => {
        e.preventDefault();
        router.push('/structures/str_home');
    };

    return (
        <div className="container">
            <div className={styles["register-form"]}>
                <form className="forms" onSubmit={onSubmit}>
                    <h2 className={styles["sub-title"]}>Inscription</h2>

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

                <div className={styles["shuffle-form"]}>
                    <p>Déjà inscrit ? <Link href="/login">Se connecter</Link></p>
                </div>
            </div>

            <div className={styles["app-name-form"]}>

                <PageNameWhite />

            </div>

        </div>
    );
};

export default RegisterPage;
