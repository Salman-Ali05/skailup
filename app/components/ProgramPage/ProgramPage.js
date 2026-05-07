"use client";

import React, { useState } from "react";
import { FiPlusCircle } from "react-icons/fi";
import style from "./ProgramPage.module.css";
import stylePopup from "@/app/components/Popup/PopupContent.module.css";
import FilterContributors from "@/app/components/Filters/FilterContributors/FilterContributor";
import EyesIcon from "@/app/components/Icons/Eyes";
import GoToIcon from "@/app/components/Icons/GoTo";
import Popup from "@/app/components/Popup/Popup";

const ProgramPage = ({
    programs = [],
    programProjects = [],
    projects = [],
    programContributors = [],
    contributors = [],
    tagParamStructures = [],
    statusOptions = [],
    programsCountByStatusOpened = 0,
    programsCountByStatusClosed = 0,
    onViewProgram,
    onEditProgram = () => { },
    onCreateProgram = () => { },
}) => {
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

    const resetForm = () => {
        setFormValues({
            id: "",
            id_param_structure: "",
            description: "",
            date_start: "",
            date_end: "",
            id_status: "",
        });
    };

    const openCreate = () => {
        resetForm();
        setOpenPopupCreate(true);
    };
    const closeCreate = () => setOpenPopupCreate(false);

    const handleCreateConfirm = async (event) => {
        event.preventDefault();
        if (
            !formValues.id_param_structure ||
            !formValues.description ||
            !formValues.date_start ||
            !formValues.date_end ||
            !formValues.id_status
        ) {
            return;
        }
        onCreateProgram({ ...formValues });
        closeCreate();
    };

    const closeEdit = () => setOpenPopupEdit(false);

    const handleEditConfirm = async (event) => {
        event.preventDefault();
        if (
            !formValues.id_param_structure ||
            !formValues.description ||
            !formValues.date_start ||
            !formValues.date_end ||
            !formValues.id_status
        ) {
            return;
        }
        onEditProgram({ ...formValues });
        closeEdit();
    };

    const openEdit = (program) => {
        setFormValues({
            id: program?.id || "",
            id_param_structure: program?.id_param_structure || "",
            description: program?.description || "",
            date_start: program?.date_start || "",
            date_end: program?.date_end || "",
            id_status: program?.id_status || "",
        });
        setOpenPopupEdit(true);
    };
    
    const handleFormChange = (key) => (event) => {
        setFormValues((prev) => ({
            ...prev,
            [key]: event.target.value,
        }));
    };
    const formatDate = (iso) => {
        if (!iso) return "";
        const [y, m, d] = iso.split("-");
        return `${d}/${m}/${y}`;
    };

    const getContributorDisplayName = (contributor) => {
        if (!contributor) return "";
        const first = contributor.user_details?.first_name;
        const last = contributor.user_details?.last_name;
        const fullName = [first, last].filter(Boolean).join(" ");
        return (
            contributor.name ||
            contributor.contrib_name ||
            contributor.contributor_details?.contrib_name ||
            contributor.contributor_details?.name ||
            fullName ||
            contributor.user?.email ||
            ""
        );
    };
    
    const projectNameById = React.useMemo(() => {
        const map = new Map();
        projects.forEach((project) => {
            if (project && project.id) {
                map.set(project.id, project.name);
            }
        });
        return map;
    }, [projects]);

    const programProjectNames = React.useMemo(() => {
        return programProjects.reduce((acc, link) => {
            if (!link || !link.id_program || !link.id_project) return acc;
            const name = projectNameById.get(link.id_project);
            if (!name) return acc;
            if (!acc[link.id_program]) acc[link.id_program] = [];
            acc[link.id_program].push(name);
            return acc;
        }, {});
    }, [programProjects, projectNameById]);

    const tagParamValueById = React.useMemo(() => {
        const map = new Map();
        tagParamStructures.forEach((tag) => {
            if (!tag || !tag.id) return;
            const value = tag.label || tag.name || tag.description || tag.tag || tag.value;
            map.set(tag.id, value || "");
        });
        return map;
    }, [tagParamStructures]);

    const contributorNameById = React.useMemo(() => {
        const map = new Map();
        contributors.forEach((contributor) => {
            if (contributor && contributor.id) {
                map.set(contributor.id, getContributorDisplayName(contributor));
            }
        });
        return map;
    }, [contributors]);

    const programContributorNames = React.useMemo(() => {
        return programContributors.reduce((acc, link) => {
            if (!link || !link.id_program || !link.id_contributor) return acc;
            const name = contributorNameById.get(link.id_contributor);
            if (!name) return acc;
            if (!acc[link.id_program]) acc[link.id_program] = [];
            acc[link.id_program].push(name);
            return acc;
        }, {});
    }, [programContributors, contributorNameById]);

    const tagParamOptions = React.useMemo(() => {
        return tagParamStructures
            .filter((tag) => tag && tag.id)
            .map((tag) => {
                const label = tag.label || tag.name || tag.description || tag.tag || tag.value || "-";
                return { id: tag.id, label };
            });
    }, [tagParamStructures]);

    const statusOptionsList = React.useMemo(() => {
        return statusOptions
            .filter((status) => status && status.id)
            .map((status) => {
                const label = status.lang_fr || status.label || status.name || status.description || status.value || "-";
                return { id: status.id, label };
            });
    }, [statusOptions]);

    const statusLabelById = React.useMemo(() => {
        const map = new Map();
        statusOptionsList.forEach((status) => {
            map.set(status.id, status.label || "");
        });
        return map;
    }, [statusOptionsList]);

    return (
        <div className={style["structure-content"]}>
            <h2>Programmes</h2>

            <div className={style.headerRow}>
                <div className="headerActions">
                    <div className="tabs">
                        <div className="tab tabActive">
                            <p>
                                Ouvert <span>({programsCountByStatusOpened})</span>
                            </p>
                        </div>
                        <div className="tab">
                            <p>
                                En cours <span>({programsCountByStatusClosed})</span>
                            </p>
                        </div>
                    </div>

                    <div className={style.tools}>
                        <FilterContributors />
                        <button
                            className="buttons-primary-reversed"
                            onClick={openCreate}
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
                                <td>
                                    {program.id_param_structure ? (
                                        <span>
                                            {" "}{tagParamValueById.get(program.id_param_structure)}
                                        </span>
                                    ) : null} <br></br>
                                    {program.description}
                                </td>
                                
                                <td>{formatDate(program.date_start)}</td>

                                <td>{formatDate(program.date_end)}</td>

                                <td>
                                    {(programContributorNames[program.id] || []).join(", ")}
                                </td>

                                <td>
                                    {(programProjectNames[program.id] || []).join(", ")}
                                </td>

                                <td>
                                    <span className={style.roleBadge}>
                                        {statusLabelById.get(program.id_status) || program.id_status || ""}
                                    </span>
                                </td>

                                <td>
                                    <div className={style.actions}>
                                        <div>
                                            <EyesIcon />
                                        </div>
                                        <div
                                            className="cursorOn"
                                            role="button"
                                            aria-label="Modifier le programme"
                                            onClick={() => openEdit(program)}
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
                        );
                    })}
                </tbody>
            </table>
            {/* Popup de création de programme */}
            <Popup open={openPopupCreate} onClose={closeCreate} title="Nouveau programme">
                <form className={stylePopup.form} onSubmit={handleCreateConfirm}>
                    <div className={stylePopup.row}>
                        <div className={stylePopup.field}>
                            <label>
                                Type de programme<span>*</span>
                            </label>
                            <select
                                className="inputs"
                                required
                                value={formValues.id_param_structure}
                                onChange={handleFormChange("id_param_structure")}
                            >
                                <option value="" disabled hidden></option>
                                {tagParamOptions.map((tag) => (
                                    <option key={tag.id} value={tag.id}>
                                        {tag.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={stylePopup.field}>
                            <label>
                                Statut<span>*</span>
                            </label>
                            <select
                                className="inputs"
                                required
                                value={formValues.id_status}
                                onChange={handleFormChange("id_status")}
                            >
                                <option value="" disabled hidden></option>
                                {statusOptionsList.map((status) => (
                                    <option key={status.id} value={status.id}>
                                        {status.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={stylePopup.row}>
                        <div className={stylePopup.field}>
                            <label>
                                Nom / ref. Cohorte<span>*</span>
                            </label>
                            <input
                                className="inputs"
                                type="text"
                                placeholder="Nom / ref. Cohorte"
                                required
                                value={formValues.description}
                                onChange={handleFormChange("description")}
                            />
                        </div>
                    </div>

                    <div className={stylePopup.row}>
                        <div className={stylePopup.field}>
                            <label>
                                Date de debut<span>*</span>
                            </label>
                            <input
                                className="inputs"
                                type="date"
                                required
                                value={formValues.date_start}
                                onChange={handleFormChange("date_start")}
                            />
                        </div>

                        <div className={stylePopup.field}>
                            <label>
                                Date de fin<span>*</span>
                            </label>
                            <input
                                className="inputs"
                                type="date"
                                required
                                value={formValues.date_end}
                                onChange={handleFormChange("date_end")}
                            />
                        </div>
                    </div>

                    <button type="submit" className={`${stylePopup.submitBtn} buttons-primary`}>
                        Continuer
                    </button>
                </form>
            </Popup>

            {/* Popup de modification de programme */}
            <Popup open={openPopupEdit} onClose={closeEdit} title="Modifier le programme">
                <form className={stylePopup.form} onSubmit={handleEditConfirm}>
                    <div className={stylePopup.row}>
                        <div className={stylePopup.field}>
                            <label>
                                Type de programme<span>*</span>
                            </label>
                            <select
                                className="inputs"
                                required
                                value={formValues.id_param_structure}
                                onChange={handleFormChange("id_param_structure")}
                            >
                                <option value="" disabled hidden></option>
                                {tagParamOptions.map((tag) => (
                                    <option key={tag.id} value={tag.id}>
                                        {tag.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={stylePopup.field}>
                            <label>
                                Statut<span>*</span>
                            </label>
                            <select
                                className="inputs"
                                required
                                value={formValues.id_status}
                                onChange={handleFormChange("id_status")}
                            >
                                <option value="" disabled hidden></option>
                                {statusOptionsList.map((status) => (
                                    <option key={status.id} value={status.id}>
                                        {status.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={stylePopup.row}>
                        <div className={stylePopup.field}>
                            <label>
                                Nom / ref. Cohorte<span>*</span>
                            </label>
                            <input
                                className="inputs"
                                type="text"
                                placeholder="Nom / ref. Cohorte"
                                required
                                value={formValues.description}
                                onChange={handleFormChange("description")}
                                
                            />
                        </div>
                    </div>

                    <div className={stylePopup.row}>
                        <div className={stylePopup.field}>
                            <label>
                                Date de debut<span>*</span>
                            </label>
                            <input
                                className="inputs"
                                type="date"
                                required
                                value={formValues.date_start}
                                onChange={handleFormChange("date_start")}
                            />
                        </div>

                        <div className={stylePopup.field}>
                            <label>
                                Date de fin<span>*</span>
                            </label>
                            <input
                                className="inputs"
                                type="date"
                                required
                                value={formValues.date_end}
                                onChange={handleFormChange("date_end")}
                            />
                        </div>
                    </div>

                    <button type="submit" className={`${stylePopup.submitBtn} buttons-primary`}>
                        Continuer
                    </button>
                </form>
            </Popup>
        </div>
    );
};

export default ProgramPage;