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
            <SelectDropdown
                data={props.data}
                label={props.labelField}
                //valueField={props.valueField}
                onSelect={props.onSelect}
                ref={props.ref}
                buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem
                }}
                defaultButtonText={props.defaultButtonText}
                buttonStyle={styles.button}
                renderDropdownIcon={() => Icon()}
                rowTextForSelection={props.rowTextForSelection}
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
    button: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#30475E',
        backgroundColor: '#fff',
        height: 35,
        width: '100%',
    }
})

export default DropdownList;