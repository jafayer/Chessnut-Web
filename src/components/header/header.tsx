import {useContext} from "react";
import { ThemeContext } from "../../App";
import Settings from "../settings/settings";
import styles from "./header.module.scss";

interface HeaderProps {
    setTheme: CallableFunction
}
export default function Header({setTheme}:HeaderProps) {
    const theme = useContext(ThemeContext);
    return <header className={styles["header"]}>
        <h1 className={styles["h1"]}>ChessNut Web Client</h1>
        <Settings setTheme={setTheme}/>
    </header>
}