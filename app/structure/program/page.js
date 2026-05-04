"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import style from "./programs.module.css";
import ProgramPage from "@/app/components/ProgramPage/ProgramPage";

const StructurePrograms = () => {
    const router = useRouter();

    const handleViewProgram = (programId) => {
        router.push(`/structure/activity/${programId}`);
    };

    const [programs, setPrograms] = useState([]);
    const [programProjects, setProgramProjects] = useState([]);
    const [projects, setProjects] = useState([]);
    const [programContributors, setProgramContributors] = useState([]);
    const [contributors, setContributors] = useState([]);
    const [tagParamStructures, setTagParamStructures] = useState([]);

    // Fetch programs
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/programs`)
            .then((res) => res.json())
            .then((data) => setPrograms(Array.isArray(data) ? data : []))
            .catch((err) => console.error(err));
    }, []);

    // Fetch program-project relationships for mapping in the UI
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/program_projects`)
            .then((res) => res.json())
            .then((data) => setProgramProjects(Array.isArray(data) ? data : []))
            .catch((err) => console.error(err));
    }, []);

    // Fetch projects for mapping program-project relationships
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`)
            .then((res) => res.json())
            .then((data) => setProjects(Array.isArray(data) ? data : []))
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/program_contributors`)
            .then((res) => res.json())
            .then((data) => setProgramContributors(Array.isArray(data) ? data : []))
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/contributors`)
            .then((res) => res.json())
            .then((data) => setContributors(Array.isArray(data) ? data : []))
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/tag_param_structure`)
            .then((res) => res.json())
            .then((data) => setTagParamStructures(Array.isArray(data) ? data : []))
            .catch((err) => console.error(err));
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
                    onViewProgram={handleViewProgram}
                    onCreateProgram={() => { }}
                />
            </div>
        </div>
    );
};

export default StructurePrograms;