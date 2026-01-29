import styles from "./Profile.module.css";

export default function ProfileLayout({ children }) {
    return (
        <div className={styles.profileWrapper}>
            <div className={styles.headerSection}>
                <h2 className={styles.title}>Données du profil</h2>
                <div className={styles.shuffler}>
                    <button className="buttons-primary">Profil</button>
                    <button className="buttons-unselected">Entreprise</button>
                </div>
            </div>

            {children}
        </div>
    );
}
