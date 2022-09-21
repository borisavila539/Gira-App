import React, { useEffect, useState } from 'react';
import { HistoyDetalle, Login } from './src/Screens/IndexScreens';
import Navegador from "./src/Screens/Navigator";
import { Provider } from 'react-redux';
import { store } from './src/store';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux'
import { iniciarSesion, documentoMostrar, tipoMoneda } from './src/store/slices/usuarioSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextoPantallas } from './src/Components/Constant';
import { View, Text, StyleSheet } from 'react-native';


const Stack = createStackNavigator();

const AppNavigation = () => {
  const dispatch = useDispatch();
  const { logeado } = useSelector(state => state.usuario);
  const { APIURLAVENTAS } = useSelector(state => state.usuario);
  const [mostrar, setMostrar] = useState(false);
  let datos =false;


  const getData = async () => {

    const usuario = await AsyncStorage.getItem("usuario");

    if (usuario != null) {
      const { nombreUsuario, nombre, empresa } = JSON.parse(usuario);

      dispatch(iniciarSesion({ user: nombreUsuario, nombre, empresa }));

      //Consultar el Tipo de documento fiscal de cada pais
      try {
        const request = await fetch(APIURLAVENTAS + 'api/Empresa/' + empresa);
        const data = await request.json();
        let documento = '';
        data.forEach(element => {
          documento = element['documento']
        })
        if(documento != ''){
          datos=true;
        }
        dispatch(documentoMostrar({ documentoFiscal: documento }))
      } catch (error) {
        console.log(error)
      }

      //Consultar Tipo de moneda de cada pais
      try {
        const request = await fetch(APIURLAVENTAS + 'api/MaestroMoneda/' + empresa);
        const data = await request.json();
        let moneda = '';
        let abreviacion = '';
        data.forEach(element => {
          moneda = element['moneda']
          abreviacion = element['abreviacion']
        })
        if(moneda!=''){
          datos=true;
        }
        dispatch(tipoMoneda({ monedaAbreviacion: abreviacion, moneda }))
      }
      catch (error) {
      }
    }
    setMostrar(true)
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <>
      {
        mostrar ?
          <NavigationContainer >
            <Stack.Navigator screenOptions={{ header: () => null }}>
              {
                logeado?                 
                  <Stack.Screen name='ScreenNavigator' component={Navegador} /> 
                :
                  <Stack.Screen name='ScreenLogin' component={Login} />
          
              }
              <Stack.Screen name='ScreenHistoryDetalle' component={HistoyDetalle} />
            </Stack.Navigator>
          </NavigationContainer>
          :
          <View style={styles.Cargando}>
            <Text style={[styles.text, { color: '#ddd' }]}>Cargando...</Text>
          </View>
      }
    </>

  )
}
const styles = StyleSheet.create({
  Cargando: {
    flex: 1,
    width: '100%',
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  text:{
    fontSize: TextoPantallas,
    fontWeight: 'bold',
    textAlign: "center",
    fontFamily: 'sans-serif'
  }
})



export default function App() {

  return (
    <Provider store={store}>
      <AppNavigation />
    </Provider>
  );
}