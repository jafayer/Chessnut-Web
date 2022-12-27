import { useState } from "react";
import "./App.scss";
import { ChessNut, connect } from "./resources/utils/chessnut";
import ChessBoard from "./components/chessboard";
import Connect from "./components/connect/connect";
import Settings from "./components/settings/settings";
import { Main } from "./components/main/main";
import Header from "./components/header/header";
import {MODE} from "./config";
import { useAppSelector } from "./redux/hooks";
import { setTheme } from "./redux/features/themeSlice";


function App() {
  const theme = useAppSelector(state => state.theme.theme);

  const [board, setBoard] = useState<ChessNut | null>(null);
  const [fen, setFen] = useState<string | null>(null);
  const [pgn, setPgn] = useState<string | null>(null);
  const [playing, setPlaying] = useState<boolean>(false);

  // @ts-ignore
  if(MODE === "development") {
    //@ts-ignore
    window.board = board;
  }

  return (
      <div className={"App"} data-theme={theme}>
        <Header setTheme={setTheme} />
        {connectOrMainScreen()}
      </div>
  );

  function playGame(boardClass: typeof board) {
    if(!boardClass) {
      return;
    }

    boardClass.startGame();
  }

  function reset(boardClass: typeof board) {
    if(!boardClass) {
      return
    }

    boardClass.reset();
  }

  function connectOrMainScreen() {
    if(!board) {
      return <Connect handler={() => {connect(setBoard, setFen, setPlaying, setPgn)}} />
    } else {
      return <Main orientation={"white"} fen={fen} playGame={() => {playGame(board)}} playing={playing} reset={() => {reset(board)}} pgn={pgn} />
    }
  }
}

export default App;
