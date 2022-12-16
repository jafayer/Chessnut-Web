import { convertCJSSquareToPiece } from "./helpers";

// interface for mocking a board with periodically emitted events and a sendReport function.
// To use, add a .env file and set MODE="development"


/**
 * Process:
 * 1. Convert Chess.js board into Pieces, then pieces into nibbles
 * 2. Combine every two pieces so structure is number[][]
 * 3. Convert two nibbles into 32 bytes
 * 4. Add extra cruft to mirror inputreport structure (len 37)
 *  with 0 representing something and 33-36 representing a timestamp
 * 5. wrap uint8array into a dataview
 */
import {Chess} from "chess.js";
import { timers } from "jquery";

const map = {
    "": 0,
    "P": 7,
    "B": 9,
    "N": 10,
    "R": 6,
    "Q": 11,
    "K": 12,
    "p": 4,
    "b": 3,
    "n": 5,
    "r": 8,
    "q": 1,
    "k": 2
}

export class BoardEmulator extends EventTarget{
    chess: Chess;
    realtime: boolean;
    interval: ReturnType<typeof setInterval> | null;

    constructor() {
        super()
        this.realtime = false;
        this.chess = new Chess();
        this.interval = null;
    }

    open() {
        this.interval = setInterval(() => {this.mockHIDEvent()}, 500);
    }

    close() {
        if(this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    getBoardInBytes() {
        return this.convertNibblesToBytes(this.convertChessBoardToNibbles());
    }

    sendReport(bit: number, data: Uint8Array) {
        switch (bit) {
            case 0x21: // set realtime mode
                this.realtime = true;
        }
    }

    mockHIDEvent() {
        if(!this.realtime) return;
        const bytes = this.getBoardInBytes();
        bytes.unshift(61); // add whatever this is to the start
        bytes.push(201, 111, 167, 0); // add dummy time codes
        const ui8a = new Uint8Array(bytes);
        const buffer = ui8a.buffer;
        const event = new Event("inputreport");
        // A little hacky but I've got to create a few values so it mirrors the
        // inputreport event emitted from the board
        //@ts-ignore
        event.reportId = 1;
        //@ts-ignore
        event.device = {productId:0x8001};
        //@ts-ignore
        event.data = new DataView(buffer);

        return this.dispatchEvent(event);
    }

    convertChessBoardToNibbles(): number[] {
        // board is a8..h8, ..., a1..h1
        // this converts it to a1..h8
        const board = this.chess.board().reverse().flat();
        const pieces = board.map(square => convertCJSSquareToPiece(square));
        // return reverses it one more time to get back to h8..a1 as real board events are
        return pieces.map(piece => map[piece]).reverse();
    }

    convertNibblesToBytes(nibbles: number[]): number[] {
        const combined = [];
        while(nibbles.length) {
            combined.push([nibbles[0], nibbles[1]].reverse())
            nibbles.splice(0,2);
        }

        return combined.map(nibbles => this.convertFromNibbles(nibbles));
    }

    private convertFromBase = (base: number) => (numbers: number[], bigEndian: boolean = true) => {
        const arrToUse = bigEndian ? numbers.reverse() : numbers;
        let res = 0;
        for(let i = 0; i < arrToUse.length; i++) {
            const multiplier = base**i;
            res += arrToUse[i]*multiplier;
        }

        return res;
    }

    private convertFromNibbles = this.convertFromBase(16);


}