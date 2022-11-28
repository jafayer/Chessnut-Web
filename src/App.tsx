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
      {board && (
        <button
          onClick={() => {
            board.boop(220, 1000);
          }}
        >
          Bop it
        </button>
      )}
      {board && (
        <button
          onClick={() => {
            board.setLights(["a1", "b2", "c3", "a8", "f6"]);
            // board.setLights([])
          }}
        >
          Light it
        </button>
      )}
      {board && <ChessBoard position={boardState} />}
    </div>
  );
}

export default App;
