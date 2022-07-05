
import { View, StyleSheet, Text, Pressable } from "react-native"
import { useDispatch, useSelector, } from 'react-redux';
import { terminarSesion } from "../store/slices/usuarioSlice";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const HeaderLogout = () => {
    const dispatch = useDispatch();
    const {nombre} = useSelector(state => state.usuario)
    const handlePressLogout = () => {
        dispatch(terminarSesion());
    }
    return (
        <View style={styles.header}>
            <Text style={styles.text}>Bienvenid@: {nombre}</Text>
            <Pressable onPress={handlePressLogout}>
                <FontAwesome5 name='sign-out-alt' size={40} color={'#9EB23B'}></FontAwesome5>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        width: '100%',
        alignItems: "center",
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding:5,
    },
    text:{
        flex:3,
        fontWeight:'bold',
        color:'#1A4D2E'
    },
})

export default HeaderLogout;