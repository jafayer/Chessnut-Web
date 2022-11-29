import { convertCJSToCB, pieceData, convertPieceToDB, indexToSquareCoords, getSquare, square } from "./helpers/helpers";
import * as chess from "chess.js";

const files = "abcdefgh";
const chessPieceMap: {[key:string]:null | pieceData }= {
  0: null,
  7: {
    color: chess.WHITE,
    piece: chess.PAWN,
  },
  9: {
    color: chess.WHITE,
    piece: chess.BISHOP,
  },
  10: {
    color: chess.WHITE,
    piece: chess.KNIGHT,
  },
  6: {
    color: chess.WHITE,
    piece: chess.ROOK,
  },
  11: {
    color: chess.WHITE,
    piece: chess.QUEEN,
  },
  12: {
    color: chess.WHITE,
    piece: chess.KING,
  },
  4: {
    color: chess.BLACK,
    piece: chess.PAWN,
  },
  3: {
    color: chess.BLACK,
    piece: chess.BISHOP,
  },
  5: {
    color: chess.BLACK,
    piece: chess.KNIGHT,
  },
  8: {
    color: chess.BLACK,
    piece: chess.ROOK,
  },
  1: {
    color: chess.BLACK,
    piece: chess.QUEEN,
  },
  2: {
    color: chess.BLACK,
    piece: chess.KING,
  },
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
  previousBoardState: Array<Array<square>>;
  boardStateCallback: CallableFunction;
  ledCoolDown: number;
  chess: chess.Chess;
  playing: boolean;

  constructor(device: any, setBoardState: CallableFunction) {
    // I don't think there's a good HID typings that exists?
    this.device = device;
    this.boardStateCallback = setBoardState;
    this.previousBoardState = [];
    this.ledCoolDown = 0;
    this.chess = new chess.Chess();
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

  setLights(lights: Array<string>) {
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
      const file = files.indexOf(light.slice(0, 1));
      const row = 7 - (parseInt(light.slice(1, 2)) - 1);
      console.log({ file, row });
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
    // h8...a1
    const nibbles = this.extractNibbles(boardState);
    // map each nibble to the appropriate piece
    const pieces: Array<pieceData|null> = nibbles.reverse().map((code: number) => {
      if (chessPieceMap.hasOwnProperty(code)) {
        return chessPieceMap[code as keyof typeof chessPieceMap];
      } else {
        throw "Unexpected piece code in board input" + code;
      }
    });

    // Don't push an update to react if the board state is identical
    // to previous state
    const flattenedPrev = this.previousBoardState.flat();
    const isEq = pieces.every((val, index) => {
        const prev = flattenedPrev[index];
        // if null, will be null, otherwise, will convert square to string
        // which can be compared
        return convertPieceToDB(val) === convertPieceToDB(prev?.pieceInfo);
    });
    if (isEq) {
      return;
    }

    // Add square names to data
    const squares: Array<square> = pieces.map((piece, index) => {
        return {
            coords: indexToSquareCoords(index),
            pieceInfo: piece,
        };
    });
    // split data into 8x8 nested array
    const board: Array<Array<square>> = [];
    for(let i = 0; i < 8; i++) {
        const rank: Array<square> = squares.slice(i*8, (i*8) + 8);
        board.push(rank);
    }
    // ^ final internal representation

    const processedBoardState = squares.reduce((prev, square, index) => {
      const rank: number = Math.floor(index / 8) + 1;
      const file = "abcdefgh"[index % 8];
      return {
        ...prev,
        [file + rank]: convertPieceToDB(square.pieceInfo),
      };
    }, {});

    if(this.playing) {
        // get all possible moves
        const possibleMoves = this.chess.moves({verbose: true});
        // for every possible move,
        // check if that piece is on the correct square
        // @ts-ignore
        const validMove = possibleMoves.find((move: chess.Move) => {
            const square = getSquare(move.to, board);
            const movePieceData: pieceData = {
                piece: move.piece,
                color: move.color,
            }
            return convertPieceToDB(movePieceData) === convertPieceToDB(square.pieceInfo);
        });

        if(validMove) {
            this.chess.move(validMove);
        } else {
            return;
        }
    }

    this.boardStateCallback(processedBoardState);
    this.previousBoardState = board;
  }

  startGame() {
    console.log("STARTING GAME");
    this.playing = true;
    this.chess.reset();
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
