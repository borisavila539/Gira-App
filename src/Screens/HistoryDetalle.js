import { useEffect } from "react";
import { useState } from "react";
import { StyleSheet, View, Text, Image, Modal, Pressable } from "react-native";
import HeaderLogout from "../Components/headerLogout";
import { useDispatch, useSelector, } from 'react-redux';




const HistoyDetalle = (props) => {
    const [modalVisible, SetModalVisible] = useState(false);
    const { nombre } = useSelector(state => state.usuario);
    const [resultHistorialJSON, setResultHistorialJSON] = useState([]);
    const [resultCategoriaJSON, setResultCategoriaJSON] = useState([]);
    const [categoria, setCategoria] = useState('');
    const [fechaCreacion, setFechaCreacion] = useState('');
    const [fechaFactura, setFechaFactura] = useState('');
    const [proveedor, setProveedor] = useState('');
    const [noFactura, setNoFactura] = useState('');
    const [descripcionAsesor, setDescripcionAsesor] = useState('');
    const [valor, setValor] = useState('')
    const [descripcionAdmin, setDescripcionAdmin] = useState('0');
    const [imagen, setImagen] = useState('');

    const datosGasto = async () => {
        const request = await fetch('http://10.100.1.27:5055/api/GastoViajeDetalle/' + props.route.params.ID);
        let data = await request.json();
        setResultHistorialJSON(data)
    }
    const llenarCategoria = async () => {
        const request = await fetch('http://10.100.1.27:5055/api/CategoriaTipoGastoViaje/');
        let data = await request.json();
        setResultCategoriaJSON(data)
    }

    const categoriaGasto = (id) => {
        let nombre = '-';
        resultCategoriaJSON.forEach(Element => {
            if (Element['idCategoriaTipoGastoViaje'] == id) {
                nombre = Element['nombre'];
            }
        })
        return nombre;

    }

    useEffect(() => {
        datosGasto()
        llenarCategoria()
    }, [])

    useEffect(() => {
        if (resultHistorialJSON) {
            resultHistorialJSON.forEach(Element => {
                let id = Element['idCategoriaTipoGastoViaje'];
                setCategoria(categoriaGasto(id));
                let fechac = Element['fechaCreacion'];
                setFechaCreacion(fechac.substring(0, 10));
                let fechaf = Element['fechaFactura'];
                setFechaFactura(fechaf.substring(0, 10));
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
        <View style={styles.body}>
            <HeaderLogout back={true} navegacion={props.navigation} />
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
                {
                    valor != '' &&
                    <View style={styles.containerDetalle}>
                        {
                            imagen == '' ?
                                <View>
                                    <Pressable onPress={() => SetModalVisible(!modalVisible)}>
                                        <Image source={require('../../assets/No-Image.png')} style={styles.image} />
                                    </Pressable>
                                </View>
                                :
                                <View>
                                    <Pressable onPress={() => SetModalVisible(!modalVisible)}>
                                        <Image source={{ uri: 'data:image/jpeg;base64,' + imagen }} style={styles.image} />
                                    </Pressable>
                                </View>
                        }
                        <View style={styles.containerInfo}>
                            <Text style={styles.text}>Asesor: {nombre}</Text>
                            <Text style={styles.text}>Categoria: {categoria}</Text>
                            <Text style={styles.text}>Fecha Envio: {fechaCreacion}</Text>
                            <Text style={styles.text}>Fecha Factura: {fechaFactura}</Text>
                            <Text style={styles.text}>Proveedor: {proveedor}</Text>
                            <Text style={styles.text}>No. Factura: {noFactura}</Text>
                            <Text style={styles.text}>Descripcion: {descripcionAsesor}</Text>
                            <Text style={styles.text}>Valor: {valor}</Text>
                            {
                                descripcionAdmin &&
                                <Text style={styles.text}>Descripcion Admin: {descripcionAdmin}</Text>
                            }
                        </View>
                    </View>
                }
                {
                    valor == '' &&
                    <View style={styles.containerDetalle}>
                        <Text style={[styles.text, { color: '#ddd' }]}>Cargando...</Text>
                    </View>
                }
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: '#ffff',
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    containerDetalle: {
        flex: 1,
        width: '100%',
        alignItems: "center",
        justifyContent: "center",
        padding: 10
    },
    containerInfo: {
        width: '80%',
        maxWidth: 500,
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