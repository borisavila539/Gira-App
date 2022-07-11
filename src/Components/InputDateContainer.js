import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native"
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from "react";


const InputDateContainer = (props) => {
    const [openDate, SetOpenDate] = useState(false)
    const [date, setDate] = useState('')
    const [showdate, setShowDate] = useState(new Date())

    const onchange = (event, selectedDate) => {
        const currentDate = selectedDate.getDate() + '/' + (selectedDate.getMonth() + 1) + '/' + selectedDate.getFullYear();
        SetOpenDate(false)
        if (event.type === 'set') {
            setDate(currentDate)
            setShowDate(selectedDate)
        }
        console.log(event)
    }
    return (
        <TouchableOpacity onPress={() => SetOpenDate(true)}>
            <View style={styles.textInputDateContainer}>
                <Text style={styles.text}>{props.title}</Text>
                <View style={styles.inputIconContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder={'01/01/2000'}
                        editable={false}
                        value={date}
                        onPressIn={() => SetOpenDate(props.Opendate)}
                    />
                    <FontAwesome5 name="calendar-alt" size={20} color={'#1A4D2E'} />
                </View>
                {
                    openDate && (<DateTimePicker
                        mode='date'
                        value={showdate}
                        onChange={onchange}
                        onTouchCancel={() => console.log('cancelado')}
                    />)
                }
            </View>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    textInputDateContainer: {
        flexDirection: 'row',
        width: '100%',

        alignItems: "center",
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
        width: '70%',
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

export default InputDateContainer;