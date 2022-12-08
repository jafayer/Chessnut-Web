import {useState, useContext} from "react";
import { ThemeContext } from "../../App";
import {Modal, Select} from "antd";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { blue } from '@ant-design/colors';
import styles from "./settings.module.scss";
interface SettingsProps {
    setTheme: CallableFunction
}
export default function Settings({setTheme}:SettingsProps) {
    const theme = useContext(ThemeContext);
    const [open, setOpen] = useState(false);
    const handleOpen = () => {setOpen(true)};
    const handleClose = () => {setOpen(false)};
    return <div>
        <FontAwesomeIcon style={{zIndex: 999}} className={styles["cog"]} icon={faCog} color={theme === "light" ? blue[5] : blue[6]} onClick={handleOpen} />
        <Modal open={open} onCancel={handleClose} footer={null}>
            <h1>Settings</h1>
            <div>
                <h2>Theme</h2>
                <Select style={{ width: 120 }} onChange={(e) => {setTheme(e)}} value={theme} options={[
                    {
                        value: "light",
                        label: "Light Mode",
                    },
                    {
                        value: "dark",
                        label: "Dark Mode",
                    },

                ]}>

                </Select>
            </div>
        </Modal>
    </div>
}
