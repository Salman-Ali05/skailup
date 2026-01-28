"use client";

import React, { useState } from 'react';
import AppName from '../components/AppName';
import styles from "./login.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { useRouteTo } from "../utils/router";


const LoginPage = () => {
    const routeTo = useRouteTo();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('https://skailup-backend.vercel.app', {
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
            // Store token if your backend returns one
            if (data.token) {
                localStorage.setItem('authToken', data.token);
            }
            
            routeTo('/structures/str_home');
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
                        <div className={styles["password-label-container"]}>
                            <label>Mot de passe</label>
                            <div className={styles["reveal-password"]}>
                                <span><p>Afficher</p></span>
                                <span><FontAwesomeIcon icon={faEye} className={styles["icons icons-gray-light"]} /></span>
                            </div>
                        </div>
                        <input 
                            type="password" 
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
