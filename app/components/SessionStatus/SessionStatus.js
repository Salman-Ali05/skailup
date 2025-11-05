"use client";

import styles from "./SessionStatus.module.css";

const SessionStatus = ({ type }) => {
    let statusClass = styles["status-default"];

    if (type === "Présentiel") statusClass = styles["status-presentiel"];
    if (type === "Distanciel") statusClass = styles["status-distanciel"];
    if (type === "Hybride") statusClass = styles["status-hybride"];

    return (
        <span className={`${styles["status-badge"]} ${statusClass}`}>
            {type}
        </span>
    );
};

export default SessionStatus;
