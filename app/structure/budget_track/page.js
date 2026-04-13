"use client";

import React from "react";
import { useRouter } from "next/navigation";
import style from "./budget-track.module.css";
import BudgetTrackPage from "@/app/components/BudgetTrack/BudgetTrackPage";

const StructureResources = () => {
    const router = useRouter();

    const handleViewBudgetTrack = (budgetTrackId) => {
        router.push(`/structures/activity/${budgetTrackId}`);
    };

    const sampleBudgetsTrack = [
        {
            id: 1,
            Param_Name: "Croissance+ Cohorte 15",
            Contributors: [
                { firstName: "Julie", lastName: "Lafontaine" },
                { firstName: "Florino", lastName: "Jean" }
            ],
            products: 3200,
            
            paid: 2000,
            balance: 1600,
        },
        {
            id: 2,
            Param_Name: "Pépinière 2025",
            Contributors: [
                { firstName: "Dipo", lastName: "Bando" }
            ],
            products: 1800,
            
            paid: 1200,
            balance: 1200,
        },
        {
            id: 3,
            Param_Name: "Prévisions+",
            Contributors: [
                { firstName: "Inter", lastName: "Venant" },
                { firstName: "Florino", lastName: "Jean" },
                { firstName: "Julie", lastName: "Lafontaine" },
                { firstName: "Dipo", lastName: "Bando" }
            ],
            products: 5400,
            
            paid: 5000,
            balance: 900,
        },
        {
            id: 4,
            Param_Name: "Accélérateur Impact Q2",
            Contributors: [
                { firstName: "Naomi", lastName: "Konan" },
                { firstName: "Eric", lastName: "Soro" }
            ],
            products: 4100,
            
            paid: 3000,
            balance: 1640,
        },
        {
            id: 5,
            Param_Name: "Booster Startup 2026",
            Contributors: [
                { firstName: "Awa", lastName: "Traore" }
            ],
            products: 2600,
            
            paid: 2000,
            balance: 0,
        },
    ];

    return (
        <div className={style["structure-layout"]}>
            <div className={style["structure-main"]}>
                <BudgetTrackPage
                    budgetsTrack={sampleBudgetsTrack}
                    onViewBudgetTrack={handleViewBudgetTrack}
                    onCreateBudgetTrack={() => { }}
                />
            </div>
        </div>
    );
};

export default StructureResources;