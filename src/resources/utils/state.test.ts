import {describe, expect, test} from '@jest/globals';
import {State} from './gameState';
import { piece } from './helpers/helpers';
import * as chess from "chess.js"

const INITIAL_STATE: Array<piece> = [
    "R",
    "N",
    "B",
    "Q",
    "K",
    "B",
    "N",
    "R",
    "P",
    "P",
    "P",
    "P",
    "P",
    "P",
    "P",
    "P",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "p",
    "p",
    "p",
    "p",
    "p",
    "p",
    "p",
    "p",
    "r",
    "n",
    "b",
    "q",
    "k",
    "b",
    "n",
    "r"
]

test("Empty state initializes", () => {
    const testState = new State([]);
    expect(testState.getFEN()).toEqual("8/8/8/8/8/8/8/8");
    const newState = new State(INITIAL_STATE);
    testState.updateFromState(newState);
    expect(testState.getFEN()).toEqual("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR")
});

test("gameState initializes", () => {
    const testState = new State(INITIAL_STATE);
    expect(testState.getFEN()).toBe("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR")
})

test("in place moves work", () => {
    const testState = new State(INITIAL_STATE);
    // @ts-ignore
    testState.updateNamedMove('e4');
    expect(testState.getFEN()).toBe("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR");
})

test("Equality works", () => {
    const testState = new State(INITIAL_STATE);
    const copy = testState.makeCopy();
    expect(testState.getFEN()).toEqual(copy.getFEN());
});

test("Reset works", () => {
    const testState = new State(INITIAL_STATE);
    // @ts-ignore
    testState.updateNamedMove("e4");
    // @ts-ignore
    testState.updateNamedMove("e5");
    testState.reset();
    const newState = new State(INITIAL_STATE);
    expect(testState.getFEN()).toBe(newState.getFEN());
});

test("Possible Moves works with castling", () => {
    const testState = new State(INITIAL_STATE);
    testState.chess.reset();
    // @ts-ignore
    testState.updateNamedMove("e4");
    // @ts-ignore
    testState.updateNamedMove("e5");
    // @ts-ignore
    testState.updateNamedMove("Nf3");
    // @ts-ignore
    testState.updateNamedMove("Nc6");
    // @ts-ignore
    testState.updateNamedMove("Bb5");
    // @ts-ignore
    testState.updateNamedMove("Nf6");
    // @ts-ignore
    const incomingState = testState.makeCopy();
    // @ts-ignore
    incomingState.updateNamedMove("O-O");


    expect(testState.possibleMove(incomingState)).toEqual('O-O');
});

test("En passant works", () => {
    const testState = new State([]);
    testState.reset();
    // @ts-ignore
    testState.updateNamedMove("e4");
    // @ts-ignore
    testState.updateNamedMove("a6");
    // @ts-ignore
    testState.updateNamedMove("e5");
    // @ts-ignore
    testState.updateNamedMove("d5");

    const incomingState = new State([]);
    incomingState.reset();
    incomingState.chess.load('rnbqkbnr/1pp1pppp/p2P4/8/8/8/PPPP1PPP/RNBQKBNR b KQkq - 0 3');
    const possibleMove = testState.possibleMove(incomingState);
    expect(possibleMove).toEqual('exd6');
});

test("Return all moved squares from original position", () => {
    const testState = new State([]);
    testState.reset();
    // @ts-ignore
    testState.updateNamedMove('e4');
    // @ts-ignore
    testState.updateNamedMove('e5');
    const copyState = testState.makeCopy();
    // @ts-ignore
    copyState.updateNamedMove("Nf3");
    expect(testState.getMovedSquares(copyState)).toEqual(["g1", "f3"]);
})