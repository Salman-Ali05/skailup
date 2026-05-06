"use client";

import React from "react";
import style from "./ActivityProofPage.module.css";

const ActivityProofPage = ({
    activitiesProof = [],
    onViewActivityProof,
    onCreateActivityProof,
}) => {
    const formatDate = (iso) => {
        if (!iso) return "-";
        const [y, m, d] = iso.split("-");
        return `${d}/${m}/${y}`;
    };

    return (
        <div className={style["structure-layout"]}>
            <div className={style["structure-main"]}>
                <div className={style["structure-content"]}>
                    <h2>Preuves d'activités</h2>
                    <div className={style.headerRow}>
                        <div className={style.mainContainer}>
                            <div className={style.leftColumn}>
                                <div className={style.panelsRow}>
                                    <div className={`panel ${style.panelGroup}`}>
                                        <div>
                                            <label>Veuillez saisir un code opération :</label>
                                            <select className={`${style.inputs} ${style.dropDown}`} required defaultValue="">
                                                <option value="" disabled hidden>Sélectionnez l'opération</option>
                                                <option value="1">Skailing</option>
                                                <option value="2">ee</option>
                                            </select>
                                        </div>
                                        <div className={style.fieldGroup}>
                                            <label>Veuillez saisir le participant concerné :</label>
                                            <select className={`${style.inputs} ${style.multipleSelect}`} multiple required>
                                                <option value="" disabled style={{ color: "#aaa" }}>Participant</option>
                                                <option>Julie Flor - Bio&Smart</option>
                                                <option>Jetto Puro - Test'eur</option>
                                                <option>Toki Gin - Sakana</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className={`panel ${style.panelGroup}`}>
                                        <div className={style.fieldGroup}>
                                            <label>Veuillez saisir la cohorte concerné :</label>
                                            <select className={`${style.inputs} ${style.multipleSelect}`} multiple required>
                                                <option value="" disabled style={{ color: "#aaa" }} >Cohortes</option>
                                                <option>Dev Program - test</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label>Veuillez saisir la période d’analyse : Début et Fin</label>
                                            <div className={style.dateRow}>
                                                <div className={style.dateGroup}>
                                                    <input className={`${style.inputs} ${style.dateInput}`} type="date" required/>
                                                </div>
                                                <div className={style.dateGroup}>
                                                    <input className={`${style.inputs} ${style.dateInput}`} type="date" required/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={style.buttonsRow}>
                                    <button className="button-reset">Réinitialiser</button>
                                    <button className="buttons-primary">Valider les informations</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>  
        </div>
    );
};

export default ActivityProofPage;