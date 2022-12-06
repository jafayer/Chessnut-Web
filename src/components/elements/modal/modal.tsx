import { useContext, ReactNode, MouseEventHandler } from "react";
import { ThemeContext } from "../../../App";
import { Modal } from "antd";

interface ModalProps {
  children: ReactNode,
  open: boolean,
  onCancel?: MouseEventHandler,
  footer?: ReactNode,
  wrapClassName?: string,
}
export default function CustomModal({ children, open, onCancel, footer, wrapClassName}: ModalProps) {
  const theme = useContext(ThemeContext);
  return (
    <Modal
      bodyStyle={{ backgroundColor: theme === "light" ? "unset" : "black" }}
      open={open}
      onCancel={onCancel}
      footer={footer}
      wrapClassName={wrapClassName}
    >
      {children}
    </Modal>
  );
}
