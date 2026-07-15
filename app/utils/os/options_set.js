"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/app/utils/contexts/userContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const useOptionsSet = () => {
    const { loading, isAuthenticated, authFetch } = useUser();

    const [optionsSet, setOptionsSet] = useState({});
    const [optionsLoading, setOptionsLoading] = useState(true);
    const [optionsError, setOptionsError] = useState(null);

    useEffect(() => {
        if (loading) return;

        if (!isAuthenticated) {
            setOptionsSet({});
            setOptionsLoading(false);
            return;
        }

        let isCancelled = false;

        const fetchOptionsSet = async () => {
            try {
                setOptionsLoading(true);
                setOptionsError(null);

                const response = await authFetch(
                    `${API_URL}/os_tags/`,
                    {
                        method: "GET",
                    }
                );

                const data = await response
                    .json()
                    .catch(() => ({}));

                if (!response.ok) {
                    throw new Error(
                        data?.error ||
                        "Impossible de récupérer les options sets"
                    );
                }

                if (!isCancelled) {
                    setOptionsSet(
                        data && typeof data === "object"
                            ? data
                            : {}
                    );
                }
            } catch (error) {
                console.error(
                    "Error fetching options sets:",
                    error
                );

                if (!isCancelled) {
                    setOptionsSet({});
                    setOptionsError(error.message);
                }
            } finally {
                if (!isCancelled) {
                    setOptionsLoading(false);
                }
            }
        };

        fetchOptionsSet();

        return () => {
            isCancelled = true;
        };
    }, [loading, isAuthenticated, authFetch]);

    return {
        optionsSet,
        optionsLoading,
        optionsError,
    };
};

export default useOptionsSet;