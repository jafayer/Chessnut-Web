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

// export function parseFen(fen: string): Array<square> {
//     for()
// }