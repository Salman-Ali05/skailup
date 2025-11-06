"use client";

import { useRouter } from "next/navigation";

/**
 * Custom hook pour naviguer vers une URL.
 **/
export function useRouteTo() {
    const router = useRouter();

    const routeTo = (url) => {
        router.push(url);
    };

    return routeTo;
}
