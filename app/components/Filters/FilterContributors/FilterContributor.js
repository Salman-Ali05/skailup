"use client"

import React from "react"
import style from "./FilterContributors.module.css"
import { FaBars } from "react-icons/fa"

const FilterContributors = () => {

    return (
    <div>
        <button className={style.filterBtn}><FaBars /> Filtre</button>
        <button className="buttons-primary-reversed">Test</button>
    </div>
    )}

export default FilterContributors