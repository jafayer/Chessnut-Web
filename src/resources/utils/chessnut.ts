import { piece } from "./helpers/helpers";
import * as chess from "chess.js";
import { State } from "./gameState";
import { BoardEmulator } from "./helpers/BoardEmulator";
import {MODE} from "../../config";
import { store } from "../../redux/store";

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
  setPlaying: CallableFunction,
  setPgn: CallableFunction,
  routeUpdate: CallableFunction,
) {
  if(MODE === "development") {
    const board = new ChessNut(new BoardEmulator(), setPlaying, setPgn, routeUpdate);
    board.device.open();
    board.device.sendReport(0x21, new Uint8Array([0x01, 0x00]));
    return callback(board);
  }

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
      const board = new ChessNut(device, setPlaying, setPgn, routeUpdate);
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
  state: State;
  ledCoolDown: number;
  playing: boolean;
  setPlaying: CallableFunction;
  setPgn: CallableFunction;
  routeUpdate: CallableFunction;

  constructor(device: any, setPlaying: CallableFunction, setPgn: CallableFunction, routeUpdate: CallableFunction) {
    // I don't think there's a good HID typings that exists?
    this.device = device;
    this.ledCoolDown = 0;
    // initialize empty board state
    this.state = new State([])
    this.playing = false;
    this.setPlaying = setPlaying;
    this.setPgn = setPgn;
    this.routeUpdate = routeUpdate;
    device.addEventListener("inputreport", (event: any) => {
      const { data, reportId } = event;
      const { productId } = event.device;
      if (reportId === 1 && (productId === 0x8001 || productId === 0x8002)) {
        this.setBoardState(new Uint8Array(data.buffer).slice(1, 33));
      }
    });
    this.routeUpdate({
      type: "fen",
      data: {
        fen: this.state.getFEN(),
      },
    });
  }

  setLights(lights: Array<chess.Square>) {
    const board = [0,0,0,0,0,0,0,0];
    const now = new Date().getTime();
    if (now - this.ledCoolDown < 500) {
      return;
    }
    
    lights.forEach((light) => {
      const file = 7 - files.indexOf(light.slice(0, 1));
      const rank = 7 - (parseInt(light.slice(-1)) - 1);
      board[rank] += 2**file;
    });
    this.ledCoolDown = now;
    this.device.sendReport(0x0a, new Uint8Array([0x08, ...board]));
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

   
    if(this.playing) {
      if(this.state.chess.isGameOver()) {
        // kind of a silly way to check winner but oh well
        const winningSide = this.state.chess.turn() === chess.WHITE ? chess.BLACK : chess.WHITE;
        this.setLights(this.state.getWinningSidePieces(winningSide));
      } else {
        const squaresToIlluminate = this.state.getMovedSquares(incomingState);
        this.setLights(squaresToIlluminate);
      }
    }

    // Don't push an update to react if the board state is identical
    // to previous state
    if (incomingState.isEq(this.state)) {
        return;
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
        this.routeUpdate({
          type: "fen",
          data: {
            fen: this.state.getFEN(),
            pgn: this.state.chess.pgn(),
          },
        })
    } else {
        // replace entire state with incomingState
        this.state.updateFromState(incomingState);
        this.routeUpdate({
          type: "fen",
          data: {
            fen: this.state.getFEN(),
          },
        })
    }
  }

  startGame() {
    this.boop(880, 100);
    this.playing = true;
    this.setPlaying(true);
    this.state.reset();
    this.routeUpdate({
      type: "fen",
      data: {
        fen: this.state.getFEN(),
      },
    })
  }

  reset() {
    this.setLights([]);
    this.startGame();
  }

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
