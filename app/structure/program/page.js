"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "nextjs-toast-notify";
import style from "./programs.module.css";
import ProgramPage from "@/app/components/ProgramPage/ProgramPage";
import { useUser } from "@/app/utils/contexts/userContext";
import useOptionsSet from "@/app/utils/os/options_set";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const StructurePrograms = () => {
    const router = useRouter();

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

    const programStatusOptions = useMemo(() => {
        const statuses = Array.isArray(optionsSet?.os_status)
            ? optionsSet.os_status
            : [];

        return statuses.filter((status) => {
            return ["Open", "Closed"].includes(status.code);
        });
    }, [optionsSet]);

    const tagParamTypes = useMemo(() => {
        return Array.isArray(optionsSet?.os_tag_params)
            ? optionsSet.os_tag_params
            : [];
    }, [optionsSet]);

    const openStatusId = useMemo(() => {
        return programStatusOptions.find((status) => {
            return status.code === "Open";
        })?.id;
    }, [programStatusOptions]);

    const closedStatusId = useMemo(() => {
        return programStatusOptions.find((status) => {
            return status.code === "Closed";
        })?.id;
    }, [programStatusOptions]);

    const [activeStatusId, setActiveStatusId] = useState("");

    const [programs, setPrograms] = useState([]);
    const [programProjects, setProgramProjects] = useState([]);
    const [projects, setProjects] = useState([]);
    const [programContributors, setProgramContributors] =
        useState([]);
    const [contributors, setContributors] = useState([]);
    const [tagParamStructures, setTagParamStructures] =
        useState([]);

    const [statusCounts, setStatusCounts] = useState({
        open: 0,
        closed: 0,
        byId: {},
    });

    const [filters, setFilters] = useState({
        programName: "",
        cohortName: "",
        contributorId: "",
        projectId: "",
        activityId: "",
    });

    useEffect(() => {
        if (!openStatusId) return;

        setActiveStatusId((currentStatusId) => {
            const currentStatusStillExists =
                programStatusOptions.some((status) => {
                    return (
                        String(status.id) ===
                        String(currentStatusId)
                    );
                });

            if (currentStatusStillExists) {
                return currentStatusId;
            }

            return String(openStatusId);
        });
    }, [openStatusId, programStatusOptions]);

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

    const handleViewProgram = (program) => {
        sessionStorage.setItem(
            "selectedProgram",
            JSON.stringify(program)
        );

        router.push(`/structure/activity/${program.id}`);
    };

    const fetchPrograms = async () => {
        if (!activeStatusId) return;

        try {
            const queryParams = new URLSearchParams();

            queryParams.set(
                "statusId",
                String(activeStatusId)
            );

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

            const res = await authFetch(
                `${API_URL}/programs?${queryString}`,
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
                    ...(openStatusId
                        ? {
                            [String(openStatusId)]: 0,
                        }
                        : {}),

                    ...(closedStatusId
                        ? {
                            [String(closedStatusId)]: 0,
                        }
                        : {}),
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
     * Les programmes sont récupérés uniquement quand :
     * - l'utilisateur est authentifié ;
     * - les OS sont chargés ;
     * - l'onglet actif possède un ID.
     */
    useEffect(() => {
        if (loading) return;
        if (optionsLoading) return;
        if (!isAuthenticated) return;
        if (!activeStatusId) return;

        refreshProgramsData();
    }, [
        loading,
        optionsLoading,
        isAuthenticated,
        activeStatusId,
        filters.programName,
        filters.cohortName,
        filters.contributorId,
        filters.projectId,
        filters.activityId,
    ]);

    const handleStatusChange = (statusId) => {
        if (!statusId) return;

        setActiveStatusId(String(statusId));
    };

    const handleFiltersChange = (nextFilters) => {
        setFilters((previousFilters) => ({
            ...previousFilters,
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

            return false;
        }

        try {
            const programPayload = {
                id_param_structure:
                    Number(formValues.id_param_structure) ||
                    formValues.id_param_structure,

                description: formValues.description,
                date_start: formValues.date_start,
                date_end: formValues.date_end,

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

            await refreshProgramsData();

            return true;
        } catch (err) {
            console.error(err);

            showToast.error(
                `Erreur : ${err.message}`
            );

            return false;
        }
    };

    const handleEditProgram = async (formValues) => {
        if (loading || !isAuthenticated) {
            showToast.error(
                "Session expirée. Veuillez vous reconnecter."
            );

            return false;
        }

        try {
            const programPayload = {
                id_param_structure:
                    Number(formValues.id_param_structure) ||
                    formValues.id_param_structure,

                description: formValues.description,
                date_start: formValues.date_start,
                date_end: formValues.date_end,

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

            await refreshProgramsData();

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
            <div className={style["structure-layout"]}>
                <div className={style["structure-main"]}>
                    <p>Chargement des options...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={style["structure-layout"]}>
            <div className={style["structure-main"]}>
                <ProgramPage
                    status={programStatusOptions}
                    activeStatusId={activeStatusId}
                    statusCounts={statusCounts}
                    onStatusChange={handleStatusChange}
                    programs={programs}
                    programProjects={programProjects}
                    projects={projects}
                    programContributors={programContributors}
                    contributors={contributors}
                    tagParamStructures={tagParamStructures}
                    tagParamTypes={tagParamTypes}
                    onViewProgram={handleViewProgram}
                    onCreateProgram={handleCreateProgram}
                    onEditProgram={handleEditProgram}
                />
            </div>
        </div>
    );
};

export default StructurePrograms;