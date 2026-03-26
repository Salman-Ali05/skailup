import styles from "./Profile.module.css";

export default function ProfileLayout({ children }) {
    return (
        <div className={styles.profileWrapper}>
            <div className={styles.headerSection}>
                <div className={styles.shuffler}>
                    <h2 className={styles.title}>Données du profil</h2>
                </div>
            </div>

            {children}
        </div>
    );
}
