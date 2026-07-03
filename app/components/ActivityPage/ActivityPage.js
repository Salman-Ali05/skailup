"use client";

import React, { useState, useEffect, useMemo } from "react";
import { FiPlusCircle } from "react-icons/fi";
import style from "./ActivityPage.module.css";
import FilterContributors from "@/app/components/Filters/FilterContributors/FilterContributor";
import ListUsersInSession from "@/app/components/ListUsers/ListUsers";
import EyesIcon from "@/app/components/Icons/Eyes";
import GoBackIcon from "@/app/components/Icons/GoBack";
import GoToIcon from "@/app/components/Icons/GoTo";
import NoItem from "../NoItem/NoItem";

const ActivityPage = ({
    programId,
    program,
    status = [],
    statusOptions = [],
    activities = [],
    activityProjects = [],
    projects = [],
    activityContribs = [],
    contributors = [],
    tagParamStructures = [],
    onBack,
    onViewActivity,
    onCreateActivity,
}) => {
    const [activeStatusId, setActiveStatusId] = useState("");

    const statusList = useMemo(() => {
        const source = status.length > 0 ? status : statusOptions;

        return source
            .filter((item) => item && item.id)
            .map((item) => {
                const label =
                    item.lang_fr ||
                    item.lang_en ||
                    item.label ||
                    item.name ||
                    item.description ||
                    item.value ||
                    item.status ||
                    "-";

                return {
                    id: String(item.id),
                    label,
                };
            });
    }, [status, statusOptions]);

    useEffect(() => {
        if (!activeStatusId && statusList.length > 0) {
            setActiveStatusId(statusList[0].id);
        }
    }, [activeStatusId, statusList]);

    const filteredActivities = useMemo(() => {
        if (!activeStatusId) return activities;

        return activities.filter((activity) => {
            return String(activity.id_status) === String(activeStatusId);
        });
    }, [activities, activeStatusId]);

    const getActivityCountByStatus = (statusId) => {
        return activities.filter((activity) => {
            return String(activity.id_status) === String(statusId);
        }).length;
    };

    const formatDate = (iso) => {
        if (!iso) return "";
        const cleanDate = String(iso).split("T")[0];
        const [y, m, d] = cleanDate.split("-");
        if (!y || !m || !d) return "";
        return `${d}/${m}/${y}`;
    };

    const tagParamValueById = useMemo(() => {
        const map = new Map();

        tagParamStructures.forEach((tag) => {
            if (!tag || !tag.id) return;

            const value =
                tag.label ||
                tag.name ||
                tag.description ||
                tag.tag ||
                tag.value ||
                "";

            map.set(String(tag.id), value);
        });

        return map;
    }, [tagParamStructures]);

    const statusLabelById = useMemo(() => {
        const map = new Map();

        statusList.forEach((item) => {
            map.set(item.id, item.label || "");
        });

        return map;
    }, [statusList]);

    const projectNameById = useMemo(() => {
        const map = new Map();

        projects.forEach((project) => {
            if (project && project.id) {
                map.set(String(project.id), project.name || project.label || "");
            }
        });

        return map;
    }, [projects]);

    const activityProjectNames = useMemo(() => {
        return activityProjects.reduce((acc, link) => {
            if (!link || !link.id_activity || !link.id_project) return acc;

            const name = projectNameById.get(String(link.id_project));
            if (!name) return acc;

            if (!acc[link.id_activity]) acc[link.id_activity] = [];
            acc[link.id_activity].push(name);

            return acc;
        }, {});
    }, [activityProjects, projectNameById]);

    const contributorNameById = useMemo(() => {
        const map = new Map();

        contributors.forEach((contributor) => {
            if (!contributor || !contributor.id) return;

            const first =
                contributor.user_details?.first_name ||
                contributor.user_details?.fname ||
                contributor.contributor_details?.first_name ||
                contributor.contributor_details?.fname;

            const last =
                contributor.user_details?.last_name ||
                contributor.user_details?.lname ||
                contributor.contributor_details?.last_name ||
                contributor.contributor_details?.lname;

            const fullName = [first, last].filter(Boolean).join(" ");

            const name =
                contributor.name ||
                contributor.contrib_name ||
                contributor.contributor_details?.contrib_name ||
                contributor.contributor_details?.name ||
                fullName ||
                contributor.user?.email ||
                "";

            map.set(String(contributor.id), name);
        });

        return map;
    }, [contributors]);

    const activityContributorNames = useMemo(() => {
        return activityContribs.reduce((acc, link) => {
            if (!link || !link.id_activity || !link.id_contrib) return acc;

            const name = contributorNameById.get(String(link.id_contrib));
            if (!name) return acc;

            if (!acc[link.id_activity]) acc[link.id_activity] = [];
            acc[link.id_activity].push(name);

            return acc;
        }, {});
    }, [activityContribs, contributorNameById]);

    const programType =
        tagParamValueById.get(String(program?.id_param_structure || "")) ||
        program?.tag_param_structure?.label ||
        "";

    const programTitle = [programType, program?.description || program?.name]
        .filter(Boolean)
        .join(" - ");

    return (
        <div className={style["structure-content"]}>
            <div className="cursorOn" onClick={onBack}>
                <GoBackIcon />
            </div>

            <h2>Programme : {programTitle || programId}</h2>

            <div className={style.headerRow}>
                <div className="headerActions">
                    <div className="tabs">
                        {statusList.map((item) => (
                            <div
                                key={item.id}
                                className={`tab ${activeStatusId === item.id ? "tabActive" : ""
                                    }`}
                                onClick={() => setActiveStatusId(item.id)}
                            >
                                <p>
                                    {item.label}{" "}
                                    <span>({getActivityCountByStatus(item.id)})</span>
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className={style.tools}>
                        <FilterContributors />

                        <button
                            className="buttons-primary-reversed"
                            onClick={onCreateActivity}
                        >
                            <FiPlusCircle className="buttons-icon" />
                            Nouvelle Activité
                        </button>
                    </div>
                </div>
            </div>

            {filteredActivities.length === 0 ? (
                <NoItem
                    message="Aucune activité trouvée"
                    subMessage="Créez une première activité pour commencer à organiser ce programme."
                />
            ) : (
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
                        {filteredActivities.map((activity) => {
                            const projectNames = activityProjectNames[activity.id] || [];
                            const contributorNames =
                                activityContributorNames[activity.id] || [];

                            return (
                                <tr key={activity.id}>
                                    <td className={style.colContributor}>
                                        <div className={style.avatarWrap}>
                                            <div className={style.nameWrap}>
                                                <div className={style.name}>
                                                    <p className="bold">{activity.name || "—"}</p>
                                                </div>

                                                <div className={style.subName}>
                                                    {tagParamValueById.get(
                                                        String(activity.id_param_name)
                                                    ) || ""}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td>
                                        <div className="row-flex">
                                            <ListUsersInSession users={contributorNames} />
                                        </div>
                                    </td>

                                    <td className={style.activity}>
                                        <div className={style.projectBadges}>
                                            {projectNames.slice(0, 2).map((projectName, idx) => (
                                                <span
                                                    key={`${projectName}-${idx}`}
                                                    className={style.projectChip}
                                                >
                                                    {projectName}
                                                </span>
                                            ))}

                                            {projectNames.length > 2 && (
                                                <span className={style.projectChip}>
                                                    +{projectNames.length - 2}
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    <td>{activity.duration_realized ?? 0}</td>
                                    <td>{formatDate(activity.date_start) || "-"}</td>
                                    <td>{formatDate(activity.date_end) || "-"}</td>
                                    <td>{activity.missing_actions ?? 0}</td>

                                    <td>
                                        <span
                                            className={
                                                statusLabelById.get(String(activity.id_status)) ===
                                                    "Ouvert"
                                                    ? "greenTag"
                                                    : "redTag"
                                            }
                                        >
                                            {statusLabelById.get(String(activity.id_status))}
                                        </span>
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
            )}
        </div>
    );
};

export default ActivityPage;