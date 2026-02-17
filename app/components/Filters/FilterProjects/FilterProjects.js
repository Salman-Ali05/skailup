"use client"

import React from "react"
import style from "./FilterProjects.module.css"
import { IoFilterOutline } from "react-icons/io5";

const FilterProjects = () => {

    return (
        <div>
            <button className={style.filterBtn}><IoFilterOutline className={style.filterIcon} /> Filtre</button>
        </div>
    )
}

export default FilterProjects