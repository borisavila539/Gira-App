import { StyleSheet, View, TouchableOpacity, SafeAreaView, Text, Alert } from "react-native";
import { Buttons, HeaderLogout } from "../Components/indexComponents";
import { TextInputContainer, DropdownList, MyImagePicker } from "../Components/indexComponents";
import { StatusBar } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { useState } from "react";
import DateTimePicker from '@react-native-community/datetimepicker';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useEffect } from "react";
import { useDispatch, useSelector, } from 'react-redux';
import { useRef } from "react";

const Viaje = (props) => {
    const [nFactura, setNFactura] = useState('');
    const [openDate, SetOpenDate] = useState(false);
    const [date, setDate] = useState('');
    const [showdate, setShowDate] = useState(new Date());
    const [today, setToday] = useState(new Date());
    const { empresa } = useSelector(state => state.usuario);
    const [resultTipo, setResultTipo] = useState();
    const [resultCategoria, setResultCategoria] = useState();
    const [resultTipoJSON, setResultTipoJSON] = useState();
    const dropDownRef = useRef({})

    const onChanceNFactura = (value) => {
        if (value.length == 16) {
            setNFactura(value[0] + value[1] + value[2] + '-' + value[3] + value[4] + value[5] + '-' + value[6] + value[7] + '-' + value[8] + value[9] + value[10] + value[11] + value[12] + value[13] + value[14] + value[15])
        } else if (value.length == 17) {
            value = value[0] + value[1] + value[2] + value[4] + value[5] + value[6] + value[8] + value[9] + value[11] + value[12] + value[13] + value[14] + value[15] + value[16]
            setNFactura(value);
        } else {
            setNFactura(value);
        }
    }
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
        console.log(event)
    }
    const onScreenLoad = async () => {
        const request = await fetch('http://10.100.1.27:5055/api/TipoGastoViaje/' + empresa);
        setResultTipoJSON(await request.json())

    }

    let resultCategoriaJSON;
    const llenarCategoria = async (id) => {
        const request = await fetch('http://10.100.1.27:5055/api/CategoriaTipoGastoViaje/' + id);
        resultCategoriaJSON = await request.json();
        let array = [];
        resultCategoriaJSON.forEach(element => {
            array.push(element['nombre'])
        })
        setResultCategoria(array)
    }

    const onSelectTipo = (selectedItem, index) => {
        resultTipoJSON.forEach(element => {
            if (element['nombre'] == selectedItem) {
                llenarCategoria(element['idTipoGastoViaje'])
            }
        })
    }
    const onSelectCategoria = (selectedItem, index) => {
        console.log(index)
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


    return (
        <ScrollView backgroundColor={'#fff'}>
            <HeaderLogout />
            <SafeAreaView style={styles.container}>
                <View style={styles.formulario}>
                    <DropdownList data={resultTipo} defaultButtonText='Seleccione Tipo' onSelect={onSelectTipo} />
                    <DropdownList data={resultCategoria} defaultButtonText='Seleccione Categoria' onSelect={onSelectCategoria} ref={dropDownRef} />
                    <StatusBar style="auto" />
                    <TextInputContainer title={'No. Factura:'} placeholder={'XXX-XXX-XX-XXXXXXXX'} maxLength={19} teclado='decimal-pad' value={nFactura} onChangeText={(value) => onChanceNFactura(value)} />
                    <TextInputContainer title='Descripcion: ' multiline={true} maxLength={300} Justify={true} height={60} />
                    <TextInputContainer title={'Valor:'} placeholder={'00.00'} teclado='decimal-pad' />
                    <TouchableOpacity onPress={() => SetOpenDate(true)}>
                        <View style={styles.textInputDateContainer}>
                            <Text style={styles.text}>Fecha Factura:</Text>
                            <View style={styles.inputIconContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder={'01/01/2000'}
                                    editable={false}
                                    value={date}
                                />
                                <FontAwesome5 name="calendar-alt" size={20} color={'#1A4D2E'} />
                            </View>
                        </View>
                    </TouchableOpacity>
                    {
                        openDate && (<DateTimePicker
                            mode='date'
                            value={showdate}
                            onChange={onchange}
                            onTouchCancel={() => console.log('Cancelado')}
                        />)
                    }
                    <MyImagePicker />
                    <Buttons title={'Enviar'}></Buttons>
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
        alignItems: "center",

    },
    textInputDateContainer: {
        width: '100%',
        padding: 5,
    },
    text: {
        fontSize: 16,
        width: '30%',
        fontWeight: 'bold',
        color: '#005555'
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
    }
})

export default Viaje;