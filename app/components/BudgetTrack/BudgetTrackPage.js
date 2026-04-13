"use client";

import React from "react";
import style from "./BudgetTrackPage.module.css";
import FilterContributors from "@/app/components/Filters/FilterContributors/FilterContributor";
import ListUsersInSession from "@/app/components/ListUsers/ListUsers";
import EyesIcon from "@/app/components/Icons/Eyes";
import GoToIcon from "@/app/components/Icons/GoTo";
import { FiFileText, FiLink } from "react-icons/fi";
import { RiFireLine } from "react-icons/ri";

const BudgetTrackPage = ({
    budgetsTrack = [],
    onViewBudgetTrack,
    onCreateBudgetTrack,
}) => {
    const formatDate = (iso) => {
        if (!iso) return "-";
        const [y, m, d] = iso.split("-");
        return `${d}/${m}/${y}`;
    };

    const getBudgetTrackType = (budgetTrack) => {
        const rawType = (budgetTrack.budgetTrack_type || "document").toLowerCase();

        if (rawType === "lien" || rawType === "link") {
            return { label: "Lien", kind: "link" };
        }

        return { label: "Document", kind: "file" };
    };

    return (
        <div className={style["structure-content"]}>
            <h2>Ressources</h2>
            <div>
                <div className="panel">
                    <div className={style.metricTitle}>
                        <span className={style.metricIcon}>
                            <RiFireLine />
                        </span>
                        <div className={style.metricText}>
                            <h3>Produit</h3>
                            <span className={style.metricSubline}>Facture(s) : 3</span>
                            <span className={style.metricSubline}>Paiement(s) : 0</span>
                        </div>
                    </div>
                </div>

            <div className="panel">
                    <div className={style.metricTitle}>
                        <span className={style.metricIcon}>
                            <RiFireLine />
                        </span>
                        <div className={style.metricText}>
                            <h3>Solde</h3>
                            <span className={style.metricSubline}>Durée de la session : 0h</span>
                            <span className={style.metricSubline}>Durée de la session : 0h</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={style.headerRow}>
                <div className="headerActions">
                    
                    <div className="tabs">
                        <div className="tab tabActive">
                            <p>
                                Vos intervenants
                            </p>
                        </div>
                    </div>
                    <div className={style.tools}>
                        <FilterContributors />
                    </div>
                </div>
            </div>

            <table className={style["contributors-table"]}>
                <thead>
                    <tr>
                        <th className="th-first th-200">programme <br />Cohortes</th>
                        <th className="th-120">Intervenant</th>
                        <th className="th-120">Produit (€)</th>
                        <th className="th-150">Factures</th>
                        <th className="th-150">Payé/Facturé</th>
                        <th className="th-100">Solde (€)</th>
                        <th className="th-last th-80">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {budgetsTrack.map((budgetTrack) => {
                        const budgetTrackType = getBudgetTrackType(budgetTrack);

                        return (
                            <tr key={budgetTrack.id}>
                                <td className={style.colContributor}>
                                    {budgetTrack.Param_Name}
                                </td>

                                <td>
                                    <div className="row-flex">
                                        <ListUsersInSession users={budgetTrack.Contributors || []} />
                                    </div>
                                </td>

                                <td>{budgetTrack.products}</td>

                                <td>{budgetTrack.bills}</td>

                                <td>{budgetTrack.paid}/{budgetTrack.bills}</td>

                                <td>{budgetTrack.balance}</td>

                                <td>
                                    <div className={style.actions}>
                                        <div>
                                            <EyesIcon />
                                        </div>
                                        <div
                                            className="cursorOn"
                                            onClick={() => onViewBudgetTrack(budgetTrack.id)}
                                        >
                                            <GoToIcon />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default BudgetTrackPage;