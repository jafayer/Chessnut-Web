import { useState } from "react";
import "./App.scss";
import { ChessNut, connect } from "./resources/utils/chessnut";
import ChessBoard from "./components/chessboard";
import Connect from "./components/connect/connect";
import Settings from "./components/settings/settings";
import { Main } from "./components/main/main";
import Header from "./components/header/header";
import {MODE} from "./config";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { setTheme } from "./redux/features/themeSlice";
import {setFEN} from "./redux/features/positionSlice";

function App() {
  const theme = useAppSelector(state => state.theme.theme);
  const dispatch = useAppDispatch();

  const [board, setBoard] = useState<ChessNut | null>(null);
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
      return <Connect handler={() => {connect(setBoard, setPlaying, setPgn, routeUpdate)}} />
    } else {
      return <Main orientation={"white"} playGame={() => {playGame(board)}} playing={playing} reset={() => {reset(board)}} />
    }
  }

  function routeUpdate(update: {type: string, data: any}) {
    console.log({update});
    switch(update.type) {
      case "fen":
        dispatch(setFEN(update.data));
    }
  }
}

export default App;
