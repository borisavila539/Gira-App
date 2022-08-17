
import { View, StyleSheet, Text, Pressable } from "react-native"
import { useDispatch, useSelector, } from 'react-redux';
import { terminarSesion } from "../store/slices/usuarioSlice";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IconHeader, TextoHeader } from "./constant";

const HeaderLogout = (props) => {
    const dispatch = useDispatch();
    const { nombre } = useSelector(state => state.usuario)
    const handlePressLogout = async () => {
        await AsyncStorage.setItem('@logeado','no')
        dispatch(terminarSesion());
    }
    return (
        <View style={styles.header}>
            {
                props.back &&
                <Pressable onPress={props.navegacion.goBack}>
                    <FontAwesome5 name="chevron-left" size={IconHeader} color={'#fff'} />
                </Pressable>
            }
            <Text style={styles.text}>Bienvenido(a): {nombre}</Text>
            {
                !props.back &&
                <Pressable onPress={handlePressLogout}>
                    <FontAwesome5 name='sign-out-alt' size={IconHeader} color={'#fff'}></FontAwesome5>
                </Pressable>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        width: '100%',
        height: '8%',
        alignItems: "center",
        flexDirection: 'row',
        backgroundColor: '#069A8E',
        padding: 5,
    },
    text: {
        flex: 3,
        fontSize: TextoHeader,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: "center",
        
    },
})

export default HeaderLogout;