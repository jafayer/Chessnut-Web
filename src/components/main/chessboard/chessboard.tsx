import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../../../App";
import { Chess } from "chess.js";
import { Tag } from "antd";
import Chessground from "react-chessground";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChessKnight,
  faTowerBroadcast,
} from "@fortawesome/free-solid-svg-icons";
import "react-chessground/dist/styles/chessground.css";

interface ChessboardProps {
  fen: string;
  pgn?: string | null;
  orientation: "white" | "black";
  playing: boolean;
}
export default function Chessboard({
  fen,
  pgn,
  orientation,
  playing,
}: ChessboardProps) {
  const [chess, setChess] = useState(new Chess());
  const theme = useContext(ThemeContext);
  useEffect(() => {
    if (pgn && pgn != chess.pgn()) {
      chess.loadPgn(pgn);
    }
  }, [pgn]);

  useEffect(() => {
    setBoardSize(Math.floor(window.innerWidth * 0.66));
    window.addEventListener("resize", (e) => {
      // @ts-ignore
      const { innerWidth } = e.target;
      const size = Math.floor(innerWidth * 0.66);
      setBoardSize(size);
    });
  }, []);

  return (
    <div
      className="board-area"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Chessground
        fen={fen}
        orientation={orientation}
        draggable={{ enabled: true }}
        viewOnly={false}
        movable={{ free: false, showDests: true }}
        disableContextMenu={true}
        coordinates={true}
        highlight={{
          lastMove: true,
          check: true,
        }}
        animation={{ enabled: true, duration: 0.5 }}
      />
      <Tag
        style={{ margin: 5 }}
        color={theme === "light" ? "green": "blue"}
        icon={
          <FontAwesomeIcon
            style={{ paddingRight: 10 }}
            icon={playing ? faTowerBroadcast : faChessKnight}
          />
        }
      >
        Showing: {playing ? "game" : "board"}
      </Tag>
    </div>
  );
}

function setBoardSize(size: number) {
  (document.querySelector(".cg-wrap") as HTMLElement).style.width =
    Math.min(500, size) + "px";
  (document.querySelector(".cg-wrap") as HTMLElement).style.height =
    Math.min(500, size) + "px";
  (document.querySelector("cg-container") as HTMLElement).style.width =
    Math.min(500, size) + "px";
  (document.querySelector("cg-container") as HTMLElement).style.height =
    Math.min(500, size) + "px";
}
