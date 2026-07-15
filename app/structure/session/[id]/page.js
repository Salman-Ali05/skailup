"use client";

import React, {
    useEffect,
    useMemo,
    useState,
} from "react";
import { useParams } from "next/navigation";
import { showToast } from "nextjs-toast-notify";
import { useRouteTo } from "@/app/utils/router";
import style from "./session.module.css";
import SessionPage from "@/app/components/SessionPage/SessionPage";
import { useUser } from "@/app/utils/contexts/userContext";
import useOptionsSet from "@/app/utils/os/options_set";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const StructureSession = () => {
    const routeTo = useRouteTo();
    const params = useParams();
    const { id: activityId } = params || {};

    const {
        loading,
        isAuthenticated,
        authFetch,
    } = useUser();

    const {
        optionsSet,
        optionsLoading,
        optionsError,
    } = useOptionsSet();

    const [activity, setActivity] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [sessionUsers, setSessionUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [contributors, setContributors] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);

    /*
     * Tous les statuts de session.
     *
     * Contrairement aux programmes et activités,
     * on ne filtre pas uniquement Open / Closed.
     */
    const sessionStatusOptions = useMemo(() => {
        return Array.isArray(optionsSet?.os_status)
            ? optionsSet.os_status
            : [];
    }, [optionsSet]);

    /*
     * Présentiel, distanciel, hybride...
     */
    const sessionTypeOptions = useMemo(() => {
        return Array.isArray(optionsSet?.os_type_session)
            ? optionsSet.os_type_session
            : [];
    }, [optionsSet]);

    useEffect(() => {
        if (!optionsError) return;

        console.error(
            "Impossible de charger les options sets :",
            optionsError
        );

        showToast.error(
            "Impossible de charger les options de l'application"
        );
    }, [optionsError]);

    /*
     * Permet d'afficher rapidement l'activité si elle
     * a été stockée avant la navigation.
     *
     * Les données du backend restent prioritaires.
     */
    useEffect(() => {
        if (!activityId) return;

        const storedActivity =
            sessionStorage.getItem("selectedActivity");

        if (!storedActivity) return;

        try {
            const parsedActivity =
                JSON.parse(storedActivity);

            if (
                String(parsedActivity.id) ===
                String(activityId)
            ) {
                setActivity(parsedActivity);
            }
        } catch (error) {
            console.error(
                "Impossible de lire l'activité stockée :",
                error
            );
        }
    }, [activityId]);

    const fetchSessionPageData = async () => {
        if (!activityId) return;

        try {
            setPageLoading(true);

            const response = await authFetch(
                `${API_URL}/sessions/${activityId}`,
                {
                    method: "GET",
                }
            );

            const data = await response
                .json()
                .catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    data?.error ||
                    "Impossible de charger les sessions"
                );
            }

            setSessions(
                Array.isArray(data?.sessions)
                    ? data.sessions
                    : []
            );

            setSessionUsers(
                Array.isArray(data?.sessionUsers)
                    ? data.sessionUsers
                    : []
            );

            setProjects(
                Array.isArray(data?.projects)
                    ? data.projects
                    : []
            );

            setContributors(
                Array.isArray(data?.contributors)
                    ? data.contributors
                    : []
            );

            if (data?.activity) {
                setActivity(data.activity);
            }
        } catch (error) {
            console.error(
                "fetchSessionPageData:",
                error
            );

            setSessions([]);
            setSessionUsers([]);
            setProjects([]);
            setContributors([]);

            showToast.error(
                "Impossible de charger les sessions"
            );
        } finally {
            setPageLoading(false);
        }
    };

    useEffect(() => {
        if (loading) return;
        if (optionsLoading) return;
        if (!isAuthenticated) return;
        if (!activityId) return;

        fetchSessionPageData();
    }, [
        loading,
        optionsLoading,
        isAuthenticated,
        activityId,
    ]);

    const handleCreateSession = async (formValues) => {
        if (loading || !isAuthenticated) {
            showToast.error(
                "Session expirée. Veuillez vous reconnecter."
            );

            return false;
        }

        const numberSession = Number(
            formValues.number_session
        );

        if (
            !Number.isInteger(numberSession) ||
            numberSession <= 0
        ) {
            showToast.error(
                "Le nombre de sessions est invalide."
            );

            return false;
        }

        try {
            const payload = {
                numberSession,
                idTypeSession:
                    formValues.id_type_session || null,
            };

            const response = await authFetch(
                `${API_URL}/sessions/${activityId}`,
                {
                    method: "POST",
                    body: JSON.stringify(payload),
                }
            );

            const data = await response
                .json()
                .catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    data?.error ||
                    "Impossible de créer les sessions"
                );
            }

            showToast.success(
                numberSession > 1
                    ? "Sessions créées avec succès"
                    : "Session créée avec succès"
            );

            await fetchSessionPageData();

            return true;
        } catch (error) {
            console.error(
                "handleCreateSession:",
                error
            );

            showToast.error(
                `Erreur : ${error.message}`
            );

            return false;
        }
    };

    const handleBack = () => {
        if (activity?.id_program) {
            routeTo(
                `/structure/activity/${activity.id_program}`
            );

            return;
        }

        routeTo("/structure/program");
    };

    const handleViewSession = (session) => {
        sessionStorage.setItem(
            "selectedSession",
            JSON.stringify(session)
        );

        console.log(
            "Session sélectionnée :",
            session.id
        );
    };

    const handleEditSession = async () => {
        showToast.error(
            "La modification des sessions n'est pas encore disponible."
        );

        return false;
    };

    const handleDeleteSession = async () => {
        showToast.error(
            "La suppression des sessions n'est pas encore disponible."
        );

        return false;
    };

    if (optionsLoading || pageLoading) {
        return (
            <div className={style["structure-layout"]}>
                <div className={style["structure-main"]}>
                    <p>Chargement des sessions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={style["structure-layout"]}>
            <SessionPage
                activityId={activityId}
                activity={activity}

                sessions={sessions}
                sessionUsers={sessionUsers}

                projects={projects}
                contributors={contributors}

                statusOptions={sessionStatusOptions}
                typeOptions={sessionTypeOptions}

                onBack={handleBack}
                onCreateSession={handleCreateSession}
                onViewActivityReport={() => { }}
                onViewSession={handleViewSession}
                onEditSession={handleEditSession}
                onDeleteSession={handleDeleteSession}
            />
        </div>
    );
};

export default StructureSession;