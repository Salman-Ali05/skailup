"use client";

import React, { useState } from "react";
import styles from "./profile_mdp.module.css";

const ProfileMdp = () => {

    // --- STATES POUR TOUS LES CHAMPS ---
    const [mdp, setMdp] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("📌 Données sauvegardées :", {
            mdp
        });
    };

    return (
        <div>
            {/* AVATAR */}

            {/* FORM */}
            <form className={styles.form} onSubmit={handleSubmit}>

                {/* Mdp */}
                <div className={styles.formGroup}>
                    <label>Mot de passe</label>
                    <input
                        className="inputs"
                        type="password"
                        value={mdp}
                        onChange={(e) => setMdp(e.target.value)}
                    />
                </div>
                {/* SUBMIT */}
                <div className={styles.submitWrapper}>
                    <button type="submit" className="buttons-primary">Enregistrer</button>
                </div>
            </form>
        </div>
    );
};

export default ProfileMdp;
