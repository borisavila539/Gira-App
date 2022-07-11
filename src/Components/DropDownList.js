import SelectDropdown from 'react-native-select-dropdown'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { View, StyleSheet, Text } from 'react-native'

function Icon() {
    return (
        <FontAwesome5 name='caret-down' size={20} color={'#1A4D2E'} />
    )
}
const DropdownList = (props) => {

    return (
        <View style={styles.container}>
            <Text style={styles.text}>{props.title}</Text>
            <SelectDropdown
                data={props.data}
                onSelect={(selectedItem, index) => {
                    console.log(selectedItem, index)
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem
                }}
                defaultButtonText={props.defaultButtonText}
                buttonStyle={styles.button}
                renderDropdownIcon={() => Icon()}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        padding: 5
    },
    text: {
        fontSize: 16,
        width: '30%',
        fontWeight: 'bold',
        color:'#005555'
    },
    button: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#30475E',
        backgroundColor: '#fff',
        height: 35,
        width: '70%',
    }
})

export default DropdownList;