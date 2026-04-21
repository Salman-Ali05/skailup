"use client";

import React from "react";
import style from "./home.module.css";
import SessionTable from "@/app/components/SessionTable/SessionTable";

const Home = ({
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
                    <div className={style.headerRow}>
                        <div className={style.mainContainer}>
                            <div className={style.fieldRow}>
                                <h2>⚠️Sessions à confirmer</h2>

                                <div className={style.fieldRow}>
                                    <svg className={style.buttonsArrow} viewBox="-19.04 0 75.803 75.803" xmlns="http://www.w3.org/2000/svg" fill="#000000">                                        <g id="SVGRepo_iconCarrier"> <g id="Group_64" data-name="Group 64" transform="translate(-624.082 -383.588)"> <path id="Path_56" data-name="Path 56" d="M660.313,383.588a1.5,1.5,0,0,1,1.06,2.561l-33.556,33.56a2.528,2.528,0,0,0,0,3.564l33.556,33.558a1.5,1.5,0,0,1-2.121,2.121L625.7,425.394a5.527,5.527,0,0,1,0-7.807l33.556-33.559A1.5,1.5,0,0,1,660.313,383.588Z" fill="#8d8aa2"/> </g> </g>
                                    </svg>
                                    <svg className={style.buttonsArrow} viewBox="-19.04 0 75.804 75.804" xmlns="http://www.w3.org/2000/svg" fill="#000000">
                                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
                                        <g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#8d8aa2"/> </g> </g>
                                    </svg>
                                </div>
                            </div>
                            

                            <div className={style.panelsRow}>
                                <div className={`${style.panelSession} ${style.panelGroup}`}>
                                    <div className={style.fieldColumn}>
                                        <div className={style.fieldColumn}>
                                            <div className={style.cohorteTagGroup}>
                                                <p className={style.mediumBold}>Croissance+ Cohorte15</p>
                                                <div className={style.fieldRow} style={{ gap: 8}}>
                                                    <p className="orangeTag">Distanciel</p>
                                                    <svg width="22" height="22" fill="#1b43d0" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>arrow-up-right-from-square</title> <path d="M26 15.036c-0.69 0-1.25 0.56-1.25 1.25v12.464h-21.5v-21.5h12.464c0.69 0 1.25-0.56 1.25-1.25s-0.56-1.25-1.25-1.25v0h-13.714c-0.69 0-1.25 0.56-1.25 1.25v0 24c0 0.69 0.56 1.25 1.25 1.25h24c0.69-0.001 1.249-0.56 1.25-1.25v-13.714c-0-0.69-0.56-1.25-1.25-1.25h-0zM31.248 1.917c-0.046-0.648-0.578-1.158-1.231-1.167h-10.017c-0.69 0-1.25 0.56-1.25 1.25s0.56 1.25 1.25 1.25v0h6.982l-15.866 15.865c-0.227 0.226-0.367 0.539-0.367 0.885 0 0.691 0.56 1.251 1.251 1.251 0.345 0 0.658-0.14 0.884-0.366v0l15.866-15.867v6.982c0 0.69 0.56 1.25 1.25 1.25s1.25-0.56 1.25-1.25v0-9.991c0-0.031 0-0.062-0.002-0.092z"></path> </g></svg>
                                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 8.25C9.92893 8.25 8.25 9.92893 8.25 12C8.25 14.0711 9.92893 15.75 12 15.75C14.0711 15.75 15.75 14.0711 15.75 12C15.75 9.92893 14.0711 8.25 12 8.25ZM9.75 12C9.75 10.7574 10.7574 9.75 12 9.75C13.2426 9.75 14.25 10.7574 14.25 12C14.25 13.2426 13.2426 14.25 12 14.25C10.7574 14.25 9.75 13.2426 9.75 12Z" fill="#1b43d0"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 3.25C7.48587 3.25 4.44529 5.9542 2.68057 8.24686L2.64874 8.2882C2.24964 8.80653 1.88206 9.28392 1.63269 9.8484C1.36564 10.4529 1.25 11.1117 1.25 12C1.25 12.8883 1.36564 13.5471 1.63269 14.1516C1.88206 14.7161 2.24964 15.1935 2.64875 15.7118L2.68057 15.7531C4.44529 18.0458 7.48587 20.75 12 20.75C16.5141 20.75 19.5547 18.0458 21.3194 15.7531L21.3512 15.7118C21.7504 15.1935 22.1179 14.7161 22.3673 14.1516C22.6344 13.5471 22.75 12.8883 22.75 12C22.75 11.1117 22.6344 10.4529 22.3673 9.8484C22.1179 9.28391 21.7504 8.80652 21.3512 8.28818L21.3194 8.24686C19.5547 5.9542 16.5141 3.25 12 3.25ZM3.86922 9.1618C5.49864 7.04492 8.15036 4.75 12 4.75C15.8496 4.75 18.5014 7.04492 20.1308 9.1618C20.5694 9.73159 20.8263 10.0721 20.9952 10.4545C21.1532 10.812 21.25 11.2489 21.25 12C21.25 12.7511 21.1532 13.188 20.9952 13.5455C20.8263 13.9279 20.5694 14.2684 20.1308 14.8382C18.5014 16.9551 15.8496 19.25 12 19.25C8.15036 19.25 5.49864 16.9551 3.86922 14.8382C3.43064 14.2684 3.17374 13.9279 3.00476 13.5455C2.84684 13.188 2.75 12.7511 2.75 12C2.75 11.2489 2.84684 10.812 3.00476 10.4545C3.17374 10.0721 3.43063 9.73159 3.86922 9.1618Z" fill="#1b43d0"></path> </g></svg>
                                                </div>
                                                
                                            </div>
                                            <p className="grayS" style={{ marginTop: -20}}>Coaching Individuelle</p>

                                        </div>

                                        <div className={style.fieldColumn}>
                                            <p style={{fontSize: 14}}>31 Octobre de 11h00 à 13h00</p>
                                        </div>

                                        <div className={style.fieldRow}>
                                            <div className={style.fieldGroup}>
                                                <p className={style.mediumBold}>Intervenant</p>
                                                <div className={style.fieldRow}>
                                                    <img src="/" />
                                                <p className={style.normalText}>Florino Jean</p>
                                                </div>
                                            </div>
                                            <div className={style.fieldGroup}>
                                                <p className={style.mediumBold}>Projets</p>
                                                <div className={style.fieldRow}>
                                                    <img src="/" />
                                                    <p className={style.normalText}>Bio&Smart</p>
                                                </div>
                                                <p className={style.normalText}>Julie Flor</p>
                                            </div>
                                        </div>

                                        <div className={style.buttonsRow}>
                                            <button className="buttons-primary">Confirmer</button>
                                            <button className="buttons-secondary">Reprogrammer</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h2>Raccourcis</h2>
                                <div className={style.buttonsRow}>
                                    <button className="buttons-primary">Mentorat 1j1m 93</button>
                                </div>
                            </div>

                            <div className={style["str-container"]} style={{ marginTop: '32px' }}>
                                <div className={style["str-content"]}>
                                    <h2 style={{ marginBottom: '32px' }}>Vos prochaines sessions</h2>
                                    <SessionTable />
                                </div>
                            </div>
                        </div>
                    </div>
    );
};

export default Home;