"use client";

import SessionTable from "@/app/components/SessionTable/SessionTable";
import React from "react";
import style from "./str_home.module.css";

const StructureHome = () => {
  return (
    <div className={style["structure-layout"]}>

      <div className={style["structure-main"]}>

        <div className={style["structure-content"]}>
          <SessionTable />
        </div>
      </div>
    </div>
  );
};

export default StructureHome;
