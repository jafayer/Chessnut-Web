import { MouseEventHandler, useState, useContext } from "react";
import { BoardContext } from "../../../../App";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { setOrientation, setPlaying} from "../../../../redux/features/gameMetadataSlice";
import { Modal, Slider } from "antd";
import Button from "../../../elements/button/button";

type GameControlPanelProps = {
  isOpen: boolean;
  setClosed: CallableFunction;
};

type buttonSelections = "white" | "black" | "random";

export default function GameControlPanel({
  isOpen,
  setClosed,
}: GameControlPanelProps) {
  const board = useContext(BoardContext);
  if(!board) { // should always be false
    return null;
  }
  const dispatch = useAppDispatch();
  const [side, setSide] = useState<buttonSelections | undefined>(undefined);

  const playGame = () => {
    dispatch(setPlaying(true));
    board.startGame();
  }

  return (
    <Modal
      open={isOpen}
      onCancel={() => setClosed()}
      onOk={() => {
        if (side === undefined) {
          return alert("Fill everything out!");
        }
        handleOk();
      }}
    >
      <h1>Start Game</h1>
      <div>
        <h2>Choose side</h2>
        {makeButton("white")}
        {makeButton("random")}
        {makeButton("black")}
      </div>
    </Modal>
  );

  function makeButton(color: buttonSelections) {
    return (
      <Button
        type={side === color ? "primary" : "default"}
        onClick={() => setSide(color)}
      >
        {color[0].toUpperCase() + color.slice(1)}
      </Button>
    );
  }

  function handleOk() {
    const resultingOrientation =
      side === "white" || side === "black"
        ? side
        : getRandomOrientation()
    
    dispatch(setOrientation(resultingOrientation));
    playGame();
    setClosed();
  }
}


function getRandomOrientation(): "white"|"black" {
    const randNumber = Math.round(Math.random())
    if(randNumber) {
        return "white";
    } else {
        return "black";
    }
}