"use client";

import React, { useState } from "react";
import styles from "./profile_sign.module.css";

const ProfileSign = () => {

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("📌 Données sauvegardées :", {
            mdp
        });
    };

    return (
        <div>
            <p>Incoming soon</p>
        </div>
    );
};

export default ProfileSign;
