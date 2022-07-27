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
        nosync: 0,
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
        noSincronizado: (state, action) =>{
            state.nosync = action.payload.nosync;
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

export const { iniciarSesion, terminarSesion, mensajeLogin, documentoMostrar, noSincronizado } = usuarioSlice.actions;
export default usuarioSlice.reducer;