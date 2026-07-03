import styles from "./NoItem.module.css";

const NoItem = ({ message, subMessage, icon }) => {
    return (
        <div className={styles.noItem}>
            {icon && <div className={styles.icon}>{icon}</div>}
            <div className={styles.message}>{message}</div>
            {subMessage && <div className={styles.subMessage}>{subMessage}</div>}
        </div>
    );
}

export default NoItem;