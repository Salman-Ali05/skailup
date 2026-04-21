"use client";

import React from "react";
import { useRouter } from "next/navigation";
import style from "./programs.module.css";
import ProgramPage from "@/app/components/ProgramPage/ProgramPage";

const StructurePrograms = () => {
    const router = useRouter();

    const handleViewProgram = (programId) => {
        router.push(`/structure/activity/${programId}`);
    };

    const samplePrograms = [
        {
            id: 1,
            Param_Name: "Croissance+ Cohorte15",
            description: "Programme d'accompagnement",
            date_start: "2025-06-01",
            date_end: "2025-12-31",
            status: "En cours",
            Program: { name: "Coaching", icon: "/program1.png" },
            Contributors: [
                { firstName: "Julie", lastName: "Lafontaine" },
                { firstName: "Florino", lastName: "Jean" }
            ],
            Projects: ["Bio&Smart", "Capitole"],
        },
        {
            id: 2,
            Param_Name: "Pépinière 2025",
            description: "Pré-incubation",
            date_start: "2025-01-15",
            date_end: "2025-09-30",
            status: "Planifié",
            Program: { name: "Formation", icon: "/program2.png" },
            Contributors: [
                { firstName: "Dipo", lastName: "Bando" }
            ],
            Projects: ["Za'Earth"],
        },
        {
            id: 3,
            Param_Name: "Prévisions+",
            description: "Programme intensif",
            date_start: "2025-03-01",
            date_end: "2025-05-30",
            status: "Terminé",
            Program: { name: "Suivi", icon: "/program3.png" },
            Contributors: [
                { firstName: "Inter", lastName: "Venant" },
                { firstName: "Florino", lastName: "Jean" },
                { firstName: "Julie", lastName: "Lafontaine" },
                { firstName: "Dipo", lastName: "Bando" }
            ],
            Projects: ["Cont'Rib", "Bio&Smart"],
        },
    ];

    return (
        <div className={style["structure-layout"]}>
            <div className={style["structure-main"]}>
                <ProgramPage
                    programs={samplePrograms}
                    onViewProgram={handleViewProgram}
                    onCreateProgram={() => { }}
                />
            </div>
        </div>
    );
};

export default StructurePrograms;