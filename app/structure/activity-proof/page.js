"use client";

import React from "react";
import { FiPlusCircle } from "react-icons/fi";
import style from "./activity-proof.module.css";
import FilterProjects from "@/app/components/Filters/FilterProjects/FilterProjects";
import EyesIcon from "@/app/components/Icons/Eyes";
import ListUsersInSession from "@/app/components/ListUsers/ListUsers";

const StructureProjects = () => {
    return (
        <div className={style["structure-layout"]}>
            <div className={style["structure-main"]}>
                <div className={style["structure-content"]}>
                    <h2>Preuves d'activités</h2>

                    <div className={style.headerRow}>
                        <div className="headerActions">
                            <div className="tabs">
                            </div>
                            <div>
                                <div className="panel">
                                    <div>
                                        <label>Veuillez saisir un code opération :</label>
                                        <select className="inputs">
                                            <option>Skailing</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label>Veuillez saisir le participant concerné :</label>
                                        <select multiple>
                                            <option>Option 1</option>
                                            <option>Option 2</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="panel">
                                    <div>
                                        <label>Veuillez saisir la cohorte concerné :</label>
                                        <select multiple>
                                            <option>Option 1</option>
                                            <option>Option 2</option>
                                        </select>
                                    </div>
                                        <div>
                                            <label>Veuillez saisir la période d’analyse : Début et Fin </label>
                                            <div>
                                            <input input type="date"></input>
                                        </div>
                                        <div>
                                            <input input type="date"></input>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className={style.tools}>
                                    <button className="button-reset">
                                        Réinitialiser
                                    </button>
                                </div>
                                <div className={style.tools}>
                                    <button className="button-validate">
                                        Valider les informations
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StructureProjects;
