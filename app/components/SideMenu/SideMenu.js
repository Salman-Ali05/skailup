"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { FaHome, FaBullhorn, FaUsers, FaRocket, FaFolder, FaCog, FaCheck } from "react-icons/fa";
import Link from "next/link";
import styles from "./SideMenu.module.css";
import { useUser } from "@/app/utils/contexts/userContext";
import { BsFileBarGraph } from "react-icons/bs";

const SideMenu = () => {
    const { userDetails } = useUser();
    const typeProfil = userDetails?.os_type_user?.code?.toLowerCase();

    const menuItems = [
        {
            label: "Accueil",
            icon: <FaHome />,
            href: `/${typeProfil}/home`,
            profiles: ["structure", "project", "contributor"],
        },
        {
            label: "Intervenants",
            icon: <FaBullhorn />,
            href: `/${typeProfil}/contributors`,
            profiles: ["structure"],
        },
        {
            label: "Projets",
            icon: <FaUsers />,
            href: `/${typeProfil}/projects`,
            profiles: ["structure"],
        },
        {
            label: "Programmes",
            icon: <FaRocket />,
            href: `/${typeProfil}/program`,
            profiles: ["structure", "project", "contributor"],
        },
        {
            label: "Ressources",
            icon: <FaFolder />,
            href: `/${typeProfil}/resources`,
            profiles: ["structure", "project", "contributor"],
        },
        {
            label: "Preuves d'activités",
            icon: <FaCheck />,
            href: `/${typeProfil}/activity_proof`,
            profiles: ["structure", "project", "contributor"],
        },
        {
            label: "Suivi budgétaire",
            icon: <BsFileBarGraph />,
            href: `/${typeProfil}/budget_track`,
            profiles: ["structure", "project", "contributor"],
        },
        {
            label: "Paramètres",
            icon: <FaCog />,
            href: `/${typeProfil}/settings`,
            profiles: ["structure"],
        },
        {
            label: "Debug",
            icon: <FaCheck />,
            href: `../../register/personal_info`,
            profiles: ["structure", "project", "contributor"],
        },
    ];

    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className={`${styles["side-menu"]} ${collapsed ? styles.collapsed : ""}`}>
            <div className={styles["side-menu-toggle"]}>
                <div
                    className={styles["menu-toggle"]}
                    onClick={() => setCollapsed(!collapsed)}
                >
                    {collapsed ? ">" : "<"}
                </div>
            </div>

            <div className={styles["side-menu-links"]}>
                {menuItems
                    .filter((item) => item.profiles.includes(typeProfil))
                    .map((item, index) => {
                        let isActive = pathname === item.href;

                        const isInSection = (section) =>
                            pathname === `/${typeProfil}/${section}` ||
                            pathname.startsWith(`/${typeProfil}/${section}/`);

                        if (item.label === "Programmes") {
                            isActive =
                                isInSection("program") ||
                                isInSection("activity") ||
                                isInSection("session");
                        }

                        return (
                            <Link
                                href={item.href}
                                key={index}
                                className={`${styles["side-menu-link"]} ${isActive ? styles.active : ""}`}
                            >
                                <span className={styles["side-menu-icon"]}>{item.icon}</span>
                                <span
                                    className={`${styles["side-menu-text"]} ${collapsed ? styles.hidden : ""}`}
                                >
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
            </div>
        </div>
    );
};

export default SideMenu;