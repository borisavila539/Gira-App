import { StyleSheet, View, Text } from "react-native";
import {HeaderLogout} from "../Components/indexComponents";

const NoSync = (props) => {

    return (
        <View style={styles.container}>
            <HeaderLogout/>
            <Text style={{fontSize:30, color:'#000'}}>NoSync</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        width:'100%',
        backgroundColor:'#0f0',
    },
    
})

export default NoSync;