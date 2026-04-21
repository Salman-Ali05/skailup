import ProfileInfo from "../../components/profile_info/profile_info";
import style from "./personal_info.module.css";
import AppName from "../../components/AppName";

export default function Page() {
    return (
        <>
            <div className={style.fieldRow}>
                <div className={style.fieldGroup}>
                    <div className={style["app-name-form"]}>
                        <h1>Bienvenue sur SkailUp</h1>
                        <div className={style["app-name-bottomed"]} >
                            <AppName style={{ color: '#FFFFFF' }} size={52} logo={"../../skailup_logo_only.png"} />
                        </div>
                    </div>
                </div>

                <div className={style.fieldGroup}>
                    <div className={style["structure-layout"]}>
                        <div className={style["structure-main"]}>
                            <div className={style["structure-content"]}>
                                <ProfileInfo />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
