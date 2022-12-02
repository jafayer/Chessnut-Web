import { useState, useEffect } from "react";
import Chess from "chess.js";
//@ts-ignore
import Chessboard from "chessboardjsx"

type props = {
  position: Object | null,
  playGame: CallableFunction,
  reset: CallableFunction,
  playing: boolean,
};

export default function ChessBoard({ position, playing, playGame, reset }: props) {
  console.log({position});
  return (
    <div className="board">
      {/* because React-Chessboard's type signature is wrong */}
      {/* @ts-ignore */}
      <Chessboard position={position} arePiecesDraggable={false} />
      {playing === false && <button onClick={() => {playGame()}}>Start Game!</button> }
      {playing && <button onClick={() => {reset()}}>Reset</button>}
    </div>
  );
}
