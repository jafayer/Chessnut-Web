import { useContext } from "react";
import { BoardContext } from "../../../../App";
import { useAppSelector, useAppDispatch } from "../../../../redux/hooks";
import Button from "../../../elements/button/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUndo, faFlag, faX } from "@fortawesome/free-solid-svg-icons";

type GameControlButtonsProps = {
  setGameSelectorOpen: CallableFunction;
};

export default function GameControlButtons({
  setGameSelectorOpen,
}: GameControlButtonsProps) {
  const board = useContext(BoardContext);
  if(!board) { // should always be false
    return null;
  }
  const dispatch = useAppDispatch();
  const playing = useAppSelector((state) => state.gameMetadata.playing);

  if (!playing) {
    return (
      <Button
        props={{ block: true }}
        onClick={() => {
          setGameSelectorOpen();
        }}
      >
        Start Game
      </Button>
    );
  } else {
    return (
      <div style={{ display: "flex", justifyContent: "space-evenly" }}>
        <Button
          onClick={undoMove}
          icon={<FontAwesomeIcon style={{ paddingRight: 5 }} icon={faUndo} />}
        >
          Undo
        </Button>
        <Button
          icon={<FontAwesomeIcon style={{ paddingRight: 5 }} icon={faFlag} />}
        >
          Resign
        </Button>
        <Button
          icon={<FontAwesomeIcon style={{ paddingRight: 5 }} icon={faX} />}
        >
          Abort
        </Button>
      </div>
    );
  }

  function undoMove() {
    // undo should:
    //   1. add the most recent move to a list of exclusions
    //   2. undo the move
    //   3. Once board state and game state are identical, reset excluded moves
    board?.undoMove();
  }
}
