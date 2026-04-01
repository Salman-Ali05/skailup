"use client";

import SessionTable from "@/app/components/SessionTable/SessionTable";
import React from "react";
import style from "./home.module.css";

const ProjectsHome = () => {
  return (
    <div className={style["str-container"]}>
      <div className={style["str-content"]}>
        <p className={style["str-home-title"]}>Vos sessions</p>
        <SessionTable />
      </div>
    </div>
  );
};

export default ProjectsHome;
