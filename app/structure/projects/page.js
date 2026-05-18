"use client";

import React, { useEffect, useState } from "react";
import { FiPlusCircle } from "react-icons/fi";
import style from "./projects.module.css";
import stylePopup from "@/app/components/Popup/PopupContent.module.css";
import FilterProjects from "@/app/components/Filters/FilterProjects/FilterProjects";
import EyesIcon from "@/app/components/Icons/Eyes";
import ListUsersInSession from "@/app/components/ListUsers/ListUsers";
import GoToIcon from "@/app/components/Icons/GoTo";
import Popup from "@/app/components/Popup/Popup";

const ProjectsPage = () => {

    const [projects, setProjects] = useState([]);
    const [projectDetails, setProjectDetails] = useState([]);
    const [tagProjects, setTagProjects] = useState([]);
    const [openPopupCreate, setOpenPopupCreate] = useState(false);
    const [openPopupEdit, setOpenPopupEdit] = useState(false);
    const [formValues, setFormValues] = React.useState({
        id: "",
        id_param_structure: "",
        description: "",
        date_start: "",
        date_end: "",
        id_status: "",
    });

    const openCreate = () => setOpenPopupCreate(true);
    const closeCreate = () => setOpenPopupCreate(false);
    const closeEdit = () => setOpenPopupEdit(false);

    const handleCreateConfirm = (event) => {
        event.preventDefault();
        closeCreate();
    };

    const openEdit = (project) => {
        setFormValues({
            id: project?.id || "",
            id_param_structure: project?.id_param_structure || "",
            description: project?.description || "",
            date_start: project?.date_start || "",
            date_end: project?.date_end || "",
            id_status: project?.id_status || "",
        });
        setOpenPopupEdit(true);
    };

    const handleFormChange = (key) => (event) => {
        setFormValues((prev) => ({
            ...prev,
            [key]: event.target.value,
        }));
    };

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
                                <button
                                    className="buttons-primary-reversed"
                                    onClick={openCreate}
                                >
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
                                        {(project.project_users || [])
                                            .map((link) => (
                                                `${link.user_details?.first_name || ""} ${link.user_details?.last_name || ""}`
                                                    .trim()
                                            ))
                                            .filter(Boolean)
                                            .join(", ") || "-"}
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
                                                aria-label="Modifier le projet"
                                                onClick={() => openEdit(project)}
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

                    {/* Popup de création de projet */}
                    <Popup open={openPopupCreate} onClose={closeCreate} title="Créer un projet et inviter ses participants">
                        <form className={stylePopup.form} onSubmit={handleCreateConfirm}>
                            <div className={stylePopup.row}>
                                <div className={stylePopup.field}>
                                    <label>
                                        Nom du projet / de l’entreprise<span>*</span>
                                    </label>
                                    <input
                                        className="inputs"
                                        type="text"
                                        required
                                        value={formValues.name}
                                        onChange={handleFormChange("description")}
                                    />
                                </div>
                            </div>

                            <div className={stylePopup.row}>
                                <div className={stylePopup.field}>
                                    <label>
                                        Mail<span>*</span>
                                    </label>
                                    <input
                                        className="inputs"
                                        type="text"
                                        required
                                        value={formValues.name}
                                        onChange={handleFormChange("email")}
                                    />
                                </div>
                                <div className={stylePopup.field}>
                                    <label>
                                        Nom<span>*</span>
                                    </label>
                                    <input
                                        className="inputs"
                                        type="text"
                                        required
                                        value={formValues.name}
                                        onChange={handleFormChange("nom")}
                                    />
                                </div>
                                <div className={stylePopup.field}>
                                    <label>
                                        Prénom<span>*</span>
                                    </label>
                                    <input
                                        className="inputs"
                                        type="text"
                                        required
                                        value={formValues.name}
                                        onChange={handleFormChange("prenom")}
                                    />
                                </div>
                                <button type="submit" className={`${stylePopup.submitBtn} buttons-primary`}>
                                    Ajouter
                                </button>
                            </div>

                            <div className={stylePopup.row}>
                                <div className={stylePopup.field}>
                                    <label>
                                        Note interne
                                    </label>
                                    <input
                                        className="inputs"
                                        type="text"
                                        placeholder="Note interne"
                                        required
                                        value={formValues.name}
                                        onChange={handleFormChange("note")}
                                    />
                                </div>
                            </div>

                            <button type="submit" className={`${stylePopup.submitBtn} buttons-primary`}>
                                Continuer
                            </button>
                        </form>
                    </Popup>

                    {/* Popup de modification de projet */}
                    <Popup open={openPopupEdit} onClose={closeEdit} title="Modifier le projet">
                        <form className={stylePopup.form} onSubmit={handleCreateConfirm}>
                            <div className={stylePopup.row}>
                                <div className={stylePopup.field}>
                                    <label>
                                        Nom du projet / de l’entreprise<span>*</span>
                                    </label>
                                    <input
                                        className="inputs"
                                        type="text"
                                        required
                                        value={formValues.name}
                                        onChange={handleFormChange("description")}
                                    />
                                </div>
                            </div>

                            <div className={stylePopup.row}>
                                <div className={stylePopup.field}>
                                    <label>
                                        Mail<span>*</span>
                                    </label>
                                    <input
                                        className="inputs"
                                        type="text"
                                        required
                                        value={formValues.name}
                                        onChange={handleFormChange("email")}
                                    />
                                </div>
                                <div className={stylePopup.field}>
                                    <label>
                                        Nom<span>*</span>
                                    </label>
                                    <input
                                        className="inputs"
                                        type="text"
                                        required
                                        value={formValues.name}
                                        onChange={handleFormChange("nom")}
                                    />
                                </div>
                                <div className={stylePopup.field}>
                                    <label>
                                        Prénom<span>*</span>
                                    </label>
                                    <input
                                        className="inputs"
                                        type="text"
                                        required
                                        value={formValues.name}
                                        onChange={handleFormChange("prenom")}
                                    />
                                </div>
                                <button type="submit" className={`${stylePopup.submitBtn} buttons-primary`}>
                                    Ajouter
                                </button>
                            </div>

                            <div className={stylePopup.row}>
                                <div className={stylePopup.field}>
                                    <label>
                                        Note interne
                                    </label>
                                    <input
                                        className="inputs"
                                        type="text"
                                        placeholder="Note interne"
                                        required
                                        value={formValues.name}
                                        onChange={handleFormChange("note")}
                                    />
                                </div>
                            </div>

                            <button type="submit" className={`${stylePopup.submitBtn} buttons-primary`}>
                                Continuer
                            </button>
                        </form>
                    </Popup>
                </div>
            </div>
        </div>
    );
};

export default ProjectsPage;