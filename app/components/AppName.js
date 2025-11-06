"use client";

import React from "react";
import { usePathname } from "next/navigation";

const PageName = ({ size, logo }) => {
    const pathname = usePathname();
    const isAuthPage = pathname === "/login" || pathname === "/register";

    const className = isAuthPage ? "app-name-white" : "app-name-black";

    return (
        <div className={className}>
            <h1 style={{ fontSize: size }}>SKAILUP</h1>
            {logo && <img src={logo} alt="Logo" className="logo"/>}
        </div>
    );
};

export default PageName;
