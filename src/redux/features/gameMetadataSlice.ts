import {createSlice} from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";

// controls game state features such as orientation and playingState

export interface GameMetadataState {
    playing?: boolean;
    orientation?: "black"|"white",
}

const initialState: GameMetadataState = {
    playing: false,
    orientation: "white",
}

export const gameMetadataSlice = createSlice({
    name: "gameMetadata",
    initialState,
    reducers: {
        setGameMetadata: ((state, action: PayloadAction<GameMetadataState>) => {
            state = {...state, ...action};
        }),
    }
});

export const {setGameMetadata} = gameMetadataSlice.actions;
export default gameMetadataSlice.reducer;

