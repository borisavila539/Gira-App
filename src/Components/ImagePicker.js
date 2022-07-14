import { StyleSheet, Image, View, Modal, Pressable, Text } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useDispatch } from "react-redux";
import { mandarFoto } from '../store/slices/usuarioSlice';
import { useEffect } from "react";


const MyImagePicker = (props) => {
    const dispatch = useDispatch();
    const [imagen, setImagen] = useState();
    const [modalVisible, SetModalVisible] = useState(false)
    const [modalCameraUpload, setModalCameraUpload] = useState(false)
    const [Base64, setBase64] = useState('')
    let result;

    const pickImage = async () => {
        result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images = "Images",
            base64: true,
            allowsEditing: true,
            quality: 1
        });

        setBase64(result.base64);
        let texto = Base64.toString();

        if (!result.cancelled) {
            setImagen(result.base64);
            setModalCameraUpload(false);
            dispatch(mandarFoto({ imagen: texto }));
        }
    };

    const upLoadImage = async () => {
        result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images = "Images",
            base64: true,
            allowsEditing: true,
            quality: 1
        });
        setBase64(result.base64);
        let texto = Base64.toString();

        if (!result.cancelled) {
            setImagen(result.base64);
            setModalCameraUpload(false);
            dispatch(mandarFoto({ imagen: texto }));
        }
    };
    useEffect(()=>{
        setImagen()
    },[props.render])
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
                        <Image source={{ uri: 'data:image/jpeg;base64,' + imagen }} style={styles.imageModal} />
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
                    <View style={styles.containerIconModal}>
                        <View style={styles.containerIconItem}>
                            <Pressable style={{ width: '100%' }} onPress={pickImage} >
                                <View style={styles.button}>
                                    <FontAwesome5 name="camera-retro" size={50} color={'#1A4D2E'} />
                                    <Text style={styles.text}>Tomar Foto</Text>
                                </View>
                            </Pressable>
                        </View>
                        <View style={styles.containerIconItem}>
                            <Pressable style={{ width: '100%' }} onPress={upLoadImage} >
                                <View style={styles.button}>
                                    <FontAwesome5 name="file-upload" size={50} color={'#1A4D2E'} />
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
                            <FontAwesome5 name="camera-retro" size={50} color={'#1A4D2E'} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            {
                imagen && <Pressable onPress={() => SetModalVisible(true)}><Image source={{ uri: 'data:image/jpeg;base64,' + imagen }} style={styles.image} /></Pressable>
            }
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#30475E',
        borderRadius: 10,
        backgroundColor: '#fff',
        padding: 5,
    },
    image: {
        width: 300,
        height: 400,
        marginBottom: 10,
        resizeMode: 'contain',
    },
    button: {
        width: '100%',
        alignItems: 'center',
    },
    containerIcon: {
        width: '100%',
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 20,
        borderBottomWidth: 1,
        marginBottom: 5,
    },
    containerIconModal: {
        width: '80%',
        maxWidth: 500,
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 20,
        borderBottomWidth: 1,
        marginBottom: 5,
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
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A4D2E'

    }
})
export default MyImagePicker;