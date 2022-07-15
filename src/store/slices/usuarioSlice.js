import { createSlice } from '@reduxjs/toolkit';

const usuarioSlice = createSlice({
    name: "usuarioSlice",
    initialState: {
        user: "",
        nombre: "",
        token: "",
        empresa: "",
        imagen: "",
        mensaje: "",
        logeado: false
    },
    reducers: {
        iniciarSesion: (state, action) => {
            state.user = action.payload.user;
            state.nombre = action.payload.nombre;
            state.empresa = action.payload.empresa;
            state.logeado = true;
        },
        mandarFoto: (state, action) => {
            state.imagen = action.payload.imagen;
        },
        mensajeLogin: (state, action) =>{
            state.mensaje = action.payload.mensaje;
        },
        terminarSesion: (state) => {
            state.user = "";
            state.nombre = "";
            state.logeado = false;
            state.token = "";
            state.empresa = "";
            state.imagen = "";
            state.mensaje = "";
        }
    }
});

export const { iniciarSesion, terminarSesion, mandarFoto, mensajeLogin } = usuarioSlice.actions;
export default usuarioSlice.reducer;