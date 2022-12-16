import { MouseEventHandler, ReactNode, useContext } from "react";
import { ThemeContext } from "../../../App";
import { Button } from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";
import { ButtonType } from "antd/es/button";

interface ButtonProps {
  children: ReactNode;
  size?: SizeType;
  props?: object;
  icon?: ReactNode;
  type?: ButtonType;
  onClick?: MouseEventHandler;
}

export default function DefaultButton({
  size,
  props,
  children,
  icon,
  type,
  onClick,
}: ButtonProps) {
  const theme = useContext(ThemeContext);

  return (
    <Button
      type={type ? type : "primary"}
      ghost={theme === "dark"}
      icon={icon ? icon : null}
      size={size ? size : "large"}
      onClick={onClick}
      style={{
        margin: 5
      }}
      {...props}
    >
      {children}
    </Button>
  );

  function getButtonType() {
    return theme === "light" ? "primary" : "ghost";
  }
}
