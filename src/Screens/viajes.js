import { StyleSheet, View, Text } from "react-native";
import {HeaderLogout} from "../Components/indexComponents";
import {TextInputContainer} from "../Components/indexComponents";

function Viaje(props) {

    return (
        <View style={styles.container}>
            <HeaderLogout/>
            <View style={styles.formulario}>
            <TextInputContainer title={'Valor:'} placeholder={'00.00'}/>
            <TextInputContainer title={'Fecha:'} placeholder={'01/01/2000'}/>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex:1,
        width:'100%',
        backgroundColor:'#C4DFAA',
        alignItems: "center",
        
    },
    formulario:{
        width:'80%',
        maxWidth: 500,
        justifyContent: "center",
        alignItems: "center",
    }
    
})

export default Viaje;