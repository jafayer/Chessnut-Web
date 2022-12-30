import { useState, createContext, useEffect } from "react";
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
import {setFEN, setPGN} from "./redux/features/positionSlice";
import {EVENTS} from "./resources/utils/events/events";

// This feels a little hacky, but...
// We need to be able to pass events from the client to the chessnut class
// such as play/reset events
// previously, callbacks were passed into the chessnut constructor,
// but this wasn't very scalable as every time a new feature was added
// the chessnut constructor had to be refactored
// by exposing the chessnut instance to the components directly,
// methods can be called straight from the object.
// Using a provider just helps keep trees a little more trim.
export const BoardContext = createContext<ChessNut|null>(null);

function App() {
  const theme = useAppSelector(state => state.theme.theme);
  const dispatch = useAppDispatch();

  const [board, setBoard] = useState<ChessNut | null>(null);

  // @ts-ignore
  if(MODE === "development") {
    //@ts-ignore
    window.board = board;
  }

  return (
      <BoardContext.Provider value={board}>
        <div className={"App"} data-theme={theme}>
          <Header setTheme={setTheme} />
          {connectOrMainScreen()}
        </div>
      </BoardContext.Provider>
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
      return <Connect handler={() => {connect(setBoard, routeUpdate)}} />
    } else {
      return <Main orientation={"white"} playGame={() => {playGame(board)}} reset={() => {reset(board)}} />
    }
  }

  function routeUpdate(update: EVENTS):void {
    switch(update.type) {
      case "fen":
        dispatch(setFEN(update.data));
      case "pgn":
        dispatch(setPGN(update.data));
    }
  }
}

export default App;
