"use client";

import React from "react";
import { FiPlusCircle } from "react-icons/fi";
import style from "./str_actitvity.module.css";
import FilterContributors from "@/app/components/Filters/FilterContributors/FilterContributor";
import ListUsersInSession from "@/app/components/ListUsers/ListUsers";
import EyesIcon from "@/app/components/Icons/Eyes";
import { useParams } from "next/navigation";
import GoBackIcon from "@/app/components/Icons/GoBack";
import { useRouteTo } from "@/app/utils/router";
import GoToIcon from "@/app/components/Icons/GoTo";

const StructureActivity = () => {

    const routeTo = useRouteTo();

    const handleViewActivity = (activityId) => {
        routeTo(`/structures/str_session/${activityId}`);
    }

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
            Contributors: ["Inter Venant", "Florino Jean", "Julie Lafontaine", "Dipo Bando"],
            Projects: ["Cont'Rib", "Bio&Smart"],
        },
    ];

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
        <div className={style["structure-layout"]}>
            <div className={style["structure-main"]}>
                <div className={style["structure-content"]}>
                    <div className="cursorOn" onClick={() => routeTo("/structures/str_programs")}>
                        <GoBackIcon />
                    </div>
                    <h2>Programme : {id}</h2>

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
                                <button className="buttons-primary-reversed">
                                    <FiPlusCircle className="buttons-icon" /> Nouvel Activité
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
                            {sampleActivity.map((activity) => {
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

                                        <td className={style.actions}>
                                            <EyesIcon />
                                            <div className="cursorOn" onClick={() => handleViewActivity(activity.id)}><GoToIcon /></div>
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

export default StructureActivity;
