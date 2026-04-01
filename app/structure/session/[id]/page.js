"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useRouteTo } from "@/app/utils/router";
import style from "./session.module.css";
import SessionPage from "@/app/components/SessionPage/SessionPage";

const StructureSession = () => {
    const routeTo = useRouteTo();
    const params = useParams();
    const { id } = params || {};

    const sampleSessions = [
        {
            id: 1,
            num: 1,
            date: "9 Février 2026 à 10h00",
            lieu: "Présentiel",
            enargement: "2/2",
            evaluation: "N/A",
            compterendu: "Voir le CR",
            status: "Réalisée",
        },
        {
            id: 2,
            num: 2,
            date: "15 Février 2026 à 15h00",
            lieu: "Présentiel",
            enargement: "0/1",
            evaluation: "N/A",
            compterendu: "Ajouter",
            status: "Réalisée",
        },
        {
            id: 3,
            num: 3,
            date: "",
            lieu: "",
            enargement: "",
            evaluation: "",
            compterendu: "Ajouter",
            status: "En attente",
        },
    ];

    return (
        <div className={style["structure-layout"]}>
            <SessionPage
                activityId={id}
                activityTitle="Dev Activité - For AP"
                activityDescription="Does it displays well ?"
                progressText="2 sur 9 terminées"
                progressPercent={22}
                sessionDuration="4h"
                documentsCount={0}
                videosCount={0}
                projects={["SKAIL"]}
                sessions={sampleSessions}
                onBack={() => routeTo("/structure/activity/1")}
                onCreateSession={() => { }}
                onViewActivityReport={() => { }}
                onViewSession={(sessionId) => console.log("view", sessionId)}
                onEditSession={(sessionId) => console.log("edit", sessionId)}
                onDeleteSession={(sessionId) => console.log("delete", sessionId)}
            />
        </div>
    );
};

export default StructureSession;