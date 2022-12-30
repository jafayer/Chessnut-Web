import * as chess from "chess.js";
import { ChessNut } from "../chessnut";
import { useAppDispatch } from "../../../redux/hooks";

export const files = "abcdefgh";

export function getFileNumber(file: string) {
    return files.indexOf(file);
}

export type piece = "" | "p" | "P" | "n" | "N" | "b" | "B" | "r" | "R" | "q" | "Q" | "k" | "K";

export type pieceData = {
    piece: piece,
    color: typeof chess.WHITE | typeof chess.BLACK,
}

export type square = {
    coords: string,
    pieceInfo: null | pieceData,
}

export type cjsSquare = {
    square: string,
    type: chess.PieceSymbol,
    color: chess.Color
}

export function convertCJSToCB(color: typeof chess.WHITE | typeof chess.BLACK, piece: piece) {
    return color.toLowerCase() + piece.toUpperCase();
}

export function indexToSquareCoords(index: number): chess.Square {
    // a1..h8
    const file = files[index % 8];
    const rank = Math.floor(index/ 8)+1;
    // @ts-ignore
    // would be really annoying to do this properly
    return file+rank;
}

export function makeCBMap(boardState:Array<Array<square>>): Object {
    return boardState.flat().reduce((prev, square, index) => {
        if(square.pieceInfo === null) {
            return prev;
        } else {
            return {
                [square.coords]: convertCJSToCB(square.pieceInfo.color, square.pieceInfo.piece),
                ...prev,
            }
        }
    }, {});
}

export function getSquare(square: string, board: Array<Array<square>>): square {
    const file = files.indexOf(square[0]);
    const rank = parseInt(square[1]) - 1;
    return board[rank][file];
}

export function makeFen(squares: Array<square>): string {
    const arr = [];
    for(let i = 0; i <= 7; i++) {
        // get rows in reverse order
        const row = squares.slice(8*(7-i), 8*(7-i)+8);
        let str = "";
        row.forEach(square => {
            const piece = square.pieceInfo;
            if(piece === null) {
                const lastChar = str[str.length-1];
                if(!isNaN(parseInt(lastChar))) {
                    str = str.slice(0, str.length - 1) + (parseInt(lastChar) + 1).toString();
                } else {
                    str = str + "1"
                }
            } else {
                const letter = piece.color === 'w'
                    ? piece.piece.toUpperCase()
                    : piece.piece.toLowerCase();
                str = str += letter;
            }
        });
        arr.push(str);
    }

    return arr.join("/");
}

export function convertFENCharToChessJSPiece(piece: piece): chess.Piece | undefined {
    const color = (piece === piece.toUpperCase()) ? chess.WHITE : chess.BLACK;

    switch(piece.toLowerCase()) {
        case "p":
            return {
                color,
                type: chess.PAWN,
            }
        case "b":
            return {
                color,
                type: chess.BISHOP,
            }
        case "n":
            return {
                color,
                type: chess.KNIGHT,
            }
        case "r":
            return {
                color,
                type: chess.ROOK,
            }
        case "q":
            return {
                color,
                type: chess.QUEEN,
            }
        case "k":
            return {
                color,
                type: chess.KING,
            }
        default:
            return undefined;
    }
}

export function convertCJSSquareToPiece(square: cjsSquare | null): piece {
    if(!square) {
        return "";
    }
    // Sorry for the type assertion I got lazy
    return square.color === "w" ? square.type.toUpperCase() as piece : square.type.toLowerCase() as piece
}