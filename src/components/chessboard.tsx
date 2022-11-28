import { useState } from "react";
import Chess from "chess.js";
import { Chessboard } from "react-chessboard";

type props = {
  position: Object | null;
};

export default function ChessBoard({ position }: props) {
  return (
    <div className="board">
      {/* because React-Chessboard's type signature is wrong */}
      {/* @ts-ignore */}
      <Chessboard position={position} arePiecesDraggable={false} />
    </div>
  );
}
