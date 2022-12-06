import { useState, createContext, useContext } from "react";
import "./App.scss";
import { ChessNut, connect } from "./resources/utils/chessnut";
import ChessBoard from "./components/chessboard";
import Connect from "./components/connect/connect";
import Settings from "./components/settings/settings";

export const ThemeContext = createContext("light");

function App() {
  const [theme, setTheme] = useState("light");
  const [board, setBoard] = useState<ChessNut | null>(null);
  const [boardState, setBoardState] = useState<Object | null>(null);

  return (
    <ThemeContext.Provider value={theme}>
      <div className={"App"} data-theme={theme}>
        <Settings setTheme={setTheme} />
        {connectOrMainScreen()}
      </div>
    </ThemeContext.Provider>
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

  function connectOrMainScreen() {
    if(!board) {
      return <Connect handler={() => {connect(setBoard, setBoardState)}} />
    } else {
      return <ChessBoard position={boardState} playGame={() => {playGame(board)}} playing={board?.playing} reset={() => {reset(board)}} />
    }
  }
}

export default App;
