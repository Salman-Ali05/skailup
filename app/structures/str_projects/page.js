"use client";

import React from "react";
import { FiPlusCircle } from "react-icons/fi";
import style from "./str_projects.module.css";
import FilterProjects from "@/app/components/Filters/FilterProjects/FilterProjects";
import EyesIcon from "@/app/components/Icons/Eyes";
import ListUsersInSession from "@/app/components/ListUsers/ListUsers";

const sampleProjects = [
    {
        id: 1,
        name: "SOS Business",
        company: "SOS Business",
        role: "Multi-rôle",
        members: [
            { firstName: "Florino", lastName: "JEAN", email: "demo.intervenant@skailup.com", avatar: "/avatar1.jpg" }
        ],
        activity: "7 programmes",
    },
    {
        id: 2,
        name: "Za'Earth",
        company: "Za'Earth",
        role: "Coach",
        members: [
            { firstName: "Dipo", lastName: "BANDO", email: "test.i2@skailup.com", avatar: "/avatar2.jpg" },
            { firstName: "Julie", lastName: "Lafontaine", email: "julie.laf@skailup.com", avatar: "/avatar4.jpg" }
        ],
        activity: "Prévisions+",
    },
    {
        id: 3,
        name: "Cont'Rib",
        company: "Cont'Rib",
        role: "Coach",
        members: [
            { firstName: "Inter", lastName: "VENANT", email: "test.i1@skailup.com", avatar: "/avatar3.jpg" },
            { firstName: "Florino", lastName: "JEAN", email: "demo.intervenant@skailup.com", avatar: "/avatar1.jpg" },
            { firstName: "Julie", lastName: "Lafontaine", email: "julie.laf@skailup.com", avatar: "/avatar4.jpg" }
        ],
        activity: "3 programmes",
    },
];

const StructureProjects = () => {
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
                            {sampleProjects.map((project) => (
                                <tr key={project.id}>
                                    <td>
                                        <span className={style.roleBadge}>
                                            {project.role}
                                        </span>
                                    </td>

                                    <td>{project.company}</td>

                                    <td className={style.colProject}>
                                        <ListUsersInSession users={project.members} />
                                    </td>

                                    <td className={style.emailCell}>
                                        {project.members.map((member) => member.email).join(", ")}
                                    </td>

                                    <td className={style.activity}>
                                        {project.activity}
                                    </td>

                                    <td className={style.actions}>
                                        <EyesIcon />
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

export default StructureProjects;
