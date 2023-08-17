import { StyleSheet, View, TouchableOpacity, SafeAreaView, Text, ActivityIndicator, Platform } from "react-native";
import { Buttons, HeaderLogout } from "../Components/indexComponents";
import { TextInputContainer, DropdownList, MyAlert, ModalCameraUpload } from "../Components/indexComponents";
import { StatusBar } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { useState } from "react";
import DateTimePicker from '@react-native-community/datetimepicker';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import RadioButtonRN from 'radio-buttons-react-native';
import { noSincronizado, terminarSesion } from '../store/slices/usuarioSlice';
import moment from "moment";
import { IconSelect, ObjectHeigth, TextoPantallas } from "../Components/constant";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as MediaLibrary from 'expo-media-library';
import RNDateTimePicker from "@react-native-community/datetimepicker";

const Viaje = (props) => {
    const dispatch = useDispatch();
    const [nFactura, setNFactura] = useState('');
    const [descripion, setDescripcion] = useState('');
    const [ exento, setExento] = useState('');
    const [ gravado, setGravado] = useState('');
    const [valor, setValor] = useState('');
    const [openDate, SetOpenDate] = useState(false);
    const [date, setDate] = useState('');
    const [showdate, setShowDate] = useState(new Date());
    const { empresa, user, nombre, documentoFiscal, APIURLAVENTAS, APIURLPROXY } = useSelector(state => state.usuario);
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
    const [buscandoProveedor, setBuscandoProveedor] = useState(false);
    const [serie, setSerie] = useState('')
    const [impuesto, setImpuesto] = useState(0);
    const [combustiblesJson,setCombustiblesJson] = useState([]);
    const [combustibles,setCombustibles] = useState([]);
    const [combustibleSelect, setCombustibleSelect] = useState('')
    const [combustibleID, setCombustibleId] = useState(0)

    let result;

    const pickImage = async () => {
        const permiso = await ImagePicker.requestCameraPermissionsAsync();
        if (permiso.granted) {
            result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images = "Images",
                base64: true,
                allowsEditing: true,
                quality: 0.2
            });
            if (!result.canceled ){
                setImagen(result.assets[0].base64);
                setModalCameraUpload(false);
            }
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status == "granted") {
                await MediaLibrary.saveToLibraryAsync(result.assets[0].uri);

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
            quality: 0.2
        });
        if (!result.canceled) {
            setImagen(result.assets[0].base64);
            setModalCameraUpload(false);
        }
    };

    const onChanceNFactura = (value) => {
        if (empresa == 'IMHN') {
            if (value.length == 16) {
                setNFactura(value[0] + value[1] + value[2] + '-' + value[3] + value[4] + value[5] + '-' + value[6] + value[7] + '-' + value[8] + value[9] + value[10] + value[11] + value[12] + value[13] + value[14] + value[15])
            } else if (value.length == 18) {
                value = value.replace('-', '').replace('-', '').replace('-', '')
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
            const request = await fetch(APIURLAVENTAS + 'Gira/TipoGasto/' + empresa);
            setResultTipoJSON(await request.json())
        } catch (error) {
            setmensajeAlerta('No hay conexion con el servidor intente mas tarde...')
            setShowMensajeAlerta(true)
            setTipoMensaje(false)
            await AsyncStorage.removeItem("usuario");
            dispatch(terminarSesion());
        }
        try {
            const request = await fetch(APIURLAVENTAS + 'Gira/CategoriaGasto/' + empresa);
            setResultCategoriaJSON(await request.json())
            setIdCategoria(null)
        } catch (err) {
            setmensajeAlerta('No hay conexion con el servidor intente mas tarde...')
            setShowMensajeAlerta(true)
            setTipoMensaje(false)
        }

        if(empresa == 'IMGT'){
            const request = await fetch(APIURLAVENTAS + 'Gira/combustibles');
            setCombustiblesJson(await request.json());
            setCombustibleId(0);
        }
    }

    const cantidadNoSync = async () => {
        let num = 0;
        try {
            const request = await fetch(APIURLAVENTAS + "Gira/GastoViajeDetalle/" + user + '/4');
            num = await request.json();
        } catch (error) {

        }
        dispatch(noSincronizado({ nosync: num }))
    }

    const llenarCategoria = async (id) => {
        let array = [];
        resultCategoriaJSON.forEach(element => {
            if (element["IdTipoGastoViaje"] == id && element["activo"] == true) {
                array.push(element['CategoriaNombre'])
                if (element['CategoriaNombre'] == 'Alimentacion') {
                    setIdAlimentos(element['idCategoriaTipoGastoViaje'])
                }
            }
        })
        setResultCategoria(array)
    };

    const getImpuesto = async () => {
        if (empresa == 'IMHN') {
            try {
                await fetch(APIURLAVENTAS + 'Gira/GrupoImpuesto/' + empresa).then(resp => {
                    let data = resp.json().then(result => {
                        setImpuesto(parseFloat(result.Content.replace('"').replace('"')))
                    })
                })
            } catch (err) {
                console.log(err)
            }
        }
    }

    const llenarProveedor = async () => {
        setBuscandoProveedor(true)
        try {
            const request = await fetch(APIURLPROXY + 'api/proveedores/' + RTN + '/' + empresa);
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
        } catch (err) {
            setmensajeAlerta('No hay conexion con el servidor intente mas tarde...')
            setTipoMensaje(false)
        }
        setShowMensajeAlerta(true)
        setBuscandoProveedor(false)
    };

    const onSelectTipo = (selectedItem, index) => {
        resultTipoJSON.forEach(element => {
            if (element['Nombre'] == selectedItem) {
                llenarCategoria(element['Id'])
                setDisabledDropDown(false)
                setCombustibleId(null)

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

    const onSelectCombustible = (selectedItem, index) =>{
        combustiblesJson.forEach(element =>{
            let elem = element['Nombre'];

            if(elem == selectedItem ){
                setCombustibleId(element['Id'])
            }
        })
    }

    const onSelectCategoria = (selectedItem, index) => {
        resultCategoriaJSON.forEach(element => {
            if (element['CategoriaNombre'] == selectedItem) {
                setIdCategoria((element['idCategoriaTipoGastoViaje']))
                setNombreCategoria(element['CategoriaNombre'])
                let proveedorPre = element['ProveedorPredefinido']
                if (proveedorPre) {
                    if (proveedorPre.length > 0) {
                        setProveedor(element['ProveedorPredefinido'])
                    }
                }
            }
        })
        if (selectedItem == 'Alimentacion') {
            setAlimentacionIsSelected(true);
        } else {
            setAlimentacionIsSelected(false);
            setProveedor('')
        }

        setRTN('')
        setNFactura('')
        setProveedoresJSON([])
        setDiasableProveedor(true)
        setCombustibleId(null)
    };

    const EnviarGasto = async () => {
        setEnviando(true)
        let facturaObligatoria = false;
        let descripcionObligatoria = false;
        let imagenObligatoria = false;
        if (resultCategoriaJSON) {
            resultCategoriaJSON.forEach(element => {
                if (element["idCategoriaTipoGastoViaje"] == IdCategoria) {
                    facturaObligatoria = element["FacturaObligatoria"]
                    descripcionObligatoria = element["Descripcion"]
                    imagenObligatoria = element["imagen"]
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
        if(combustibleID == null && nombreCategoria == 'Combustible' && empresa == 'IMGT'){
            alertas('Debe Seleccionar un combustible...', true, false)
            setEnviando(false)
            return
        }

        if (empresa == 'IMGT') {
            if (serie.length == 0) {
                alertas('El campo de No. Serie es obligatorio', true, false)
                setEnviando(false)
                return
            }

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
        if (empresa == 'IMHN') {

            if (exento == '' && gravado == '') {
                alertas('Debe llenar el importe Gravado o exento.', true, false)
                setEnviando(false)
                return
            }
        }

        if (empresa == 'IMGT') {
            //Meter validaciones de combustible y exento de hospedaje
            if (valor == '') {
                alertas('Debe llenar el importe Total', true, false)
                setEnviando(false)
                return
            }
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

        let resul = JSON.stringify({
            IdCategoriaTipoGastoViaje: IdCategoria,
            UsuarioAsesor: user,
            Proveedor: proveedor,
            NoFactura: nFactura,
            Descripcion: descripion,
            ValorFactura: valor,
            FechaFactura: showdate,
            FechaCreacion: hoy,
            Imagen: imagen,
            DescripcionGasto: messageAX,
            Serie: serie,
            importeExento: parseFloat(exento ? exento : 0),
            importeGravado: parseFloat(gravado ? gravado : 0),
            CombustibleID: empresa == 'IMGT' ? combustibleID : null
        });


        try {
            let verificar = false;
            if (nFactura != '') {
                const verificacion = await fetch(APIURLAVENTAS + 'Gira/GastoViajeDetalle/verificar/' + nFactura + "/" + proveedor + "/"+ (serie != ''? serie: '-'));
                await verificacion.json().then(async (res) => {
                    if (!res) {
                        const request = await fetch(APIURLAVENTAS + 'Gira/GastoViajeDetalle', {
                            method: 'POST',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                IdCategoriaTipoGastoViaje: IdCategoria,
                                UsuarioAsesor: user,
                                Proveedor: proveedor,
                                NoFactura: nFactura,
                                Descripcion: descripion,
                                ValorFactura: valor,
                                FechaFactura: showdate,
                                FechaCreacion: hoy,
                                Imagen: imagen,
                                DescripcionGasto: messageAX,
                                Serie: serie,
                                importeExento: parseFloat(exento ? exento : 0),
                                importeGravado: parseFloat(gravado ? gravado : 0),
                                CombustibleID: empresa == 'IMGT' ? combustibleID : null
                            })
                        })

                        try {
                            let result = await request.json();

                            if (result == true) {
                                setEnviado(true)
                            } else {
                                alertas('Gasto no enviado', true, false)
                            }
                        } catch (err) {
                            console.log("error json")
                        }
                    } else {
                        alertas('Factura: ' + nFactura + ' ya existe para proveedor seleccionado', true, false)
                        setEnviando(false)
                    }

                });

            } else {
                const request = await fetch(APIURLAVENTAS + 'Gira/GastoViajeDetalle', {
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
                        valorFactura: valor,
                        fechaFactura: showdate,
                        fechaCreacion: hoy,
                        imagen: imagen,
                        descripcionGasto: messageAX,
                        serie: serie,
                        importeExento: parseFloat(exento ? exento : 0),
                        CombustibleID: empresa == 'IMGT' ? combustibleID : null
                    })
                })

                try {
                    let result = await request.json();
                    if (result) {
                        setEnviado(true)
                    } else {
                        alertas('Gasto no enviado', true, false)
                    }
                } catch (err) {
                    console.log("error json")
                }
            }


        } catch (err) {

            setmensajeAlerta('No hay conexion con el servidor intente mas tarde...')
            setShowMensajeAlerta(true)
            setTipoMensaje(false)
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
        getImpuesto();
    }, [])

    useEffect(() => {
        let array = [];
        if (resultTipoJSON) {
            resultTipoJSON.forEach(element => {
                array.push(element['Nombre'])

            });
            setResultTipo(array)
        }
    }, [resultTipoJSON])

    useEffect(() => {
        let array = [];
        if (proveedoresJSON) {
            proveedoresJSON.forEach(element => {
                array.push(element['Identificacion'] + '\n' + element['Nombre'])
            });
            setProveedores(array)
        }
    }, [proveedoresJSON])

    useEffect(()=>{
        let array = [];
        if(combustiblesJson){
            combustiblesJson.forEach(element =>{
                array.push(element['Nombre'])
            });
            setCombustibles(array)
        }
    },[combustiblesJson])

    useEffect(() => {
        if (enviado) {
            alertas('Su gasto fue enviado a revision', true, true)
            setNFactura('');
            setDescripcion('');
            setValor('');
            setDate('');
            setGravado('');
            setExento('');
            setEnviado(false);
            setImagen(null);
            setSerie("")
        }



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
                                textStyle={{ color: '#000', fontSize: 16 }}
                                initial={1}
                                selectedBtn={(value) => setTipoAlimento(value)}
                                box={false}
                                textColor={'#000'}
                                icon={<FontAwesome5 name="check" size={15} color={'#005555'} />}
                                circleSize={10}
                            />
                        }

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
                                        < ActivityIndicator size='small' color={'#000'} />
                                }
                            </View>
                        </View>
                        <DropdownList defaultButtonText='Seleccione Proveedor' data={proveedores} onSelect={onSelectProveedor} search={true} searchPlaceHolder={'Buscar por nombre'} disabled={disableProveedor} />
                        {
                            combustiblesJson.length > 0 && nombreCategoria == 'Combustible' &&
                            <DropdownList defaultButtonText= 'Seleccione Combustible' data={combustibles} onSelect={onSelectCombustible} search={true} searchPlaceHolder={'Buscar por nombre'} disabled={false}/>
                        }
                        {
                            empresa == 'IMGT' &&
                            <TextInputContainer editable={proveedor != '' ? true : false} title={'No. Serie'} height={ObjectHeigth} value={serie} onChangeText={(value) => setSerie(value)} />
                        }
                        <TextInputContainer editable={proveedor != '' ? true : false} title={'No. Factura:'} height={ObjectHeigth} placeholder={empresa == 'IMHN' ? 'XXX-XXX-XX-XXXXXXXX' : ''} maxLength={empresa == 'IMHN' ? 19 : null} teclado={empresa == 'IMHN' ? 'decimal-pad' : 'default'} value={nFactura} onChangeText={(value) => onChanceNFactura(value)} />
                        <TextInputContainer title='Descripcion: ' multiline={true} maxLength={200} Justify={true} height={80} onChangeText={(value) => setDescripcion(value)} value={descripion} />
                        {
                            empresa == 'IMHN' &&
                            <>
                                <TextInputContainer title={'Importe Gravado:'} height={ObjectHeigth} placeholder={'0.00'} teclado='decimal-pad' onChangeText={(value) => { setGravado(value); setValor(parseFloat(exento ? exento : 0) + parseFloat(value ? value : 0) * (1 + impuesto) + '') }} value={gravado} />
                                <TextInputContainer title={'Importe Exento:'} height={ObjectHeigth} placeholder={'0.00'} teclado='decimal-pad' onChangeText={(value) => { setExento(value); setValor(parseFloat(value ? value : 0) + parseFloat(gravado ? gravado : 0) * (1 + impuesto) + '') }} value={exento} />
                            </>
                        }
                        {
                            empresa == 'IMGT' && nombreCategoria == 'Hospedaje' &&
                            <>
                                <TextInputContainer title={'Importe Exento:'} height={ObjectHeigth} placeholder={'0.00'} teclado='decimal-pad' onChangeText={(value) => { setExento(value) }} value={exento} />
                            </>
                        }
                        {
                            empresa == 'IMGT' && nombreCategoria == 'Combustible' &&
                            <>
                                <TextInputContainer title={'Cantidad Galones:'} height={ObjectHeigth} placeholder={'0.00'} teclado='decimal-pad' onChangeText={(value) => { setExento(value) }} value={exento} />
                            </>
                        }
                        {
                            empresa == 'IMHN' &&
                            <TextInputContainer title={'Total:'} height={ObjectHeigth} placeholder={'0.00'} value={parseFloat(valor) > 0 ? parseFloat(valor).toFixed(2) : ""} editable={false} />
                        }

                        {
                            empresa == 'IMGT' &&
                            <TextInputContainer title={'Total:'} height={ObjectHeigth} placeholder={'0.00'} teclado='decimal-pad' onChangeText={(value) => { setValor(value) }} value={valor} editable={true} />
                        }
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
                            <RNDateTimePicker 
                                testID="dateTimePicker" 
                                display="default"
                                mode="date" value={showdate} 
                                onChange={onchange} 
                                style={{width:"100%"}}/>
                            //<DateTimePicker testID="dateTimePicker" display="spinner" mode='date'  value={showdate} onChange={onchange} />
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
        //fontFamily: 'sans-serif'
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
        //fontFamily: 'sans-serif'
    }
})

export default Viaje;