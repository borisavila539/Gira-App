import { StyleSheet, View, Text, SafeAreaView, ScrollView} from "react-native";
import { HeaderLogout, TextInputContainer, Buttons, MyAlert, ModalCameraUpload } from "../Components/indexComponents";
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
    const { user, documentoFiscal, APIURL } = useSelector(state => state.usuario);
    const [enviando, setEnviando] = useState(false);

    let result;
    const pickImage = async () => {
        const permiso = await ImagePicker.requestCameraPermissionsAsync();
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
        setEnviando(true)
        if (nombre == '') {
            setmensajeAlerta('Debe llenar el nombre del proveedor')
            setShowMensajeAlerta(true)
            setTipoMensaje(false)
            setEnviando(false)
            return
        }

        if (RTN == '') {
            setmensajeAlerta('Debe llenar el RTN')
            setShowMensajeAlerta(true)
            setTipoMensaje(false)
            setEnviando(false)
            return
        }

        if (descripcion == '') {
            setmensajeAlerta('Debe llenar la descripcion')
            setShowMensajeAlerta(true)
            setTipoMensaje(false)
            setEnviando(false)
            return
        }

        if (imagen == null) {
            setmensajeAlerta('Debe subir una imagen de la factura con RTN del Proveedor Solicitado')
            setShowMensajeAlerta(true)
            setTipoMensaje(false)
            setEnviando(false)
            return
        }

        try {
            const request = await fetch(APIURL + 'api/Usuarios', {
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
        setEnviando(false)


    }


    return (
        <View>
            <HeaderLogout />
            <ScrollView backgroundColor={'#fff'} style={{ height: '92%' }}>
                <StatusBar style="auto" />

                <SafeAreaView style={styles.container}>
                    <View style={styles.formulario}>
                        <TextInputContainer title={'Nombre:'} placeholder={'Nombre Proveedor'} onChangeText={value => setnombre(value)} value={nombre} />
                        <TextInputContainer title={documentoFiscal + ':'} placeholder={documentoFiscal} onChangeText={value => setRTN(value)} value={RTN} />
                        <TextInputContainer title={'Descripcion:'} multiline={true} maxLength={300} Justify={true} height={80} onChangeText={value => setDescripcion(value)} value={descripcion} />
                        <ModalCameraUpload
                            modalVisible={modalVisible}
                            onRequestCloseImage={() => SetModalVisible(!modalVisible)}
                            OnPressUploadImage={() => SetModalVisible(!modalVisible)}
                            imagen={imagen}
                            modalCameraUpload={modalCameraUpload}
                            onRequestCloseSelectUploadImage={() => setModalCameraUpload(!modalCameraUpload)}
                            onPressOut={() => setModalCameraUpload(!modalCameraUpload)}
                            onPressCameraUpload={pickImage}
                            OnPressUpLoadImage={upLoadImage}
                            onPressModalCameraUpload={() => setModalCameraUpload(true)}
                            modalImage={() => SetModalVisible(!modalVisible)}
                        />
                        <Buttons title={enviando ? 'Enviando..' : 'Enviar'} onPressFunction={EnviarSolicitud} disabled={enviando}></Buttons>
                        <MyAlert visible={showMensajeAlerta} tipoMensaje={tipoMensaje} mensajeAlerta={mensajeAlerta} onPress={() => setShowMensajeAlerta(false)} />
                    </View>
                </SafeAreaView>
            </ScrollView>
        </View>
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
        maxWidth: 600,
        justifyContent: "center",
        alignItems: "center"
    }

})

export default Proveedor;