"use client";

import React from "react";
import SessionStatus from "../SessionStatus/SessionStatus";
import ListUsersInSession from "../ListUsersInSession/ListUsersInSession";
import style from "./SessionTable.module.css";

const sessions = [
    {
        program: "Croissance+ Cohorte15",
        type: "Présentiel",
        date: "2025-06-23",
        time: "14:30",
        duration: "2h",
        activity: "Coaching",
        speakers: ["Julie Lafontaine"],
        projects: ["bio", "smart"],
    },
    {
        program: "Pépinière 2025",
        type: "Distanciel",
        date: "2025-06-23",
        time: "19:30",
        duration: "1h",
        activity: "Formation",
        speakers: ["Florino Jean", "Florino Jean"],
        projects: ["bio", "capitole"],
    },
];

const SessionTable = () => {
    return (
        <div className={style["session-table"]}>
            <table className={style["table-session"]}>
                <thead className={style["table-header"]}>
                    <tr>
                        <th className={style["table-session-rows"]}>Programme</th>
                        <th>Session</th>
                        <th>Date</th>
                        <th>Heure</th>
                        <th>Activité</th>
                        <th>Intervenants</th>
                        <th>Projets</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {sessions.map((s, i) => (
                        <tr key={i}>
                            <td>{s.program}</td>
                            <td><SessionStatus type={s.type} /></td>
                            <td>
                                23/06/2025 <br />
                                <small className={style["text-muted"]}>(dans 12 jours)</small>
                            </td>
                            <td>{s.time} ({s.duration})</td>
                            <td>{s.activity}</td>
                            <td>
                                <ListUsersInSession users={s.speakers} />
                            </td>
                            <td>
                                <div className={style["project-badges"]}>
                                    {s.projects.map((p, j) => (
                                        <span key={j} className={style["project-chip"]}>{p}</span>
                                    ))}
                                </div>
                            </td>
                            <td>
                                <div className={style["action-icons"]}>
                                    <button className={style["icon-btn"]}>👁</button>
                                    <button className={style["icon-btn"]}>↗</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SessionTable;
