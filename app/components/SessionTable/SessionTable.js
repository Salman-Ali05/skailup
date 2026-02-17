"use client";

import React from "react";
import SessionStatus from "../SessionStatus/SessionStatus";
import style from "./SessionTable.module.css";
import EyesIcon from "../Icons/Eyes";
import GoToIcon from "../Icons/GoTo";
import ListUsers from "../ListUsers/ListUsers";

const sessions = [
    {
        program: "Croissance+ Cohorte15",
        type: "Présentiel",
        date: "2025-06-23",
        time: "14:30",
        duration: "2h",
        activity: "Coaching",
        speakers: ["Julie Lafontaine"],
        projects: [
            {
                id: 1,
                name: "bio",
                users: [
                    { firstName: "Alice", lastName: "Dupont" },
                    { firstName: "Bob", lastName: "Martin" },
                ],
            },
            {
                id: 2,
                name: "smart",
                users: [
                    { firstName: "Charlie", lastName: "Durand" },
                ],
            },
        ],
    },
    {
        program: "Pépinière 2025",
        type: "Distanciel",
        date: "2025-06-23",
        time: "19:30",
        duration: "1h",
        activity: "Formation",
        speakers: ["Florino Jean", "Florino Jean"],
        projects: [
            {
                id: 3,
                name: "bio",
                users: [
                    { firstName: "Diana", lastName: "Bernard" },
                    { firstName: "Eve", lastName: "Lefevre" },
                ],
            },
        ],
    },
];


const SessionTable = () => {
    return (
        <div className={style["session-table"]}>
            <table className={style["table-session"]}>
                <thead className={style["table-header"]}>
                    <tr>
                        <th className="th-150 th-first">Programme</th>
                        <th className="th-100">Session</th>
                        <th className="th-100">Date</th>
                        <th className="th-100">Heure</th>
                        <th className="th-150">Activité</th>
                        <th className="th-150">Intervenants</th>
                        <th className="th-150">Projets</th>
                        <th className="th-last th-100">Action</th>
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
                                <ListUsers users={s.speakers} />
                            </td>
                            <td>
                                <div className={style["project-badges"]}>
                                    <ListUsers users={s.projects} />
                                </div>
                            </td>
                            <td>
                                <div className={style["action-icons"]}>
                                    <EyesIcon />
                                    <GoToIcon />
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
