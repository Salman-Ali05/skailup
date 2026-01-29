"use client";

import { usePathname, useRouter } from "next/navigation";
import styles from "../../profile/Profile.module.css";

export default function ProfileTabs() {
    const router = useRouter();
    const pathname = usePathname();

    const isInfo = pathname === "/profile/info";
    const isMdp = pathname === "/profile/mdp";

    return (
        <div className={styles.tabs}>
            <button
                className={`${styles.tab} ${isInfo ? styles.active : ""}`}
                onClick={() => router.push("/profile/info")}
            >
                Infos personnelles
            </button>

            <button
                className={`${styles.tab} ${isMdp ? styles.active : ""}`}
                onClick={() => router.push("/profile/mdp")}
            >
                Mot de passe
            </button>

            <button className={styles.tab} onClick={() => router.push("/profile/sign")}>
                Signature
            </button>
        </div>
    );
}
