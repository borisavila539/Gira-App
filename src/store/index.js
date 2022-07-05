import { configureStore } from '@reduxjs/toolkit'
import usuarioReducer from "./slices/usuarioSlice";

export const store = configureStore({
    reducer: {
        usuario: usuarioReducer
    },
})