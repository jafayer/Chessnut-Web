import * as chess from "chess.js";
import { ChessBoardProps } from "react-chessboard";
import {piece, indexToSquareCoords, convertFENCharToChessJSPiece, convertCJSSquareToPiece, files, INITIAL_STATE} from "./helpers/helpers";

export class State {
    chess;
    state: Array<Array<piece>>
    // State goes from h8..a1
    constructor(pieces: piece[]) {
        // build internal 2D-array representation
        // input should be a1..h8
        // raw from chessboard
        this.state = this.piecesToBoard(pieces);
        
        this.chess = new chess.Chess();
        this.fillChessJS(this.state);
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
        newState.state = this.state;

        return newState;
    }

    updateFromArray(pieces: Array<piece>) {
        // update BOARD state destructively
        // take a move, put it into chess.js,
        // get the output of chess.board()
        // convert and override internal representation
        this.state = this.piecesToBoard(pieces);
        this.fillChessJS(this.state);
    }

    updateNamedMove(move: chess.Move) {
        // update state in place
        // this is a bit of an ugly mish-mosh of board and game state
        const didMove = this.chess.move(move);
        if(didMove) {
            const newState = this.chess.board().map(row => row.map(square => convertCJSSquareToPiece(square)));
            this.state = newState;

            return true;
        } else {
            return false;
        }
    }

    updateFromState(newState: State) {
        this.state = newState.state;
        this.fillChessJS(this.state);
    }

    reset() {
        this.chess.reset();
        this.state = this.boardToState();
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

    private fillChessJS(state: Array<Array<piece>>) {
        this.chess.clear();
        state.forEach((row, rowIndex) => {
            row.forEach((square, columnIndex) =>  {
                const piece = convertFENCharToChessJSPiece(square);
                if(piece) {
                    this.chess.put(piece, this.getSquareName(rowIndex, columnIndex));
                }
            });
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

    private boardToState(): Array<Array<piece>> {
        return this.chess.board().map(row => {
            return row.map(piece => convertCJSSquareToPiece(piece));
        });
    }
    
    private getSquareName(rowIndex: number, columnIndex: number): chess.Square {
        const rank = 8 - rowIndex;
        const file = files[columnIndex];
        // @ts-ignore
        return file+rank;
    }

    private convertStateBackToArray() {
        return this.state.reverse().flat();
    }
}