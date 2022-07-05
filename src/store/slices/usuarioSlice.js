import { createSlice } from '@reduxjs/toolkit';

const usuarioSlice = createSlice({
    name: "usuarioSlice",
    initialState: {
        nombre: "",
        token: "",
        logeado: false
    },
    reducers: {
        iniciarSesion: (state, action) => {
            state.nombre = action.payload.nombre;
            state.logeado = true;
        },
        terminarSesion: (state) => {
            state.nombre = "";
            state.logeado = false;
            state.token = "";
        }
    }
});

export const { iniciarSesion, terminarSesion } = usuarioSlice.actions;
export default usuarioSlice.reducer;