import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Viaje, History, Proveedor, NoSync } from "../Screens/indexScreens";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useSelector, } from 'react-redux';

const Tab = createBottomTabNavigator();

const Navegador = (props) => {
    const { nosync } = useSelector(state => state.usuario)
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color }) => {
                    let iconName;
                    color = focused ? '#069A8E' : '#fff';
                    if (route.name === 'Gastos de Viaje') {
                        iconName = 'file-invoice-dollar'
                    } else if (route.name === 'Historial') {
                        iconName = 'history'
                    } else if (route.name === 'Solicitar Proveedor') {
                        iconName = 'user-plus';
                    } else if (route.name === 'No Sincronizado') {
                        iconName = 'sync';
                    }

                    return <FontAwesome5 name={iconName} size={30} color={color}></FontAwesome5>
                },
                tabBarActiveTintColor: '#069A8E',
                tabBarInactiveTintColor: '#fff',
                tabBarActiveBackgroundColor: '#fff',
                tabBarInactiveBackgroundColor: '#069A8E',
                tabBarStyle: { height: 70 },
                tabBarLabelStyle: { paddingBottom: 15, fontWeight: 'bold' },
                tabBarIconStyle: { marginTop: 5 },
                headerShown: false,
                tabBarHideOnKeyboard: true,
                tabBarLabelPosition: 'below-icon',

            })}
        >
            <Tab.Screen name='Gastos de Viaje' component={Viaje} />
            <Tab.Screen name='Historial' component={History} />
            <Tab.Screen name='Solicitar Proveedor' component={Proveedor} />
            {
                <Tab.Screen name='No Sincronizado' component={NoSync}
                    options={({ route }) => ({ tabBarBadge: nosync != 0 ? nosync : null, tabBarBadgeStyle: { backgroundColor: '#F94C66', color: '#fff', fontWeight: 'bold' }, })} />
            }
        </Tab.Navigator>

    )
}

export default Navegador;