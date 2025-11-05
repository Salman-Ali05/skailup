"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { FaHome, FaBullhorn, FaUsers, FaRocket, FaFolder, FaCog } from "react-icons/fa";
import AppName from "../AppName";
import Image from "next/image";
import Link from "next/link";
import styles from "./SideMenu.module.css";

const menuItems = [
    { label: "Accueil", icon: <FaHome />, href: "/structures/str_home" },
    { label: "Intervenants", icon: <FaBullhorn />, href: "/structures/str_users" },
    { label: "Projects", icon: <FaUsers />, href: "/structures/str_projects" },
    { label: "Programmes", icon: <FaRocket />, href: "/structures/str_programs" },
    { label: "Ressources", icon: <FaFolder />, href: "/structures/str_resources" },
    { label: "Paramètres", icon: <FaCog />, href: "/structures/str_settings" },
];

const SideMenu = () => {
    const pathname = usePathname();

    return (
        <div className={styles["side-menu"]}>
            <div className={styles["side-menu-top"]}>
                <div className={styles["side-menu-header"]}>
                    <AppName />
                </div>

                <div className={styles["side-menu-profile"]}>
                    <div className={styles["profile-avatar"]}>
                        <Image
                            src="/logoproj.jpg"
                            alt="Logo Structure"
                            width={36}
                            height={36}
                            className={styles["profile-img"]}
                        />
                    </div>
                    <div className={styles["profile-info"]}>
                        <p className={styles["profile-name"]}>MieuxReussir</p>
                        <p className={styles["profile-role"]}>Structure</p>
                    </div>
                </div>

                <div className={styles["side-menu-links"]}>
                    {menuItems.map((item, index) => {
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                href={item.href}
                                key={index}
                                className={`${styles["side-menu-link"]} ${isActive ? styles.active : ""}`}
                            >
                                <span className={styles["side-menu-icon"]}>{item.icon}</span>
                                <span className={styles["side-menu-text"]}>{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default SideMenu;
