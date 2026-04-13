"use client";

import React from "react";
import style from "./ResourcePage.module.css";
import FilterContributors from "@/app/components/Filters/FilterContributors/FilterContributor";
import ListUsersInSession from "@/app/components/ListUsers/ListUsers";
import EyesIcon from "@/app/components/Icons/Eyes";
import GoToIcon from "@/app/components/Icons/GoTo";
import { FiFileText, FiLink } from "react-icons/fi";

const ResourcePage = ({
    resources = [],
    onViewResource,
    onCreateResource,
}) => {
    const formatDate = (iso) => {
        if (!iso) return "-";
        const [y, m, d] = iso.split("-");
        return `${d}/${m}/${y}`;
    };

    const getResourceType = (resource) => {
        const rawType = (resource.resource_type || "document").toLowerCase();

        if (rawType === "lien" || rawType === "link") {
            return { label: "Lien", kind: "link" };
        }

        return { label: "Document", kind: "file" };
    };

    return (
        <div className={style["structure-content"]}>
            <h2>Ressources</h2>

            <div className={style.headerRow}>
                <div className="headerActions">
                    <div className="tabs">
                        <div className="tab tabActive">
                            <p>
                                Supports <span>(8)</span>
                            </p>
                        </div>
                        <div className="tab">
                            <p>
                                Comptes rendus <span>(6)</span>
                            </p>
                        </div>
                        <div className="tab">
                            <p>
                                Suivi d'activités <span>(1)</span>
                            </p>
                        </div>
                    </div>

                    <div className={style.tools}>
                        <FilterContributors />
                    </div>
                </div>
            </div>

            <table className={style["contributors-table"]}>
                <thead>
                    <tr>
                        <th className="th-first th-200">programme <br />Cohortes</th>
                        <th className="th-120">Activités</th>
                        <th className="th-120">Intervenants</th>
                        <th className="th-150">Projets</th>
                        <th className="th-150">Ressources</th>
                        <th className="th-100">Ajouté le</th>
                        <th className="th-last th-80">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {resources.map((resource) => {
                        const resourceType = getResourceType(resource);

                        return (
                            <tr key={resource.id}>
                                <td className={style.colContributor}>
                                    {resource.Param_Name}
                                </td>

                                <td>{resource.activite}</td>

                                <td>
                                    <div className="row-flex">
                                        <ListUsersInSession users={resource.Contributors || []} />
                                    </div>
                                </td>

                                <td className={style.resources}>
                                    <div className={style.projectBadges}>
                                        {(resource.Projects || []).slice(0, 2).map((p, idx) => (
                                            <span key={idx} className={style.projectChip}>
                                                {p}
                                            </span>
                                        ))}
                                        {(resource.Projects || []).length > 2 && (
                                            <span className={style.projectChip}>
                                                +{resource.Projects.length - 2}
                                            </span>
                                        )}
                                    </div>
                                </td>

                                <td>
                                    <span
                                        className={`${style.resourceTypeChip} ${
                                            resourceType.kind === "link"
                                                ? style.resourceTypeLink
                                                : style.resourceTypeFile
                                        }`}
                                    >
                                        {resourceType.kind === "link" ? <FiLink /> : <FiFileText />}
                                        {resourceType.label}
                                    </span>
                                </td>

                                <td>
                                    {formatDate(resource.date_ajout)}
                                </td>

                                <td>
                                    <div className={style.actions}>
                                        <div>
                                            <EyesIcon />
                                        </div>
                                        <div
                                            className="cursorOn"
                                            onClick={() => onViewResource(resource.id)}
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

export default ResourcePage;