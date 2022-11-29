import { useState } from "react";
import Chess from "chess.js";
import { Chessboard } from "react-chessboard";

type props = {
  position: Object | null,
  playGame: CallableFunction,
  playing: boolean,
};

export default function ChessBoard({ position, playing, playGame }: props) {
  console.log({position});
  return (
    <div className="board">
      {/* because React-Chessboard's type signature is wrong */}
      {/* @ts-ignore */}
      <Chessboard position={position} arePiecesDraggable={false} />
      {playing !== undefined && playing !== null && !playing && <button onClick={() => {playGame()}}>Start Game!</button> }
    </div>
  );
}
