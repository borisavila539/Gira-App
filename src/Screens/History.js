import { StyleSheet, View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import { HeaderLogout, DropdownList } from "../Components/indexComponents";
import DateTimePicker from '@react-native-community/datetimepicker';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useState } from "react";

const History = (props) => {
    const [openDateIni, setOpenDateIni] = useState(false);
    const [openDateFin, setOpenDateFin] = useState(false);
    const [dateIni, setDateIni] = useState('')
    const [dateFin, setDateFin] = useState('')
    const [showdateIni, setShowDateIni] = useState(new Date())
    const [showdateFin, setShowDateFin] = useState(new Date())

    const onchangeIni = (event, selectedDate) => {
        const currentDate = selectedDate.getDate() + '/' + (selectedDate.getMonth() + 1) + '/' + selectedDate.getFullYear();
        setOpenDateIni(false)
        if (event.type === 'set') {
            if (showdateFin) {
                if (selectedDate <= showdateFin) {
                    setDateIni(currentDate)
                    setShowDateIni(selectedDate)
                } else {
                    Alert.alert('La fecha inicial debe ser menor o igual que fecha final')
                }
            } else {
                setDateIni(currentDate)
                setShowDateIni(selectedDate)
            }
        }
        console.log(event)
    }

    const onchangeFIn = (event, selectedDate) => {
        const currentDate = selectedDate.getDate() + '/' + (selectedDate.getMonth() + 1) + '/' + selectedDate.getFullYear();
        setOpenDateFin(false)
        if (event.type === 'set') {
            if (showdateIni) {
                if (selectedDate >= showdateIni) {
                    setDateFin(currentDate)
                    setShowDateFin(selectedDate)
                } else {
                    Alert.alert('La fecha final debe ser mayor o igual que fecha inicial')
                }
            } else {
                setDateFin(currentDate)
                setShowDateFin(selectedDate)
            }
        }
        console.log(event)
    }
    return (
        <View style={styles.container}>
            <HeaderLogout />

            <View style={styles.filters}>
                <View style={styles.textInputDateContainer}>
                    <Text style={styles.text}>Inicio:</Text>
                    <TouchableOpacity onPress={() => setOpenDateIni(true)}>
                        <View style={styles.inputIconContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder={'01/01/2000'}
                                editable={false}
                                value={dateIni}
                            />
                            <FontAwesome5 name="calendar-alt" size={20} color={'#1A4D2E'} />
                        </View>
                    </TouchableOpacity>
                </View>



                <View style={styles.textInputDateContainer}>
                    <Text style={styles.text}>Fin:</Text>
                    <TouchableOpacity onPress={() => setOpenDateFin(true)}>
                        <View style={styles.inputIconContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder={'01/01/2000'}
                                editable={false}
                                value={dateFin}
                            />
                            <FontAwesome5 name="calendar-alt" size={20} color={'#1A4D2E'} />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ borderWidth:1, width:'33%'}}>
                        <DropdownList title='estado' />
                    </View>
            </View>
            {
                openDateIni && (<DateTimePicker
                    mode='date'
                    value={showdateIni}
                    onChange={onchangeIni}
                    onTouchCancel={() => console.log('Cancelado')}
                />)
            }
            {
                openDateFin && (<DateTimePicker
                    mode='date'
                    value={showdateFin}
                    onChange={onchangeFIn}
                    onTouchCancel={() => console.log('Cancelado')}
                />)
            }
        </View >
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    textInputDateContainer: {
        flexDirection: 'row',
        width:'33%',
        alignItems: "center",
        paddingVertical: 2,
    },
    text: {
        fontSize: 16,
        width: 42,
        textAlign: "right",
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
    filters: {
        width: '100%',
        flexDirection: 'row',
    }
})

export default History;