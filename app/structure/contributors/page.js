"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FiPlusCircle } from "react-icons/fi";
import style from "./str_contributors.module.css";
import stylePopup from "@/app/components/Popup/PopupContent.module.css";
import FilterContributors from "@/app/components/Filters/FilterContributors/FilterContributor";
import EyesIcon from "@/app/components/Icons/Eyes";
import Popup from "@/app/components/Popup/Popup";
import { showToast } from "nextjs-toast-notify";
import { useUser } from "@/app/utils/contexts/userContext";
import Multiselect from "@/app/components/Multiselect/Multiselect";
import { formatDate } from "@/app/utils/fct/dateFormatter";
import { avoidDoubleClicks } from "@/app/utils/fct/avoidDoubleClicks";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const StructureContributors = () => {
    const { loading, isAuthenticated, authFetch } = useUser();

    const [openPopup, setOpenPopup] = useState(false);

    const [osTagsContributor, setOsTagsContributor] = useState({
        os_tag1: [],
        os_tag2: [],
        os_tag3: [],
    });

    const [selectedTags, setSelectedTags] = useState({
        Tag1: [],
        Tag2: [],
        Tag3: [],
    });

    const [contributors, setContributors] = useState([]);

    const fetchTags = async () => {
        try {
            const res = await fetch(`${API_URL}/os_tags/tag_contributors`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.error || "Erreur lors du chargement des tags");
            }

            setOsTagsContributor({
                os_tag1: data?.os_tag1 ?? [],
                os_tag2: data?.os_tag2 ?? [],
                os_tag3: data?.os_tag3 ?? [],
            });
        } catch (e) {
            console.error(e);
            showToast.error("Impossible de charger les listes de rôles/statuts");
        }
    };

    const fetchContributors = async () => {
        try {
            const res = await authFetch(`${API_URL}/contributors`, {
                method: "GET",
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.error || "Erreur lors du chargement des contributeurs");
            }

            setContributors(data ?? []);
        } catch (e) {
            console.error(e);
            showToast.error("Impossible de charger la liste des contributeurs");
        }
    };

    useEffect(() => {
        fetchTags();
    }, []);

    useEffect(() => {
        if (loading) return;
        if (!isAuthenticated) return;

        fetchContributors();
    }, [loading, isAuthenticated]);

    const handleInviteContrib = async (e, event) => {
        e.preventDefault();

        const form = e.currentTarget;
        if (
            selectedTags.Tag1.length === 0 ||
            selectedTags.Tag2.length === 0 ||
            selectedTags.Tag3.length === 0
        ) {
            showToast.error("Veuillez sélectionner au moins une valeur par catégorie.");
            return;
        }

        if (loading || !isAuthenticated) {
            showToast.error("Session expirée. Veuillez vous reconnecter.");
            return;
        }

        const payload = {
            first_name: form.first_name.value,
            last_name: form.last_name.value,
            email: form.email.value,
            contrib_name: form.name.value,

            Tag1: selectedTags.Tag1,
            Tag2: selectedTags.Tag2,
            Tag3: selectedTags.Tag3,
        };

        try {
            const res = await authFetch(`${API_URL}/users/contributor`, {
                method: "POST",
                body: JSON.stringify(payload),
            });

            const text = await res.text();

            let data;

            try {
                data = text ? JSON.parse(text) : {};
            } catch {
                console.error("Réponse non JSON:", text);
                throw new Error("Le serveur a renvoyé une réponse invalide");
            }

            if (!res.ok) {
                throw new Error(data?.error || "Erreur lors de l’invitation");
            }

            showToast.success("Invitation envoyée avec succès !");

            await fetchContributors();

            setOpenPopup(false);
            form.reset();

            setSelectedTags({
                Tag1: [],
                Tag2: [],
                Tag3: [],
            });
        } catch (e) {
            console.error(e);
            showToast.error(`Erreur : ${e.message}`);
        }
    };

    const getRoleLabel = (contributor) => {
        const tag1 = contributor?.tags?.Tag1 ?? [];

        if (tag1.length > 1) {
            return "Multi-rôle";
        }

        if (tag1.length === 1) {
            return tag1[0]?.lang_fr;
        }

        return "-";
    };

    return (
        <div className={style["structure-layout"]}>
            <Popup
                open={openPopup}
                title="Nouvel intervenant"
                onClose={() => setOpenPopup(false)}
            >
                <form className={stylePopup.form} onSubmit={handleInviteContrib}>
                    <div className={stylePopup.row}>
                        <div className={stylePopup.field}>
                            <label>
                                Nom<span>*</span>
                            </label>
                            <input className="inputs" name="last_name" required />
                        </div>

                        <div className={stylePopup.field}>
                            <label>
                                Prénom<span>*</span>
                            </label>
                            <input className="inputs" name="first_name" required />
                        </div>
                    </div>

                    <div className={stylePopup.row}>
                        <div className={stylePopup.field}>
                            <label>
                                Mail<span>*</span>
                            </label>
                            <input className="inputs" name="email" type="email" required />
                        </div>

                        <div className={stylePopup.field}>
                            <label>
                                Société<span>*</span>
                            </label>
                            <input className="inputs" name="name" required />
                        </div>
                    </div>

                    <div className={stylePopup.row}>
                        <div className={stylePopup.field}>
                            <Multiselect
                                label="Rôle"
                                required
                                options={osTagsContributor.os_tag1}
                                value={selectedTags.Tag1}
                                onChange={(value) =>
                                    setSelectedTags((prev) => ({
                                        ...prev,
                                        Tag1: value,
                                    }))
                                }
                                placeholder="Sélectionner un rôle"
                            />
                        </div>

                        <div className={stylePopup.field}>
                            <Multiselect
                                label="Statut"
                                required
                                options={osTagsContributor.os_tag2}
                                value={selectedTags.Tag2}
                                onChange={(value) =>
                                    setSelectedTags((prev) => ({
                                        ...prev,
                                        Tag2: value,
                                    }))
                                }
                                placeholder="Sélectionner un statut"
                            />
                        </div>

                        <div className={stylePopup.field}>
                            <Multiselect
                                label="Situation"
                                required
                                options={osTagsContributor.os_tag3}
                                value={selectedTags.Tag3}
                                onChange={(value) =>
                                    setSelectedTags((prev) => ({
                                        ...prev,
                                        Tag3: value,
                                    }))
                                }
                                placeholder="Sélectionner une situation"
                            />
                        </div>
                    </div>

                    <button
                        id="inviteContribBtn"
                        type="submit"
                        className={`${stylePopup.submitBtn} buttons-primary`} onClick={() => avoidDoubleClicks("inviteContribBtn")}
                    >
                        Inviter
                    </button>
                </form>
            </Popup>

            <div className={style["structure-main"]}>
                <div className={style["structure-content"]}>
                    <h2>Intervenants</h2>

                    <div className={style.headerRow}>
                        <div className="headerActions">
                            <div className="tabs">
                                <div className="tab tabActive">
                                    <p>
                                        Inscrit <span>({contributors.length})</span>
                                    </p>
                                </div>
                                <div className="tab">
                                    <p>
                                        Invitation <span>(0)</span>
                                    </p>
                                </div>
                            </div>

                            <div className={style.tools}>
                                <FilterContributors />

                                <button
                                    className="buttons-primary-reversed"
                                    onClick={() => setOpenPopup(true)}
                                >
                                    <FiPlusCircle className="buttons-icon" /> Nouvel intervenant
                                </button>
                            </div>
                        </div>
                    </div>

                    <table className={style["contributors-table"]}>
                        <thead>
                            <tr>
                                <th className="th-first th-150">Intervenant</th>
                                <th className="th-150">Société</th>
                                <th className="th-150">Email</th>
                                <th className="th-100">Rôle</th>
                                <th className="th-100">Dernière connexion</th>
                                <th className="th-150">Programmes</th>
                                <th className="th-last th-100">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {contributors.map((contributor) => (
                                <tr key={contributor.id}>
                                    <td className={style.colContributor}>
                                        <div className={style.avatarWrap}>
                                            <Image
                                                src={contributor.user_details?.photo_url || "/woman.png"}
                                                alt={contributor.name || "Intervenant"}
                                                width={40}
                                                height={40}
                                                className={style.avatar}
                                            />

                                            <div className={style.nameWrap}>
                                                <div className={style.name}>
                                                    {contributor.user_details?.first_name}{" "}
                                                    {contributor.user_details?.last_name}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td>{contributor.name || "-"}</td>

                                    <td className={style.emailCell}>
                                        {contributor.email || contributor.user?.email || "-"}
                                    </td>

                                    <td>
                                        <span className={style.roleBadge}>
                                            {getRoleLabel(contributor)}
                                        </span>
                                    </td>

                                    <td>
                                        {formatDate(contributor.user_details?.last_connect)}
                                    </td>

                                    <td className={style.programs}>
                                        {contributor.programs || "0 programme"}
                                    </td>

                                    <td className={style.actions}>
                                        <EyesIcon />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StructureContributors;