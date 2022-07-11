import { createSlice } from '@reduxjs/toolkit';

const usuarioSlice = createSlice({
    name: "usuarioSlice",
    initialState: {
        user: "",
        nombre: "1",
        token: "",
        empresa: "",
        logeado: false
    },
    reducers: {
        iniciarSesion: (state, action) => {
            state.user = action.payload.user;
            state.nombre = action.payload.nombre;
            state.empresa = action.payload.empresa;
            state.logeado = true;
        },
        terminarSesion: (state) => {
            state.user = "";
            state.nombre = "";
            state.logeado = false;
            state.token = "";
            state.empresa = ""
        }
    }
});

export const { iniciarSesion, terminarSesion } = usuarioSlice.actions;
export default usuarioSlice.reducer;