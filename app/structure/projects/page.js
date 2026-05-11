"use client";

import React, { useEffect, useState } from "react";
import { FiPlusCircle } from "react-icons/fi";
import style from "./projects.module.css";
import FilterProjects from "@/app/components/Filters/FilterProjects/FilterProjects";
import EyesIcon from "@/app/components/Icons/Eyes";
import ListUsersInSession from "@/app/components/ListUsers/ListUsers";
import GoToIcon from "@/app/components/Icons/GoTo";

const ProjectsPage = () => {

    const [projects, setProjects] = useState([]);
    const [projectDetails, setProjectDetails] = useState([]);
    const [tagProjects, setTagProjects] = useState([]);

    // Fetch all necessary data on component mount
    useEffect(() => {
        const controller = new AbortController();

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
            signal: controller.signal,
        })
            .then((res) => res.json())
            .then((data) => {
                const list = Array.isArray(data) ? data : data?.projects || [];
                const detailsFromProjects = list
                    .map((project) => project?.project_detail)
                    .filter(Boolean);
                setProjects(list);
                setProjectDetails(data?.projectDetails || detailsFromProjects);
                setTagProjects(data?.tagProjects || []);
            })
            .catch((err) => {
                if (err?.name !== "AbortError") {
                    console.error(err);
                }
            });
    }, []);

    const projectDetailById = React.useMemo(() => {
        const map = new Map();
        projectDetails.forEach((detail) => {
            if (detail && detail.id) {
                map.set(detail.id, detail);
            }
        });
        return map;
    }, [projectDetails]);

    return (
        <div className={style["structure-layout"]}>
            <div className={style["structure-main"]}>
                <div className={style["structure-content"]}>
                    <h2>Projets</h2>

                    <div className={style.headerRow}>
                        <div className="headerActions">
                            <div className="tabs">
                                <div className="tab tabActive">
                                    <p>
                                        Inscrit <span>(7)</span>
                                    </p>
                                </div>
                                <div className="tab">
                                    <p>
                                        Invitation <span>(1)</span>
                                    </p>
                                </div>
                            </div>

                            <div className={style.tools}>
                                <FilterProjects />
                                <button className="buttons-primary-reversed">
                                    <FiPlusCircle className="buttons-icon" /> Nouveau projet
                                </button>
                            </div>
                        </div>
                    </div>

                    <table className={style["projects-table"]}>
                        <thead>
                            <tr>
                                <th className="th-first th-100">Rôle</th>
                                <th className="th-150">Projet</th>
                                <th className=" th-150">Participant(s)</th>
                                <th className="th-150">Email(s)</th>
                                <th className="th-150">Programmes</th>
                                <th className="th-last th-100">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {projects.map((project) => (
                                <tr key={project.id}>
                                    <td>
                                        <span className={style.roleBadge}>
                                            {project.role}
                                        </span>
                                    </td>

                                    <td>{project.name}</td>

                                    <td className={style.colProject}>
                                        <ListUsersInSession users={project.members || []} />
                                    </td>

                                    <td className={style.emailCell}>
                                        {(() => {
                                            { project.email }
                                            return project.email
                                        })()}
                                    </td>

                                    <td>
                                        {(project.project_programs || [])
                                            .map((link) => link.program?.description || link.program?.description)
                                            .filter(Boolean)
                                            .join(", ") || "-"}
                                    </td>

                                    <td>
                                        <div className={style.actions}>
                                            <div>
                                                <EyesIcon />
                                            </div>
                                            <div
                                                className="cursorOn"
                                                role="button"
                                                aria-label="Modifier le programme"
                                                onClick={() => openEdit(program)}
                                            >
                                                <svg
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25Z"
                                                        fill="currentColor"
                                                    />
                                                    <path
                                                        d="M20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z"
                                                        fill="currentColor"
                                                    />
                                                </svg>
                                            </div>
                                            <div
                                                className="cursorOn"
                                                onClick={() => onViewProgram(program.id)}
                                            >
                                                <GoToIcon />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            </div>
        </div>
    );
};

export default ProjectsPage;