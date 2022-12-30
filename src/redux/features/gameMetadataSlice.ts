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
        setPlaying: ((state, action: PayloadAction<GameMetadataState["playing"]>) => {
            state.playing = action.payload;
        }),
        setOrientation: ((state, action: PayloadAction<GameMetadataState["orientation"]>) => {
            state.orientation = action.payload;
        }),
    }
});

export const {setPlaying, setOrientation} = gameMetadataSlice.actions;
export default gameMetadataSlice.reducer;

