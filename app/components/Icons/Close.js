"use client";

import React from "react";
import { IoClose } from "react-icons/io5";

const CloseIcon = ({ size = 20 }) => {
    return <IoClose size={size} color="#9a9d9c" opacity={0.5}/>;
};

export default CloseIcon;
