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
    const { loading, isAuthenticated, authFetch } = useUser();

    const openStatusId = "d20cd09d-ba64-4f84-a78c-ca3b71422d9d";
    const closedStatusId = "ede65ade-1953-43c1-807b-0be999951dd0";

    const [programs, setPrograms] = useState([]);
    const [programProjects, setProgramProjects] = useState([]);
    const [projects, setProjects] = useState([]);
    const [programContributors, setProgramContributors] = useState([]);
    const [contributors, setContributors] = useState([]);
    const [tagParamStructures, setTagParamStructures] = useState([]);
    const [statusOptions, setStatusOptions] = useState([]);
    const [status, setStatus] = useState([]);

    const handleViewProgram = (program) => {
        sessionStorage.setItem("selectedProgram", JSON.stringify(program));
        router.push(`/structure/activity/${program.id}`);
    };

    const fetchStatus = async () => {
        try {
            const res = await authFetch(`${API_URL}/os_tags/os_status`, {
                method: "GET",
            });

            const data = await res.json();

            const statusData = Array.isArray(data)
                ? data
                : Array.isArray(data.code)
                    ? data.code
                    : [];

            const allowedStatus = statusData.filter((item) => {
                return ["Open", "Closed"].includes(item.code);
            });

            setStatus(allowedStatus);
        } catch (err) {
            console.error(err);
            showToast.error("Impossible de charger la liste des statuts");
        }
    };

    const fetchPrograms = async () => {
        try {
            const res = await authFetch(`${API_URL}/programs`, {
                method: "GET",
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(data?.error || "Erreur lors du chargement des programmes");
            }

            setPrograms(data?.programs ?? []);
            setProgramProjects(data?.programProjects ?? []);
            setProjects(data?.projects ?? []);
            setProgramContributors(data?.programContributors ?? []);
            setStatusOptions(data?.statusOptions ?? []);
            setTagParamStructures(data?.tagParamStructures ?? []);
            setContributors(data?.contributors ?? []);
        } catch (err) {
            console.error(err);
            showToast.error("Impossible de charger la liste des programmes");
        }
    };

    const refreshProgramsData = async () => {
        await fetchPrograms();
    };

    useEffect(() => {
        if (loading) return;
        if (!isAuthenticated) return;
        fetchStatus();
        refreshProgramsData();
    }, [loading, isAuthenticated]);

    const handleCreateProgram = async (formValues) => {
        if (loading || !isAuthenticated) {
            showToast.error("Session expirée. Veuillez vous reconnecter.");
            return;
        }

        try {
            const programPayload = {
                id_param_structure: Number(formValues.id_param_structure) || formValues.id_param_structure,
                description: formValues.description,
                date_start: formValues.date_start,
                date_end: formValues.date_end,
                id_status: Number(formValues.id_status) || formValues.id_status,
            };

            const res = await authFetch(`${API_URL}/programs`, {
                method: "POST",
                body: JSON.stringify(programPayload),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(data?.error || "Erreur lors de la création du programme");
            }

            showToast.success("Programme créé avec succès");

            await refreshProgramsData();
        } catch (err) {
            console.error(err);
            showToast.error(`Erreur : ${err.message}`);
        }
    };

    const handleEditProgram = async (formValues) => {
        if (loading || !isAuthenticated) {
            showToast.error("Session expirée. Veuillez vous reconnecter.");
            return;
        }

        try {
            const programPayload = {
                id_param_structure:
                    Number(formValues.id_param_structure) || formValues.id_param_structure,
                description: formValues.description,
                date_start: formValues.date_start,
                date_end: formValues.date_end,
                id_status: Number(formValues.id_status) || formValues.id_status,
            };

            const res = await authFetch(`${API_URL}/programs/${formValues.id}`, {
                method: "PUT",
                body: JSON.stringify(programPayload),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(data?.error || "Erreur lors de la modification du programme");
            }

            showToast.success("Programme modifié avec succès");

            await refreshProgramsData();
        } catch (err) {
            console.error(err);
            showToast.error(`Erreur : ${err.message}`);
        }
    };

    return (
        <div className={style["structure-layout"]}>
            <div className={style["structure-main"]}>
                <ProgramPage
                    status={status}
                    statusOptions={statusOptions}
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