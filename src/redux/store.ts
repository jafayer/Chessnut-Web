import {configureStore} from "@reduxjs/toolkit";
import themeReducer from "./features/themeSlice";
import positionReducer from "./features/positionSlice";
import gameMetadataReducer from "./features/gameMetadataSlice";

export const store = configureStore({
    reducer: {
        theme: themeReducer,
        position: positionReducer,
        gameMetadata: gameMetadataReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;