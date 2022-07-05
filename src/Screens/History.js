import { StyleSheet, View, Text } from "react-native";
import {HeaderLogout} from "../Components/indexComponents";

function History(props) {

    return (
        <View style={styles.container}>
            <HeaderLogout/>
            <Text style={{fontSize:30, color:'#000'}}>Historial</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex:1,
        width:'100%',
    },
    
})

export default History;