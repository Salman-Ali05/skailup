"use client";

import React, {
    useEffect,
    useMemo,
    useState,
} from "react";
import { useParams } from "next/navigation";
import { showToast } from "nextjs-toast-notify";
import { useRouteTo } from "@/app/utils/router";
import style from "./actitvity.module.css";
import ActivityPage from "@/app/components/ActivityPage/ActivityPage";
import { useUser } from "@/app/utils/contexts/userContext";
import useOptionsSet from "@/app/utils/os/options_set";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const StructureActivity = () => {
    const routeTo = useRouteTo();
    const params = useParams();
    const { id } = params || {};

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

    /*
     * Statuts autorisés pour les activités.
     */
    const activityStatusOptions = useMemo(() => {
        const statuses = Array.isArray(optionsSet?.os_status)
            ? optionsSet.os_status
            : [];

        return statuses.filter((status) => {
            return ["Open", "Closed"].includes(status.code);
        });
    }, [optionsSet]);

    /*
     * Durées disponibles pour une session.
     */
    const durationOptionsSet = useMemo(() => {
        return Array.isArray(
            optionsSet?.os_activity_duration
        )
            ? optionsSet.os_activity_duration
            : [];
    }, [optionsSet]);

    /*
     * Types de paramètres :
     * Activities, Programs, etc.
     */
    const tagParamTypes = useMemo(() => {
        return Array.isArray(optionsSet?.os_tag_params)
            ? optionsSet.os_tag_params
            : [];
    }, [optionsSet]);

    const [program, setProgram] = useState(null);

    const [activities, setActivities] = useState([]);
    const [activityProjects, setActivityProjects] =
        useState([]);
    const [projects, setProjects] = useState([]);

    const [activityContribs, setActivityContribs] =
        useState([]);
    const [contributors, setContributors] =
        useState([]);

    const [
        tagParamStructures,
        setTagParamStructures,
    ] = useState([]);

    const [programProjects, setProgramProjects] =
        useState([]);

    const [
        availableProgramProjects,
        setAvailableProgramProjects,
    ] = useState([]);

    useEffect(() => {
        const storedProgram =
            sessionStorage.getItem("selectedProgram");

        if (!storedProgram) return;

        try {
            const parsedProgram =
                JSON.parse(storedProgram);

            if (
                String(parsedProgram.id) ===
                String(id)
            ) {
                setProgram(parsedProgram);
            }
        } catch (err) {
            console.error(
                "Impossible de récupérer le programme",
                err
            );
        }
    }, [id]);

    /*
     * Gestion de l'erreur du fichier global OS.
     */
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

    const fetchActivities = async () => {
        try {
            const res = await authFetch(
                `${API_URL}/activities/${id}`,
                {
                    method: "GET",
                }
            );

            const data = await res
                .json()
                .catch(() => ({}));

            if (!res.ok) {
                throw new Error(
                    data?.error ||
                    "Erreur lors du chargement des activités"
                );
            }

            setProgram(data?.program || null);

            setActivities(
                Array.isArray(data?.activities)
                    ? data.activities
                    : []
            );

            setActivityProjects(
                Array.isArray(data?.activityProjects)
                    ? data.activityProjects
                    : []
            );

            setProjects(
                Array.isArray(data?.projects)
                    ? data.projects
                    : []
            );

            setActivityContribs(
                Array.isArray(data?.activityContribs)
                    ? data.activityContribs
                    : []
            );

            setContributors(
                Array.isArray(data?.contributors)
                    ? data.contributors
                    : []
            );

            setTagParamStructures(
                Array.isArray(data?.tagParamStructures)
                    ? data.tagParamStructures
                    : []
            );

            /*
             * On n'utilise plus :
             *
             * data.statusOptions
             * data.tagParamTypes
             *
             * Ces données viennent maintenant de optionsSet.
             */
        } catch (err) {
            console.error(err);

            setActivities([]);
            setActivityProjects([]);
            setProjects([]);
            setActivityContribs([]);
            setContributors([]);
            setTagParamStructures([]);

            showToast.error(
                "Impossible de charger la liste des activités"
            );
        }
    };

    const fetchProgramProjects = async () => {
        try {
            const res = await authFetch(
                `${API_URL}/programs/${id}/projects`,
                {
                    method: "GET",
                }
            );

            const data = await res
                .json()
                .catch(() => ({}));

            if (!res.ok) {
                throw new Error(
                    data?.error ||
                    "Erreur lors du chargement des projets du programme"
                );
            }

            setProgramProjects(
                Array.isArray(data?.programProjects)
                    ? data.programProjects
                    : []
            );

            setAvailableProgramProjects(
                Array.isArray(data?.availableProjects)
                    ? data.availableProjects
                    : []
            );
        } catch (err) {
            console.error(err);

            setProgramProjects([]);
            setAvailableProgramProjects([]);

            showToast.error(
                "Impossible de charger les projets du programme"
            );
        }
    };

    const refreshActivitiesData = async () => {
        await fetchActivities();
    };

    const refreshProgramProjectsData = async () => {
        await fetchProgramProjects();
    };

    /*
     * Les données sont chargées une fois que :
     * - l'authentification est prête ;
     * - les options sets sont disponibles ;
     * - l'ID du programme est disponible.
     */
    useEffect(() => {
        if (loading) return;
        if (optionsLoading) return;
        if (!isAuthenticated) return;
        if (!id) return;

        Promise.all([
            refreshActivitiesData(),
            refreshProgramProjectsData(),
        ]);
    }, [
        loading,
        optionsLoading,
        isAuthenticated,
        id,
    ]);

    const handleViewActivity = (activityId) => {
        routeTo(
            `/structure/session/${activityId}`
        );
    };

    const handleCreateActivity = async (
        formValues
    ) => {
        if (loading || !isAuthenticated) {
            showToast.error(
                "Session expirée. Veuillez vous reconnecter."
            );

            return false;
        }

        try {
            const activityPayload = {
                id_param_name:
                    Number(
                        formValues.id_param_name
                    ) ||
                    formValues.id_param_name,

                name: formValues.name,

                description:
                    formValues.description,

                is_sign_needed:
                    formValues.is_sign_needed,

                is_note_needed:
                    formValues.is_note_needed,

                number_session: Number(
                    formValues.number_session
                ),

                duration_in_minutes: Number(
                    formValues.duration_in_minutes
                ),

                contribs:
                    formValues.contribs ?? [],

                projects:
                    formValues.projects ?? [],

                is_planable:
                    formValues.is_planable,

                id_status:
                    Number(formValues.id_status) ||
                    formValues.id_status,

                is_finished:
                    formValues.is_finished ?? false,

                is_priced:
                    formValues.is_priced ?? false,

                rate_60minutes:
                    formValues.rate_60minutes ?? [],
            };

            const res = await authFetch(
                `${API_URL}/activities/${id}`,
                {
                    method: "POST",
                    body: JSON.stringify(
                        activityPayload
                    ),
                }
            );

            const data = await res
                .json()
                .catch(() => ({}));

            if (!res.ok) {
                throw new Error(
                    data?.error ||
                    "Erreur lors de la création de l'activité"
                );
            }

            showToast.success(
                "Activité créée avec succès"
            );

            await Promise.all([
                refreshActivitiesData(),
                refreshProgramProjectsData(),
            ]);

            return true;
        } catch (err) {
            console.error(err);

            showToast.error(
                `Erreur : ${err.message}`
            );

            return false;
        }
    };

    const handleEditActivity = async (
        formValues
    ) => {
        if (loading || !isAuthenticated) {
            showToast.error(
                "Session expirée. Veuillez vous reconnecter."
            );

            return false;
        }

        try {
            const activityPayload = {
                id_param_name:
                    Number(
                        formValues.id_param_name
                    ) ||
                    formValues.id_param_name,

                name: formValues.name,

                description:
                    formValues.description,

                is_sign_needed:
                    formValues.is_sign_needed,

                is_note_needed:
                    formValues.is_note_needed,

                number_session: Number(
                    formValues.number_session
                ),

                duration_in_minutes: Number(
                    formValues.duration_in_minutes
                ),

                is_planable:
                    formValues.is_planable,

                id_status:
                    Number(formValues.id_status) ||
                    formValues.id_status,

                is_finished:
                    formValues.is_finished ?? false,

                is_priced:
                    formValues.is_priced ?? false,
            };

            const res = await authFetch(
                `${API_URL}/activities/${id}/${formValues.id}`,
                {
                    method: "PUT",
                    body: JSON.stringify(
                        activityPayload
                    ),
                }
            );

            const data = await res
                .json()
                .catch(() => ({}));

            if (!res.ok) {
                throw new Error(
                    data?.error ||
                    "Erreur lors de la modification de l'activité"
                );
            }

            showToast.success(
                "Activité modifiée avec succès"
            );

            await refreshActivitiesData();

            return true;
        } catch (err) {
            console.error(err);

            showToast.error(
                `Erreur : ${err.message}`
            );

            return false;
        }
    };

    const handleAddProjectsToProgram = async (
        projectIds
    ) => {
        if (loading || !isAuthenticated) {
            showToast.error(
                "Session expirée. Veuillez vous reconnecter."
            );

            return false;
        }

        if (
            !Array.isArray(projectIds) ||
            projectIds.length === 0
        ) {
            showToast.error(
                "Sélectionnez au moins un projet."
            );

            return false;
        }

        try {
            const res = await authFetch(
                `${API_URL}/programs/${id}/projects`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        projectIds,
                    }),
                }
            );

            const data = await res
                .json()
                .catch(() => ({}));

            if (!res.ok) {
                throw new Error(
                    data?.error ||
                    "Erreur lors de l'affectation des projets"
                );
            }

            showToast.success(
                projectIds.length > 1
                    ? "Projets ajoutés au programme"
                    : "Projet ajouté au programme"
            );

            await refreshProgramProjectsData();

            return true;
        } catch (err) {
            console.error(err);

            showToast.error(
                `Erreur : ${err.message}`
            );

            return false;
        }
    };

    if (optionsLoading) {
        return (
            <div
                className={
                    style["structure-layout"]
                }
            >
                <div
                    className={
                        style["structure-main"]
                    }
                >
                    <p>
                        Chargement des options...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            className={
                style["structure-layout"]
            }
        >
            <div
                className={
                    style["structure-main"]
                }
            >
                <ActivityPage
                    programId={id}
                    program={program}

                    /*
                     * Les OS viennent maintenant
                     * du fichier global.
                     */
                    status={
                        activityStatusOptions
                    }
                    durationOptionsSet={
                        durationOptionsSet
                    }
                    tagParamTypes={
                        tagParamTypes
                    }

                    activities={activities}
                    activityProjects={
                        activityProjects
                    }
                    projects={projects}
                    activityContribs={
                        activityContribs
                    }
                    contributors={
                        contributors
                    }
                    tagParamStructures={
                        tagParamStructures
                    }

                    programProjects={
                        programProjects
                    }
                    availableProgramProjects={
                        availableProgramProjects
                    }

                    onBack={() =>
                        routeTo(
                            "/structure/program"
                        )
                    }

                    onViewActivity={
                        handleViewActivity
                    }

                    onCreateActivity={
                        handleCreateActivity
                    }

                    onEditActivity={
                        handleEditActivity
                    }

                    onAddProjectsToProgram={
                        handleAddProjectsToProgram
                    }

                    onRefreshProgramProjects={
                        refreshProgramProjectsData
                    }
                />
            </div>
        </div>
    );
};

export default StructureActivity;