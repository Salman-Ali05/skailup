"use client";

import React, { useState } from "react";
import { FiPlusCircle } from "react-icons/fi";
import style from "./projects.module.css";
import FilterProjects from "@/app/components/Filters/FilterProjects/FilterProjects";
import EyesIcon from "@/app/components/Icons/Eyes";
import ListUsersInSession from "@/app/components/ListUsers/ListUsers";
import Popup from "@/app/components/Popup/Popup";
import stylePopup from "@/app/components/Popup/PopupContent.module.css";

const StructureProjects = () => {

    const [openPopup, setOpenPopup] = useState(false);

    const [projectForm, setProjectForm] = useState({
        project_name: "",
        project_status: "",
        note: "",
    });

    const [participantForm, setParticipantForm] = useState({
        email: "",
        last_name: "",
        first_name: "",
    });

    const [participants, setParticipants] = useState([]);

    const handleProjectChange = (e) => {
        const { name, value } = e.target;
        setProjectForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleParticipantChange = (e) => {
        const { name, value } = e.target;
        setParticipantForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddParticipant = () => {
        if (!participantForm.email || !participantForm.last_name || !participantForm.first_name) {
            return;
        }

        setParticipants((prev) => [...prev, participantForm]);

        setParticipantForm({
            email: "",
            last_name: "",
            first_name: "",
        });
    };

    const handleCreateProject = (e) => {
        e.preventDefault();

        const payload = {
            ...projectForm,
            participants,
        };

        console.log("CREATE PROJECT PAYLOAD =", payload);

        // API plus tard
    };
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

    return (
        <div className={style["structure-layout"]}>
            <Popup
                open={openPopup}
                title="Créer un projet et inviter ses participants"
                onClose={() => setOpenPopup(false)}
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
                                Statut du projet<span>*</span>
                            </label>
                            <select
                                className="inputs"
                                name="project_status"
                                value={projectForm.project_status}
                                onChange={handleProjectChange}
                                required
                            >
                                <option value="">Sélectionner un statut</option>
                                <option value="new">Nouveau</option>
                                <option value="active">Actif</option>
                                <option value="archived">Archivé</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <p style={{ marginBottom: "12px", fontWeight: 500 }}>
                            Invitez les participants du projet<span style={{ color: "#d11" }}>*</span>
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
                                <label style={{ visibility: "hidden" }}>Ajouter</label>
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
                            <div style={{ marginTop: "12px" }}>
                                {participants.map((participant, index) => (
                                    <div key={`${participant.email}-${index}`}>
                                        {participant.first_name} {participant.last_name} — {participant.email}
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
                                    onClick={() => setOpenPopup(true)} className="buttons-primary-reversed">
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
