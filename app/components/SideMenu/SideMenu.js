"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { FaHome, FaBullhorn, FaUsers, FaRocket, FaFolder, FaCog } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import styles from "./SideMenu.module.css";

const menuItems = [
    { label: "Accueil", icon: <FaHome />, href: "/structures/str_home", hidden: false },
    { label: "Intervenants", icon: <FaBullhorn />, href: "/structures/str_contributors", hidden: false },
    { label: "Projets", icon: <FaUsers />, href: "/structures/str_projects", hidden: false },
    { label: "Programmes", icon: <FaRocket />, href: "/structures/str_programs", hidden: false },
    { label: "Programmes", icon: <FaRocket />, href: "/structures/str_activity", hidden: true },
    { label: "Programmes", icon: <FaRocket />, href: "/structures/str_session", hidden: true },
    { label: "Ressources", icon: <FaFolder />, href: "/structures/str_resources", hidden: false },
    { label: "Paramètres", icon: <FaCog />, href: "/structures/str_settings", hidden: false },
];

const SideMenu = () => {
    const pathname = usePathname();

    return (
        <div className={styles["side-menu"]}>
            <div className={styles["side-menu-top"]}>
                <div className={styles["side-menu-header"]}>
                    <Image
                        src="/logoonly.png"
                        alt="Logo Structure"
                        width={30}
                        height={30}
                    />
                    <Image
                        src="/textonlylogo.png"
                        alt="Logo Structure"
                        width={150}
                        height={40}
                    />
                </div>

                <div className={styles["side-menu-links"]}>
                    {menuItems.map((item, index) => {
                        if (item.hidden) return null;

                        let isActive = pathname === item.href;

                        if (item.label === "Programmes") {
                            isActive = pathname.startsWith("/structures/str_activity") || pathname.startsWith("/structures/str_session") || pathname === item.href;
                        }

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
