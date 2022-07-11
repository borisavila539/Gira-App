import { StyleSheet, View, TouchableOpacity, SafeAreaView, Text } from "react-native";
import { Buttons, HeaderLogout } from "../Components/indexComponents";
import { TextInputContainer, DropdownList, MyImagePicker } from "../Components/indexComponents";
import { StatusBar } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { useState } from "react";
import DateTimePicker from '@react-native-community/datetimepicker';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const Viaje = (props) => {
    const [nFactura, setNFactura] = useState('')
    const [openDate, SetOpenDate] = useState(false)
    const [date, setDate] = useState('')
    const [showdate, setShowDate] = useState(new Date())

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
            setDate(currentDate)
            setShowDate(selectedDate)
        }
        console.log(event)
    }
    let Categoria = ['Hospedaje', 'Alimentacion', 'Combustible', 'Papeleria', 'Peaje', 'Otros']
    let Tipo = ['Gastos de Viaje', 'Gastos de Combustible', 'Gastos por Deprecuacion'];

    return (
        <ScrollView backgroundColor={'#fff'}>
            <HeaderLogout />
            <SafeAreaView style={styles.container}>
                <View style={styles.formulario}>
                    <DropdownList title='Tipo:' data={Tipo} defaultButtonText='Seleccione Tipo' />
                    <DropdownList title='Categoria:' data={Categoria} defaultButtonText='Seleccione Categoria' />
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
                                <FontAwesome5 name="calendar-alt" size={20} color={'#1A4D2E'}/>
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
    textInputDateContainer:{
        flexDirection: 'row',
        width: '100%',
        
        alignItems: "center",
        padding: 5,
    },
    text: {
        fontSize: 16,
        width: '30%',
        fontWeight: 'bold',
        color:'#005555'
    },
    inputIconContainer:{
        flexDirection: 'row',
        width: '70%',
        alignItems: "center",
        backgroundColor:'#fff',
        borderRadius: 5,
        borderWidth:1,
        borderColor: '#30475E',
        paddingHorizontal:5,
    },
    input: {
        flex: 1,
        maxHeight: 100,
        fontSize: 16,
        backgroundColor: '#fff',
        height: 35,
        borderRightWidth:1,
        borderColor:'#30475E',
        marginRight:5,
        color: '#121212',
        padding: 2,
        textAlign: "center",
    }
})

export default Viaje;