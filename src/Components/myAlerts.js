import { Text, View, StyleSheet, Modal } from "react-native"
const myAlert = (props) => {
    console.log('modal')
    return (
        <Modal visible={props.visible} transparent={true} animationType="fade">
            <View style={styles.modal}>
                <Text>{props.alert}nada</Text>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        width: '100%'
    },
    modal: {
        backgroundColor: '#00000099',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
})

export default myAlert;