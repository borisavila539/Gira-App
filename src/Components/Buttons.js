import React from "react";
import {
    TouchableOpacity,
    View,
    Text,
    StyleSheet,
} from 'react-native';

const Buttons= (props) => {
    return(
        <TouchableOpacity 
          style={{width:'100%'}}
          activeOpacity={0.5}  
          onPress={props.onPressFunction}
          hitSlop={{ top:10, bottom:20, left:20, right: 20}}
        >
          <View style={styles.button}>
            <Text style={[styles.text]}>{props.title}</Text>
          </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button:{
        marginTop:10,
        width:'100%',
        padding:10,
        alignItems: 'center',
        borderRadius:5,
        backgroundColor:'#069A8E',
        
      },
      text:{
        fontSize:20,
        color:'#fff',
        fontWeight:'bold',
      },
})

export default Buttons;