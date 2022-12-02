import { convertCJSToCB, pieceData, convertPieceToDB, indexToSquareCoords, getSquare, makeFen, square, piece } from "./helpers/helpers";
import * as chess from "chess.js";
import { State } from "./gameState";

const files = "abcdefgh";
const chessPieceMap: {[key:string]: piece }= {
  0: "",
  7: "P",
  9: "B",
  10: "N",
  6: "R",
  11: "Q",
  12: "K",
  4: "p",
  3: "b",
  5: "n",
  8: "r",
  1: "q",
  2: "k",
};

export async function connect(
  callback: CallableFunction,
  setBoardStateCB: CallableFunction
) {
  try {
    // @ts-ignore
    // because HID doesn't belong to navigator 😮‍💨
    const [device] = await window.navigator.hid.requestDevice({
      filters: [
        { vendorId: 0x2d80, productId: 0x8001 },
        { vendorId: 0x2d80, productId: 0x8002 },
      ],
    });

    if (device) {
      const board = new ChessNut(device, setBoardStateCB);
      await board.device.open();
      await board.device.sendReport(0x21, new Uint8Array([0x01, 0x00]));
      board.boop(560, 100);
      board.setLights([]);
      callback(board);
    } else {
      //
    }
  } catch (e) {
    callback(null);
  }
}

export class ChessNut {
  // Need these declared up top to stop typescript from complaining
  device;
  lights;
  state: State;
  boardStateCallback: CallableFunction;
  ledCoolDown: number;
  playing: boolean;

  constructor(device: any, setBoardState: CallableFunction) {
    // I don't think there's a good HID typings that exists?
    this.device = device;
    this.boardStateCallback = setBoardState;
    this.ledCoolDown = 0;
    // initialize empty board state
    this.state = new State([...Array(64).keys()].map(i => ""))
    this.playing = false;
    device.addEventListener("inputreport", (event: any) => {
      const { data, reportId } = event;
      const { productId } = event.device;
      if (reportId === 1 && (productId === 0x8001 || productId === 0x8002)) {
        this.setBoardState(new Uint8Array(data.buffer).slice(1, 33));
      }
    });
    this.lights = [];
    for (let rank = 1; rank <= 8; rank++) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.lights.push({ [file + rank]: 0 });
      }
    }
  }

  setLights(lights: Array<square>) {
    const now = new Date().getTime();
    if (now - this.ledCoolDown < 500) {
      return;
    }
    const board = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ];
    lights.forEach((light) => {
      const file = files.indexOf((light.coords).slice(0, 1));
      const row = 7 - (parseInt((light.coords).slice(1, 2)) - 1);
      board[row][file] = 1;
    });

    const binaries = board.map((row, index) => {
      let led = 0;
      row.forEach((square) => {
        if (square === 1) {
          led += 1 << index;
        }
      });
      return led;
    });

    this.ledCoolDown = now;
    this.device.sendReport(0x0a, new Uint8Array([0x08, ...binaries]));
  }

  boop(freq: number, duration: number) {
    const freqBytes = this.convertToBytes(freq, 2);
    const durationBytes = this.convertToBytes(duration, 2);
    this.device.sendReport(
      0x0b,
      new Uint8Array([0x04, ...freqBytes, ...durationBytes])
    );
  }

  setBoardState(boardState: Uint8Array) {
    // convert 32 bytes to 64 nibbles
    const nibbles = this.extractNibbles(boardState);
    // map each nibble to the appropriate piece
    const pieces: Array<piece> = nibbles.map((code: number) => {
      if (chessPieceMap.hasOwnProperty(code)) {
        return chessPieceMap[code as keyof typeof chessPieceMap];
      } else {
        throw "Unexpected piece code in board input" + code;
      }
    });

    // create internal stateful representation of boardState
    // pass in a1..h8
    const incomingState = new State(pieces.reverse());

    // Don't push an update to react if the board state is identical
    // to previous state
    if (incomingState.isEq(this.state)) {
        // return;
    }

    if(this.playing) {
        // check that some move from this.state
        // could result in incomingState
        const possibleMove = this.state.possibleMove(incomingState);
        if(possibleMove) {
            this.state.chess.move(possibleMove);
            if(this.state.chess.inCheck()) {
                this.boop(440, 100);
            }
        } else {
            // position is different, but there is no valid move on board.
            // Illuminate all squares that aren't consistent with
            // previousBoardState FEN
            
        }
        this.boardStateCallback(this.state.getFEN());
    } else {
        // replace entire state with incomingState
        this.state.updateFromState(incomingState);
        this.boardStateCallback(this.state.getFEN());
    }
  }

  startGame() {
    this.boop(880, 100);
    this.playing = true;
    this.state.reset();
  }

  // getMovedSquares(incomingstate: State): Array<square> {
    
  // }

  private extractNibbles(uiarr: Uint8Array): Array<number> {
    const arr = Array.from(uiarr);
    const stuff = arr.map((byte) => {
      return this.convertToNibbles(byte, 2, false);
    });

    return stuff.flat();
  }

  private convertToBase =
    (base: number) =>
    (number: number, minLength: number, bigEndian: boolean = true) => {
      let arr = [];
      while (number > 0) {
        const remainder = number % base;
        number = Math.floor(number / base);

        arr.push(remainder);
      }

      while (arr.length < minLength) {
        arr.push(0);
      }

      if (bigEndian) {
        return arr.reverse();
      } else {
        return arr;
      }
    };

  private convertToBytes = this.convertToBase(256);

  private convertToNibbles = this.convertToBase(16);

  private convertToBinary = this.convertToBase(2);


}
