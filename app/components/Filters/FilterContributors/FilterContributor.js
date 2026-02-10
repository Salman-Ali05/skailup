"use client"

import React from "react"
import style from "./FilterContributors.module.css"
import { IoFilterOutline } from "react-icons/io5";

const FilterContributors = () => {

    return (
        <div>
            <button className={style.filterBtn}><IoFilterOutline /> Filtre</button>
        </div>
    )
}

export default FilterContributors