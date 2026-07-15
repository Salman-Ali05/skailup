"use client";

import React, {
    useMemo,
    useState,
} from "react";
import { FiPlusCircle } from "react-icons/fi";
import style from "./SessionPage.module.css";
import stylePopup from "@/app/components/Popup/PopupContent.module.css";
import FilterContributors from "@/app/components/Filters/FilterContributors/FilterContributor";
import EyesIcon from "@/app/components/Icons/Eyes";
import GoBackIcon from "@/app/components/Icons/GoBack";
import PenIcon from "@/app/components/Icons/Pen";
import DeleteIcon from "@/app/components/Icons/Delete";
import Popup from "@/app/components/Popup/Popup";
import NoItem from "@/app/components/NoItem/NoItem";
import ListUsersInSession from "@/app/components/ListUsers/ListUsers";
import { avoidDoubleClicks } from "@/app/utils/fct/avoidDoubleClicks";

const SessionPage = ({
    activityId,
    activity,

    sessions = [],
    sessionUsers = [],

    projects = [],
    contributors = [],

    statusOptions = [],
    typeOptions = [],

    onBack = () => { },
    onCreateSession = async () => false,
    onViewActivityReport = () => { },
    onViewSession = () => { },
    onEditSession = async () => false,
    onDeleteSession = async () => false,
}) => {
    const [openCreatePopup, setOpenCreatePopup] =
        useState(false);

    const [isCreating, setIsCreating] =
        useState(false);

    const [formValues, setFormValues] =
        useState({
            number_session: "1",
            id_type_session: "",
        });

    const statusList = useMemo(() => {
        return statusOptions
            .filter((item) => item?.id)
            .map((item) => {
                const label =
                    item.lang_fr ||
                    item.lang_en ||
                    item.label ||
                    item.name ||
                    item.description ||
                    item.value ||
                    item.code ||
                    "-";

                return {
                    id: String(item.id),
                    code: item.code || "",
                    label,
                };
            });
    }, [statusOptions]);

    const typeList = useMemo(() => {
        return typeOptions
            .filter((item) => item?.id)
            .map((item) => {
                const label =
                    item.lang_fr ||
                    item.lang_en ||
                    item.label ||
                    item.name ||
                    item.description ||
                    item.value ||
                    item.code ||
                    "-";

                return {
                    id: String(item.id),
                    code: item.code || "",
                    label,
                };
            });
    }, [typeOptions]);

    const statusById = useMemo(() => {
        const map = new Map();

        statusList.forEach((status) => {
            map.set(
                String(status.id),
                status
            );
        });

        return map;
    }, [statusList]);

    const typeById = useMemo(() => {
        const map = new Map();

        typeList.forEach((type) => {
            map.set(
                String(type.id),
                type
            );
        });

        return map;
    }, [typeList]);

    const sessionUserIdsBySession = useMemo(() => {
        return sessionUsers.reduce(
            (accumulator, link) => {
                if (
                    !link?.id_session ||
                    !link?.id_user
                ) {
                    return accumulator;
                }

                const sessionId =
                    String(link.id_session);

                if (!accumulator[sessionId]) {
                    accumulator[sessionId] = [];
                }

                const userId =
                    String(link.id_user);

                if (
                    !accumulator[
                        sessionId
                    ].includes(userId)
                ) {
                    accumulator[
                        sessionId
                    ].push(userId);
                }

                return accumulator;
            },
            {}
        );
    }, [sessionUsers]);

    const contributorNames = useMemo(() => {
        return contributors
            .map((contributor) => {
                const user =
                    contributor?.user_details ||
                    contributor?.user;

                const fullName = [
                    user?.first_name ||
                    user?.fname,

                    user?.last_name ||
                    user?.lname,
                ]
                    .filter(Boolean)
                    .join(" ");

                return (
                    fullName ||
                    contributor?.name ||
                    contributor?.contrib_name ||
                    user?.email ||
                    ""
                );
            })
            .filter(Boolean);
    }, [contributors]);

    const projectNames = useMemo(() => {
        return projects
            .map((project) => {
                return (
                    project?.name ||
                    project?.label ||
                    project?.description ||
                    ""
                );
            })
            .filter(Boolean);
    }, [projects]);

    const activityTitle = useMemo(() => {
        const typeLabel =
            activity?.id_param_name?.label || "";

        return [
            typeLabel,
            activity?.name,
        ]
            .filter(Boolean)
            .join(" - ");
    }, [activity]);

    const isCompletedSession = (session) => {
        const status = statusById.get(
            String(session.id_session_status)
        );

        if (!status) return false;

        const completedCodes = [
            "Done",
            "Completed",
            "Finished",
            "Realized",
            "Closed",
        ];

        if (
            completedCodes.includes(status.code)
        ) {
            return true;
        }

        const normalizedLabel =
            String(status.label)
                .toLocaleLowerCase("fr");

        return (
            normalizedLabel.includes("réalis") ||
            normalizedLabel.includes("termin")
        );
    };

    const completedSessions = useMemo(() => {
        return sessions.filter(
            isCompletedSession
        );
    }, [sessions, statusById]);

    const progressPercent =
        sessions.length > 0
            ? Math.round(
                (
                    completedSessions.length /
                    sessions.length
                ) * 100
            )
            : 0;

    const formatDuration = (minutes) => {
        const parsedMinutes = Number(minutes);

        if (
            !Number.isFinite(parsedMinutes) ||
            parsedMinutes <= 0
        ) {
            return "-";
        }

        const hours =
            Math.floor(parsedMinutes / 60);

        const remainingMinutes =
            parsedMinutes % 60;

        if (hours === 0) {
            return `${remainingMinutes} min`;
        }

        if (remainingMinutes === 0) {
            return `${hours}h`;
        }

        return `${hours}h${String(
            remainingMinutes
        ).padStart(2, "0")}`;
    };

    const formatSessionDate = (value) => {
        if (!value) {
            return "Non planifiée";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return String(value);
        }

        const formattedDate =
            date.toLocaleDateString("fr-FR");

        const containsTime =
            String(value).includes("T");

        if (!containsTime) {
            return formattedDate;
        }

        const formattedTime =
            date.toLocaleTimeString(
                "fr-FR",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                }
            );

        return `${formattedDate} à ${formattedTime}`;
    };

    const getSessionLocation = (session) => {
        const type = typeById.get(
            String(session.id_type_session)
        );

        if (type?.label) {
            return type.label;
        }

        if (session.localisation) {
            return session.localisation;
        }

        if (session.link_visio) {
            return "Visioconférence";
        }

        return "-";
    };

    const getSessionUserCount = (
        sessionId
    ) => {
        return (
            sessionUserIdsBySession[
                String(sessionId)
            ]?.length ?? 0
        );
    };

    const getSignValue = (session) => {
        if (!activity?.is_sign_needed) {
            return "N/A";
        }

        const totalUsers =
            getSessionUserCount(session.id);

        const signedUsers =
            session.signed_users_count ?? 0;

        return `${signedUsers}/${totalUsers}`;
    };

    const getEvaluationValue = (
        session
    ) => {
        if (!activity?.is_note_needed) {
            return "N/A";
        }

        const totalUsers =
            getSessionUserCount(session.id);

        const evaluatedUsers =
            session.evaluated_users_count ??
            0;

        return `${evaluatedUsers}/${totalUsers}`;
    };

    const getStatusClassName = (
        session
    ) => {
        const status = statusById.get(
            String(session.id_session_status)
        );

        if (!status) {
            return style.roleBadge;
        }

        if (isCompletedSession(session)) {
            return "greenTag";
        }

        if (
            status.code === "Cancelled" ||
            status.code === "Canceled"
        ) {
            return "redTag";
        }

        return style.roleBadge;
    };

    const resetForm = () => {
        setFormValues({
            number_session: "1",
            id_type_session: "",
        });
    };

    const openCreate = () => {
        resetForm();
        setOpenCreatePopup(true);
    };

    const closeCreate = () => {
        setOpenCreatePopup(false);
        resetForm();
    };

    const handleFormChange =
        (key) => (event) => {
            setFormValues(
                (previousValues) => ({
                    ...previousValues,
                    [key]:
                        event.target.value,
                })
            );
        };

    const handleCreateConfirm = async (
        event
    ) => {
        event.preventDefault();

        const numberSession = Number(
            formValues.number_session
        );

        if (
            !Number.isInteger(numberSession) ||
            numberSession <= 0
        ) {
            return;
        }

        setIsCreating(true);

        try {
            const success =
                await onCreateSession(
                    formValues
                );

            if (success) {
                closeCreate();
            }
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className={style["structure-main"]}>
            <div
                className={
                    style["structure-content"]
                }
            >
                <div
                    className="cursorOn"
                    onClick={onBack}
                >
                    <GoBackIcon />
                </div>

                <div className={style.topSection}>
                    <div className={style.topLeft}>
                        <div>
                            <h2>
                                Activité :{" "}
                                {activityTitle || activityId}
                            </h2>

                            <p
                                className={
                                    style.description
                                }
                            >
                                Description :{" "}
                                {activity?.description ||
                                    "-"}
                            </p>
                        </div>

                        <button
                            type="button"
                            className={
                                style.buttonActivityTrack
                            }
                            onClick={
                                onViewActivityReport
                            }
                        >
                            <EyesIcon color="#1d4ed8" />
                            &nbsp; Rapport de
                            l&apos;activité
                        </button>
                    </div>

                    <div className={style.cardsRow}>
                        <div className={style.card}>
                            <div
                                className={
                                    style.cardTitle
                                }
                            >
                                Progrès
                            </div>

                            <div
                                className={
                                    style.cardBody
                                }
                            >
                                <div
                                    className={
                                        style.progressText
                                    }
                                >
                                    {
                                        completedSessions.length
                                    }{" "}
                                    sur {sessions.length}{" "}
                                    terminée
                                    {sessions.length > 1
                                        ? "s"
                                        : ""}
                                </div>

                                <div
                                    className={
                                        style.progressBar
                                    }
                                >
                                    <div
                                        className={
                                            style.progressFill
                                        }
                                        style={{
                                            width:
                                                `${progressPercent}%`,
                                        }}
                                    />
                                </div>

                                <div
                                    className={
                                        style.meta
                                    }
                                >
                                    Durée de la
                                    session :{" "}
                                    {formatDuration(
                                        activity?.duration_in_minutes
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className={style.card}>
                            <div
                                className={
                                    style.cardTitle
                                }
                            >
                                Ressources
                            </div>

                            <div
                                className={
                                    style.cardBody
                                }
                            >
                                <div>
                                    0 document(s)
                                </div>

                                <div>
                                    0 vidéo(s)
                                </div>
                            </div>
                        </div>

                        <div className={style.card}>
                            <div
                                className={
                                    style.cardTitle
                                }
                            >
                                Intervenants
                            </div>

                            <div
                                className={
                                    style.cardBody
                                }
                            >
                                {contributorNames.length >
                                    0 ? (
                                    <ListUsersInSession
                                        users={
                                            contributorNames
                                        }
                                    />
                                ) : (
                                    "-"
                                )}
                            </div>
                        </div>

                        <div className={style.card}>
                            <div
                                className={
                                    style.cardTitle
                                }
                            >
                                Projets
                            </div>

                            <div
                                className={
                                    style.cardBody
                                }
                            >
                                {projectNames.length ===
                                    0 ? (
                                    "-"
                                ) : (
                                    projectNames.map(
                                        (
                                            projectName,
                                            index
                                        ) => (
                                            <div
                                                key={
                                                    `${projectName}-${index}`
                                                }
                                                className={
                                                    style.projectBadge
                                                }
                                            >
                                                {
                                                    projectName
                                                }
                                            </div>
                                        )
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className={
                    style["structure-content"]
                }
            >
                <div className={style.headerRow}>
                    <h2>Sessions</h2>

                    <div className={style.tools}>
                        <FilterContributors />

                        <button
                            type="button"
                            className="buttons-primary-reversed"
                            onClick={openCreate}
                        >
                            <FiPlusCircle className="buttons-icon" />
                            Nouvelle Session
                        </button>
                    </div>
                </div>

                {sessions.length === 0 ? (
                    <NoItem
                        message="Aucune session trouvée"
                        subMessage="Créez une première session pour cette activité."
                    />
                ) : (
                    <table
                        className={
                            style[
                            "contributors-table"
                            ]
                        }
                    >
                        <thead>
                            <tr>
                                <th className="th-first th-50">
                                    N°
                                </th>

                                <th className="th-150">
                                    Date
                                </th>

                                <th className="th-150">
                                    Lieu
                                </th>

                                <th className="th-100">
                                    Émargement
                                </th>

                                <th className="th-100">
                                    Évaluation
                                </th>

                                <th className="th-150">
                                    Compte rendu
                                </th>

                                <th className="th-100">
                                    Statut
                                </th>

                                <th className="th-last th-100">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {sessions.map(
                                (session) => {
                                    const status =
                                        statusById.get(
                                            String(
                                                session.id_session_status
                                            )
                                        );

                                    return (
                                        <tr
                                            key={
                                                session.id
                                            }
                                        >
                                            <td>
                                                {session.incremental_session ??
                                                    "-"}
                                            </td>

                                            <td>
                                                {formatSessionDate(
                                                    session.date_session
                                                )}
                                            </td>

                                            <td>
                                                <span
                                                    className={
                                                        style.badge
                                                    }
                                                >
                                                    {getSessionLocation(
                                                        session
                                                    )}
                                                </span>
                                            </td>

                                            <td>
                                                {getSignValue(
                                                    session
                                                )}
                                            </td>

                                            <td>
                                                {getEvaluationValue(
                                                    session
                                                )}
                                            </td>

                                            <td>
                                                <button
                                                    type="button"
                                                    className="cr-btn buttons-primary-reversed"
                                                >
                                                    Ajouter
                                                </button>
                                            </td>

                                            <td>
                                                <span
                                                    className={getStatusClassName(
                                                        session
                                                    )}
                                                >
                                                    {status?.label ||
                                                        "-"}
                                                </span>
                                            </td>

                                            <td>
                                                <div
                                                    className={
                                                        style.actions
                                                    }
                                                >
                                                    <div
                                                        className="cursorOn"
                                                        onClick={() =>
                                                            onViewSession(
                                                                session
                                                            )
                                                        }
                                                    >
                                                        <EyesIcon />
                                                    </div>

                                                    <div
                                                        className="cursorOn"
                                                        onClick={() =>
                                                            onEditSession(
                                                                session
                                                            )
                                                        }
                                                    >
                                                        <PenIcon />
                                                    </div>

                                                    <div
                                                        className="cursorOn"
                                                        onClick={() =>
                                                            onDeleteSession(
                                                                session
                                                            )
                                                        }
                                                    >
                                                        <DeleteIcon />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                }
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            <Popup
                open={openCreatePopup}
                onClose={closeCreate}
                title="Nouvelle session"
            >
                <form
                    className={stylePopup.form}
                    onSubmit={
                        handleCreateConfirm
                    }
                >
                    <div className={stylePopup.row}>
                        <div
                            className={
                                stylePopup.field
                            }
                        >
                            <label>
                                Nombre de sessions
                                <span>*</span>
                            </label>

                            <input
                                className="inputs"
                                type="number"
                                min="1"
                                required
                                value={
                                    formValues.number_session
                                }
                                onChange={handleFormChange(
                                    "number_session"
                                )}
                            />
                        </div>

                        <div
                            className={
                                stylePopup.field
                            }
                        >
                            <label>
                                Type de session
                            </label>

                            <select
                                className="inputs"
                                value={
                                    formValues.id_type_session
                                }
                                onChange={handleFormChange(
                                    "id_type_session"
                                )}
                            >
                                <option value="">
                                    Non défini
                                </option>

                                {typeList.map(
                                    (type) => (
                                        <option
                                            key={type.id}
                                            value={type.id}
                                        >
                                            {
                                                type.label
                                            }
                                        </option>
                                    )
                                )}
                            </select>
                        </div>
                    </div>

                    <button
                        id="btnCreateSession"
                        type="submit"
                        className={`${stylePopup.submitBtn} buttons-primary`}
                        disabled={isCreating}
                        onClick={() =>
                            avoidDoubleClicks(
                                "btnCreateSession"
                            )
                        }
                    >
                        {isCreating
                            ? "Création en cours..."
                            : "Créer"}
                    </button>
                </form>
            </Popup>
        </div>
    );
};

export default SessionPage;