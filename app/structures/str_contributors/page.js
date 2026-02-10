"use client";

import React from "react";
import Image from "next/image";
import { FiEye, FiPlusCircle } from "react-icons/fi";
import style from "./str_contributors.module.css";
import FilterContributors from "@/app/components/Filters/FilterContributors/FilterContributor";

const sampleContributors = [
    {
        id: 1,
        name: "Florino JEAN",
        company: "SOS Business",
        email: "demo.intervenant@skailup.com",
        role: "Multi-rôle",
        lastConnection: "30/10/2025",
        programs: "7 programmes",
        avatar: "/avatar1.jpg",
    },
    {
        id: 2,
        name: "Dipo BANDO",
        company: "Za'Earth",
        email: "test.i2@skailup.com",
        role: "Coach",
        lastConnection: "01/09/2025",
        programs: "Prévisions+",
        avatar: "/avatar2.jpg",
    },
    {
        id: 3,
        name: "Inter VENANT",
        company: "Cont'Rib",
        email: "test.i1@skailup.com",
        role: "Coach",
        lastConnection: "13/06/2025",
        programs: "3 programmes",
        avatar: "/avatar3.jpg",
    },
];

const StructureContributors = () => {
    return (
        <div className={style["structure-layout"]}>
            <div className={style["structure-main"]}>
                <div className={style["structure-content"]}>
                    <h2>Intervenants</h2>
                    <div className={style.headerRow}>

                        <div className={style.headerActions}>
                            <div className={style.tabs}>
                                <button className={style.tabActive}>Inscrit <span>(7)</span></button>
                                <button className={style.tab}>Invitation <span>(1)</span></button>
                            </div>

                            <div className={style.tools}>
                                <FilterContributors />
                                <button className="buttons-primary-reversed"><FiPlusCircle /> Nouvel intervenant</button>
                            </div>
                        </div>
                    </div>

                    <table className={style["contributors-table"]}>
                        <thead>
                            <tr>
                                <th className="th-first">Intervenant</th>
                                <th>Société</th>
                                <th>Email</th>
                                <th>Rôle</th>
                                <th>Dernière connexion</th>
                                <th>Programmes</th>
                                <th className="th-last">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sampleContributors.map((c) => (
                                <tr key={c.id}>
                                    <td className={style.colContributor}>
                                        <div className={style.avatarWrap}>
                                            <Image src={c.avatar} alt={c.name} width={40} height={40} className={style.avatar} />
                                            <div className={style.nameWrap}>
                                                <div className={style.name}>{c.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{c.company}</td>
                                    <td className={style.emailCell}>{c.email}</td>
                                    <td>
                                        <span className={style.roleBadge}>{c.role}</span>
                                    </td>
                                    <td>{c.lastConnection}</td>
                                    <td className={style.programs}>{c.programs}</td>
                                    <td className={style.actions}>
                                        <button className={style.iconBtn} aria-label="Voir">
                                            <FiEye />
                                        </button>
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

export default StructureContributors;
