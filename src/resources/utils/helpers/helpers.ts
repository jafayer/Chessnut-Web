import chess from "chess.js";

export const files = "abcdefgh";

export function getFileNumber(file: string) {
    return files.indexOf(file);
}

export type piece = typeof chess.PAWN | typeof chess.BISHOP | typeof chess.KNIGHT | typeof chess.ROOK | typeof chess.QUEEN | typeof chess.KING;

export type pieceData = {
    piece: piece,
    color: typeof chess.WHITE | typeof chess.BLACK,
}

export type square = {
    coords: string,
    pieceInfo: null | pieceData,
}

export function convertCJSToCB(color: typeof chess.WHITE | typeof chess.BLACK, piece: piece) {
    return color.toLowerCase() + piece.toUpperCase();
}

export function convertPieceToDB(piece: pieceData | null) {
    if(piece === null || piece === undefined) {
        return "";
    } else {
        return piece.color.toLowerCase() + piece.piece.toUpperCase();
    }
}

export function indexToSquareCoords(index: number): string {
    const file = files[Math.floor(index/8)];
    const rank = (index % 8) + 1;
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

export function makeProcessedBoardState(){}