"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./profile_info.module.css";
import { FiEdit2, FiTrash2, FiLinkedin } from "react-icons/fi";
import { useUser } from "@/app/utils/contexts/userContext";

const ProfileInfo = () => {

    const { userDetails } = useUser();
    const { user } = useUser();
    const { session } = useUser();
    
    // --- STATES POUR TOUS LES CHAMPS ---
    const [email, setEmail] = useState("");
    const [fName, setFName] = useState("");
    const [lName, setLName] = useState("");
    const [civility, setCivility] = useState("Madame");
    const [birthDate, setBirthDate] = useState("");
    const [phone, setPhone] = useState("");
    const [town, setTown] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [address, setAddress] = useState("");
    const [linkedin, setLinkedin] = useState("");

    useEffect(() => {
        if (userDetails) {
            setEmail(user.email || "");
            setFName(userDetails.first_name || "");
            setLName(userDetails.last_name || "");
            setCivility(userDetails.gender || "");
            setBirthDate(userDetails.birthday || "");
            setPhone(userDetails.phone || "");
            setTown(userDetails.town || "");
            setZipCode(userDetails.zip_code || "");
            setAddress(userDetails.address || "");
            setLinkedin(userDetails.linkedin || "");
        }
    }, [userDetails]);
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
            body: JSON.stringify({
                email,
                first_name: fName,
                last_name: lName, 
                gender: civility,
                birthday: birthDate,
                phone : phone,
                town : town,
                zip_code: zipCode,
                address,
                linkedin,
            }),
        });
        if (!res.ok) {
            // gérer l'erreur (afficher un message à l'utilisateur, etc.)
            console.error("Failed to update profile");
        } else {
            alert("Profil mis à jour avec succès !");
        }
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
                        <label>Nom</label>
                        <input
                            type="text"
                            className="inputs"
                            value={lName}
                            onChange={(e) => setLName(e.target.value)}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Prénom</label>
                        <input
                            type="text"
                            className="inputs"
                            value={fName}
                            onChange={(e) => setFName(e.target.value)}
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
                            value={town}
                            onChange={(e) => setTown(e.target.value)}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Code postal</label>
                        <input
                            type="text"
                            className="inputs"
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value)}
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
