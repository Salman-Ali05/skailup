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
import CloseIcon from "@/app/components/Icons/Close";

const ProjectsPage = () => {

    const [projects, setProjects] = useState([]);
    const [projectDetails, setProjectDetails] = useState([]);
    const [tagProjects, setTagProjects] = useState([]);
    const [openPopupCreate, setOpenPopupCreate] = useState(false);
    const [openPopupEdit, setOpenPopupEdit] = useState(false);
    const [projectForm, setProjectForm] = useState({
        project_name: "",
        project_tag: "",
        note: "",
    });
    const [participantForm, setParticipantForm] = useState({
        email: "",
        last_name: "",
        first_name: "",
    });
    const [participants, setParticipants] = useState([]);
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

    const handleProjectChange = (event) => {
        const { name, value } = event.target;
        setProjectForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleParticipantChange = (event) => {
        const { name, value } = event.target;
        setParticipantForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddParticipant = () => {
        const hasValue = Object.values(participantForm).some(Boolean);
        if (!hasValue) {
            return;
        }

        setParticipants((prev) => [...prev, participantForm]);
        setParticipantForm({
            email: "",
            last_name: "",
            first_name: "",
        });
    };

    const handleRemoveParticipant = (index) => {
        setParticipants((prev) => prev.filter((_, idx) => idx !== index));
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
            <Popup
                open={openPopupCreate}
                title="Créer un projet et inviter ses participants"
                onClose={() => setOpenPopupCreate(false)}
            >
                <form className={stylePopup.form} onSubmit={handleCreateConfirm}>
                    <div className={stylePopup.row}>
                        <div className={stylePopup.field}>
                            <label>
                                Nom du projet / de l’entreprise<span>*</span>
                            </label>
                            <input
                                className="inputs"
                                name="project_name"
                                value={projectForm.project_name}
                                onChange={handleProjectChange}
                                required
                            />
                        </div>
                        <div className={stylePopup.field}>
                            <label>
                                Tag du projet<span>*</span>
                            </label>
                            <select
                                className="inputs"
                                name="project_tag"
                                value={projectForm.project_tag}
                                onChange={handleProjectChange}
                                required
                            >
                                <option value="">Sélectionner un tag</option>
                                {tagProjects.map((tag) => (
                                    <option key={tag.id} value={tag.id}>
                                        {tag.lang_fr}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <p style={{ marginBottom: "12px", fontWeight: 500 }}>
                            Invitez les participants du projet
                            <span style={{ color: "#d11" }}>*</span>
                        </p>

                        <div className={stylePopup.row}>
                            <div className={stylePopup.field}>
                                <label>
                                    Mail<span>*</span>
                                </label>
                                <input
                                    className="inputs"
                                    name="email"
                                    type="email"
                                    value={participantForm.email}
                                    onChange={handleParticipantChange}
                                />
                            </div>

                            <div className={stylePopup.field}>
                                <label>
                                    Nom<span>*</span>
                                </label>
                                <input
                                    className="inputs"
                                    name="last_name"
                                    value={participantForm.last_name}
                                    onChange={handleParticipantChange}
                                />
                            </div>

                            <div className={stylePopup.field}>
                                <label>
                                    Prénom<span>*</span>
                                </label>
                                <input
                                    className="inputs"
                                    name="first_name"
                                    value={participantForm.first_name}
                                    onChange={handleParticipantChange}
                                />
                            </div>

                            <div className={stylePopup.field}>
                                <label style={{ visibility: "hidden" }}>
                                    Ajouter
                                </label>
                                <button
                                    type="button"
                                    className="buttons-primary"
                                    onClick={handleAddParticipant}
                                >
                                    Ajouter
                                </button>
                            </div>
                        </div>

                        <p style={{ color: "#ec7f3d", fontSize: "14px", marginTop: "8px" }}>
                            Remarque : le 1er participant ajouté sera l'administrateur du projet
                        </p>

                        {participants.length > 0 && (
                            <div className={stylePopup.participantList}>
                                {participants.map((participant, index) => (
                                    <div
                                        key={`${participant.email}-${index}`}
                                        className={
                                            index === 0
                                                ? `${stylePopup.participantItem} ${stylePopup.participantItemFirst}`
                                                : stylePopup.participantItem
                                        }
                                    >
                                        <span>
                                            {participant.first_name} {participant.last_name} — {participant.email}
                                        </span>

                                        <div
                                            onClick={() => handleRemoveParticipant(index)}
                                            className={stylePopup.removeParticipant}
                                        >
                                            <CloseIcon />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className={stylePopup.field}>
                        <label>Note interne</label>
                        <textarea
                            className="inputs"
                            name="note"
                            placeholder="Note interne"
                            value={projectForm.note}
                            onChange={handleProjectChange}
                            rows={5}
                            style={{ resize: "none", minHeight: "100px" }}
                        />
                    </div>

                    <button type="submit" className={`${stylePopup.submitBtn} buttons-primary`}>
                        Inviter
                    </button>
                </form>
            </Popup>

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
                                    onClick={() => setOpenPopupCreate(true)}
                                    className="buttons-primary-reversed"
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
                                <th className="th-150">Tag</th>
                                <th className="th-150">Participant(s)</th>
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

                                    <td>{project.tag}</td>

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
                </div>
            </div>
        </div>
    );
};

export default ProjectsPage;