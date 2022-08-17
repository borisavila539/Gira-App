import SelectDropdown from 'react-native-select-dropdown'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { ObjectHeigth, IconSelect } from './constant';

import { View, StyleSheet, Text } from 'react-native'
import { TextoPantallas } from './constant';

function Icon() {
    return (
        <FontAwesome5 name='caret-down' size={IconSelect} color={'#1A4D2E'} />
    )
}
function iconFind() {
    return (
        <FontAwesome5 name='search' size={IconSelect} color={'#1A4D2E'} />
    )
}
const DropdownList = (props) => {

    return (
        <View style={styles.container}>
            <SelectDropdown
                data={props.data}
                label={props.labelField}
                onSelect={props.onSelect}
                buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem
                }}
                defaultButtonText={props.defaultButtonText}
                buttonStyle={styles.button}
                renderDropdownIcon={() => Icon()}
                rowTextForSelection={props.rowTextForSelection}
                search={props.search}
                searchPlaceHolder={props.searchPlaceHolder}
                
                renderSearchInputLeftIcon={iconFind}
                disableAutoScroll={true}
                disabled={props.disabled}
                rowStyle={{height:60, flex:1}}
                rowTextStyle={{fontFamily: 'sans-serif', fontSize: TextoPantallas}}
                buttonTextStyle={{fontFamily: 'sans-serif', fontSize: TextoPantallas}}                
            />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        padding: 5,
    },
    button: {
        borderRadius: 5,
        borderWidth: 1.5,
        borderColor: '#30475E',
        backgroundColor: '#f0f0f0',
        height: ObjectHeigth,
        width: '100%'
    }
})

export default DropdownList;