import { useState } from "react";
import { Text, View, StyleSheet, Modal, Pressable } from "react-native"
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { TextoPantallas } from "./Constant";
function MyAlert(props) {
    return (
        <Modal visible={props.visible} transparent={true}>
            <View style={styles.modal}>
                <View style={{ width: '80%', backgroundColor: '#fff', alignItems: "center", borderRadius: 10, paddingVertical: 15 }} >
                    <FontAwesome5 name={props.tipoMensaje ? 'check' : 'exclamation-triangle'} size={80} color={props.tipoMensaje ? 'green' : 'orange'} />
                    <Text style={{ fontSize: TextoPantallas, fontWeight: 'bold', marginTop: 10 ,fontFamily: 'sans-serif'}}>{props.mensajeAlerta}</Text>
                    <Pressable onPress={props.onPress} style={{ backgroundColor: '#0078AA', paddingVertical: 7, paddingHorizontal: 20, borderRadius: 5, marginTop: 15 }}>
                        <Text style={{ fontSize: TextoPantallas, fontWeight: 'bold', color: '#fff',fontFamily: 'sans-serif' }}>Ok</Text>
                    </Pressable>
                </View>
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

export default MyAlert;