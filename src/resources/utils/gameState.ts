import * as chess from "chess.js";
import { ChessBoardProps } from "react-chessboard";
import {piece, indexToSquareCoords, convertFENCharToChessJSPiece, convertCJSSquareToPiece, files} from "./helpers/helpers";

export class State {
    chess;
    constructor(pieces: piece[]) {
        
        this.chess = new chess.Chess();
        this.fillChessJS(pieces);
    }

    getFEN():string{
        return this.chess.fen().split(" ")[0]
    }
    
    isEq(otherState: State):boolean {
        return this.getFEN() === otherState.getFEN();
    }

    makeCopy(): State {
        const newState = new State([]);
        newState.chess.reset();
        newState.chess.loadPgn(this.chess.pgn());
        return newState;
    }

    updateFromArray(pieces: Array<piece>) {
        // TODO: probably remove this or fillChessJS
        this.fillChessJS(pieces);
    }

    updateNamedMove(move: chess.Move) {
        // update state in place
        // this is a bit of an ugly mish-mosh of board and game state
        const didMove = this.chess.move(move);
        return didMove ? true : false;
    }

    updateFromState(newState: State) {
        const pieces = newState.boardToPieces();
        this.fillChessJS(pieces);
    }

    reset() {
        this.chess.reset();
    }

    possibleMove(incomingState: State) {
        const copy = this.makeCopy();
        const movesToTry = copy.chess.moves();
        for(let i = 0; i < movesToTry.length; i++) {
            copy.updateNamedMove(movesToTry[i] as chess.Move);
            if(copy.isEq(incomingState)) {
                return movesToTry[i];
            }
            copy.chess.undo();
        }
    }

    
    getMovedSquares(incomingState: State): Array<chess.Square> {
        // return all squares which don't match current internal state
        const pieces = this.boardToPieces();
        const incomingPieces = incomingState.boardToPieces();
        const filtered = pieces.map((piece, index) => {
            if(piece != incomingPieces[index]) {
                return indexToSquareCoords(index)
            }
        }).filter(square => square != undefined);
        
        return filtered as chess.Square[];
    }

    getWinningSidePieces(side: chess.Color): Array<chess.Square> {
        const pieces = this.boardToPieces();
        const filtered = pieces.map((piece, index) => {
            if(piece.toUpperCase() === piece) { // white
                if(side === chess.WHITE) {
                    return indexToSquareCoords(index);
                }
            } else { // black
                if(side === chess.BLACK) {
                    return indexToSquareCoords(index);
                }
            }
        }).filter(square => square != undefined);

        return filtered as chess.Square[];
    }

    private fillChessJS(pieces: Array<piece>) {
        this.chess.clear();
        pieces.forEach((piece, index) => {
            const squareName = indexToSquareCoords(index);
            const pieceObject = convertFENCharToChessJSPiece(piece);
            if(pieceObject) {
                return this.chess.put(pieceObject, squareName);
            } else {
                return false;
            }
        });
    }

    private piecesToBoard(pieces: Array<piece>): Array<Array<piece>> {
        // should mirror fen orientation
        // i.e. a8..h8, a7..h7, ... , a1..h1
        const board = [];
        for(let i = 0; i < Math.floor(pieces.length/8); i++) {
            // i[1]..i[8] starting at h
            const row = pieces.slice(Math.floor(64 - (8 * i) - 8), Math.floor(64 - (8 * i)));
            board.push(row);
        }
        return board;
    }

    private boardToPieces(): Array<piece> {
        // chess.board is a1..h8, ..., a1..h1,
        const board = this.chess.board();
        let toReturn: Array<piece> = [];
        for(let i = 7; i >= 0; i--) {
            toReturn = [...toReturn, ...board[i].map(pieceObj => convertCJSSquareToPiece(pieceObj))];
        }
        return toReturn;
    }
    
    private getSquareName(rowIndex: number, columnIndex: number): chess.Square {
        const rank = 8 - rowIndex;
        const file = files[columnIndex];
        // @ts-ignore
        return file+rank;
    }
}