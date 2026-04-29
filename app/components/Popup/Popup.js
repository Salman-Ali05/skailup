"use client";

import CloseIcon from "../Icons/Close";
import styles from "./Popup.module.css";
import stylePopup from "@/app/components/Popup/PopupContent.module.css";

const Popup = ({ open, onClose, children }) => {
    if (!open) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
                <div className={stylePopup.popupHeader}>
                    <h3>Nouveau intervenant</h3>
                    <div onClick={onClose} className={stylePopup.closePopup}>
                        <CloseIcon />
                    </div>
                </div>

                {children}
            </div>
        </div>
    );
};

export default Popup;