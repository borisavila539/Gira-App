import { createSlice } from '@reduxjs/toolkit';

const usuarioSlice = createSlice({
    name: "usuarioSlice",
    initialState: {
        user: "",
        nombre: "",
        token: "",
        empresa: "",
        mensaje: "",
        documentoFiscal: "",
        logeado: false
    },
    reducers: {
        iniciarSesion: (state, action) => {
            state.user = action.payload.user;
            state.nombre = action.payload.nombre;
            state.empresa = action.payload.empresa;
            state.logeado = true;
        },
        mensajeLogin: (state, action) =>{
            state.mensaje = action.payload.mensaje;
        },
        documentoMostrar: (state, action) =>{
            state.documentoFiscal = action.payload.documentoFiscal;
        },
        terminarSesion: (state) => {
            state.user = "";
            state.nombre = "";
            state.logeado = false;
            state.token = "";
            state.empresa = "";
            state.mensaje = "";
        }
    }
});

export const { iniciarSesion, terminarSesion, mensajeLogin, documentoMostrar } = usuarioSlice.actions;
export default usuarioSlice.reducer;