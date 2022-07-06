import { StyleSheet, Image, View, Modal, Pressable,Text } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";
import {  TouchableOpacity } from "react-native-gesture-handler";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';


function MyImagePicker(props) {
    const [image, setImage] = useState();
    const [modalVisible, SetModalVisible] = useState(false)
    const [modalCameraUpload, setModalCameraUpload] = useState(false)

    const pickImage = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images = "Images",
            allowsEditing: true,
            quality: 1,
        });
        console.log(result);

        if (!result.cancelled) {
            setImage(result.uri);
            setModalCameraUpload(false);
            console.log(result.uri)
        }
    };

    const upLoadImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images = "Images",
            allowsEditing: true,
            quality: 1,
        });
        console.log(result);

        if (!result.cancelled) {
            setImage(result.uri);
            setModalCameraUpload(false);
            console.log(result.uri)
        }
    };

    return (
        <View style={styles.container}>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => SetModalVisible(!modalVisible)}
            >
                <View style={styles.modal}>
                    <Pressable style={styles.hideimage} onPress={() => SetModalVisible(!modalVisible)}>
                        <Image source={{ uri: image }} style={styles.imageModal} />
                    </Pressable>

                </View>
            </Modal>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalCameraUpload}
                onRequestClose={() => setModalCameraUpload(!modalCameraUpload)}
            >
                <View style={styles.modal}>
                    <View style={styles.containerIcon}>
                        <View style={styles.containerIconItem}>
                            <Pressable style={{ width: '100%' }} onPress={pickImage} >
                                <View style={styles.button}>
                                    <FontAwesome5 name="camera" size={50} color={'#1A4D2E'} />
                                    <Text style={styles.text}>Tomar Foto</Text>
                                </View>
                            </Pressable>
                        </View>
                        <View style={styles.containerIconItem}>
                            <Pressable style={{ width: '100%' }} onPress={upLoadImage} >
                                <View style={styles.button}>
                                    <FontAwesome5 name="upload" size={50} color={'#1A4D2E'} />
                                    <Text style={styles.text}>Subir Foto</Text>
                                </View>
                            </Pressable>
                        </View>
                    </View>
                </View>

            </Modal>
            <View style={styles.containerIcon}>
                <View style={styles.containerIconItem}>
                    <TouchableOpacity style={{ width: '100%' }} onPress={() => setModalCameraUpload(true)} >
                        <View style={styles.button}>
                            <FontAwesome5 name="camera" size={50} color={'#1A4D2E'} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            {
                image && <TouchableOpacity onPress={() => SetModalVisible(true)}><Image source={{ uri: image }} style={styles.image} /></TouchableOpacity>
            }
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        borderWidth:1,
        borderColor:'#30475E',
        borderRadius: 10,
        backgroundColor: '#fff',
        padding: 5,
    },
    image: {
        width: 400,
        height: 400,
        marginBottom: 10,
        resizeMode: 'contain',
    },
    button: {
        width: '100%',
        alignItems: 'center',
    },
    containerIcon: {
        width: '70%',
        flexDirection: 'row',
        padding: 10,
        backgroundColor:'#fff',
        borderRadius: 20,
    },
    containerIconItem: {
        flex: 1,
    },
    modal: {
        backgroundColor: '#00000099',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    imageModal: {
        width: '90%',
        height: '90%',
        resizeMode: 'contain',
    },
    hideimage: {
        flex: 1,
        borderWidth: 1,
        width: '100%',
        alignItems: "center",
        justifyContent: 'center',
    },
    text:{
        fontSize:18,
        fontWeight: 'bold',
        color:'#1A4D2E'

    } 
})
export default MyImagePicker;