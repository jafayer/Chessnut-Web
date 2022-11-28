const files = "abcdefgh";
const chessPieceMap = {
  0: "",
  7: "wP",
  9: "wB",
  10: "wN",
  6: "wR",
  11: "wQ",
  12: "wK",
  4: "bP",
  3: "bB",
  5: "bN",
  8: "bR",
  1: "bQ",
  2: "bK",
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
      board.device.sendReport(0x21, new Uint8Array([0x01, 0x00]));
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
  previousBoardState: Array<string>;
  boardStateCallback: CallableFunction;
  ledCoolDown: number;

  constructor(device: any, setBoardState: CallableFunction) {
    // I don't think there's a good HID typings that exists?
    this.device = device;
    this.boardStateCallback = setBoardState;
    this.previousBoardState = [];
    this.ledCoolDown = 0;
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
    if(now - this.ledCoolDown < 500) {
        return;
    }
    const board = [
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
    ];
    lights.forEach(light => {
        const file = files.indexOf(light.slice(0,1))
        const row = 7-(parseInt(light.slice(1,2))-1);
        console.log({file, row});
        board[row][file] = 1;
    });

    const binaries = board.map((row, index) => {
        let led = 0;
        row.forEach(square => {
            if(square === 1) {
                led += (1<<index);
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
    // process
    const nibbles = this.extractNibbles(boardState);

    const pieces: Array<string> = nibbles.reverse().map((code: number) => {
      if (chessPieceMap.hasOwnProperty(code)) {
        return chessPieceMap[code as keyof typeof chessPieceMap];
      } else {
        throw "Unexpected piece code in board input" + code;
      }
    });

    const isEq = pieces.every(
      (val, index) => val === this.previousBoardState[index]
    );
    if (isEq) {
      return;
    }
    const processedBoardState = pieces.reduce((prev, square, index) => {
      const rank = Math.floor(index / 8) + 1;
      const file = "abcdefgh"[index % 8];
      return {
        ...prev,
        [file + rank]: square,
      };
    }, {});
    this.boardStateCallback(processedBoardState);
    this.previousBoardState = pieces;
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
