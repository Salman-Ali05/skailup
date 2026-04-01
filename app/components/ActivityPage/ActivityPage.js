"use client";

import React from "react";
import { FiPlusCircle } from "react-icons/fi";
import style from "./ActivityPage.module.css";
import FilterContributors from "@/app/components/Filters/FilterContributors/FilterContributor";
import ListUsersInSession from "@/app/components/ListUsers/ListUsers";
import EyesIcon from "@/app/components/Icons/Eyes";
import GoBackIcon from "@/app/components/Icons/GoBack";
import GoToIcon from "@/app/components/Icons/GoTo";

const ActivityPage = ({
    programId,
    activities = [],
    onBack,
    onViewActivity,
    onCreateActivity,
}) => {
    const formatDate = (iso) => {
        if (!iso) return "-";
        const [y, m, d] = iso.split("-");
        return `${d}/${m}/${y}`;
    };

    const computeSessions = (activity) => {
        const realized = Math.floor(Math.random() * 12);
        const nextSession = activity.date_start ? formatDate(activity.date_start) : "-";
        const lastSession = activity.date_end ? formatDate(activity.date_end) : "-";
        const missingActions = Math.floor(Math.random() * 4);

        return { realized, nextSession, lastSession, missingActions };
    };

    return (
        <div className={style["structure-content"]}>
            <div className="cursorOn" onClick={onBack}>
                <GoBackIcon />
            </div>

            <h2>Programme : {programId}</h2>

            <div className={style.headerRow}>
                <div className="headerActions">
                    <div className="tabs">
                        <div className="tab tabActive">
                            <p>
                                En cours <span>(7)</span>
                            </p>
                        </div>
                        <div className="tab">
                            <p>
                                Clos <span>(1)</span>
                            </p>
                        </div>
                    </div>

                    <div className={style.tools}>
                        <FilterContributors />
                        <button
                            className="buttons-primary-reversed"
                            onClick={onCreateActivity}
                        >
                            <FiPlusCircle className="buttons-icon" />
                            Nouvel Activité
                        </button>
                    </div>
                </div>
            </div>

            <table className={style["contributors-table"]}>
                <thead>
                    <tr>
                        <th className="th-first th-150">Activité</th>
                        <th className="th-150">Intervenants</th>
                        <th className="th-150">Projets</th>
                        <th className="th-100">Session Réalisée</th>
                        <th className="th-100">Prochaine Session</th>
                        <th className="th-150">Dernière Session Réalisée</th>
                        <th className="th-100">Actions Manquantes</th>
                        <th className="th-100">Statut</th>
                        <th className="th-last th-100">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {activities.map((activity) => {
                        const { realized, nextSession, lastSession, missingActions } =
                            computeSessions(activity);

                        return (
                            <tr key={activity.id}>
                                <td className={style.colContributor}>
                                    <div className={style.avatarWrap}>
                                        <div className={style.nameWrap}>
                                            <div className={style.name}>
                                                {activity.Activity?.name || "—"}
                                            </div>
                                            <div className={style.subName}>
                                                {activity.Param_Name}
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                <td>
                                    <div className="row-flex">
                                        <ListUsersInSession users={activity.Contributors || []} />
                                    </div>
                                </td>

                                <td className={style.activity}>
                                    <div className={style.projectBadges}>
                                        {(activity.Projects || []).slice(0, 2).map((p, idx) => (
                                            <span key={idx} className={style.projectChip}>
                                                {p}
                                            </span>
                                        ))}
                                        {(activity.Projects || []).length > 2 && (
                                            <span className={style.projectChip}>
                                                +{activity.Projects.length - 2}
                                            </span>
                                        )}
                                    </div>
                                </td>

                                <td>{realized}</td>
                                <td>{nextSession}</td>
                                <td>{lastSession}</td>
                                <td>{missingActions}</td>

                                <td>
                                    <span className={style.roleBadge}>{activity.status}</span>
                                </td>

                                <td>
                                    <div className={style.actions}>
                                        <div>
                                            <EyesIcon />
                                        </div>
                                        <div
                                            className="cursorOn"
                                            onClick={() => onViewActivity(activity.id)}
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

export default ActivityPage;