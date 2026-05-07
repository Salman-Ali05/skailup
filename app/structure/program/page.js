"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import style from "./programs.module.css";
import ProgramPage from "@/app/components/ProgramPage/ProgramPage";

const StructurePrograms = () => {
    const router = useRouter();
    const openStatusId = "d20cd09d-ba64-4f84-a78c-ca3b71422d9d";
    const closedStatusId = "ede65ade-1953-43c1-807b-0be999951dd0";

    const handleViewProgram = (programId) => {
        router.push(`/structure/activity/${programId}`);
    };

    {/* Handlers for creating and editing programs, using the same form values structure for simplicity */ }

    const handleCreateProgram = async (formValues) => {
        try {
            const programPayload = {
                id_param_structure: Number(formValues.id_param_structure) || formValues.id_param_structure,
                description: formValues.description,
                date_start: formValues.date_start,
                date_end: formValues.date_end,
                id_status: Number(formValues.id_status) || formValues.id_status,
            };

            const programRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/programs`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(programPayload),
            });

            if (!programRes.ok) {
                const errorBody = await programRes.json().catch(() => ({}));
                throw new Error(errorBody.error || "Failed to create program");
            }

            const createdProgram = await programRes.json();

            setPrograms((prev) => [createdProgram, ...prev]);
        } catch (err) {
            console.error(err);
        }
    };

    const handleEditProgram = async (formValues) => {
        try {
            const programPayload = {
                id_param_structure: Number(formValues.id_param_structure) || formValues.id_param_structure,
                description: formValues.description,
                date_start: formValues.date_start,
                date_end: formValues.date_end,
                id_status: Number(formValues.id_status) || formValues.id_status,
            };

            const programRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/programs/${formValues.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(programPayload),
            });

            if (!programRes.ok) {
                const errorBody = await programRes.json().catch(() => ({}));
                throw new Error(errorBody.error || "Failed to update program");
            }

            const updatedProgram = await programRes.json();

            setPrograms((prev) =>
                prev.map((program) => (program.id === updatedProgram.id ? updatedProgram : program))
            );
        } catch (err) {
            console.error(err);
        }
    };

    const [programs, setPrograms] = useState([]);
    const [programProjects, setProgramProjects] = useState([]);
    const [projects, setProjects] = useState([]);
    const [programContributors, setProgramContributors] = useState([]);
    const [contributors, setContributors] = useState([]);
    const [tagParamStructures, setTagParamStructures] = useState([]);
    const [statusOptions, setStatusOptions] = useState([]);
    const [programsCountByStatusOpened, setProgramsCountByStatusOpened] = useState(0);
    const [programsCountByStatusClosed, setProgramsCountByStatusClosed] = useState(0);

    // Fetch all necessary data on component mount
    useEffect(() => {
        const controller = new AbortController();

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/programs`, {
            signal: controller.signal,
        })
            .then((res) => res.json())
            .then((data) => {
                setPrograms(data.programs);
                setProgramProjects(data.programProjects);
                setProgramContributors(data.programContributors);
                setStatusOptions(data.statusOptions);
                setTagParamStructures(data.tagParamStructures);
                setContributors(data.contributors);
            })
            .catch((err) => {
                if (err?.name !== "AbortError") {
                    console.error(err);
                }
            });



        fetch(

            `${process.env.NEXT_PUBLIC_API_URL}/programs/count/by-status?statusIds=${encodeURIComponent(openStatusId)}`,
            {
                signal: controller.signal,
            }
        )
            .then((res) => res.json())
            .then((data) => {
                setProgramsCountByStatusOpened(data.count ?? 0);
            })
            .catch((err) => {
                if (err?.name !== "AbortError") {
                    console.error(err);
                }
            });

        fetch(

            `${process.env.NEXT_PUBLIC_API_URL}/programs/count/by-status?statusIds=${encodeURIComponent(closedStatusId)}`,
            {
                signal: controller.signal,
            }
        )
            .then((res) => res.json())
            .then((data) => {
                setProgramsCountByStatusClosed(data.count ?? 0);
            })
            .catch((err) => {
                if (err?.name !== "AbortError") {
                    console.error(err);
                }
            });

        return () => controller.abort();


    }, []);

    return (
        <div className={style["structure-layout"]}>
            <div className={style["structure-main"]}>
                <ProgramPage
                    programs={programs}
                    programProjects={programProjects}
                    projects={projects}
                    programContributors={programContributors}
                    contributors={contributors}
                    tagParamStructures={tagParamStructures}
                    statusOptions={statusOptions}
                    programsCountByStatusOpened={programsCountByStatusOpened}
                    programsCountByStatusClosed={programsCountByStatusClosed}
                    onViewProgram={handleViewProgram}
                    onCreateProgram={handleCreateProgram}
                    onEditProgram={handleEditProgram}
                />
            </div>
        </div>
    );
};

export default StructurePrograms;