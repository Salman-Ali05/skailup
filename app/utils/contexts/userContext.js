"use client";

import React, {
    createContext,
    useContext,
    useEffect,
    useCallback,
    useState,
} from "react";
import { supabase } from "../supabase/browser";

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

const isTokenAlmostExpired = (session) => {
    if (!session?.expires_at) return false;

    const expiresAtMs = session.expires_at * 1000;
    const nowMs = Date.now();

    return expiresAtMs - nowMs < 60_000;
};

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [userDetails, setUserDetails] = useState(null);

    // loading = auth pas encore initialisée
    const [loading, setLoading] = useState(true);

    // loading spécifique au /users/me
    const [detailsLoading, setDetailsLoading] = useState(false);

    const applySession = useCallback((newSession) => {
        setSession(newSession ?? null);
        setUser(newSession?.user ?? null);
    }, []);

    const getValidSession = useCallback(async () => {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
            console.error("getSession error:", error);
            return null;
        }

        let currentSession = data.session ?? null;

        if (currentSession && isTokenAlmostExpired(currentSession)) {
            const { data: refreshedData, error: refreshError } =
                await supabase.auth.refreshSession();

            if (refreshError) {
                console.error("refreshSession error:", refreshError);
                return null;
            }

            currentSession = refreshedData.session ?? null;
        }

        return currentSession;
    }, []);

    const getAccessToken = useCallback(async () => {
        const validSession = await getValidSession();

        applySession(validSession);

        return validSession?.access_token ?? null;
    }, [getValidSession, applySession]);

    const authFetch = useCallback(
        async (url, options = {}) => {
            let token = await getAccessToken();

            if (!token) {
                throw new Error("No active session");
            }

            let res = await fetch(url, {
                ...options,
                headers: {
                    "Content-Type": "application/json",
                    ...(options.headers || {}),
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.status === 401) {
                const { data, error } = await supabase.auth.refreshSession();

                if (error) {
                    throw new Error("Session expired");
                }

                const refreshedSession = data.session ?? null;
                applySession(refreshedSession);

                token = refreshedSession?.access_token ?? null;

                if (!token) {
                    throw new Error("Session expired");
                }

                res = await fetch(url, {
                    ...options,
                    headers: {
                        "Content-Type": "application/json",
                        ...(options.headers || {}),
                        Authorization: `Bearer ${token}`,
                    },
                });
            }

            return res;
        },
        [getAccessToken, applySession]
    );

    useEffect(() => {
        let alive = true;

        const init = async () => {
            setLoading(true);

            const validSession = await getValidSession();

            if (!alive) return;

            applySession(validSession);
            setLoading(false);
        };

        init();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, newSession) => {
            applySession(newSession);
            setLoading(false);
        });

        return () => {
            alive = false;
            subscription.unsubscribe();
        };
    }, [getValidSession, applySession]);

    useEffect(() => {
        if (loading) return;

        const token = session?.access_token;

        if (!token) {
            setUserDetails(null);
            setDetailsLoading(false);
            return;
        }

        let cancelled = false;

        const fetchDetails = async () => {
            try {
                setDetailsLoading(true);

                const res = await authFetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/users/me`
                );

                const json = await res.json();

                if (!res.ok) {
                    throw new Error(json?.error || `HTTP ${res.status}`);
                }

                if (!cancelled) {
                    setUserDetails(json.user_details ?? null);
                }
            } catch (e) {
                console.error("fetch /me failed:", e);

                if (!cancelled) {
                    setUserDetails(null);
                }
            } finally {
                if (!cancelled) {
                    setDetailsLoading(false);
                }
            }
        };

        fetchDetails();

        return () => {
            cancelled = true;
        };
    }, [loading, session?.access_token, authFetch]);

    const loginUser = async ({ session: s, user_details }) => {
        setLoading(true);

        if (s?.access_token && s?.refresh_token) {
            const { data, error } = await supabase.auth.setSession({
                access_token: s.access_token,
                refresh_token: s.refresh_token,
            });

            if (error) {
                console.error("setSession error:", error);
                applySession(null);
                setUserDetails(null);
                setLoading(false);
                return;
            }

            applySession(data.session ?? s);
            setUserDetails(user_details ?? null);
        }

        setLoading(false);
    };

    const logoutUser = async () => {
        setLoading(true);

        await supabase.auth.signOut();

        setUserDetails(null);
        applySession(null);

        setLoading(false);
    };

    return (
        <UserContext.Provider
            value={{
                user,
                session,
                userDetails,

                loading,
                detailsLoading,

                isAuthenticated: Boolean(session?.access_token),

                loginUser,
                logoutUser,

                getAccessToken,
                authFetch,

                setLoading,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};