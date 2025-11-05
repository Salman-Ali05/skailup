"use client";

import React from "react";
import { usePathname } from "next/navigation";

const PageName = () => {
    const pathname = usePathname();
    const isAuthPage = pathname === "/login" || pathname === "/register";

    const className = isAuthPage ? "app-name-white" : "app-name-black";

    return (
        <div className={className}>
            <h1>SKAILUP</h1>
        </div>
    );
};

export default PageName;
