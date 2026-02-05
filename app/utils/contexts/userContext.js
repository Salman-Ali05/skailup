"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase/browser";

const UserContext = createContext(null);
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let alive = true;

        const init = async () => {
            const { data, error } = await supabase.auth.getSession();
            if (!alive) return;

            if (error) console.error("getSession error:", error);

            setSession(data.session ?? null);
            setUser(data.session?.user ?? null);
            setLoading(false);
        };

        init();

        const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
            setSession(newSession ?? null);
            setUser(newSession?.user ?? null);
        });

        return () => {
            alive = false;
            sub.subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        const token = session?.access_token;

        if (!token) {
            setUserDetails(null);
            return;
        }

        let cancelled = false;

        const fetchDetails = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) {
                    // token invalide / backend down / etc.
                    const txt = await res.text();
                    throw new Error(txt || `HTTP ${res.status}`);
                }

                const json = await res.json();
                if (!cancelled) setUserDetails(json.user_details ?? null);
            } catch (e) {
                console.error("fetch /me failed:", e);
                if (!cancelled) setUserDetails(null);
            }
        };

        fetchDetails();

        return () => {
            cancelled = true;
        };
    }, [session?.access_token]);

    const loginUser = async ({ session: s, user_details }) => {
        setLoading(true);

        if (s?.access_token && s?.refresh_token) {
            const { error } = await supabase.auth.setSession({
                access_token: s.access_token,
                refresh_token: s.refresh_token,
            });
            if (error) console.error("setSession error:", error);
        }
    };

    const logoutUser = async () => {
        await supabase.auth.signOut();
        setUserDetails(null);
        setSession(null);
        setUser(null);
    };

    return (
        <UserContext.Provider
            value={{ user, session, userDetails, loading, loginUser, logoutUser, setLoading }}
        >
            {children}
        </UserContext.Provider>
    );
};
