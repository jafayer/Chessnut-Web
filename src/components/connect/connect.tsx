import { useContext } from "react";
import { ThemeContext } from "../../App";
import Button from '../elements/button/button';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChessKnight } from "@fortawesome/free-solid-svg-icons";
import { ConnectInterface } from "./connect.interface";

export default function Connect({ handler }: ConnectInterface) {
    const theme = useContext(ThemeContext)
  return (
    <div
      style={{
        width: "100%",
        height: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Button
        onClick={handler}
      >
        Connect to ChessNut Board
      </Button>
    </div>
  );
}
