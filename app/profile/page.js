"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "./Profile.module.css";
import ProfileInfo from "../components/profile_info/profile_info";
import ProfileMdp from "../components/profile_mdp/profile_mdp";

const ProfilePage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const currentPage = searchParams.get("page") || "profile_info";

    const renderComponent = () => {
        switch (currentPage) {
            case "profile_info":
                return <ProfileInfo />;
            case "profile_mdp":
                return <ProfileMdp />;
            default:
                return <ProfileInfo />;
        }
    };

    const updatePage = (page) => {
        router.push(`?page=${page}`);
    };

    return (
        <div className={styles.profileWrapper}>
            <div className={styles.headerSection}>
                <h2 className={styles.title}>Données du profil</h2>
                <div className={styles.shuffler}>
                    <button className="buttons-primary">Profil</button>
                    <button className="buttons-unselected">Entreprise</button>
                </div>
            </div>

            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${currentPage === "profile_info" ? styles.active : ""}`}
                    onClick={() => updatePage("profile_info")}
                >
                    Infos personnelles
                </button>
                <button
                    className={`${styles.tab} ${currentPage === "profile_mdp" ? styles.active : ""}`}
                    onClick={() => updatePage("profile_mdp")}
                >
                    Mot de passe
                </button>
                <button className={styles.tab}>Signature</button>
            </div>

            {renderComponent()}
        </div>
    );
};

export default ProfilePage;
