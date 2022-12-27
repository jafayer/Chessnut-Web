import { ReactNode, MouseEventHandler } from "react";
import { Modal } from "antd";
import { useAppSelector } from "../../../redux/hooks";

interface ModalProps {
  children: ReactNode,
  open: boolean,
  onCancel?: MouseEventHandler,
  footer?: ReactNode,
  wrapClassName?: string,
}
export default function CustomModal({ children, open, onCancel, footer, wrapClassName}: ModalProps) {
  const theme = useAppSelector((state) => state.theme.theme);
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
