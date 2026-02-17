"use client";

import React from "react";
import { FiPlusCircle } from "react-icons/fi";
import style from "./str_session.module.css";
import FilterContributors from "@/app/components/Filters/FilterContributors/FilterContributor";
import EyesIcon from "@/app/components/Icons/Eyes";
import { useParams } from "next/navigation";
import GoBackIcon from "@/app/components/Icons/GoBack";
import { useRouteTo } from "@/app/utils/router";
import PenIcon from "@/app/components/Icons/Pen";
import DeleteIcon from "@/app/components/Icons/Delete";

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

    const computeSessionDetails = (session) => {
        return {
            num: session.num,
            date: session.date,
            lieu: session.lieu,
            enargement: session.enargement,
            evaluation: session.evaluation,
            compterendu: session.compterendu,
            status: session.status,
        };
    };

    return (
        <div className={style["structure-layout"]}>
            <div className={style["structure-main"]}>
                <div className={style["structure-content"]}>
                    <div className="cursorOn" onClick={() => routeTo("/structures/str_programs")}>
                        <GoBackIcon />
                    </div>
                    <div className={style.topSection}>
                        <div className={style.topLeft}>
                            <div>
                                <h2>Activité : Dev Activité - For AP ({id})</h2>
                                <p className={style.description}>Description : Does it displays well ?</p>
                            </div>
                            <button className={style.buttonActivityTrack}>
                                <EyesIcon color="#1d4ed8"/>&nbsp; Rapport de l'activité
                            </button>
                        </div>

                        <div className={style.cardsRow}>
                            <div className={style.card}>
                                <div className={style.cardTitle}>Progrès</div>
                                <div className={style.cardBody}>
                                    <div className={style.progressText}>2 sur 9 terminées</div>
                                    <div className={style.progressBar}>
                                        <div className={style.progressFill} style={{ width: "22%" }} />
                                    </div>
                                    <div className={style.meta}>Durée de la session : 4h</div>
                                </div>
                            </div>

                            <div className={style.card}>
                                <div className={style.cardTitle}>Ressources</div>
                                <div className={style.cardBody}>
                                    <div>0 document(s)</div>
                                    <div>0 vidéo(s)</div>
                                </div>
                            </div>

                            <div className={style.card}>
                                <div className={style.cardTitle}>Intervenants</div>
                                <div className={style.cardBody}>
                                    <div className={style.avatar}> {/* placeholder avatar */} </div>
                                </div>
                            </div>

                            <div className={style.card}>
                                <div className={style.cardTitle}>Projets</div>
                                <div className={style.cardBody}>
                                    <div className={style.projectBadge}>SKAIL</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* end TOP PART */}

                <div className={style["structure-content"]}>
                    <div className={style.headerRow}>
                    <h2>Sessions</h2>
                        <div className={style.tools}>
                            <FilterContributors />
                            <button className="buttons-primary-reversed">
                                <FiPlusCircle className="buttons-icon" /> Nouvelle Session
                            </button>
                        </div>
                    </div>

                    <table className={style["contributors-table"]}>
                        <thead>
                            <tr>
                                <th className="th-first th-50">N°</th>
                                <th className="th-150">Date</th>
                                <th className="th-150">Lieu</th>
                                <th className="th-100">Enargement</th>
                                <th className="th-100">Evaluation</th>
                                <th className="th-150">Compte Rendu</th>
                                <th className="th-100">Statut</th>
                                <th className="th-last th-100">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {sampleSessions.map((session) => {
                                const { num, date, lieu, enargement, evaluation, compterendu, status } =
                                    computeSessionDetails(session);

                                return (
                                    <tr key={session.id}>
                                        <td>{num}</td>
                                        <td>{date}</td>
                                        <td><span className={style.badge}>{lieu}</span></td>
                                        <td>{enargement}</td>
                                        <td>{evaluation}</td>
                                        <td>
                                            <button className="cr-btn buttons-primary-reversed">{compterendu}</button>
                                        </td>
                                        <td>
                                            <span className={style.roleBadge}>{status}</span>
                                        </td>
                                        <td className={style.actions}>
                                            <div className="cursorOn">
                                                <EyesIcon />
                                            </div>
                                            <div className="cursorOn">
                                                <PenIcon />
                                            </div>
                                            <div className="cursorOn">
                                                <DeleteIcon />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StructureSession;
