"use client";

import React from "react";
import Image from "next/image";
import { FiMessageCircle } from "react-icons/fi";
import styles from "./Header.module.css";

const Header = () => {
    return (
        <header className={styles["header-container"]}>
            <div></div>

            <div className={styles["header-right"]}>
                <button className={styles["message-button"]}>
                    <FiMessageCircle size={18} />
                </button>

                <div className={styles.profile}>
                    <Image
                        src="/woman.png"
                        alt="Profil utilisateur"
                        width={32}
                        height={32}
                        className={styles["profile-img"]}
                    />
                    <div className={styles["profile-info"]}>
                        <p className={styles["profile-name"]}>Solène SEGUIN</p>
                        <p className={styles["profile-role"]}>Compte Structure</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
