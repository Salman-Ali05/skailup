"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { showToast } from "nextjs-toast-notify";
import { useRouteTo } from "@/app/utils/router";
import style from "./actitvity.module.css";
import ActivityPage from "@/app/components/ActivityPage/ActivityPage";
import { useUser } from "@/app/utils/contexts/userContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const StructureActivity = () => {
    const routeTo = useRouteTo();
    const params = useParams();
    const { id } = params || {};

    const { loading, isAuthenticated, authFetch } = useUser();

    const [program, setProgram] = useState(null);

    const [activities, setActivities] = useState([]);
    const [activityProjects, setActivityProjects] = useState([]);
    const [projects, setProjects] = useState([]);

    const [activityContribs, setActivityContribs] = useState([]);
    const [contributors, setContributors] = useState([]);

    const [tagParamStructures, setTagParamStructures] = useState([]);
    const [tagParamTypes, setTagParamTypes] = useState([]);

    const [statusOptions, setStatusOptions] = useState([]);
    const [status, setStatus] = useState([]);

    const [durationOptionsSet, setDurationOptionsSet] = useState([]);

    const [programProjects, setProgramProjects] = useState([]);
    const [availableProgramProjects, setAvailableProgramProjects] =
        useState([]);

    useEffect(() => {
        const storedProgram = sessionStorage.getItem("selectedProgram");

        if (!storedProgram) return;

        try {
            const parsedProgram = JSON.parse(storedProgram);

            if (String(parsedProgram.id) === String(id)) {
                setProgram(parsedProgram);
            }
        } catch (err) {
            console.error(
                "Impossible de récupérer le programme",
                err
            );
        }
    }, [id]);

    const normalizeOsResponse = (data) => {
        if (Array.isArray(data)) return data;
        if (Array.isArray(data?.code)) return data.code;
        if (Array.isArray(data?.data)) return data.data;
        return [];
    };

    const fetchStatus = async () => {
        try {
            const res = await authFetch(
                `${API_URL}/os_tags/os_status`,
                {
                    method: "GET",
                }
            );

            const data = await res.json().catch(() => []);

            if (!res.ok) {
                throw new Error(
                    data?.error ||
                    "Impossible de charger les statuts"
                );
            }

            const statusData = normalizeOsResponse(data);

            const allowedStatus = statusData.filter((item) => {
                return ["Open", "Closed"].includes(item.code);
            });

            setStatus(allowedStatus);
        } catch (err) {
            console.error(err);
            showToast.error(
                "Impossible de charger la liste des statuts"
            );
        }
    };

    const fetchActivityDurations = async () => {
        try {
            const res = await authFetch(
                `${API_URL}/os_tags/os_activity_duration`,
                {
                    method: "GET",
                }
            );

            const data = await res.json().catch(() => []);

            if (!res.ok) {
                throw new Error(
                    data?.error ||
                    "Impossible de charger les durées d'activité"
                );
            }

            setDurationOptionsSet(normalizeOsResponse(data));
        } catch (err) {
            console.error(err);
            setDurationOptionsSet([]);

            showToast.error(
                "Impossible de charger la liste des durées"
            );
        }
    };

    const fetchActivities = async () => {
        try {
            const res = await authFetch(
                `${API_URL}/activities/${id}`,
                {
                    method: "GET",
                }
            );

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(
                    data?.error ||
                    "Erreur lors du chargement des activités"
                );
            }

            setProgram(data?.program || null);
            setActivities(data?.activities ?? []);
            setActivityProjects(data?.activityProjects ?? []);
            setProjects(data?.projects ?? []);
            setActivityContribs(data?.activityContribs ?? []);
            setContributors(data?.contributors ?? []);
            setStatusOptions(data?.statusOptions ?? []);
            setTagParamStructures(
                data?.tagParamStructures ?? []
            );
            setTagParamTypes(data?.tagParamTypes ?? []);
        } catch (err) {
            console.error(err);

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

            const data = await res.json().catch(() => ({}));

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

    useEffect(() => {
        if (loading) return;
        if (!isAuthenticated) return;
        if (!id) return;

        fetchStatus();
        fetchActivityDurations();
        refreshActivitiesData();
        refreshProgramProjectsData();
    }, [loading, isAuthenticated, id]);

    const handleViewActivity = (activityId) => {
        routeTo(`/structure/session/${activityId}`);
    };

    const handleCreateActivity = async (formValues) => {
        if (loading || !isAuthenticated) {
            showToast.error(
                "Session expirée. Veuillez vous reconnecter."
            );
            return false;
        }

        try {
            const activityPayload = {
                id_param_name:
                    Number(formValues.id_param_name) ||
                    formValues.id_param_name,

                name: formValues.name,
                description: formValues.description,

                is_sign_needed: formValues.is_sign_needed,
                is_note_needed: formValues.is_note_needed,

                number_session: Number(
                    formValues.number_session
                ),

                duration_in_minutes: Number(
                    formValues.duration_in_minutes
                ),

                contribs: formValues.contribs ?? [],
                projects: formValues.projects ?? [],

                is_planable: formValues.is_planable,

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
                    body: JSON.stringify(activityPayload),
                }
            );

            const data = await res.json().catch(() => ({}));

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
            showToast.error(`Erreur : ${err.message}`);
            return false;
        }
    };

    const handleEditActivity = async (formValues) => {
        if (loading || !isAuthenticated) {
            showToast.error(
                "Session expirée. Veuillez vous reconnecter."
            );
            return false;
        }

        try {
            const activityPayload = {
                id_param_name:
                    Number(formValues.id_param_name) ||
                    formValues.id_param_name,

                name: formValues.name,
                description: formValues.description,

                is_sign_needed: formValues.is_sign_needed,
                is_note_needed: formValues.is_note_needed,

                number_session: Number(
                    formValues.number_session
                ),

                duration_in_minutes: Number(
                    formValues.duration_in_minutes
                ),

                is_planable: formValues.is_planable,

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
                    body: JSON.stringify(activityPayload),
                }
            );

            const data = await res.json().catch(() => ({}));

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
            showToast.error(`Erreur : ${err.message}`);
            return false;
        }
    };

    const handleAddProjectsToProgram = async (projectIds) => {
        if (loading || !isAuthenticated) {
            showToast.error(
                "Session expirée. Veuillez vous reconnecter."
            );

            return false;
        }

        if (!Array.isArray(projectIds) || projectIds.length === 0) {
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

            const data = await res.json().catch(() => ({}));

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
            showToast.error(`Erreur : ${err.message}`);
            return false;
        }
    };

    return (
        <div className={style["structure-layout"]}>
            <div className={style["structure-main"]}>
                <ActivityPage
                    programId={id}
                    program={program}
                    status={status}
                    statusOptions={statusOptions}
                    activities={activities}
                    activityProjects={activityProjects}
                    projects={projects}
                    activityContribs={activityContribs}
                    contributors={contributors}
                    tagParamStructures={tagParamStructures}
                    tagParamTypes={tagParamTypes}
                    durationOptionsSet={durationOptionsSet}
                    programProjects={programProjects}
                    availableProgramProjects={
                        availableProgramProjects
                    }
                    onBack={() =>
                        routeTo("/structure/program")
                    }
                    onViewActivity={handleViewActivity}
                    onCreateActivity={handleCreateActivity}
                    onEditActivity={handleEditActivity}
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