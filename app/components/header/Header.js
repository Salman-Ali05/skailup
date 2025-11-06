"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FiMessageCircle } from "react-icons/fi";
import { FiUser, FiLogOut } from "react-icons/fi";
import styles from "./Header.module.css";
import { useRouteTo } from "../../utils/router";

const Header = () => {
    const routeTo = useRouteTo();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef();

    const toggleDropdown = () => setOpen(!open);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className={styles["header-container"]}>
            <div></div>

            <div className={styles["header-right"]}>
                <button className={styles["message-button"]}>
                    <FiMessageCircle size={18} />
                </button>

                <div className={styles["profile-container"]} ref={dropdownRef}>
                    <div className={styles.profile} onClick={toggleDropdown}>
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

                    {open && (
                        <div className={styles["dropdown-menu"]}>
                            <div className={styles["dropdown-user"]}>
                                <p className={styles["role"]}>Compte Structure</p>
                                <p className={styles["name"]}>Solène SEGUIN</p>
                                <p className={styles["email"]}>example@gmail.com</p>

                                <div className={styles["entreprise"]}>
                                    <Image src="/logoproj.jpg" alt="logo projet" width={40} height={40} className={styles["logo-entreprise"]} />
                                    <div>
                                        <p className={styles["entreprise-name"]}>MieuxReussir</p>
                                        <p className={styles["entreprise-type"]}>Entreprise</p>
                                    </div>
                                </div>
                            </div>

                            <div className={styles["dropdown-actions"]}>
                                <button className={styles["dropdown-btn"]}>
                                    <FiUser /> <span>Profile</span>
                                </button>
                                <button className={styles["dropdown-btn"]} onClick={() => routeTo('/login')}>
                                    <FiLogOut /> <span>Déconnexion</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
