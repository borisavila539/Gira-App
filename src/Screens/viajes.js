import { StyleSheet, View, TouchableOpacity, SafeAreaView, Text, Alert, Image, Modal, Pressable } from "react-native";
import { Buttons, HeaderLogout } from "../Components/indexComponents";
import { TextInputContainer, DropdownList, myAlert } from "../Components/indexComponents";
import { StatusBar } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { useState } from "react";
import DateTimePicker from '@react-native-community/datetimepicker';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useEffect } from "react";
import { useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import RadioButtonRN from "radio-buttons-react-native";


const Viaje = (props) => {
    const [nFactura, setNFactura] = useState('');
    const [descripion, setDescripcion] = useState('');
    const [valor, setValor] = useState(0.00);
    const [openDate, SetOpenDate] = useState(false);
    const [date, setDate] = useState('');
    const [showdate, setShowDate] = useState(new Date());
    const { empresa, user } = useSelector(state => state.usuario);
    const [resultTipo, setResultTipo] = useState([]);
    const [resultCategoria, setResultCategoria] = useState([]);
    const [resultTipoJSON, setResultTipoJSON] = useState([]);
    const [resultCategoriaJSON, setResultCategoriaJSON] = useState([]);
    const [IdCategoria, setIdCategoria] = useState(null);
    const [enviado, setEnviado] = useState(false);
    const [imagen, setImagen] = useState(null);
    const [modalVisible, SetModalVisible] = useState(false);
    const [modalCameraUpload, setModalCameraUpload] = useState(false);
    const [today, setToday] = useState(new Date());
    const [alimentacionIsSelected, setAlimentacionIsSelected] = useState(false);
    const [alimento, setAlimento] = useState('');
    const [descripcionGasto, setDescripcionGasto] = useState('');
    const [mensajeAlerta, setmensajeAlerta] = useState('');
    const [showMensajeAlerta, setShowMensajeAlerta] = useState(false);
    const [tipoMensaje, setTipoMensaje] = useState(false);
    const [RTN, setRTN] = useState('');
    const [proveedoresJSON, setProveedoresJSON] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const dataAlimentos = [{ label: 'Desayuno' }, { label: 'Almuerzo' }, { label: 'Cena' }]


    let result;

    const pickImage = async () => {
        result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images = "Images",
            base64: true,
            allowsEditing: true,
            quality: 1
        });
        if (!result.cancelled) {
            console.log(result.base64)
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
                Alert.alert('Debe seleccionar una fecha correcta')
            }
        }
    };

    const onScreenLoad = async () => {
        const request = await fetch('http://10.100.1.27:5055/api/TipoGastoViaje/' + empresa);
        setResultTipoJSON(await request.json())
    };

    const llenarCategoria = async (id) => {
        const request = await fetch('http://10.100.1.27:5055/api/CategoriaTipoGastoViaje/' + id);
        setResultCategoriaJSON(await request.json())
        setIdCategoria(null)
    };

    const llenarProveedor = async () => {
        const request = await fetch('http://190.109.223.244:8083/api/proveedores/' + RTN + '/' + empresa);
        let data = await request.json()
        setProveedoresJSON(data)
        console.log(data)
        let cont=0;
        data.forEach(element=>{
            cont = cont + 1
        })
        console.log(cont)
        if (cont === 0) {
            setmensajeAlerta('No se encontraron proveedores')
            setTipoMensaje(false)           
        } else {
            setmensajeAlerta('Lista de Proveedores llena')
            setTipoMensaje(true)
        }
        setShowMensajeAlerta(true)
        
        
    };

    const onSelectTipo = (selectedItem, index) => {
        resultTipoJSON.forEach(element => {
            if (element['nombre'] == selectedItem) {
                llenarCategoria(element['idTipoGastoViaje'])
            }
        })
    };

    const onSelectCategoria = (selectedItem, index) => {
        resultCategoriaJSON.forEach(element => {
            if (element['nombre'] == selectedItem) {
                setIdCategoria((element['idCategoriaTipoGastoViaje']))
                console.log('categoria ' + element['idCategoriaTipoGastoViaje'])
            }
        })
        if (selectedItem == 'Alimentacion') {
            setAlimentacionIsSelected(true);
        } else {
            setAlimentacionIsSelected(false);
        }
    };

    const EnviarGasto = async () => {
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
            setmensajeAlerta('Debe seleccionar una categoria')
            setShowMensajeAlerta(true)
            setTipoMensaje(false)
            return
        }
        if (facturaObligatoria) {
            if (nFactura == '') {
                setmensajeAlerta('Debe llenar el numero de factura')
                setShowMensajeAlerta(true)
                setTipoMensaje(false)
                return
            }
        }
        if (descripcionObligatoria) {
            if (descripion == '') {
                setmensajeAlerta('Debe llenar la descripcion')
                setShowMensajeAlerta(true)
                setTipoMensaje(false)
                return
            }
        }

        if (valor == 0) {
            setmensajeAlerta('Debe ingresar el valor del gasto')
            setShowMensajeAlerta(true)
            setTipoMensaje(false)
            return
        }

        if (date == '') {
            setmensajeAlerta('Debe seleccionar la fecha de la factura')
            setShowMensajeAlerta(true)
            setTipoMensaje(false)
            return
        }

        if (imagenObligatoria) {
            if (imagen == null) {
                setmensajeAlerta('Debe subir una imagen de la factura')
                setShowMensajeAlerta(true)
                setTipoMensaje(false)
                return
            }
        }

        let hoy = new Date();
        try {
            const request = await fetch('http://10.100.1.27:5055/api/GastoViajeDetalle', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idCategoriaTipoGastoViaje: IdCategoria,
                    usuarioAsesor: user,
                    proveedor: "1234",
                    noFactura: nFactura,
                    descripcion: descripion,
                    valorFactura: valor,
                    fechaFactura: showdate,
                    fechaCreacion: hoy,
                    imagen: imagen,
                    descripcionGasto: descripcionGasto
                })
            })
            const result = await request.json();
            if (result['idEstado']) {
                console.log(result)
                setEnviado(true)
            } else {
                setmensajeAlerta('Gasto no enviado')
                setShowMensajeAlerta(true)
                setTipoMensaje(false)
            }

        } catch (err) {
            console.log('no se envio: ' + err)
        }
    }


    useEffect(() => {
        onScreenLoad();
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
            });
            setResultCategoria(array)
        }
    }, [resultCategoriaJSON])

    useEffect(() => {
        let array = [];
        if (proveedoresJSON) {
            proveedoresJSON.forEach(element => {
                array.push(element['Identificacion'] + ' - ' + element['Nombre'])
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
        <ScrollView backgroundColor={'#fff'}>
            <HeaderLogout />
            <SafeAreaView style={styles.container}>
                <View style={styles.formulario}>
                    <StatusBar style="auto" />
                    <DropdownList data={resultTipo} defaultButtonText='Seleccione Tipo' onSelect={onSelectTipo} />
                    <DropdownList data={resultCategoria} defaultButtonText='Seleccione Categoria' onSelect={onSelectCategoria} />
                    {
                        alimentacionIsSelected &&
                        <RadioButtonRN data={dataAlimentos}
                            style={{ flex: 1, width: '95%', }}
                            boxStyle={{ flex: 1, alignItems: 'center', marginHorizontal: 0, paddingHorizontal: 10 }}
                            textStyle={{ color: '#000', fontSize: 16 }}
                            initial={1}
                            selectedBtn={value => console.log(value)}
                            box={false}
                            textColor={'#000'}
                            icon={<FontAwesome5 name="check" size={15} color={'#005555'} />}
                            circleSize={10}
                        />
                    }
                    <View style={styles.textInputDateContainer}>
                        <Text style={styles.text}>RTN:</Text>
                        <View style={styles.inputIconContainer}>
                            <TextInput style={styles.input} keyboardType={empresa == 'IMHN' ? 'decimal-pad' : 'default'} value={RTN} onChangeText={(value) => setRTN(value)} />
                            <TouchableOpacity onPress={llenarProveedor}>
                                <FontAwesome5 name="search" size={20} color={'#1A4D2E'} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <DropdownList defaultButtonText='Seleccione Proveedor' data={proveedores} onSelect={() => console.log('seleccccionado')} search={true} searchPlaceHolder={'Buscar por nombre'} />
                    <TextInputContainer title={'No. Factura:'} placeholder={empresa == 'IMHN' ? 'XXX-XXX-XX-XXXXXXXX' : ''} maxLength={empresa == 'IMHN' ? 19 : null} teclado={empresa == 'IMHN' ? 'decimal-pad' : 'default'} value={nFactura} onChangeText={(value) => onChanceNFactura(value)} />
                    <TextInputContainer title='Descripcion: ' multiline={true} maxLength={300} Justify={true} height={60} onChangeText={(value) => setDescripcion(value)} value={descripion} />
                    <TextInputContainer title={'Valor:'} placeholder={'00.00'} teclado='decimal-pad' onChangeText={(value) => setValor(parseFloat(value))} value={valor.toString()} />
                    <TouchableOpacity onPress={() => SetOpenDate(true)}>
                        <View style={styles.textInputDateContainer}>
                            <Text style={styles.text}>Fecha Factura:</Text>
                            <View style={styles.inputIconContainer}>
                                <TextInput style={styles.input} placeholder={'01/01/2000'} editable={false} value={date} />
                                <FontAwesome5 name="calendar-alt" size={20} color={'#1A4D2E'} />
                            </View>
                        </View>
                    </TouchableOpacity>
                    {
                        openDate &&
                        <DateTimePicker mode='date' value={showdate} onChange={onchange} onTouchCancel={() => console.log('Cancelado')} />
                    }
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
                    <Buttons title={'Enviar'} onPressFunction={EnviarGasto}></Buttons>

                    <Modal visible={showMensajeAlerta} transparent={true}>
                        <View style={styles.modal}>
                            <View style={{ width: '80%', backgroundColor: '#fff', alignItems: "center", borderRadius: 10, paddingVertical: 15 }} >
                                <FontAwesome5 name={tipoMensaje ? 'check' : 'exclamation-triangle'} size={80} color={tipoMensaje ? 'green' : 'orange'} />
                                <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 10 }}>{mensajeAlerta}</Text>
                                <Pressable onPress={() => setShowMensajeAlerta(false)} style={{ backgroundColor: '#0078AA', paddingVertical: 7, paddingHorizontal: 20, borderRadius: 5, marginTop: 15 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>Ok</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Modal>
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
    textInputDateContainer: {
        width: '100%',
        padding: 5,
    },
    text: {
        fontSize: 16,
        width: '30%',
        fontWeight: 'bold',
        color: '#005555',
    },
    inputIconContainer: {
        flexDirection: 'row',
        width: '100%',
        alignItems: "center",
        backgroundColor: '#fff',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#30475E',
        paddingHorizontal: 5,
    },
    input: {
        flex: 1,
        maxHeight: 100,
        fontSize: 16,
        backgroundColor: '#fff',
        height: 35,
        borderRightWidth: 1,
        borderColor: '#30475E',
        marginRight: 5,
        color: '#121212',
        padding: 2,
        textAlign: "center",
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

export default Viaje;