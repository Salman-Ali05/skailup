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
import { showToast } from "nextjs-toast-notify";
import { useUser } from "@/app/utils/contexts/userContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ProjectsPage = () => {
    const { session } = useUser();
    const token = session?.access_token;

    const [projects, setProjects] = useState([]);
    const [projectDetails, setProjectDetails] = useState([]);
    const [openPopupCreate, setOpenPopupCreate] = useState(false);
    const [projectTags, setProjectTags] = useState([]);
    const [participants, setParticipants] = useState([]);

    const [projectForm, setProjectForm] = useState({
        project_name: "",
        project_status: "",
        project_tag: "",
        note: "",
    });

    const [participantForm, setParticipantForm] = useState({
        email: "",
        last_name: "",
        first_name: "",
    });

    const fetchProjects = async () => {
        try {
            const res = await fetch(`${API_URL}/projects`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.error || "Erreur lors du chargement des projets");
            }

            const list = Array.isArray(data) ? data : data?.projects || [];
            const detailsFromProjects = list
                .map((project) => project?.project_detail)
                .filter(Boolean);

            setProjects(list);
            setProjectDetails(data?.projectDetails || detailsFromProjects);
        } catch (err) {
            console.error(err);
            showToast.error("Impossible de charger la liste des projets");
        }
    };

    const fetchProjectTags = async () => {
        try {
            const res = await fetch(`${API_URL}/os_tags/tag_projects`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.error || "Erreur lors du chargement des tags projets");
            }

            setProjectTags(data?.os_tag_project ?? data?.tags ?? data ?? []);
        } catch (err) {
            console.error(err);
            showToast.error("Impossible de charger les tags projets");
        }
    };

    useEffect(() => {
        fetchProjectTags();

        if (token) {
            fetchProjects();
        }
    }, [token]);

    const handleProjectChange = (e) => {
        const { name, value } = e.target;
        setProjectForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleParticipantChange = (e) => {
        const { name, value } = e.target;
        setParticipantForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddParticipant = () => {
        if (
            !participantForm.email ||
            !participantForm.last_name ||
            !participantForm.first_name
        ) {
            showToast.error("Veuillez remplir les informations du participant");
            return;
        }

        setParticipants((prev) => [...prev, participantForm]);

        setParticipantForm({
            email: "",
            last_name: "",
            first_name: "",
        });
    };

    const handleRemoveParticipant = (indexToRemove) => {
        setParticipants((prev) =>
            prev.filter((_, index) => index !== indexToRemove)
        );
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();

        if (!token) {
            showToast.error("Session expirée. Veuillez vous reconnecter.");
            return;
        }

        if (!projectForm.project_name || !projectForm.project_tag) {
            showToast.error("Veuillez renseigner le nom et le tag du projet");
            return;
        }

        const primaryEmail = participants[0]?.email || "";

        if (!primaryEmail) {
            showToast.error("Veuillez ajouter au moins un participant");
            return;
        }

        const payload = {
            name: projectForm.project_name,
            id_tag_project: projectForm.project_tag,
            email: primaryEmail,
            note: projectForm.note,
            participants,
        };

        try {
            const res = await fetch(`${API_URL}/users/project`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.error || "Erreur lors de la création du projet");
            }

            showToast.success("Projet créé avec succès");

            await fetchProjects();

            setOpenPopupCreate(false);

            setProjectForm({
                project_name: "",
                project_status: "",
                project_tag: "",
                note: "",
            });

            setParticipants([]);

            setParticipantForm({
                email: "",
                last_name: "",
                first_name: "",
            });
        } catch (err) {
            console.error(err);
            showToast.error(`Erreur : ${err.message}`);
        }
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

    const handleViewProject = (projectId) => {
        console.log("VIEW PROJECT =", projectId);
    };

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
                <form className={stylePopup.form} onSubmit={handleCreateProject}>
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
                                {projectTags.map((tag) => (
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
                                        Inscrit <span>({projects.length})</span>
                                    </p>
                                </div>
                                <div className="tab">
                                    <p>
                                        Invitation <span>(0)</span>
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
                                        {project.tag_project ? (
                                            <span className={style.roleBadge}>
                                                {project.tag_project.lang_fr}
                                            </span>
                                        ) : (
                                            "-"
                                        )}
                                    </td>

                                    <td>{project.name}</td>

                                    <td>
                                        {(() => {
                                            const participants = (project.project_users || [])
                                                .map((link) =>
                                                    `${link.user_details?.first_name || ""} ${link.user_details?.last_name || ""}`.trim()
                                                )
                                                .filter(Boolean);

                                            if (participants.length === 0) {
                                                return "-";
                                            }

                                            if (participants.length > 2) {
                                                return `${participants[0]} +${participants.length - 1}`;
                                            }

                                            return participants.join(", ");
                                        })()}
                                    </td>

                                    <td>
                                        {project.email || "-"}
                                    </td>

                                    <td>
                                        {(project.project_programs || [])
                                            .map((link) => link.program?.description)
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
                                                onClick={() => handleViewProject(project.id)}
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