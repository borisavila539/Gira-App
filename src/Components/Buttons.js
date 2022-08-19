import React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { TextButtons } from "./Constant";

const Buttons = (props) => {
  return (
    <TouchableOpacity
      style={{ width: '100%' }}
      activeOpacity={0.5}
      onPress={props.onPressFunction}
      hitSlop={{ top: 10, bottom: 20, left: 20, right: 20 }}
      disabled={props.disabled}
    >
      <View style={styles.button}>
        <Text style={[styles.text]}>{props.title}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    padding: 10,
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: '#069A8E',
  },
  text: {
    fontSize: TextButtons,
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'sans-serif'
  },
})

export default Buttons;