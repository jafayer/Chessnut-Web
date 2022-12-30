import {createSlice} from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";

export interface PositionState {
    fen: string;
    pgn?: string;
}

const initialState: PositionState = {
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
}

export const positionSlice = createSlice({
    name: "position",
    initialState,
    reducers: {
        setFEN: ((state, action: PayloadAction<PositionState["fen"]>) => {
            state.fen = action.payload;
        }),
        setPGN: ((state, action: PayloadAction<PositionState["pgn"]>) => {
            state.pgn = action.payload;
        })
    }
});

export const {setFEN, setPGN} = positionSlice.actions;
export default positionSlice.reducer;

