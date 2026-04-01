"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useRouteTo } from "@/app/utils/router";
import style from "./actitvity.module.css";
import ActivityPage from "@/app/components/ActivityPage/ActivityPage";

const ProjectsActivity = () => {
    const routeTo = useRouteTo();
    const params = useParams();
    const { id } = params || {};

    const sampleActivity = [
        {
            id: 1,
            Param_Name: "Croissance+ Cohorte15",
            description: "Programme d’accompagnement",
            date_start: "2025-06-01",
            date_end: "2025-12-31",
            status: "En cours",
            Activity: { name: "Coaching", icon: "/activity1.png" },
            Contributors: ["Julie Lafontaine", "Florino Jean"],
            Projects: ["Bio&Smart", "Capitole"],
        },
        {
            id: 2,
            Param_Name: "Pépinière 2025",
            description: "Pré-incubation",
            date_start: "2025-01-15",
            date_end: "2025-09-30",
            status: "Planifié",
            Activity: { name: "Formation", icon: "/activity2.png" },
            Contributors: ["Dipo Bando"],
            Projects: ["Za'Earth"],
        },
        {
            id: 3,
            Param_Name: "Prévisions+",
            description: "Programme intensif",
            date_start: "2025-03-01",
            date_end: "2025-05-30",
            status: "Terminé",
            Activity: { name: "Suivi", icon: "/activity3.png" },
            Contributors: [
                "Inter Venant",
                "Florino Jean",
                "Julie Lafontaine",
                "Dipo Bando",
            ],
            Projects: ["Cont'Rib", "Bio&Smart"],
        },
    ];

    const handleViewActivity = (activityId) => {
        routeTo(`/project/session/${activityId}`);
    };

    return (
        <div className={style["structure-layout"]}>
            <div className={style["structure-main"]}>
                <ActivityPage
                    programId={id}
                    activities={sampleActivity}
                    onBack={() => routeTo("/project/program")}
                    onViewActivity={handleViewActivity}
                    onCreateActivity={() => {}}
                />
            </div>
        </div>
    );
};

export default ProjectsActivity;