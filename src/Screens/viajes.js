import { StyleSheet, View, TouchableOpacity, SafeAreaView, Text } from "react-native";
import { Buttons, HeaderLogout } from "../Components/IndexComponents";
import { TextInputContainer, DropdownList, MyAlert, ModalCameraUpload } from "../Components/IndexComponents";
import { StatusBar } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { useState } from "react";
import DateTimePicker from '@react-native-community/datetimepicker';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import RadioButtonRN from 'radio-buttons-react-native';
import { noSincronizado } from '../store/slices/usuarioSlice';
import moment from "moment";
import { IconSelect, ObjectHeigth, TextoPantallas } from "../Components/Constant";

const Viaje = (props) => {
    const dispatch = useDispatch();
    const [nFactura, setNFactura] = useState('');
    const [descripion, setDescripcion] = useState('');
    const [valor, setValor] = useState(0.00);
    const [openDate, SetOpenDate] = useState(false);
    const [date, setDate] = useState('');
    const [showdate, setShowDate] = useState(new Date());
    const { empresa, user, nombre, documentoFiscal, moneda, APIURL } = useSelector(state => state.usuario);
    const [resultTipo, setResultTipo] = useState([]);
    const [resultCategoria, setResultCategoria] = useState([]);
    const [resultTipoJSON, setResultTipoJSON] = useState([]);
    const [resultCategoriaJSON, setResultCategoriaJSON] = useState([]);
    const [IdCategoria, setIdCategoria] = useState(null);
    const [nombreCategoria, setNombreCategoria] = useState('')
    const [enviado, setEnviado] = useState(false);
    const [imagen, setImagen] = useState(null);
    const [modalVisible, SetModalVisible] = useState(false);
    const [modalCameraUpload, setModalCameraUpload] = useState(false);
    const [today, setToday] = useState(new Date());
    const [alimentacionIsSelected, setAlimentacionIsSelected] = useState(false);
    const [mensajeAlerta, setmensajeAlerta] = useState('');
    const [showMensajeAlerta, setShowMensajeAlerta] = useState(false);
    const [tipoMensaje, setTipoMensaje] = useState(false);
    const [RTN, setRTN] = useState('');
    const [proveedoresJSON, setProveedoresJSON] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [proveedor, setProveedor] = useState('');
    const dataAlimentos = [{ label: 'Desayuno' }, { label: 'Almuerzo' }, { label: 'Cena' }]
    const [idAlimentos, setIdAlimentos] = useState(null);
    const [tipoAlimento, setTipoAlimento] = useState('');
    const [disabledDropDown, setDisabledDropDown] = useState(true);
    const [disableProveedor, setDiasableProveedor] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const [proveedorPredefinido, setProveedorPredefinido] = useState(false);
    const [buscandoProveedor, setBuscandoProveedor] = useState(false);
    let result;


    const pickImage = async () => {
        const permiso = await ImagePicker.requestCameraPermissionsAsync();
        console.log(permiso)
        if (permiso.granted) {
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
        } else {
            setmensajeAlerta('Estado permisos de camara: ' + permiso.status)
            setShowMensajeAlerta(true)
            setTipoMensaje(false)
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

    const onChanceNFactura = (value) => {
        if (empresa == 'IMHN') {
            if (value.length == 16) {
                setNFactura(value[0] + value[1] + value[2] + '-' + value[3] + value[4] + value[5] + '-' + value[6] + value[7] + '-' + value[8] + value[9] + value[10] + value[11] + value[12] + value[13] + value[14] + value[15])
            } else if (value.length == 17) {
                value = value[0] + value[1] + value[2] + value[4] + value[5] + value[6] + value[8] + value[9] + value[11] + value[12] + value[13] + value[14] + value[15] + value[16]
                setNFactura(value);
            } else {
                setNFactura(value);
            }
        } else {
            setNFactura(value);
        }
    };

    const onchange = (event, selectedDate) => {
        const currentDate = selectedDate.getDate() + '/' + (selectedDate.getMonth() + 1) + '/' + selectedDate.getFullYear();
        SetOpenDate(false)
        if (event.type === 'set') {
            if (selectedDate <= today) {
                setDate(currentDate)
                setShowDate(selectedDate)
            } else {
                setmensajeAlerta('Debe seleccionar una fecha correcta')
                setShowMensajeAlerta(true)
                setTipoMensaje(false)
            }
        }
    };

    const onScreenLoad = async () => {

        try {
            const request = await fetch(APIURL + 'api/TipoGastoViaje/' + empresa);
            setResultTipoJSON(await request.json())
        } catch (error) {
            setmensajeAlerta('No hay conexion con el servidor intente mas tarde...')
            setShowMensajeAlerta(true)
            setTipoMensaje(false)
        }
    };

    const cantidadNoSync = async () => {
        let num = 0;
        try {
            const request = await fetch(APIURL + "api/GastoViajeDetalle/" + user + '/4');
            num = await request.json();
        } catch (error) {
            console.log('No hay sincronizados')
        }
        dispatch(noSincronizado({ nosync: num }))
    }

    const llenarCategoria = async (id) => {
        const request = await fetch(APIURL + 'api/CategoriaTipoGastoViaje/' + id);
        setResultCategoriaJSON(await request.json())
        setIdCategoria(null)
    };

    const llenarProveedor = async () => {
        setBuscandoProveedor(true)
        const request = await fetch('http://190.109.223.244:8083/api/proveedores/' + RTN + '/' + empresa);
        let data = await request.json()
        setProveedoresJSON(data)
        let cont = 0;
        data.forEach(element => {
            cont = cont + 1
        })
        if (cont === 0) {
            setmensajeAlerta('No se encontraron proveedores')
            setTipoMensaje(false)
            setDiasableProveedor(true)
        } else {
            setmensajeAlerta('Lista de Proveedores llena')
            setTipoMensaje(true)
            setDiasableProveedor(false)
        }
        setShowMensajeAlerta(true)
        setBuscandoProveedor(false)
    };

    const onSelectTipo = (selectedItem, index) => {
        resultTipoJSON.forEach(element => {
            if (element['nombre'] == selectedItem) {
                llenarCategoria(element['idTipoGastoViaje'])
                setDisabledDropDown(false)
            }
        })
    };

    const onSelectProveedor = (selectedItem, index) => {
        proveedoresJSON.forEach(element => {
            let elem = element['Identificacion'] + '\n' + element['Nombre'];
            if (elem == selectedItem) {
                setProveedor(element['CodigoProveedor'])
            }
        })
    }

    const onSelectCategoria = (selectedItem, index) => {
        resultCategoriaJSON.forEach(element => {
            if (element['nombre'] == selectedItem) {
                setIdCategoria((element['idCategoriaTipoGastoViaje']))
                setNombreCategoria(element['nombre'])
                let proveedorPre = element['proveedorPredefinido']
                if (proveedorPre.length > 0) {
                    setProveedor(element['proveedorPredefinido'])
                    setProveedorPredefinido(true)
                } else {
                    setProveedor('')
                    setProveedorPredefinido(false)
                }
            }
        })
        if (selectedItem == 'Alimentacion') {
            setAlimentacionIsSelected(true);
        } else {
            setAlimentacionIsSelected(false);
        }
    };

    const EnviarGasto = async () => {
        setEnviando(true)
        let facturaObligatoria = false;
        let descripcionObligatoria = false;
        let imagenObligatoria = false;
        if (resultCategoriaJSON) {
            resultCategoriaJSON.forEach(element => {
                if (element["idCategoriaTipoGastoViaje"] == IdCategoria) {
                    facturaObligatoria = element["facturaObligatoria"]
                    descripcionObligatoria = element["descripcion"]
                    imagenObligatoria = element["imagenObligatoria"]
                }
            })
        }

        if (IdCategoria == null) {
            alertas('Debe seleccionar una Categoria...', true, false)
            setEnviando(false)
            return
        }

        if (proveedor == '') {
            alertas('Debe Seleccionar un proveedor...', true, false)
            setEnviando(false)
            return
        }

        if (facturaObligatoria) {

            if (empresa == 'IMHN') {
                if (nFactura.length == 0) {
                    alertas('El campo No.Factura es obligatorio.', true, false)
                    setEnviando(false)
                    return
                } else if (nFactura.length != 19) {
                    alertas('El campo No.Factura esta incompleto.', true, false)
                    setEnviando(false)
                    return
                }
            } else {
                if (nFactura == '') {
                    alertas('El campo No.Factura es obligatorio.', true, false)
                    setEnviando(false)
                    return
                }
            }
        }
        if (descripcionObligatoria) {
            if (descripion == '') {
                alertas('El campo Descripcion es obligatorio.', true, false)
                setEnviando(false)
                return
            }
        }

        if (valor == 0) {
            alertas('El campo Valor es obligatorio.', true, false)
            setEnviando(false)
            return
        }

        if (date == '') {
            alertas('El campo Fecha Factura es obligatorio.', true, false)
            setEnviando(false)
            return
        }

        if (imagenObligatoria) {
            if (imagen == null) {
                alertas('La imagen de la factura es obligatoria.', true, false)
                setEnviando(false)
                return
            }
        }

        let hoy = moment().format();

        //Creacion de mensaje que se enviara a AX
        let messageAX = '';
        var weekOfYear = function (todayhoy) {
            var d = new Date(+todayhoy);
            d.setHours(0, 0, 0);
            d.setDate(d.getDate() + 4 - (d.getDay() || 7));
            return Math.ceil((((d - new Date(d.getFullYear(), 0, 1)) / 8.64e7) + 1) / 7);
        }
        let semana = weekOfYear(today)
        if (IdCategoria == idAlimentos) {
            messageAX = tipoAlimento['label'] + ' sem ' + semana + ' ' + nombre;
        } else {
            messageAX = nombreCategoria + ' sem ' + semana + ' ' + nombre;
        }

        try {
            const request = await fetch(APIURL + 'api/GastoViajeDetalle', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idCategoriaTipoGastoViaje: IdCategoria,
                    usuarioAsesor: user,
                    proveedor: proveedor,
                    noFactura: nFactura,
                    descripcion: descripion,
                    valorFactura: parseFloat(valor),
                    fechaFactura: showdate,
                    fechaCreacion: hoy,
                    imagen: imagen,
                    descripcionGasto: messageAX
                })
            })
            const result = await request.json();
            if (result['idEstado']) {
                setEnviado(true)
            } else {
                console.log(result)
                alertas('Gasto no enviado', true, false)
            }

        } catch (err) {
            console.log('no se envio: ' + err)
        }
        setEnviando(false)
    }

    const alertas = (mensaje, show, tipo) => {
        setmensajeAlerta(mensaje)
        setShowMensajeAlerta(show)
        setTipoMensaje(tipo)
    }


    useEffect(() => {
        onScreenLoad();
        cantidadNoSync();
    }, [])

    useEffect(() => {
        let array = [];
        if (resultTipoJSON) {
            resultTipoJSON.forEach(element => {
                array.push(element['nombre'])

            });
            setResultTipo(array)
        }
    }, [resultTipoJSON])

    useEffect(() => {
        let array = [];
        if (resultCategoriaJSON) {
            resultCategoriaJSON.forEach(element => {
                array.push(element['nombre'])
                if (element['nombre'] == 'Alimentacion') {
                    setIdAlimentos(element['idCategoriaTipoGastoViaje'])
                }
            });
            setResultCategoria(array)
        }
    }, [resultCategoriaJSON])

    useEffect(() => {
        let array = [];
        if (proveedoresJSON) {
            proveedoresJSON.forEach(element => {
                array.push(element['Identificacion'] + '\n' + element['Nombre'])
            });
            setProveedores(array)
        }
    }, [proveedoresJSON])

    useEffect(() => {
        if (enviado) {
            setmensajeAlerta('Su gasto fue enviado a revision')
            setShowMensajeAlerta(true)
            setTipoMensaje(true)
        }
        setNFactura('');
        setDescripcion('');
        setValor('');
        setDate('');
        setEnviado(false);
        setImagen(null)
        onScreenLoad()

    }, [enviado])

    return (
        <View><HeaderLogout />
            <ScrollView backgroundColor={'#fff'} style={{ height: '92%' }} showsVerticalScrollIndicator={false}>
                <SafeAreaView style={styles.container}>
                    <View style={styles.formulario}>
                        <StatusBar style="auto" />
                        <DropdownList data={resultTipo} defaultButtonText='Seleccione Tipo' onSelect={onSelectTipo} />
                        <DropdownList data={resultCategoria} defaultButtonText='Seleccione Categoria' onSelect={onSelectCategoria} disabled={disabledDropDown} />
                        {
                            alimentacionIsSelected &&
                            <RadioButtonRN data={dataAlimentos}
                                style={{ flex: 1, width: '95%' }}
                                boxStyle={{ flex: 1, alignItems: 'center', marginHorizontal: 0, paddingHorizontal: 10 }}
                                textStyle={{ color: '#000', fontSize: 16, fontFamily: 'sans-serif' }}
                                initial={1}
                                selectedBtn={(value) => setTipoAlimento(value)}
                                box={false}
                                textColor={'#000'}
                                icon={<FontAwesome5 name="check" size={15} color={'#005555'} />}
                                circleSize={10}
                            />
                        }
                        {
                            !proveedorPredefinido ?
                                <>
                                    <View style={styles.textInputDateContainer}>
                                        <Text style={styles.text}>{documentoFiscal}:</Text>
                                        <View style={styles.inputIconContainer}>
                                            <TextInput style={styles.input} keyboardType={'default'} value={RTN} onChangeText={(value) => setRTN(value)} />
                                            {
                                                !buscandoProveedor ?
                                                    <TouchableOpacity onPress={RTN != '' ? llenarProveedor : null}>
                                                        <FontAwesome5 name="search" size={IconSelect} color={'#1A4D2E'} />
                                                    </TouchableOpacity>
                                                    :
                                                    <FontAwesome5 name="spinner" size={IconSelect} color={'#1A4D2E'} />
                                            }
                                        </View>
                                    </View>
                                    <DropdownList defaultButtonText='Seleccione Proveedor' data={proveedores} onSelect={onSelectProveedor} search={true} searchPlaceHolder={'Buscar por nombre'} disabled={disableProveedor} />
                                </>
                                : null
                        }

                        <TextInputContainer title={'No. Factura:'} height={ObjectHeigth} placeholder={empresa == 'IMHN' ? 'XXX-XXX-XX-XXXXXXXX' : ''} maxLength={empresa == 'IMHN' ? 19 : null} teclado={empresa == 'IMHN' ? 'decimal-pad' : 'default'} value={nFactura} onChangeText={(value) => onChanceNFactura(value)} />
                        <TextInputContainer title='Descripcion: ' multiline={true} maxLength={300} Justify={true} height={80} onChangeText={(value) => setDescripcion(value)} value={descripion} />
                        <TextInputContainer title={'Valor en ' + moneda + ':'} height={ObjectHeigth} placeholder={'00.00'} teclado='decimal-pad' onChangeText={(value) => setValor(value)} value={valor.toString()} />
                        <TouchableOpacity onPress={() => SetOpenDate(true)}>
                            <View style={styles.textInputDateContainer}>
                                <Text style={styles.text}>Fecha Factura:</Text>
                                <View style={styles.inputIconContainer}>
                                    <TextInput style={styles.input} placeholder={'01/01/2000'} editable={false} value={date} />
                                    <FontAwesome5 name="calendar-alt" size={IconSelect} color={'#1A4D2E'} />
                                </View>
                            </View>
                        </TouchableOpacity>
                        {
                            openDate &&
                            <DateTimePicker mode='date' value={showdate} onChange={onchange} onTouchCancel={() => console.log('Cancelado')} />
                        }
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
                        <Buttons title={enviando ? 'Enviando..' : 'Enviar'} onPressFunction={EnviarGasto} disabled={enviando}></Buttons>
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
    },
    textInputDateContainer: {
        width: '100%',
        padding: 5,
    },
    text: {
        fontSize: TextoPantallas,
        fontWeight: 'bold',
        color: '#005555',
        fontFamily: 'sans-serif'
    },
    inputIconContainer: {
        flexDirection: 'row',
        width: '100%',
        alignItems: "center",
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        borderWidth: 1.5,
        borderColor: '#30475E',
        paddingHorizontal: 5,
    },
    input: {
        flex: 1,
        maxHeight: 100,
        fontSize: TextoPantallas,
        height: ObjectHeigth,
        borderRightWidth: 1,
        borderColor: '#30475E',
        marginRight: 5,
        color: '#121212',
        padding: 2,
        textAlign: "center",
        fontFamily: 'sans-serif'
    }
})

export default Viaje;