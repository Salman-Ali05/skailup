"use client";

import React from "react";
import { useRouter } from "next/navigation";
import style from "./resources.module.css";
import RessourcePage from "@/app/components/ResourcePage/ResourcePage";

const StructureResources = () => {
    const router = useRouter();

    const handleViewResource = ( resourceId) => {
        router.push(`/structures/activity/${resourceId}`);
    };

    const sampleResources = [
        {
            id: 1,
            Param_Name: "Dev Program test",
            activite: "Dev Activité Yorozuya",
            resource_type: "document",
            Contributors: [
                { firstName: "Julie", lastName: "Lafontaine" },
                { firstName: "Florino", lastName: "Jean" }
            ],
            Projects: ["Bio&Smart", "Capitole"],
            date_ajout: "2025-06-01",
        },
        {
            id: 2,
            Param_Name: "Pépinière 2025",
            activite: "Pré-incubation",
            resource_type: "link",
            Contributors: [
                { firstName: "Dipo", lastName: "Bando" }
            ],
            Projects: ["Za'Earth"],
            date_ajout: "2025-01-15",
        },
        {
            id: 3,
            Param_Name: "Prévisions+",
            activite: "Programme intensif",
            resource_type: "document",
            Contributors: [
                { firstName: "Inter", lastName: "Venant" },
                { firstName: "Florino", lastName: "Jean" },
                { firstName: "Julie", lastName: "Lafontaine" },
                { firstName: "Dipo", lastName: "Bando" }
            ],
            Projects: ["Cont'Rib", "Bio&Smart"],
            date_ajout: "2025-03-01",
        },
    ];

    return (
        <div className={style["structure-layout"]}>
            <div className={style["structure-main"]}>
                <RessourcePage
                    resources={sampleResources}
                    onViewResource={handleViewResource}
                    onCreateResource={() => { }}
                />
            </div>
        </div>
    );
};

export default StructureResources;