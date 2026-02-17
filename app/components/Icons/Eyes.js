"use client";

import React from "react";
import { IoEyeOutline } from "react-icons/io5";

const EyesIcon = ({ size = 20, color = "#9a9d9c" }) => {
    return <IoEyeOutline size={size} color={color} opacity={0.5}/>;
};

export default EyesIcon;
