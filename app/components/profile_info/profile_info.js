"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./profile_info.module.css";
import { FiEdit2, FiTrash2, FiLinkedin } from "react-icons/fi";

const ProfileInfo = () => {

    // --- STATES POUR TOUS LES CHAMPS ---
    const [email, setEmail] = useState("demo.participant@skailup.com");
    const [fullName, setFullName] = useState("Solène Seguin");
    const [civility, setCivility] = useState("Madame");
    const [birthDate, setBirthDate] = useState("2025-06-23");
    const [phone, setPhone] = useState("+33 1 23 45 67 89");
    const [city, setCity] = useState("Paris");
    const [postalCode, setPostalCode] = useState("010000");
    const [address, setAddress] = useState("11 rue jean jaures 75000");
    const [linkedin, setLinkedin] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("📌 Données sauvegardées :", {
            email,
            fullName,
            civility,
            birthDate,
            phone,
            city,
            postalCode,
            address,
            linkedin
        });
    };

    return (
        <div>
            {/* AVATAR */}
            <div className={styles.avatarSection}>
                <Image src="/woman.png" alt="Profil" width={90} height={90} className={styles.avatar} />

                <div className={styles.avatarActions}>
                    <button className={styles.iconButton}><FiEdit2 /></button>
                    <button className={styles.iconButton}><FiTrash2 /></button>
                </div>
            </div>

            {/* FORM */}
            <form className={styles.form} onSubmit={handleSubmit}>

                {/* EMAIL */}
                <div className={styles.formGroup}>
                    <label>Mail</label>
                    <input
                        className="inputs"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                {/* NOM & CIVILITÉ */}
                <div className={styles.formDouble}>
                    <div className={styles.formGroup}>
                        <label>Nom et prénom</label>
                        <input
                            type="text"
                            className="inputs"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Civilité</label>
                        <select
                            className="inputs"
                            value={civility}
                            onChange={(e) => setCivility(e.target.value)}
                        >
                            <option value="Madame">Madame</option>
                            <option value="Monsieur">Monsieur</option>
                        </select>
                    </div>
                </div>

                {/* NAISSANCE & TÉLÉPHONE */}
                <div className={styles.formDouble}>
                    <div className={styles.formGroup}>
                        <label>Date de naissance</label>
                        <input
                            type="date"
                            className="inputs"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Téléphone personnel</label>
                        <input
                            type="tel"
                            className="inputs"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                </div>

                {/* VILLE / CODE POSTAL / ADRESSE */}
                <div className={styles.formTriple}>
                    <div className={styles.formGroup}>
                        <label>Ville</label>
                        <input
                            type="text"
                            className="inputs"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Code postal</label>
                        <input
                            type="text"
                            className="inputs"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Adresse postale</label>
                        <input
                            type="text"
                            className="inputs"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                </div>

                {/* LINKEDIN */}
                <div className={styles.formGroupLinkedin}>
                    <FiLinkedin size={20} className={styles.linkedIcon} />
                    <input
                        type="text"
                        className="inputs"
                        placeholder="https://linkedin.com"
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
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

export default ProfileInfo;
