import React from 'react';
import { Login } from './src/Screens/indexScreens'
import { Navigator } from './src/Screens/Navigator'
import { Provider } from 'react-redux';
import { store } from './src/store';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';

const Stack = createStackNavigator();

const AppNavigation = () => {
  const { logeado } = useSelector(e => e.usuario);

  return (
    <NavigationContainer >
      <Stack.Navigator screenOptions={{ header: () => null }}>
        {logeado
          ? <Stack.Screen name='ScreenNavigator' component={Navigator} />
          : <Stack.Screen name='ScreenLogin' component={Login} />}
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