"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Multiselect.module.css";

export default function Multiselect({
    label,
    required = false,
    options = [],
    value = [],
    onChange,
    placeholder = "Sélectionner",
}) {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleValue = (id) => {
        if (value.includes(id)) {
            onChange(value.filter((v) => v !== id));
        } else {
            onChange([...value, id]);
        }
    };

    const selectedLabels = options
        .filter((option) => value.includes(option.id))
        .map((option) => option.lang_fr);

    const selectedCount = value.length;

    return (
        <div className={styles.wrapper} ref={wrapperRef}>
            <label className={styles.label}>
                {label}
                {required && <span>*</span>}
            </label>

            <button
                type="button"
                className={styles.trigger}
                onClick={() => setOpen((prev) => !prev)}
            >
                <span className={selectedLabels.length ? styles.selectedText : styles.placeholder}>
                    {selectedLabels.length > 0
                        ? selectedLabels.join(", ")
                        : placeholder}
                </span>

                <span className={styles.rightSide}>
                    {selectedCount > 0 && (
                        <span className={styles.countBadge}>{selectedCount}</span>
                    )}
                    <span className={styles.chevron}>▾</span>
                </span>
            </button>

            {open && (
                <div className={styles.dropdown}>
                    {options.length === 0 ? (
                        <div className={styles.empty}>Aucune option</div>
                    ) : (
                        options.map((option) => (
                            <label key={option.id} className={styles.option}>
                                <input
                                    type="checkbox"
                                    checked={value.includes(option.id)}
                                    onChange={() => toggleValue(option.id)}
                                />
                                <span>{option.lang_fr}</span>
                            </label>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}