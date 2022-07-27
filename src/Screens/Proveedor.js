import { StyleSheet, View, Text, SafeAreaView, ScrollView, Modal, Pressable, TouchableOpacity, Image } from "react-native";
import { HeaderLogout, TextInputContainer, Buttons, MyAlert } from "../Components/indexComponents";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from "react-native";
import { useState } from "react";
import { useSelector } from "react-redux";

const Proveedor = (props) => {
    const [nombre, setnombre] = useState('')
    const [RTN, setRTN] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [modalVisible, SetModalVisible] = useState(false);
    const [imagen, setImagen] = useState(null);
    const [modalCameraUpload, setModalCameraUpload] = useState(false);
    const [mensajeAlerta, setmensajeAlerta] = useState('');
    const [showMensajeAlerta, setShowMensajeAlerta] = useState(false);
    const [tipoMensaje, setTipoMensaje] = useState(false);
    const { user, documentoFiscal } = useSelector(state => state.usuario);

    let result;
    const pickImage = async () => {
        result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images = "Images",
            base64: true,
            allowsEditing: true,
            quality: 1
        });
        if (!result.cancelled) {
            setImagen(result.base64);
            setModalCameraUpload(false);
        }
    };

    const upLoadImage = async () => {
        result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images = "Images",
            base64: true,
            allowsEditing: true,
            quality: 1
        });
        if (!result.cancelled) {
            setImagen(result.base64);
            setModalCameraUpload(false);
        }
    };

    const EnviarSolicitud = async () => {
        if (nombre == '') {
            setmensajeAlerta('Debe llenar el nombre del proveedor')
            setShowMensajeAlerta(true)
            setTipoMensaje(false)
            return
        }

        if (RTN == '') {
            setmensajeAlerta('Debe llenar el RTN')
            setShowMensajeAlerta(true)
            setTipoMensaje(false)
            return
        }

        if (descripcion == '') {
            setmensajeAlerta('Debe llenar la descripcion')
            setShowMensajeAlerta(true)
            setTipoMensaje(false)
            return
        }

        if (imagen == null) {
            setmensajeAlerta('Debe subir una imagen de la factura con RTN del Proveedor Solicitado')
            setShowMensajeAlerta(true)
            setTipoMensaje(false)
            return
        }

        try {
            const request = await fetch('http://10.100.1.27:5055/api/Usuarios', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    usuario: user,
                    detalle: descripcion,
                    nombre: nombre,
                    rtn: RTN,
                    imagen: imagen
                })
            })
            const result = await request.json();
            if (result == 'Correo Enviado') {
                setmensajeAlerta('Solicitud Enviada')
                setShowMensajeAlerta(true)
                setTipoMensaje(true)
                setnombre('')
                setRTN('')
                setDescripcion('')
                setImagen(null)
            }
        } catch (err) {
            console.log('no se envio el correo' + err)
        }


    }


    return (
        <ScrollView backgroundColor={'#fff'}>
            <StatusBar style="auto" />
            <HeaderLogout />
            <SafeAreaView style={styles.container}>
                <View style={styles.formulario}>
                    <TextInputContainer title={'Nombre:'} placeholder={'Nombre'} onChangeText={value => setnombre(value)} value={nombre} />
                    <TextInputContainer title={documentoFiscal+':'} placeholder={documentoFiscal} onChangeText={value => setRTN(value)} value={RTN} />
                    <TextInputContainer title={'Descripcion:'} multiline={true} maxLength={300} Justify={true} height={80} onChangeText={value => setDescripcion(value)} value={descripcion} />

                    <View style={styles.containerImage}>
                        <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => SetModalVisible(!modalVisible)}>
                            <View style={styles.modal}>
                                <Pressable style={styles.hideimage} onPress={() => SetModalVisible(!modalVisible)}>
                                    <Image source={{ uri: 'data:image/jpeg;base64,' + imagen }} style={styles.imageModal} />
                                </Pressable>
                            </View>
                        </Modal>
                        <Modal animationType="fade" transparent={true} visible={modalCameraUpload} onRequestClose={() => setModalCameraUpload(!modalCameraUpload)}>
                            <Pressable style={styles.modal} onPress={() => setModalCameraUpload(!modalCameraUpload)}>
                                <View style={styles.containerIconModal}>
                                    <View style={styles.containerIconItem}>
                                        <Pressable style={{ width: '100%' }} onPress={pickImage} >
                                            <View style={styles.button}>
                                                <FontAwesome5 name="camera-retro" size={50} color={'#1A4D2E'} />
                                                <Text style={styles.textFoto}>Tomar Foto</Text>
                                            </View>
                                        </Pressable>
                                    </View>
                                    <View style={styles.containerIconItem}>
                                        <Pressable style={{ width: '100%' }} onPress={upLoadImage} >
                                            <View style={styles.button}>
                                                <FontAwesome5 name="file-upload" size={50} color={'#1A4D2E'} />
                                                <Text style={styles.textFoto}>Subir Foto</Text>
                                            </View>
                                        </Pressable>
                                    </View>
                                </View>
                            </Pressable>
                        </Modal>
                        <View style={styles.containerIcon}>
                            <View style={styles.containerIconItem}>
                                <TouchableOpacity style={{ width: '100%' }} onPress={() => setModalCameraUpload(true)} >
                                    <View style={styles.button}>
                                        <FontAwesome5 name="camera-retro" size={50} color={'#1A4D2E'} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {
                            imagen &&
                            <Pressable onPress={() => SetModalVisible(true)}>
                                <Image source={{ uri: 'data:image/jpeg;base64,' + imagen }} style={styles.image} />
                            </Pressable>
                        }
                    </View >
                    <Buttons title='Enviar' onPressFunction={EnviarSolicitud}></Buttons>
                    <MyAlert visible={showMensajeAlerta} tipoMensaje={tipoMensaje} mensajeAlerta={mensajeAlerta} onPress={() => setShowMensajeAlerta(false)} />
                </View>

            </SafeAreaView>
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: '#fff',
        alignItems: "center",
        paddingVertical: 20
    },
    formulario: {
        width: '80%',
        maxWidth: 500,
        justifyContent: "center",
        alignItems: "center"
    },
    containerImage: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#30475E',
        borderRadius: 10,
        backgroundColor: '#fff',
        padding: 5,
    },
    image: {
        width: 300,
        height: 400,
        marginBottom: 10,
        resizeMode: 'contain',
    },
    button: {
        width: '100%',
        alignItems: 'center',
    },
    containerIcon: {
        width: '100%',
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        marginBottom: 5,
    },
    containerIconModal: {
        width: '80%',
        maxWidth: 500,
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 20,
        borderBottomWidth: 1,
        marginBottom: 5,
    },
    containerIconItem: {
        flex: 1,
    },
    modal: {
        backgroundColor: '#00000099',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    imageModal: {
        width: '90%',
        height: '90%',
        resizeMode: 'contain',
    },
    hideimage: {
        flex: 1,
        borderWidth: 1,
        width: '100%',
        alignItems: "center",
        justifyContent: 'center',
    },
    textFoto: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A4D2E'
    }

})

export default Proveedor;