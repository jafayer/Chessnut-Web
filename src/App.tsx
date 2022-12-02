import { useState } from "react";
import "./App.css";
import { ChessNut, connect } from "./resources/utils/chessnut";
import ChessBoard from "./components/chessboard";

function App() {
  const [board, setBoard] = useState<ChessNut | null>(null);
  const [boardState, setBoardState] = useState<Object | null>(null);

  if (board) {
    console.log(boardState);
  }

  return (
    <div className="App">
      {!board && (
        <button
          onClick={() => {
            connect(setBoard, setBoardState);
          }}
        >
          Connect to ChessNut board
        </button>
      )}
      {board && <ChessBoard position={boardState} playGame={() => {playGame(board)}} playing={board?.playing} reset={() => {reset(board)}} />}
    </div>
  );

  function playGame(boardClass: typeof board) {
    if(!boardClass) {
      return;
    }

    boardClass.startGame();
  }

  function reset(boardClass: typeof board) {
    console.log("TEST")
    if(!boardClass) {
      console.log
      return
    }

    boardClass.reset();
  }
}

export default App;
