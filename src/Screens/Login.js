
import { useEffect, useState } from 'react';
import { StyleSheet, View, Image, TextInput, Pressable, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Buttons, MyAlert } from '../Components/IndexComponents';
import { useDispatch, useSelector } from 'react-redux'
import { iniciarSesion, mensajeLogin, documentoMostrar, tipoMoneda } from '../store/slices/usuarioSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IconSelect, TextButtons } from '../Components/Constant';

const Login = (props) => {
    const dispatch = useDispatch();
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [viewPassword, setViewPassword] = useState(true);
    const { mensaje, APIURLAVENTAS } = useSelector(state => state.usuario);
    const [mensajeAlerta, setmensajeAlerta] = useState('');
    const [showMensajeAlerta, setShowMensajeAlerta] = useState(false);
    const [tipoMensaje, setTipoMensaje] = useState(false);
    const [enviando, setEnviando] = useState(false);

    const onPressHandle = async () => {
        setEnviando(true)
        try {
            const request = await fetch(APIURLAVENTAS +"api/authentication/movil", {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    UserAccount: user,
                    Password: password,
                })
            })
            const result = await request.json();
            if (result['Data']) {
                let data = result['Data'];
                let nombre = data['Nombre'];
                let empresa = data['Empresa'].toUpperCase();
                let usuario = data['Usuario'];
                let nombreUsuario = usuario['IdUsuario'];

                const usuarioLogeado = { nombreUsuario, nombre, empresa };
                await AsyncStorage.setItem("usuario", JSON.stringify(usuarioLogeado));

                dispatch(iniciarSesion({ user: nombreUsuario, nombre, empresa }));
                //Consultar el Tipo de documento fiscal de cada pais
                try {
                    const request = await fetch(APIURLAVENTAS + 'api/Empresa/' + empresa);
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
                    const request = await fetch(APIURLAVENTAS + 'api/MaestroMoneda/' + empresa);
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
        } catch (err) {
            console.log(err)
            if(mensaje == ''){
                setmensajeAlerta('No hay conexion con el servidor, intente mas tarde....')
            }else{
                setmensajeAlerta(mensaje)
            }
            setShowMensajeAlerta(true)
            setTipoMensaje(false)
            setEnviando(false)
        }
        
    }
    return (
        <View style={{ flex: 1 }}>

            <LinearGradient
                style={styles.container}
                colors={['#069A8E', '#005555']} //'#069A8E','#005555'
            >
                <View style={styles.imagenContainer}>
                    <Image
                        source={require('../../assets/Logo.png')}
                        style={styles.imagen}
                    />
                    <Text style={styles.text}>Login</Text>
                </View>

                <View style={styles.containerinputs}>
                    <View style={styles.textInputAlign}>
                        <FontAwesome5
                            name='user'
                            style={styles.icons}
                            solid />
                        <TextInput
                            style={styles.input}
                            placeholder='Usuario'
                            placeholderTextColor={'#069A8E'}
                            onChangeText={(value) => setUser(value)}
                            value={user}
                        />
                    </View>
                    <View style={styles.textInputAlign}>
                        <FontAwesome5
                            name='key'
                            style={styles.icons}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder='Contraseña'
                            placeholderTextColor={'#069A8E'}
                            secureTextEntry={viewPassword}
                            onChangeText={(value) => setPassword(value)}
                            value={password}
                        />
                        <Pressable onPress={() => setViewPassword(!viewPassword)}>
                            <FontAwesome5
                                name={viewPassword ? 'eye' : 'eye-slash'}
                                style={styles.icons}
                                solid
                            />
                        </Pressable>
                    </View>
                    <View style={{ width: '100%', marginTop: 10, alignItems: 'center'}}>
                        <Buttons
                            title={enviando ? 'Iniciando...' : 'Iniciar Sesion'}
                            onPressFunction={onPressHandle}
                            disabled={enviando}
                        />
                    </View>
                </View>
            </LinearGradient>
            <MyAlert visible={showMensajeAlerta} tipoMensaje={tipoMensaje} mensajeAlerta={mensajeAlerta} onPress={() => setShowMensajeAlerta(false)} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
    },
    imagenContainer: {
        width: '100%',
        height: '50%',
        maxHeight: 500,
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomLeftRadius: 50,
        borderBottomEndRadius: 50,
        marginBottom: 30
    },
    imagen: {
        width: '100%',
        height: '80%',
        resizeMode: 'contain',
        marginBottom: 20,
    },
    containerinputs: {
        width: '80%',
        height: '30%',
        justifyContent:'space-around',
        maxWidth: 600,
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 20,
        backgroundColor: '#FFF8F3',
        borderRadius: 20,
    },
    input: {
        flex: 3,
        padding: 5,
        marginLeft: 10,
        fontSize: TextButtons,
        color: '#005555',
        fontFamily: 'sans-serif'
    },
    textInputAlign: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height:'20%',
        paddingHorizontal: 3,
        marginBottom: 15,
        backgroundColor: '#A1E3D8',
        maxWidth: 500,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 24,
        borderRadius: 8,
    },
    icons: {
        flex: 0,
        fontSize: IconSelect,
        marginLeft: 5,
        color: '#005555',
    },
    text: {
        color: '#F27281',
        fontSize: 40,
        marginBottom: 15,
        fontWeight: 'bold',
        fontFamily: 'sans-serif'
    }
})

export default Login;