"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FiMessageCircle } from "react-icons/fi";
import { FiUser, FiLogOut } from "react-icons/fi";
import styles from "./Header.module.css";
import { useRouteTo } from "../../utils/router";
import { useUser } from "@/app/utils/contexts/userContext";

const Header = () => {
    const { userDetails } = useUser();
    const { user } = useUser();
    
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
                <div className={styles["message-button"]}>
                    <FiMessageCircle size={25} />
                </div>

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
                            <p className={styles["profile-name"]}>{userDetails?.first_name} {userDetails?.last_name}</p>
                            <p className={styles["profile-role"]}>Compte {userDetails?.os_type_user.lang_fr}</p>
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
                                <button className={styles["dropdown-btn"]} onClick={() => {
                                    setOpen(false);
                                    routeTo('/profile/info');
                                }}>
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
