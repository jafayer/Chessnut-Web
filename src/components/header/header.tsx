import { useAppSelector } from "../../redux/hooks";
import Settings from "../settings/settings";
import styles from "./header.module.scss";

interface HeaderProps {
    setTheme: CallableFunction
}
export default function Header({setTheme}:HeaderProps) {
    const theme = useAppSelector((state) => state.theme.theme);
    return <header className={styles["header"]}>
        <h1 className={styles["h1"]}>ChessNut Web Client</h1>
        <Settings setTheme={setTheme}/>
    </header>
}