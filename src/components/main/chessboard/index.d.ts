declare module "react-chessground" {
  import React from "react";
  interface ReactChessGroundProps {
    fen: string;
    onMove?: (from: string, to: string) => void;
    randomMove?: (moves: string[], move: string) => void;
    promotion?: (e: string) => void;
    reset?: () => void;
    undo?: () => void;
    coordinates: boolean;
    orientation: "white" | "black";
    draggable?: {
      enabled?: boolean;
    };
    viewOnly?: boolean;
    disableContextMenu?: boolean;
    movable?: {
      free?: boolean;
      showDests?: boolean;
    };
    highlight?: {
      lastMove?: boolean;
      check?: boolean;
    };
    animation?: {
      enabled?: boolean;
      duration?: number;
    };
  }

  declare class Chessground extends React.Component<
    ReactChessGroundProps,
    any
  > {}
  export default Chessground;
}
