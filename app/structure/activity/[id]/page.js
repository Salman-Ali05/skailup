"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useRouteTo } from "@/app/utils/router";
import style from "./actitvity.module.css";
import ActivityPage from "@/app/components/ActivityPage/ActivityPage";
import { useUser } from "@/app/utils/contexts/userContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const StructureActivity = () => {
    const routeTo = useRouteTo();
    const params = useParams();
    const { id } = params || {};

    const { loading, isAuthenticated, authFetch } = useUser();

    const [program, setProgram] = useState(null);
    const [activities, setActivities] = useState([]);
    const [activityProjects, setActivityProjects] = useState([]);
    const [projects, setProjects] = useState([]);
    const [activityContribs, setActivityContribs] = useState([]);
    const [contributors, setContributors] = useState([]);
    const [tagParamStructures, setTagParamStructures] = useState([]);
    const [status, setStatus] = useState([]);
    const [statusOptions, setStatusOptions] = useState([]);

    useEffect(() => {
        const storedProgram = sessionStorage.getItem("selectedProgram");

        if (!storedProgram) return;

        try {
            const parsedProgram = JSON.parse(storedProgram);

            if (String(parsedProgram.id) === String(id)) {
                setProgram(parsedProgram);
            }
        } catch (err) {
            console.error("Impossible de récupérer le programme", err);
        }
    }, [id]);

    useEffect(() => {
        if (loading || !isAuthenticated || !id) return;

        const fetchActivities = async () => {
            try {
                const res = await authFetch(`${API_URL}/activities/${id}`);
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(
                        data?.error || "Erreur lors de la récupération des activités"
                    );
                }

                const statusData = Array.isArray(data?.statusOptions)
                    ? data.statusOptions
                    : [];

                setProgram(data?.program || null);
                setActivities(Array.isArray(data?.activities) ? data.activities : []);
                setActivityProjects(
                    Array.isArray(data?.activityProjects)
                        ? data.activityProjects
                        : []
                );
                setProjects(Array.isArray(data?.projects) ? data.projects : []);
                setActivityContribs(
                    Array.isArray(data?.activityContribs)
                        ? data.activityContribs
                        : []
                );
                setContributors(
                    Array.isArray(data?.contributors) ? data.contributors : []
                );
                setTagParamStructures(
                    Array.isArray(data?.tagParamStructures)
                        ? data.tagParamStructures
                        : []
                );

                setStatusOptions(statusData);

                setStatus(
                    statusData.filter((item) => {
                        return ["Open", "Closed"].includes(item.code);
                    })
                );
            } catch (err) {
                console.error("Erreur fetchActivities :", err);

                setActivities([]);
                setActivityProjects([]);
                setProjects([]);
                setActivityContribs([]);
                setContributors([]);
                setTagParamStructures([]);
                setStatus([]);
                setStatusOptions([]);
            }
        };

        fetchActivities();
    }, [loading, isAuthenticated, id, authFetch]);

    const handleViewActivity = (activityId) => {
        routeTo(`/structure/session/${activityId}`);
    };

    return (
        <div className={style["structure-layout"]}>
            <div className={style["structure-main"]}>
                <ActivityPage
                    programId={id}
                    program={program}
                    status={status}
                    statusOptions={statusOptions}
                    activities={activities}
                    activityProjects={activityProjects}
                    projects={projects}
                    activityContribs={activityContribs}
                    contributors={contributors}
                    tagParamStructures={tagParamStructures}
                    onBack={() => routeTo("/structure/program")}
                    onViewActivity={handleViewActivity}
                    onCreateActivity={() => { }}
                />
            </div>
        </div>
    );
};

export default StructureActivity;