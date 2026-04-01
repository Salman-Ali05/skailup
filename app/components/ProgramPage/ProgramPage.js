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
    onViewProgram,
    onCreateProgram,
}) => {
    const formatDate = (iso) => {
        if (!iso) return "-";
        const [y, m, d] = iso.split("-");
        return `${d}/${m}/${y}`;
    };

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
                                <td className={style.colContributor}>
                                    {program.Param_Name}
                                </td>

                                <td>{formatDate(program.date_start)}</td>

                                <td>{formatDate(program.date_end)}</td>

                                <td>
                                    <div className="row-flex">
                                        <ListUsersInSession users={program.Contributors || []} />
                                    </div>
                                </td>

                                <td className={style.programs}>
                                    <div className={style.projectBadges}>
                                        {(program.Projects || []).slice(0, 2).map((p, idx) => (
                                            <span key={idx} className={style.projectChip}>
                                                {p}
                                            </span>
                                        ))}
                                        {(program.Projects || []).length > 2 && (
                                            <span className={style.projectChip}>
                                                +{program.Projects.length - 2}
                                            </span>
                                        )}
                                    </div>
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