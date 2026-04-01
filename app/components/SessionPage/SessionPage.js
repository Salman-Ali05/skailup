"use client";

import React from "react";
import { FiPlusCircle } from "react-icons/fi";
import style from "./SessionPage.module.css";
import FilterContributors from "@/app/components/Filters/FilterContributors/FilterContributor";
import EyesIcon from "@/app/components/Icons/Eyes";
import GoBackIcon from "@/app/components/Icons/GoBack";
import PenIcon from "@/app/components/Icons/Pen";
import DeleteIcon from "@/app/components/Icons/Delete";

const SessionPage = ({
    activityId,
    activityTitle,
    activityDescription,
    progressText,
    progressPercent,
    sessionDuration,
    documentsCount,
    videosCount,
    projects = [],
    sessions = [],
    onBack,
    onCreateSession,
    onViewActivityReport,
    onViewSession,
    onEditSession,
    onDeleteSession,
}) => {
    return (
        <div className={style["structure-main"]}>
            <div className={style["structure-content"]}>
                <div className="cursorOn" onClick={onBack}>
                    <GoBackIcon />
                </div>

                <div className={style.topSection}>
                    <div className={style.topLeft}>
                        <div>
                            <h2>
                                Activité : {activityTitle} ({activityId})
                            </h2>
                            <p className={style.description}>
                                Description : {activityDescription}
                            </p>
                        </div>

                        <button
                            className={style.buttonActivityTrack}
                            onClick={onViewActivityReport}
                        >
                            <EyesIcon color="#1d4ed8" />&nbsp; Rapport de l'activité
                        </button>
                    </div>

                    <div className={style.cardsRow}>
                        <div className={style.card}>
                            <div className={style.cardTitle}>Progrès</div>
                            <div className={style.cardBody}>
                                <div className={style.progressText}>{progressText}</div>
                                <div className={style.progressBar}>
                                    <div
                                        className={style.progressFill}
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                                <div className={style.meta}>
                                    Durée de la session : {sessionDuration}
                                </div>
                            </div>
                        </div>

                        <div className={style.card}>
                            <div className={style.cardTitle}>Ressources</div>
                            <div className={style.cardBody}>
                                <div>{documentsCount} document(s)</div>
                                <div>{videosCount} vidéo(s)</div>
                            </div>
                        </div>

                        <div className={style.card}>
                            <div className={style.cardTitle}>Intervenants</div>
                            <div className={style.cardBody}>
                                <div className={style.avatar}></div>
                            </div>
                        </div>

                        <div className={style.card}>
                            <div className={style.cardTitle}>Projets</div>
                            <div className={style.cardBody}>
                                {projects.map((project, index) => (
                                    <div key={index} className={style.projectBadge}>
                                        {project}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={style["structure-content"]}>
                <div className={style.headerRow}>
                    <h2>Sessions</h2>

                    <div className={style.tools}>
                        <FilterContributors />
                        <button
                            className="buttons-primary-reversed"
                            onClick={onCreateSession}
                        >
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
                        {sessions.map((session) => (
                            <tr key={session.id}>
                                <td>{session.num}</td>
                                <td>{session.date}</td>
                                <td>
                                    <span className={style.badge}>{session.lieu}</span>
                                </td>
                                <td>{session.enargement}</td>
                                <td>{session.evaluation}</td>
                                <td>
                                    <button className="cr-btn buttons-primary-reversed">
                                        {session.compterendu}
                                    </button>
                                </td>
                                <td>
                                    <span className={style.roleBadge}>{session.status}</span>
                                </td>
                                <td>
                                    <div className={style.actions}>
                                        <div
                                            className="cursorOn"
                                            onClick={() => onViewSession(session.id)}
                                        >
                                            <EyesIcon />
                                        </div>
                                        <div
                                            className="cursorOn"
                                            onClick={() => onEditSession(session.id)}
                                        >
                                            <PenIcon />
                                        </div>
                                        <div
                                            className="cursorOn"
                                            onClick={() => onDeleteSession(session.id)}
                                        >
                                            <DeleteIcon />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SessionPage;