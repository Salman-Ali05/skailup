"use client";

import SessionTable from "@/app/components/SessionTable/SessionTable";
import React from "react";
import style from "./str_home.module.css";

const StructureHome = () => {
  return (
    <div className={style["str-container"]}>
      <div className={style["str-content"]}>
        <p className={style["str-home-title"]}>Vos sessions</p>
        <SessionTable />
      </div>
    </div>
  );
};

export default StructureHome;
