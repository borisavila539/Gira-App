import React, { useEffect, useState } from 'react';
import { HistoyDetalle, Login } from './src/Screens/indexScreens';
import Navegador from "./src/Screens/Navigator";
import { Provider } from 'react-redux';
import { store } from './src/store';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux'
import { iniciarSesion, mensajeLogin, documentoMostrar, tipoMoneda } from './src/store/slices/usuarioSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Stack = createStackNavigator();

const AppNavigation = () => {
  const dispatch = useDispatch();
  const { logeado } = useSelector(state => state.usuario);
  const { mensaje, APIURL } = useSelector(state => state.usuario);

  const getData = async () => {
    let result = await AsyncStorage.getItem('@logeado');

    if (result == "yes") {
      let nombreUsuario = await AsyncStorage.getItem('@usuario')
      let nombre = await AsyncStorage.getItem('@nombre')
      let empresa = await AsyncStorage.getItem('@empresa')
      
      dispatch(iniciarSesion({ user: nombreUsuario, nombre, empresa }));

      //Consultar el Tipo de documento fiscal de cada pais
      try {
        const request = await fetch(APIURL + 'api/Empresa/' + empresa);
        const data = await request.json();
        let documento = '';
        data.forEach(element => {
          documento = element['documento']
        })
        dispatch(documentoMostrar({ documentoFiscal: documento }))
      } catch (error) {
        console.log(error)
      }

      //Consultar Tipo de moneda de cada pais
      try {
        const request = await fetch(APIURL + 'api/MaestroMoneda/' + empresa);
        const data = await request.json();
        let moneda = '';
        let abreviacion = '';
        data.forEach(element => {
          moneda = element['moneda']
          abreviacion = element['abreviacion']
        })

        dispatch(tipoMoneda({ monedaAbreviacion: abreviacion, moneda }))
      }
      catch (error) {
      }
    } else {
      let menssage = result['Message']
      dispatch(mensajeLogin({ mensaje: menssage }))
      setmensajeAlerta(result['Message'])
      setShowMensajeAlerta(true)
      setTipoMensaje(false)
      setEnviando(false)
    }

    console.log(result)
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <NavigationContainer >
      <Stack.Navigator screenOptions={{ header: () => null }}>
        {logeado
          ? <Stack.Screen name='ScreenNavigator' component={Navegador} />
          : <Stack.Screen name='ScreenLogin' component={Login} />}
        <Stack.Screen name='ScreenHistoryDetalle' component={HistoyDetalle} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default function App() {

  return (
    <Provider store={store}>
      <AppNavigation />
    </Provider>
  );
}