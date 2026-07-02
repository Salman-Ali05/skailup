"use client";

import React, { useState, useEffect, useMemo } from "react";
import { FiPlusCircle } from "react-icons/fi";
import style from "./ProgramPage.module.css";
import stylePopup from "@/app/components/Popup/PopupContent.module.css";
import FilterContributors from "@/app/components/Filters/FilterContributors/FilterContributor";
import EyesIcon from "@/app/components/Icons/Eyes";
import GoToIcon from "@/app/components/Icons/GoTo";
import Popup from "@/app/components/Popup/Popup";
import PenIcon from "../Icons/Pen";
import { avoidDoubleClicks } from "@/app/utils/fct/avoidDoubleClicks";

const ProgramPage = ({
    status = [],
    programs = [],
    programProjects = [],
    projects = [],
    programContributors = [],
    contributors = [],
    tagParamStructures = [],
    statusOptions = [],
    onViewProgram,
    onEditProgram = () => { },
    onCreateProgram = () => { },
}) => {
    const [activeStatusId, setActiveStatusId] = useState("");
    const [openPopup, setOpenPopup] = useState(false);
    const [popupMode, setPopupMode] = useState("create");
    const [formValues, setFormValues] = React.useState({
        id: "",
        id_param_structure: "",
        description: "",
        date_start: "",
        date_end: "",
        id_status: "",
    });

    const statusList = useMemo(() => {
        const source = status.length > 0 ? status : statusOptions;

        return source
            .filter((item) => item && item.id)
            .map((item) => {
                const label =
                    item.lang_fr ||
                    item.lang_en ||
                    item.label ||
                    item.name ||
                    item.description ||
                    item.value ||
                    item.status ||
                    "-";

                return {
                    id: String(item.id),
                    label,
                };
            });
    }, [status, statusOptions]);

    useEffect(() => {
        if (!activeStatusId && statusList.length > 0) {
            setActiveStatusId(statusList[0].id);
        }
    }, [activeStatusId, statusList]);

    const filteredPrograms = useMemo(() => {
        if (!activeStatusId) return programs;

        return programs.filter((program) => {
            return String(program.id_status) === String(activeStatusId);
        });
    }, [programs, activeStatusId]);

    const getProgramCountByStatus = (statusId) => {
        return programs.filter((program) => {
            return String(program.id_status) === String(statusId);
        }).length;
    };

    const isEditMode = popupMode === "edit";

    const toInputDate = (date) => {
        if (!date) return "";
        return String(date).split("T")[0];
    };

    const getEmptyForm = () => ({
        id: "",
        id_param_structure: "",
        description: "",
        date_start: "",
        date_end: "",
        id_status: activeStatusId || statusList[0]?.id || "",
    });

    const resetForm = () => {
        setFormValues(getEmptyForm());
    };

    const closePopup = () => {
        setOpenPopup(false);
        setPopupMode("create");
        resetForm();
    };

    const openCreate = () => {
        setPopupMode("create");
        setFormValues(getEmptyForm());
        setOpenPopup(true);
    };

    const openEdit = (program) => {
        setPopupMode("edit");

        setFormValues({
            id: program?.id ? String(program.id) : "",
            id_param_structure: program?.id_param_structure
                ? String(program.id_param_structure)
                : "",
            description: program?.description || "",
            date_start: toInputDate(program?.date_start),
            date_end: toInputDate(program?.date_end),
            id_status: program?.id_status ? String(program.id_status) : "",
        });

        setOpenPopup(true);
    };

    const isFormValid = () => {
        return (
            formValues.id_param_structure &&
            formValues.description &&
            formValues.date_start &&
            formValues.date_end &&
            formValues.id_status
        );
    };

    const handleProgramConfirm = async (event) => {
        event.preventDefault();

        if (!isFormValid()) return;

        if (popupMode === "edit") {
            onEditProgram({ ...formValues });
        } else {
            onCreateProgram({ ...formValues });
        }

        closePopup();
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

    const projectNameById = useMemo(() => {
        const map = new Map();
        projects.forEach((project) => {
            if (project && project.id) {
                map.set(project.id, project.name);
            }
        });
        return map;
    }, [projects]);

    const programProjectNames = useMemo(() => {
        return programProjects.reduce((acc, link) => {
            if (!link || !link.id_program || !link.id_project) return acc;
            const name = projectNameById.get(link.id_project);
            if (!name) return acc;
            if (!acc[link.id_program]) acc[link.id_program] = [];
            acc[link.id_program].push(name);
            return acc;
        }, {});
    }, [programProjects, projectNameById]);

    const tagParamValueById = useMemo(() => {
        const map = new Map();
        tagParamStructures.forEach((tag) => {
            if (!tag || !tag.id) return;
            const value = tag.label || tag.name || tag.description || tag.tag || tag.value;
            map.set(tag.id, value || "");
        });
        return map;
    }, [tagParamStructures]);

    const contributorNameById = useMemo(() => {
        const map = new Map();
        contributors.forEach((contributor) => {
            if (contributor && contributor.id) {
                map.set(contributor.id, getContributorDisplayName(contributor));
            }
        });
        return map;
    }, [contributors]);

    const programContributorNames = useMemo(() => {
        return programContributors.reduce((acc, link) => {
            if (!link || !link.id_program || !link.id_contributor) return acc;
            const name = contributorNameById.get(link.id_contributor);
            if (!name) return acc;
            if (!acc[link.id_program]) acc[link.id_program] = [];
            acc[link.id_program].push(name);
            return acc;
        }, {});
    }, [programContributors, contributorNameById]);

    const tagParamOptions = useMemo(() => {
        return tagParamStructures
            .filter((tag) => tag && tag.id)
            .map((tag) => {
                const label = tag.label || tag.name || tag.description || tag.tag || tag.value || "-";
                return { id: tag.id, label };
            });
    }, [tagParamStructures]);

    const statusLabelById = React.useMemo(() => {
        const map = new Map();

        statusList.forEach((item) => {
            map.set(item.id, item.label || "");
        });

        return map;
    }, [statusList]);

    return (
        <div className={style["structure-content"]}>
            <h2>Programmes</h2>

            <div className={style.headerRow}>
                <div className="headerActions">
                    <div className="tabs">
                        {statusList.map((item) => (
                            <div
                                key={item.id}
                                className={`tab ${activeStatusId === item.id ? "tabActive" : ""}`}
                                onClick={() => setActiveStatusId(item.id)}
                            >
                                <p>
                                    {item.label} <span>({getProgramCountByStatus(item.id)})</span>
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className={style.tools}>
                        <FilterContributors />
                        <button
                            className="buttons-primary-reversed"
                            onClick={openCreate}
                        >
                            <FiPlusCircle className="buttons-icon" /> Créer une Cohorte
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
                    {filteredPrograms.map((program) => {
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
                                    <span className={(statusLabelById.get(String(program.id_status)) === "Ouvert") ? "greenTag" : "redTag"}>
                                        {statusLabelById.get(String(program.id_status))}
                                    </span>
                                </td>

                                <td>
                                    <div className={style.actions}>
                                        <div
                                            className="cursorOn"
                                            onClick={() => onViewProgram(program)}
                                        >
                                            <GoToIcon />
                                        </div>
                                        <div className="cursorOn"
                                            role="button"
                                            aria-label="Modifier le programme"
                                            onClick={() => openEdit(program)}>
                                            <PenIcon />
                                        </div>
                                        <div>
                                            <EyesIcon />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <Popup
                open={openPopup}
                onClose={closePopup}
                title={isEditMode ? "Modifier la cohorte" : "Nouvelle cohorte"}
            >
                <form className={stylePopup.form} onSubmit={handleProgramConfirm}>
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

                                {statusList.map((status) => (
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

                    <button
                        id="btnCreateProgram"
                        type="submit"
                        className={`${stylePopup.submitBtn} buttons-primary`} onClick={() => avoidDoubleClicks("btnCreateProgram")}>
                        {isEditMode ? "Modifier" : "Créer"}
                    </button>
                </form>
            </Popup>
        </div>
    );
};

export default ProgramPage;