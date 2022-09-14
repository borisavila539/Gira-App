import { useEffect } from "react";
import { useState } from "react";
import { StyleSheet, View, Text, Image, Modal, Pressable, ScrollView, SafeAreaView } from "react-native";
import HeaderLogout from "../Components/HeaderLogout";
import { useSelector } from 'react-redux';
import { ImageHeigth, ImageWidth, TextoPantallas } from "../Components/Constant";
import Buttons from "../Components/Buttons";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from 'expo-media-library';
import MyAlert from "../Components/MyAlerts";

const HistoyDetalle = (props) => {
    const [modalVisible, SetModalVisible] = useState(false);
    const [resultHistorialJSON, setResultHistorialJSON] = useState([]);
    const [tipo, setTipo] = useState('');
    const [categoria, setCategoria] = useState('');
    const [fechaCreacion, setFechaCreacion] = useState('');
    const [fechaFactura, setFechaFactura] = useState('');
    const [noFactura, setNoFactura] = useState('');
    const [descripcionAsesor, setDescripcionAsesor] = useState('');
    const [valor, setValor] = useState('')
    const [descripcionAdmin, setDescripcionAdmin] = useState('');
    const [imagen, setImagen] = useState(null);
    const { monedaAbreviacion, APIURL } = useSelector(state => state.usuario);
    const [administrador, setAdministrador] = useState('');
    const [serie, setSerie] =  useState('');
    const [descargar, setDescargar] = useState(false)

    const [mensajeAlerta, setmensajeAlerta] = useState('');
    const [showMensajeAlerta, setShowMensajeAlerta] = useState(false);
    const [tipoMensaje, setTipoMensaje] = useState(false);

    const datosGasto = async () => {
        
        try {
            const request = await fetch(APIURL + 'api/GastoViajeDetalle/' + props.route.params.ID);
            let data = await request.json();

            setResultHistorialJSON(data)
        } catch (error) {
            console.log('No hay historial: ' + error)
        }
    }

    const descargarImagen = async() =>{
        setDescargar(true)
        console.log('guardando')
        const fileUri = FileSystem.documentDirectory + 'imagen.png';
        await FileSystem.writeAsStringAsync(fileUri, imagen, {encoding: FileSystem.EncodingType.Base64}).then(
            async()=>{
                const mediaResult = await MediaLibrary.saveToLibraryAsync(fileUri);
                console.log('guardado')
                setDescargar(false)

                setmensajeAlerta('Imagen Guardada en galeria')
                setShowMensajeAlerta(true)
                setTipoMensaje(true)
            }
        )
        
    }

    useEffect(() => {
        datosGasto()
    }, [])

    useEffect(() => {
        if (resultHistorialJSON) {
            resultHistorialJSON.forEach(Element => {
                setTipo(Element['tipo'])
                setCategoria(Element['categoria']);

                let fechac = (Element['fechaCreacion']).toString();
                let hora = fechac.substring(11, 13);
                let tiempo = '';
                tiempo = parseInt(hora) >= 12 ? 'PM' : 'AM';

                setFechaCreacion(fechac.replace('T', ' ').substring(0, 16).replace('-', '/').replace('-', '/') + ' ' + tiempo);

                let fechaf = (Element['fechaFactura']).toString();
                setFechaFactura(fechaf.substring(0, 10).replace('-', '/').replace('-', '/'));
                setNoFactura(Element['noFactura']);
                setDescripcionAsesor(Element['descripcion']);
                setValor(Element['valorFactura']);
                setDescripcionAdmin(Element['descripcionAdmin']);
                setImagen(Element['imagen']);
                setAdministrador(Element['admin'])
                setSerie(Element['serie'])

            })
        }
    }, [resultHistorialJSON])
    return (
        <View style={{ flex: 1, width: '100%' }}>
            <HeaderLogout back={true} navegacion={props.navigation} />
            {
                valor != '' &&
                <ScrollView>
                    <SafeAreaView style={styles.body}>
                        <Modal
                            animationType="fade"
                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={() => SetModalVisible(!modalVisible)}
                        >
                            <View style={styles.modal}>
                                <Pressable style={styles.hideimage} onPress={() => SetModalVisible(!modalVisible)}>
                                    <Image source={{ uri: 'data:image/jpeg;base64,' + imagen }} style={styles.imageModal} />
                                    <View style={{width:'80%', maxWidth: 300}}>
                                    <Buttons title={descargar?'Descargando...':"Descargar"} onPressFunction={descargarImagen}></Buttons>

                                    </View>
                                </Pressable>

                            </View>
                        </Modal>
                        <View style={styles.containerDetalle}>
                            <View style={styles.containerDetalle2}>
                                {
                                    imagen == null ?
                                        <View>
                                            <Image source={require('../../assets/No-Image.png')} style={styles.image} />
                                        </View>
                                        :
                                        <View>
                                            <Pressable onPress={() => SetModalVisible(!modalVisible)}>
                                                <Image source={{ uri: 'data:image/jpeg;base64,' + imagen }} style={styles.image} />
                                            </Pressable>
                                        </View>
                                }
                                <View style={styles.containerInfo}>
                                    <Text style={styles.text}>Tipo de Gasto:</Text>
                                    <Text style={styles.text2}> {tipo}</Text><Text></Text>
                                    <Text style={styles.text}>Categoria de Gasto:</Text>
                                    <Text style={styles.text2}> {categoria}</Text><Text></Text>
                                    <Text style={styles.text}>Fecha Envio: </Text>
                                    <Text style={styles.text2}>{fechaCreacion}</Text><Text></Text>
                                    <Text style={styles.text}>Fecha Factura: </Text>
                                    <Text style={styles.text2}>{fechaFactura}</Text><Text></Text>
                                    {
                                        serie != '' &&
                                        <>
                                            <Text style={styles.text}>No. Serie: </Text>
                                            <Text style={styles.text2}>{serie}</Text><Text></Text>
                                        </>
                                    }
                                    {
                                        noFactura != '' &&
                                        <>
                                            <Text style={styles.text}>No. Factura: </Text>
                                            <Text style={styles.text2}>{noFactura}</Text><Text></Text>
                                        </>
                                    }
                                    {
                                        descripcionAsesor != '' &&
                                        <>
                                            <Text style={styles.text}>Descripcion: </Text>
                                            <Text style={styles.text2}>{descripcionAsesor}</Text><Text></Text>
                                        </>

                                    }
                                    <Text style={styles.text}>Valor: </Text>
                                    <Text style={styles.text2}>{monedaAbreviacion}{valor}</Text>
                                    {
                                        administrador != null &&
                                        <>
                                            <Text></Text>
                                            <Text style={styles.text}>Administrador: </Text>
                                            <Text style={styles.text2}>{administrador}</Text>
                                        </>

                                    }
                                    {
                                        descripcionAdmin != '' &&
                                        <>

                                            <Text></Text>
                                            <Text style={styles.text}>Descripcion Rechazo: </Text>
                                            <Text style={styles.text2}>{descripcionAdmin}</Text>
                                        </>
                                    }
                                </View>
                            </View>
                        </View>
                    </SafeAreaView>
                </ScrollView>
            }
            {
                valor == '' &&
                <View style={styles.containerDetalle}>
                    <Text style={[styles.text, { color: '#ddd' }]}>Cargando...</Text>
                </View>
            }
            <MyAlert visible={showMensajeAlerta} tipoMensaje={tipoMensaje} mensajeAlerta={mensajeAlerta} onPress={() => setShowMensajeAlerta(false)} />
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        width: '100%',
        backgroundColor: '#ffff',
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontSize: TextoPantallas,
        fontWeight: 'bold',
        textAlign: "center",
        fontFamily: 'sans-serif'
    },
    text2: {
        fontSize: TextoPantallas,
        fontWeight: "normal",
        fontStyle: "italic",
        textAlign: "center",
        fontFamily: 'sans-serif'
    },
    containerDetalle: {
        flex: 1,
        width: '100%',
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
    },
    containerDetalle2: {
        width: '100%',
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#069A8E'
    },
    containerInfo: {
        width: '70%',
        maxWidth: 500,
        borderTopWidth: 1,
        paddingVertical: 10
    },
    image: {
        width: ImageWidth,
        height: ImageHeigth,
        marginBottom: 10,
        resizeMode: 'contain',

    },
    modal: {
        backgroundColor: '#00000099',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    hideimage: {
        flex: 1,
        borderWidth: 1,
        width: '100%',
        alignItems: "center",
        justifyContent: 'center',
    },
    imageModal: {
        width: '90%',
        height: '90%',
        resizeMode: 'contain',
    },
})
export default HistoyDetalle;