"use client";

import React from "react";
import { FiPlusCircle } from "react-icons/fi";
import style from "./str_settings.module.css";
import FilterContributors from "@/app/components/Filters/FilterContributors/FilterContributor";
import PenIcon from "@/app/components/Icons/Pen";
import DeleteIcon from "@/app/components/Icons/Delete";

const StructureSettings = () => {

    const sampleTags = [
        { id: 1, name: "Tag 1", "status": "Actif", logo: "" },
        { id: 2, name: "Tag 2", "status": "Actif", logo: "" },
        { id: 3, name: "Tag 3", "status": "Innactif", logo: "" },
    ];

    const handleToggleStatus = (tagId) => {
        console.log(`Toggle status for tag with ID: ${tagId}`);
    }


    return (
        <div className={style["structure-layout"]}>
            <div className={style["structure-main"]}>
                <div className={style["structure-content"]}>
                    <h2>Liste de vos différents tags</h2>

                    <div className={style.headerRow}>
                        <div className="headerActions">
                            <div className="tabs">
                                <div className="tab tabActive">
                                    <p>
                                        Programmes
                                    </p>
                                </div>
                                <div className="tab">
                                    <p>
                                        Activités
                                    </p>
                                </div>
                                <div className="tab">
                                    <p>
                                        Opérations
                                    </p>
                                </div>
                            </div>

                            <div className={style.tools}>
                                <FilterContributors />
                                <button className="buttons-primary-reversed">
                                    <FiPlusCircle className="buttons-icon" /> Nouveau Tag
                                </button>
                            </div>
                        </div>
                    </div>

                    <table className={style["contributors-table"]}>
                        <thead>
                            <tr>
                                <th className="th-first th-200">Nom</th>
                                <th className="th-100">Statut</th>
                                <th className="th-last th-80">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {sampleTags.map((tag) => {

                                return (
                                    <tr key={tag.id}>
                                        <td className={style.colContributor}>
                                            {tag.name}
                                        </td>

                                        <td>
                                            <span className={style.roleBadge}>{tag.status}</span>
                                        </td>
                                        <td className={style.actions}>
                                            <button
                                                className={`${style.switch} ${tag.status === "Actif" ? style.switchActive : ""}`}
                                                onClick={() => handleToggleStatus(tag.id)}
                                            >
                                                <span className={style.slider} />
                                            </button>

                                            <div className="cursorOn"><PenIcon /></div>
                                            <div className="cursorOn"><DeleteIcon /></div>
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

export default StructureSettings;
