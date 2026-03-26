"use client";

import { usePathname, useRouter } from "next/navigation";

export default function ProfileTabs() {
    const router = useRouter();
    const pathname = usePathname();

    const isInfo = pathname === "/profile/info";
    const isFirm = pathname === "/profile/firm";
    const isMdp = pathname === "/profile/mdp";

    return (
        <div className="tabs">
            <div className={`tab ${isInfo ? "tabActive" : ""}`} onClick={() => router.push("/profile/info")}>
                <p>
                    Infos personnelles
                </p>
            </div>
            <div className={`tab ${isFirm ? "tabActive" : ""}`} onClick={() => router.push("/profile/firm")}>
                <p>
                    Entreprise
                </p>
            </div>
            <div className={`tab ${isMdp ? "tabActive" : ""}`} onClick={() => router.push("/profile/mdp")}>
                <p>
                    Mot de passe
                </p>
            </div>
        </div>
    );
}
