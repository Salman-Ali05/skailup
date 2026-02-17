import Image from "next/image";
import style from "./ListUsers.module.css";

const ListUsers = ({ users, projects }) => {
    const max = 3;
    const extra = users.length - max;

    return (
        <div className={style["user-stack"]}>
            {users.slice(0, max).map((user, i) => (
                <Image
                    key={i}
                    src="/logoproj.jpg"
                    alt={user}
                    width={28}
                    height={28}
                    className={style["user-avatar"]}
                    style={{ zIndex: max - i }}
                />
            ))}
            {users.length === 1 && (
                <span className={style["extra-user"]}>
                    {users[0].firstName} {users[0].lastName}
                </span>
            )}
            {extra > 1 && (
                <span className={style["extra-count"]}>
                    +{extra}
                </span>
            )}
        </div>
    );
};

export default ListUsers;