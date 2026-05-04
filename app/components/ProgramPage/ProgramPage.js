"use client";

import React from "react";
import { FiPlusCircle } from "react-icons/fi";
import style from "./ProgramPage.module.css";
import FilterContributors from "@/app/components/Filters/FilterContributors/FilterContributor";
import ListUsersInSession from "@/app/components/ListUsers/ListUsers";
import EyesIcon from "@/app/components/Icons/Eyes";
import GoToIcon from "@/app/components/Icons/GoTo";

const ProgramPage = ({
    programs = [],
    programProjects = [],
    projects = [],
    programContributors = [],
    contributors = [],
    tagParamStructures = [],
    onViewProgram,
    onCreateProgram = () => {},
}) => {
    const formatDate = (iso) => {
        if (!iso) return "-";
        const [y, m, d] = iso.split("-");
        return `${d}/${m}/${y}`;
    };
    
    const projectNameById = React.useMemo(() => {
        const map = new Map();
        projects.forEach((project) => {
            if (project && project.id) {
                map.set(project.id, project.name || "-");
            }
        });
        return map;
    }, [projects]);

    const programProjectNames = React.useMemo(() => {
        return programProjects.reduce((acc, link) => {
            if (!link || !link.id_program || !link.id_project) return acc;
            const name = projectNameById.get(link.id_project);
            if (!name) return acc;
            if (!acc[link.id_program]) acc[link.id_program] = [];
            acc[link.id_program].push(name);
            return acc;
        }, {});
    }, [programProjects, projectNameById]);

    const tagParamValueById = React.useMemo(() => {
        const map = new Map();
        tagParamStructures.forEach((tag) => {
            if (!tag || !tag.id) return;
            const value = tag.label || tag.name || tag.description || tag.tag || tag.value;
            map.set(tag.id, value || "-");
        });
        return map;
    }, [tagParamStructures]);

    const contributorNameById = React.useMemo(() => {
        const map = new Map();
        contributors.forEach((contributor) => {
            if (contributor && contributor.id) {
                map.set(contributor.id, contributor.name || "-");
            }
        });
        return map;
    }, [contributors]);

    const programContributorNames = React.useMemo(() => {
        return programContributors.reduce((acc, link) => {
            if (!link || !link.id_program || !link.id_contributor) return acc;
            const name = contributorNameById.get(link.id_contributor);
            if (!name) return acc;
            if (!acc[link.id_program]) acc[link.id_program] = [];
            acc[link.id_program].push(name);
            return acc;
        }, {});
    }, [programContributors, contributorNameById]);

    return (
        <div className={style["structure-content"]}>
            <h2>Programmes</h2>

            <div className={style.headerRow}>
                <div className="headerActions">
                    <div className="tabs">
                        <div className="tab tabActive">
                            <p>
                                Ouvert <span>(7)</span>
                            </p>
                        </div>
                        <div className="tab">
                            <p>
                                En cours <span>(1)</span>
                            </p>
                        </div>
                    </div>

                    <div className={style.tools}>
                        <FilterContributors />
                        <button
                            className="buttons-primary-reversed"
                            onClick={onCreateProgram}
                        >
                            <FiPlusCircle className="buttons-icon" /> Nouveau programme
                        </button>
                    </div>
                </div>
            </div>

            <table className={style["contributors-table"]}>
                <thead>
                    <tr>
                        <th className="th-first th-200">Programme</th>
                        <th className="th-120">Début</th>
                        <th className="th-120">Fin</th>
                        <th className="th-150">Intervenants</th>
                        <th className="th-150">Projets</th>
                        <th className="th-100">Statut</th>
                        <th className="th-last th-80">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {programs.map((program) => {
                        return (
                            <tr key={program.id}>
                                <td>
                                    {program.id_param_structure ? (
                                        <span>
                                            {" "}{tagParamValueById.get(program.id_param_structure)}
                                        </span>
                                    ) : null} <br></br>
                                    {program.description}
                                </td>
                                
                                <td>{formatDate(program.date_start)}</td>

                                <td>{formatDate(program.date_end)}</td>

                                <td>
                                    {(programContributorNames[program.id] || ["-"]).join(", ")}
                                </td>

                                <td>
                                    {(programProjectNames[program.id] || ["-"]).join(", ")}
                                </td>

                                <td>
                                    <span className={style.roleBadge}>{program.status}</span>
                                </td>

                                <td>
                                    <div className={style.actions}>
                                        <div>
                                            <EyesIcon />
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
                        );
                    })}
                </tbody>
            </table>
            
        </div>
    );
};

export default ProgramPage;