"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "nextjs-toast-notify";
import style from "./programs.module.css";
import ProgramPage from "@/app/components/ProgramPage/ProgramPage";
import { useUser } from "@/app/utils/contexts/userContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const StructurePrograms = () => {
    const router = useRouter();

    const {
        loading,
        isAuthenticated,
        authFetch,
    } = useUser();

    // later, we'll use the os in the utilis folder 
    const openStatusId = "a71fd9fe-5def-49da-90f1-ef3bee535906";
    const closedStatusId = "1d85343e-5bb8-4f71-b3c4-2e9f23e157a2";

    const [activeStatusId, setActiveStatusId] =
        useState(openStatusId);

    const [programs, setPrograms] = useState([]);
    const [programProjects, setProgramProjects] = useState([]);
    const [projects, setProjects] = useState([]);
    const [programContributors, setProgramContributors] = useState([]);
    const [contributors, setContributors] = useState([]);
    const [tagParamStructures, setTagParamStructures] = useState([]);
    const [statusOptions, setStatusOptions] = useState([]);
    const [status, setStatus] = useState([]);

    const [statusCounts, setStatusCounts] = useState({
        open: 0,
        closed: 0,
        byId: {
            [openStatusId]: 0,
            [closedStatusId]: 0,
        },
    });

    /*
     * Prévu pour les futurs filtres.
     *
     * programName = nom du tag programme
     * cohortName = description de la cohorte
     */
    const [filters, setFilters] = useState({
        programName: "",
        cohortName: "",
        contributorId: "",
        projectId: "",
        activityId: "",
    });

    const handleViewProgram = (program) => {
        sessionStorage.setItem(
            "selectedProgram",
            JSON.stringify(program)
        );

        router.push(`/structure/activity/${program.id}`);
    };

    const fetchStatus = async () => {
        try {
            const res = await authFetch(
                `${API_URL}/os_tags/os_status`,
                {
                    method: "GET",
                }
            );

            const data = await res.json();

            const statusData = Array.isArray(data)
                ? data
                : Array.isArray(data?.code)
                    ? data.code
                    : [];

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

    const fetchPrograms = async () => {
        try {
            const queryParams = new URLSearchParams();

            /*
             * L’onglet actif est toujours envoyé au backend.
             */
            if (activeStatusId) {
                queryParams.set(
                    "statusId",
                    activeStatusId
                );
            }

            /*
             * Filtres facultatifs.
             */
            if (filters.programName.trim()) {
                queryParams.set(
                    "programName",
                    filters.programName.trim()
                );
            }

            if (filters.cohortName.trim()) {
                queryParams.set(
                    "cohortName",
                    filters.cohortName.trim()
                );
            }

            if (filters.contributorId) {
                queryParams.set(
                    "contributorId",
                    filters.contributorId
                );
            }

            if (filters.projectId) {
                queryParams.set(
                    "projectId",
                    filters.projectId
                );
            }

            if (filters.activityId) {
                queryParams.set(
                    "activityId",
                    filters.activityId
                );
            }

            const queryString = queryParams.toString();

            const url = queryString
                ? `${API_URL}/programs?${queryString}`
                : `${API_URL}/programs`;

            const res = await authFetch(url, {
                method: "GET",
            });

            const data = await res
                .json()
                .catch(() => ({}));

            if (!res.ok) {
                throw new Error(
                    data?.error ||
                    "Erreur lors du chargement des programmes"
                );
            }

            setPrograms(
                Array.isArray(data?.programs)
                    ? data.programs
                    : []
            );

            setProgramProjects(
                Array.isArray(data?.programProjects)
                    ? data.programProjects
                    : []
            );

            setProjects(
                Array.isArray(data?.projects)
                    ? data.projects
                    : []
            );

            setProgramContributors(
                Array.isArray(data?.programContributors)
                    ? data.programContributors
                    : []
            );

            setStatusOptions(
                Array.isArray(data?.statusOptions)
                    ? data.statusOptions
                    : []
            );

            setTagParamStructures(
                Array.isArray(data?.tagParamStructures)
                    ? data.tagParamStructures
                    : []
            );

            setContributors(
                Array.isArray(data?.contributors)
                    ? data.contributors
                    : []
            );

            setStatusCounts({
                open: data?.statusCounts?.open ?? 0,
                closed: data?.statusCounts?.closed ?? 0,
                byId: data?.statusCounts?.byId ?? {
                    [openStatusId]: 0,
                    [closedStatusId]: 0,
                },
            });
        } catch (err) {
            console.error(err);

            setPrograms([]);
            setProgramProjects([]);
            setProjects([]);
            setProgramContributors([]);
            setContributors([]);

            showToast.error(
                "Impossible de charger la liste des programmes"
            );
        }
    };

    const refreshProgramsData = async () => {
        await fetchPrograms();
    };

    /*
     * Chargement initial des statuts.
     */
    useEffect(() => {
        if (loading) return;
        if (!isAuthenticated) return;

        fetchStatus();
    }, [loading, isAuthenticated]);

    /*
     * Nouveau chargement des programmes dès que :
     * - l’onglet change ;
     * - un filtre change.
     */
    useEffect(() => {
        if (loading) return;
        if (!isAuthenticated) return;
        if (!activeStatusId) return;

        refreshProgramsData();
    }, [
        loading,
        isAuthenticated,
        activeStatusId,
        filters.programName,
        filters.cohortName,
        filters.contributorId,
        filters.projectId,
        filters.activityId,
    ]);

    const handleStatusChange = (statusId) => {
        setActiveStatusId(String(statusId));
    };

    const handleFiltersChange = (nextFilters) => {
        setFilters((prev) => ({
            ...prev,
            ...nextFilters,
        }));
    };

    const handleClearFilters = () => {
        setFilters({
            programName: "",
            cohortName: "",
            contributorId: "",
            projectId: "",
            activityId: "",
        });
    };

    const handleCreateProgram = async (formValues) => {
        if (loading || !isAuthenticated) {
            showToast.error(
                "Session expirée. Veuillez vous reconnecter."
            );

            return;
        }

        try {
            const programPayload = {
                id_param_structure:
                    Number(formValues.id_param_structure) ||
                    formValues.id_param_structure,

                description:
                    formValues.description,

                date_start:
                    formValues.date_start,

                date_end:
                    formValues.date_end,

                id_status:
                    Number(formValues.id_status) ||
                    formValues.id_status,
            };

            const res = await authFetch(
                `${API_URL}/programs`,
                {
                    method: "POST",
                    body: JSON.stringify(programPayload),
                }
            );

            const data = await res
                .json()
                .catch(() => ({}));

            if (!res.ok) {
                throw new Error(
                    data?.error ||
                    "Erreur lors de la création du programme"
                );
            }

            showToast.success(
                "Programme créé avec succès"
            );

            /*
             * Si le programme créé appartient à l’onglet actif,
             * il apparaîtra après le refresh.
             *
             * Les compteurs seront également recalculés.
             */
            await refreshProgramsData();
        } catch (err) {
            console.error(err);

            showToast.error(
                `Erreur : ${err.message}`
            );
        }
    };

    const handleEditProgram = async (formValues) => {
        if (loading || !isAuthenticated) {
            showToast.error(
                "Session expirée. Veuillez vous reconnecter."
            );

            return;
        }

        try {
            const programPayload = {
                id_param_structure:
                    Number(formValues.id_param_structure) ||
                    formValues.id_param_structure,

                description:
                    formValues.description,

                date_start:
                    formValues.date_start,

                date_end:
                    formValues.date_end,

                id_status:
                    Number(formValues.id_status) ||
                    formValues.id_status,
            };

            const res = await authFetch(
                `${API_URL}/programs/${formValues.id}`,
                {
                    method: "PUT",
                    body: JSON.stringify(programPayload),
                }
            );

            const data = await res
                .json()
                .catch(() => ({}));

            if (!res.ok) {
                throw new Error(
                    data?.error ||
                    "Erreur lors de la modification du programme"
                );
            }

            showToast.success(
                "Programme modifié avec succès"
            );

            /*
             * Si le statut a changé, le programme peut disparaître
             * de l’onglet courant et le compteur de l’autre onglet
             * sera mis à jour.
             */
            await refreshProgramsData();
        } catch (err) {
            console.error(err);

            showToast.error(
                `Erreur : ${err.message}`
            );
        }
    };

    return (
        <div className={style["structure-layout"]}>
            <div className={style["structure-main"]}>
                <ProgramPage
                    status={status}
                    statusOptions={statusOptions}

                    activeStatusId={activeStatusId}
                    statusCounts={statusCounts}
                    onStatusChange={handleStatusChange}

                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    onClearFilters={handleClearFilters}

                    programs={programs}
                    programProjects={programProjects}
                    projects={projects}
                    programContributors={programContributors}
                    contributors={contributors}
                    tagParamStructures={tagParamStructures}

                    onViewProgram={handleViewProgram}
                    onCreateProgram={handleCreateProgram}
                    onEditProgram={handleEditProgram}
                />
            </div>
        </div>
    );
};

export default StructurePrograms;