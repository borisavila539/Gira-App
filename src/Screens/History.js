import { StyleSheet, View, Text, TouchableOpacity, TextInput, Alert, FlatList,RefreshControl } from "react-native";
import { HeaderLogout, DropdownList } from "../Components/indexComponents";
import DateTimePicker from '@react-native-community/datetimepicker';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";
import { useSelector } from 'react-redux';

const History = (props) => {
    const [openDateIni, setOpenDateIni] = useState(false);
    const [openDateFin, setOpenDateFin] = useState(false);
    const [dateIni, setDateIni] = useState(new Date());
    const [dateFin, setDateFin] = useState(new Date());
    const [showdateIni, setShowDateIni] = useState(new Date());
    const [showdateFin, setShowDateFin] = useState(new Date());
    const [historialJSON, setHistorialJSON] = useState([]);
    const { user } = useSelector(state => state.usuario);
    const [resultCategoriaJSON, setResultCategoriaJSON] = useState();
    const [refreshing, setRefreshing] = useState(false)

    const onchangeIni = (event, selectedDate) => {
        const currentDate = selectedDate.getDate() + '/' + (selectedDate.getMonth() + 1) + '/' + selectedDate.getFullYear();
        setOpenDateIni(false)
        if (event.type === 'set') {
            if (showdateFin) {
                if (selectedDate <= showdateFin) {
                    setDateIni(currentDate)
                    setShowDateIni(selectedDate)
                } else {
                    Alert.alert('La fecha inicial debe ser menor o igual que fecha final')
                }
            } else {
                setDateIni(currentDate)
                setShowDateIni(selectedDate)
            }
        }
        console.log(event)
    }

    const onchange = (fin, ini) => {
        ini.setMonth(ini.getMonth() - 1)
        const inicio = ini.getFullYear() + '-' + (ini.getMonth() + 1) + '-' + ini.getDate();
        const final = fin.getFullYear() + '-' + (fin.getMonth() + 1) + '-' + fin.getDate();
        setDateIni(inicio)
        setDateFin(final)
    }

    const Historial = async (fin, ini) => {
        const inicio = ini.getFullYear() + '-' + (ini.getMonth() + 1) + '-' + ini.getDate();
        const final = fin.getFullYear() + '-' + (fin.getMonth() + 1) + '-' + fin.getDate();
        console.log('Usuario: ' + user + '/' + inicio + '/' + final);
        const request = await fetch('http://10.100.1.27:5055/api/GastoViajeDetalle/' + user + '/' + inicio + '/' + final);
        let data = await request.json()
        setHistorialJSON(data)
    }

    useEffect(() => {
        onchange(dateFin, dateIni)
        Historial(dateFin, dateIni)
        llenarCategoria()
    }, [])

    const onchangeFIn = (event, selectedDate) => {
        const currentDate = selectedDate.getDate() + '/' + (selectedDate.getMonth() + 1) + '/' + selectedDate.getFullYear();
        setOpenDateFin(false)
        if (event.type === 'set') {
            if (showdateIni) {
                if (selectedDate >= showdateIni) {
                    setDateFin(currentDate)
                    setShowDateFin(selectedDate)
                } else {
                    Alert.alert('La fecha final debe ser mayor o igual que fecha inicial')
                }
            } else {
                setDateFin(currentDate)
                setShowDateFin(selectedDate)
            }
        }
    }
    const llenarCategoria = async () => {
        const request = await fetch('http://10.100.1.27:5055/api/CategoriaTipoGastoViaje/');
        let data = await request.json();
        console.log(data)
        setResultCategoriaJSON(data)
    }

    const renderItem = (item) => {
        const cambioFecha = ( fecha) =>{
           
            return fecha.substring(0,10);
           
        };

        const tipoGasto = (id) =>{
            let categoria ='';
            if(resultCategoriaJSON){
                resultCategoriaJSON.forEach(element => {
                    if(element['idCategoriaTipoGastoViaje']==id)
                        categoria =element['nombre'];
                });
            }
            return categoria;
        }
        return (
            
            <View style={{ borderWidth: 1, width: "98%",maxWidth:500,flexDirection: 'row' ,margin:5, padding:3, borderRadius:10}}>
                <View style={{ width: '20%', alignItems:'center', justifyContent:'center'}}>
                <FontAwesome5
                            name='file-invoice'
                            style={{color:'red'}}
                            size={40}
                            solid />
                </View>
                <View style={{ width: '80%' }}>
                    <Text style={[styles.text,{textAlign:'left'}]}>Categoria: {tipoGasto(item.idCategoriaTipoGastoViaje)}</Text>
                    <Text style={[styles.text,{textAlign:'left'}]}>Valor: {item.valorFactura}</Text>
                    <Text style={styles.text}>Fecha: {cambioFecha(item.fechaFactura)}</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <HeaderLogout />
            <View style={styles.filtersContainer}>
                <ScrollView backgroundColor={'#fff'} horizontal={true} contentContainerStyle={{paddingHorizontal:5}}>
                    <View style={styles.containerSafeAreView}>
                        <View style={styles.filters}>
                            <View style={styles.textInputDateContainer}>
                                <Text style={styles.text}>Inicio:</Text>
                                <TouchableOpacity onPress={() => setOpenDateIni(true)}>
                                    <View style={styles.inputIconContainer}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder={'01/01/2000'}
                                            editable={false}
                                            value={dateIni}
                                        />
                                        <FontAwesome5 name="calendar-alt" size={20} color={'#1A4D2E'} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.textInputDateContainer}>
                                <Text style={styles.text}>Fin:</Text>
                                <TouchableOpacity onPress={() => setOpenDateFin(true)}>
                                    <View style={styles.inputIconContainer}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder={'01/01/2000'}
                                            editable={false}
                                            value={dateFin}
                                        />
                                        <FontAwesome5 name="calendar-alt" size={20} color={'#1A4D2E'} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: 200 }}>
                                <DropdownList defaultButtonText='-- Estado --' />
                            </View>
                        </View>
                        {
                            openDateIni && (<DateTimePicker
                                mode='date'
                                value={showdateIni}
                                onChange={onchangeIni}
                                onTouchCancel={() => console.log('Cancelado')}
                            />)
                        }
                        {
                            openDateFin && (<DateTimePicker
                                mode='date'
                                value={showdateFin}
                                onChange={onchangeFIn}
                                onTouchCancel={() => console.log('Cancelado')}
                            />)
                        }
                    </View>
                </ScrollView>
            </View>

            <FlatList
                data={historialJSON}
                keyExtractor={(item) => item.idGastoViajeDetalle.toString()}
                renderItem={({ item }) => renderItem(item)}
                refreshControl={
                       <RefreshControl refreshing={refreshing} onRefresh={Historial} colors={['red']}></RefreshControl>
                    }
            />
        </View >
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    containerSafeAreView: {
        width: '100%',
        backgroundColor: '#fff',
        alignItems: "center",
        paddingVertical: 10,
    },
    textInputDateContainer: {
        flexDirection: 'row',
        width: 200,
        alignItems: "center",
        paddingVertical: 2,
    },
    text: {
        fontSize: 16,
        textAlign: "right",
        fontWeight: 'bold',
        color: '#005555'
    },
    inputIconContainer: {
        flexDirection: 'row',
        width: '100%',
        alignItems: "center",
        backgroundColor: '#fff',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#30475E',
        paddingHorizontal: 5,
    },
    input: {
        maxHeight: 100,
        fontSize: 16,
        backgroundColor: '#fff',
        height: 35,
        borderRightWidth: 1,
        borderColor: '#30475E',
        marginRight: 5,
        color: '#121212',
        padding: 2,
        textAlign: "center",
    },
    filters: {
        width: '100%',
        flexDirection: 'row',
    },
    filtersContainer: {
        width: '100%',
        height: 70,
        backgroundColor:'#fff'
    }
})

export default History;