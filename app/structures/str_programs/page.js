"use client";

import React from "react";
import { FiPlusCircle } from "react-icons/fi";
import style from "./str_programs.module.css";
import FilterContributors from "@/app/components/Filters/FilterContributors/FilterContributor";
import ListUsersInSession from "@/app/components/ListUsers/ListUsers";
import EyesIcon from "@/app/components/Icons/Eyes";
import GoToIcon from "@/app/components/Icons/GoTo";
import { useRouter } from "next/navigation";

const StructurePrograms = () => {
    const router = useRouter();

    const handleViewProgram = (programId) => {
        router.push(`/structures/str_activity/${programId}`);
    };

    const samplePrograms = [
        {
            id: 1,
            Param_Name: "Croissance+ Cohorte15",
            description: "Programme d'accompagnement",
            date_start: "2025-06-01",
            date_end: "2025-12-31",
            status: "En cours",
            Program: { name: "Coaching", icon: "/program1.png" },
            Contributors: [
                { firstName: "Julie", lastName: "Lafontaine" },
                { firstName: "Florino", lastName: "Jean" }
            ],
            Projects: ["Bio&Smart", "Capitole"],
        },
        {
            id: 2,
            Param_Name: "Pépinière 2025",
            description: "Pré-incubation",
            date_start: "2025-01-15",
            date_end: "2025-09-30",
            status: "Planifié",
            Program: { name: "Formation", icon: "/program2.png" },
            Contributors: [
                { firstName: "Dipo", lastName: "Bando" }
            ],
            Projects: ["Za'Earth"],
        },
        {
            id: 3,
            Param_Name: "Prévisions+",
            description: "Programme intensif",
            date_start: "2025-03-01",
            date_end: "2025-05-30",
            status: "Terminé",
            Program: { name: "Suivi", icon: "/program3.png" },
            Contributors: [
                { firstName: "Inter", lastName: "Venant" },
                { firstName: "Florino", lastName: "Jean" },
                { firstName: "Julie", lastName: "Lafontaine" },
                { firstName: "Dipo", lastName: "Bando" }
            ],
            Projects: ["Cont'Rib", "Bio&Smart"],
        },
    ];

    const formatDate = (iso) => {
        if (!iso) return "-";
        const [y, m, d] = iso.split("-");
        return `${d}/${m}/${y}`;
    };

    const computeSessions = (program) => {
        const realized = Math.floor(Math.random() * 12);
        const nextSession = program.date_start ? formatDate(program.date_start) : "-";
        const lastSession = program.date_end ? formatDate(program.date_end) : "-";
        const missingActions = Math.floor(Math.random() * 4);

        return { realized, nextSession, lastSession, missingActions };
    };


    return (
        <div className={style["structure-layout"]}>
            <div className={style["structure-main"]}>
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
                                <button className="buttons-primary-reversed">
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
                            {samplePrograms.map((program) => {
                                const { realized, nextSession, lastSession, missingActions } =
                                    computeSessions(program);

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

                                        <td className={style.actions}>
                                            <EyesIcon />
                                            <div className="cursorOn" onClick={() => handleViewProgram(program.id)}><GoToIcon /></div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StructurePrograms;
