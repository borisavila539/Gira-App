import { useEffect } from "react";
import { useState } from "react";
import { StyleSheet, View, Text, Image, Modal, Pressable, ScrollView, SafeAreaView } from "react-native";
import HeaderLogout from "../Components/headerLogout";

const HistoyDetalle = (props) => {
    const [modalVisible, SetModalVisible] = useState(false);
    const [resultHistorialJSON, setResultHistorialJSON] = useState([]);
    const [resultCategoriaJSON, setResultCategoriaJSON] = useState([]);
    const [tipo, setTipo] = useState('');
    const [categoria, setCategoria] = useState('');
    const [fechaCreacion, setFechaCreacion] = useState('');
    const [fechaFactura, setFechaFactura] = useState('');
    const [proveedor, setProveedor] = useState('');
    const [noFactura, setNoFactura] = useState('');
    const [descripcionAsesor, setDescripcionAsesor] = useState('');
    const [valor, setValor] = useState('')
    const [descripcionAdmin, setDescripcionAdmin] = useState('');
    const [imagen, setImagen] = useState(null);

    const datosGasto = async () => {
        try {
            const request = await fetch('http://10.100.1.27:5055/api/GastoViajeDetalle/' + props.route.params.ID);
            let data = await request.json();
            setResultHistorialJSON(data)
        } catch (error) {
            console.log('No hay historial: ' + error)
        }
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
                setFechaCreacion(fechac.replace('T', ' ').substring(0, 16).replace('-', '/').replace('-', '/'));
                let fechaf = (Element['fechaFactura']).toString();
                setFechaFactura(fechaf.substring(0, 10).replace('-', '/').replace('-', '/'));
                let prov = Element['proveedor'];
                setProveedor(prov);
                let factura = Element['noFactura'];
                setNoFactura(factura);
                let descripA = Element['descripcion'];
                setDescripcionAsesor(descripA);
                let valorf = Element['valorFactura'];
                setValor(valorf);
                let descripAd = Element['descripcionAdmin'];
                setDescripcionAdmin(descripAd);
                let imagenBase64 = Element['imagen']
                setImagen(imagenBase64)
            })
        }
    }, [resultHistorialJSON, resultCategoriaJSON])
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
                                    <Text style={styles.text}>No. Factura: </Text>
                                    <Text style={styles.text2}>{noFactura}</Text><Text></Text>
                                    <Text style={styles.text}>Descripcion: </Text>
                                    <Text style={styles.text2}>{descripcionAsesor}</Text><Text></Text>
                                    <Text style={styles.text}>Valor: </Text>
                                    <Text style={styles.text2}>{valor}</Text><Text></Text>
                                    {
                                        descripcionAdmin &&
                                        <>
                                            <Text style={styles.text}>Descripcion Admin: </Text>
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
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: "center"
    },
    text2: {
        fontSize: 16,
        fontWeight: "normal",
        fontStyle: "italic",
        textAlign: "center"
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
        width: 300,
        height: 400,
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