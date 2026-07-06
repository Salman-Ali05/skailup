"use client";

import React, { useState, useEffect, useMemo } from "react";
import { FiPlusCircle } from "react-icons/fi";
import style from "./ActivityPage.module.css";
import FilterContributors from "@/app/components/Filters/FilterContributors/FilterContributor";
import ListUsersInSession from "@/app/components/ListUsers/ListUsers";
import EyesIcon from "@/app/components/Icons/Eyes";
import GoBackIcon from "@/app/components/Icons/GoBack";
import GoToIcon from "@/app/components/Icons/GoTo";
import PenIcon from "../Icons/Pen";
import NoItem from "../NoItem/NoItem";
import { avoidDoubleClicks } from "@/app/utils/fct/avoidDoubleClicks";
import Popup from "@/app/components/Popup/Popup";
import stylePopup from "@/app/components/Popup/PopupContent.module.css";
import Multiselect from "@/app/components/Multiselect/Multiselect";

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
    tagParamTypes = [],
    onBack,
    onViewActivity,
    onCreateActivity = () => { },
    onEditActivity = () => { },
    durationOptionsSet = []
}) => {
    const [activeStatusId, setActiveStatusId] = useState("");
    const [openPopup, setOpenPopup] = useState(false);
    const [popupMode, setPopupMode] = useState("create");

    const [formValues, setFormValues] = useState({
        id: "",
        id_param_name: "",
        name: "",
        description: "",
        emargement_evaluation: "",
        number_session: "",
        duration_in_minutes: "",
        contribs: [],
        includeAllProgramProjects: false,
        projects: [],
        is_planable: "false",
        id_status: "",
    });

    const durationOptions = useMemo(() => {
        return durationOptionsSet
            .filter((option) => option)
            .map((option) => {
                const rawValue =
                    option.value ??
                    option.duration_in_minutes ??
                    option.duration ??
                    option.minutes ??
                    "";

                const label =
                    option.lang_fr ||
                    option.lang_en ||
                    option.label ||
                    option.display ||
                    option.code ||
                    option.name ||
                    "-";

                return {
                    id: String(option.id || rawValue || label),
                    value: String(rawValue),
                    label,
                };
            })
            .filter((option) => option.value);
    }, [durationOptionsSet]);

    const isEditMode = popupMode === "edit";

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

    const activityTypeParam = useMemo(() => {
        return tagParamTypes.find((type) => {
            return type.code === "Activities" || type.lang_fr === "Activités";
        });
    }, [tagParamTypes]);

    const filteredTagParamStructures = useMemo(() => {
        if (!activityTypeParam?.id) return [];

        return tagParamStructures.filter((tag) => {
            return String(tag.id_type_param) === String(activityTypeParam.id);
        });
    }, [tagParamStructures, activityTypeParam]);

    const tagParamOptions = useMemo(() => {
        return filteredTagParamStructures
            .filter((tag) => tag && tag.id)
            .map((tag) => {
                const label =
                    tag.label ||
                    tag.name ||
                    tag.description ||
                    tag.tag ||
                    tag.value ||
                    "-";

                return {
                    id: String(tag.id),
                    label,
                    lang_fr: label,
                };
            });
    }, [filteredTagParamStructures]);

    const contributorOptions = useMemo(() => {
        return contributors
            .filter((contributor) => contributor && contributor.id)
            .map((contributor) => {
                const userName = [
                    contributor.user_details?.first_name,
                    contributor.user_details?.last_name,
                ]
                    .filter(Boolean)
                    .join(" ");

                const label = [
                    userName,
                    contributor.name,
                ]
                    .filter(Boolean)
                    .join(" - ");

                return {
                    id: String(contributor.id),
                    lang_fr: label || "-",
                };
            });
    }, [contributors]);

    const projectOptions = useMemo(() => {
        return projects
            .filter((project) => project && project.id)
            .map((project) => {
                const userName = [
                    project.user?.first_name || project.user_details?.first_name,
                    project.user?.last_name || project.user_details?.last_name,
                ]
                    .filter(Boolean)
                    .join(" ");

                const label = [
                    project.name,
                    userName,
                ]
                    .filter(Boolean)
                    .join(" - ");

                return {
                    id: String(project.id),
                    lang_fr: label || "-",
                };
            });
    }, [projects]);

    const getEmptyForm = () => ({
        id: "",
        id_param_name: "",
        name: "",
        description: "",
        emargement_evaluation: "",
        number_session: "",
        duration_in_minutes: "",
        contribs: [],
        includeAllProgramProjects: false,
        projects: [],
        is_planable: "false",
        id_status: activeStatusId || statusList[0]?.id || "",
    });

    const getEmargementEvaluationValue = (activity) => {
        const isSignNeeded = Boolean(activity?.is_sign_needed);
        const isNoteNeeded = Boolean(activity?.is_note_needed);

        if (isSignNeeded && isNoteNeeded) return "both";
        if (isSignNeeded) return "emargement";
        if (isNoteNeeded) return "evaluation";

        return "none";
    };

    const getActivityProjectIds = (activityId) => {
        return activityProjects
            .filter((link) => {
                return String(link.id_activity) === String(activityId);
            })
            .map((link) => String(link.id_project))
            .filter(Boolean);
    };

    const getActivityContribIds = (activityId) => {
        return activityContribs
            .filter((link) => {
                return String(link.id_activity) === String(activityId);
            })
            .map((link) => String(link.id_contrib))
            .filter(Boolean);
    };

    const resetForm = () => {
        setFormValues(getEmptyForm());
    };

    const closePopup = () => {
        setOpenPopup(false);
        setPopupMode("create");
        resetForm();
    };

    const openCreate = () => {
        setPopupMode("create");
        setFormValues(getEmptyForm());
        setOpenPopup(true);
    };

    const openEdit = (activity) => {
        setPopupMode("edit");

        setFormValues({
            id: activity?.id ? String(activity.id) : "",
            id_param_name: activity?.id_param_name
                ? String(activity.id_param_name)
                : "",
            name: activity?.name || "",
            description: activity?.description || "",
            emargement_evaluation: getEmargementEvaluationValue(activity),
            number_session:
                activity?.number_session !== null &&
                    activity?.number_session !== undefined
                    ? String(activity.number_session)
                    : "",
            duration_in_minutes:
                activity?.duration_in_minutes !== null &&
                    activity?.duration_in_minutes !== undefined
                    ? String(activity.duration_in_minutes)
                    : "",
            contribs: getActivityContribIds(activity?.id),
            includeAllProgramProjects: false,
            projects: getActivityProjectIds(activity?.id),
            is_planable: activity?.is_planable ? "true" : "false",
            id_status: activity?.id_status ? String(activity.id_status) : "",
        });

        setOpenPopup(true);
    };

    const handleFormChange = (key) => (event) => {
        setFormValues((prev) => ({
            ...prev,
            [key]: event.target.value,
        }));
    };

    const handleIncludeAllProgramProjectsChange = (event) => {
        const checked = event.target.checked;

        setFormValues((prev) => ({
            ...prev,
            includeAllProgramProjects: checked,
            projects: checked ? [] : prev.projects,
        }));
    };

    const isFormValid = () => {
        return (
            formValues.id_param_name &&
            formValues.name &&
            formValues.emargement_evaluation &&
            formValues.number_session &&
            formValues.duration_in_minutes &&
            formValues.is_planable !== "" &&
            formValues.id_status
        );
    };

    const handleActivityConfirm = async (event) => {
        event.preventDefault();

        if (!isFormValid()) return;

        const projectsPayload = formValues.includeAllProgramProjects
            ? projectOptions.map((project) => project.id)
            : formValues.projects;

        const payload = {
            id: formValues.id,
            id_param_name: formValues.id_param_name,
            name: formValues.name,
            description: formValues.description || null,

            is_sign_needed:
                formValues.emargement_evaluation === "emargement" ||
                formValues.emargement_evaluation === "both",

            is_note_needed:
                formValues.emargement_evaluation === "evaluation" ||
                formValues.emargement_evaluation === "both",

            number_session: Number(formValues.number_session),
            duration_in_minutes: Number(formValues.duration_in_minutes),

            contribs: formValues.contribs,
            projects: projectsPayload,

            is_planable: formValues.is_planable === "true",

            id_status: formValues.id_status,

            is_finished: false,
            is_priced: false,

            rate_60minutes: formValues.contribs.map(() => 0),
        };

        if (popupMode === "edit") {
            await onEditActivity(payload);
        } else {
            await onCreateActivity(payload);
        }

        closePopup();
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

            const fullName = [
                contributor.user_details?.first_name,
                contributor.user_details?.last_name,
            ]
                .filter(Boolean)
                .join(" ");

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
                            onClick={openCreate}
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
                                                    <p className="bold">
                                                        {tagParamValueById.get(
                                                            String(activity.id_param_name))}
                                                    </p>
                                                </div>

                                                <div className={style.subName}>

                                                    {activity.name}
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
                                            {projectNames
                                                .slice(0, 2)
                                                .map((projectName, idx) => (
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
                                                statusLabelById.get(
                                                    String(activity.id_status)
                                                ) === "Ouvert"
                                                    ? "greenTag"
                                                    : "redTag"
                                            }
                                        >
                                            {statusLabelById.get(
                                                String(activity.id_status)
                                            )}
                                        </span>
                                    </td>

                                    <td>
                                        <div className={style.actions}>
                                            <div
                                                className="cursorOn"
                                                onClick={() =>
                                                    onViewActivity(activity.id)
                                                }
                                            >
                                                <GoToIcon />
                                            </div>
                                            <div
                                                className="cursorOn"
                                                role="button"
                                                aria-label="Modifier l'activité"
                                                onClick={() => openEdit(activity)}
                                            >
                                                <PenIcon />
                                            </div>

                                            <div>
                                                <EyesIcon />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}

            <Popup
                open={openPopup}
                onClose={closePopup}
                title={isEditMode ? "Modifier l'activité" : "Nouvelle activité"}
            >
                <form className={stylePopup.form} onSubmit={handleActivityConfirm}>
                    <div className={stylePopup.row}>
                        <div className={stylePopup.field}>
                            <label>
                                Type d'activité<span>*</span>
                            </label>

                            <select
                                className="inputs"
                                required
                                value={formValues.id_param_name}
                                onChange={handleFormChange("id_param_name")}
                            >
                                <option value="" disabled hidden>
                                    Type d'activité
                                </option>

                                {tagParamOptions.map((tag) => (
                                    <option key={tag.id} value={tag.id}>
                                        {tag.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={stylePopup.field}>
                            <label>
                                Statut<span>*</span>
                            </label>

                            <select
                                className="inputs"
                                required
                                value={formValues.id_status}
                                onChange={handleFormChange("id_status")}
                            >
                                <option value="" disabled hidden>
                                    Statut
                                </option>

                                {statusList.map((status) => (
                                    <option key={status.id} value={status.id}>
                                        {status.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={stylePopup.row}>
                        <div className={stylePopup.field}>
                            <label>
                                Nom de l'activité<span>*</span>
                            </label>

                            <input
                                className="inputs"
                                type="text"
                                required
                                placeholder="Nom de l'activité"
                                value={formValues.name}
                                onChange={handleFormChange("name")}
                            />
                        </div>
                    </div>

                    <div className={stylePopup.row}>
                        <div className={stylePopup.field}>
                            <label>Description</label>

                            <textarea
                                className="inputs"
                                placeholder="Description"
                                value={formValues.description}
                                onChange={handleFormChange("description")}
                                rows={4}
                            />
                        </div>
                    </div>

                    <div className={stylePopup.row}>
                        <div className={stylePopup.field}>
                            <label>
                                Émargement et Évaluation<span>*</span>
                            </label>

                            <select
                                className="inputs"
                                required
                                value={formValues.emargement_evaluation}
                                onChange={handleFormChange(
                                    "emargement_evaluation"
                                )}
                            >
                                <option value="" disabled hidden>
                                    Émargement et Évaluation
                                </option>
                                <option value="none">Aucun</option>
                                <option value="emargement">
                                    Émargement uniquement
                                </option>
                                <option value="evaluation">
                                    Évaluation uniquement
                                </option>
                                <option value="both">
                                    Émargement et Évaluation
                                </option>
                            </select>
                        </div>
                    </div>

                    <div className={stylePopup.row}>
                        <div className={stylePopup.field}>
                            <label>
                                Nombre de sessions<span>*</span>
                            </label>

                            <input
                                className="inputs"
                                type="number"
                                min="1"
                                required
                                value={formValues.number_session}
                                onChange={handleFormChange("number_session")}
                            />
                        </div>

                        <div className={stylePopup.field}>
                            <label>
                                Durée d'une session<span>*</span>
                            </label>

                            <select
                                className="inputs"
                                required
                                value={formValues.duration_in_minutes}
                                onChange={handleFormChange(
                                    "duration_in_minutes"
                                )}
                            >
                                <option value="" disabled hidden>
                                    Durée de la session
                                </option>

                                {durationOptions.map((duration) => (
                                    <option key={duration.id} value={duration.value}>
                                        {duration.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {!isEditMode && (
                        <>
                            <div className={stylePopup.row}>
                                <div className={stylePopup.field}>
                                    <Multiselect
                                        label="Affectation Intervenants"
                                        options={contributorOptions}
                                        value={formValues.contribs}
                                        onChange={(value) =>
                                            setFormValues((prev) => ({
                                                ...prev,
                                                contribs: value,
                                            }))
                                        }
                                        placeholder="Sélectionner des intervenants"
                                    />
                                </div>
                            </div>

                            <div className={stylePopup.row}>
                                <div className={stylePopup.field}>
                                    <label className="row-flex">
                                        Ajouter tous les projets affectés au programme
                                        <input
                                            type="checkbox"
                                            checked={formValues.includeAllProgramProjects}
                                            onChange={handleIncludeAllProgramProjectsChange}
                                        />
                                        Oui
                                    </label>
                                </div>
                            </div>

                            <div className={stylePopup.row}>
                                <div className={stylePopup.field}>
                                    <Multiselect
                                        label="Affectation Projets"
                                        options={projectOptions}
                                        value={formValues.projects}
                                        onChange={(value) =>
                                            setFormValues((prev) => ({
                                                ...prev,
                                                projects: value,
                                            }))
                                        }
                                        placeholder="Sélectionner des projets"
                                        disabled={formValues.includeAllProgramProjects}
                                    />
                                </div>
                            </div>
                            <div className={stylePopup.row}>
                                <div className={stylePopup.field}>
                                    <Multiselect
                                        label="Affectation Projets"
                                        options={projectOptions}
                                        value={formValues.projects}
                                        onChange={(value) =>
                                            setFormValues((prev) => ({
                                                ...prev,
                                                projects: value,
                                            }))
                                        }
                                        placeholder="Sélectionner des projets"
                                        disabled={formValues.includeAllProgramProjects}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <div className={stylePopup.row}>
                        <div className={stylePopup.field}>
                            <label>
                                Autoriser les participants à planifier des sessions
                                <span>*</span>
                            </label>

                            <select
                                className="inputs"
                                required
                                value={formValues.is_planable}
                                onChange={handleFormChange("is_planable")}
                            >
                                <option value="false">non</option>
                                <option value="true">oui</option>
                            </select>
                        </div>
                    </div>

                    <button
                        id="btnCreateActivity"
                        type="submit"
                        className={`${stylePopup.submitBtn} buttons-primary`}
                        onClick={() => avoidDoubleClicks("btnCreateActivity")}
                    >
                        {isEditMode ? "Modifier" : "Créer"}
                    </button>
                </form>
            </Popup>
        </div>
    );
};

export default ActivityPage;