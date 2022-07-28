import { StyleSheet, View, Text, TouchableOpacity, TextInput, Alert, FlatList, RefreshControl, ActivityIndicator } from "react-native";
import { HeaderLogout, DropdownList } from "../Components/indexComponents";
import DateTimePicker from '@react-native-community/datetimepicker';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { useEffect } from "react";
import { useSelector } from 'react-redux';


const History = (props) => {
    const [openDateIni, setOpenDateIni] = useState(false);
    const [openDateFin, setOpenDateFin] = useState(false);
    const [dateIni, setDateIni] = useState('');
    const [dateFin, setDateFin] = useState('');
    const [showdateIni, setShowDateIni] = useState(new Date());
    const [showdateFin, setShowDateFin] = useState(new Date());
    const [historialJSON, setHistorialJSON] = useState([]);
    const [showHistorialJSON, setShowHistorialJSON] = useState([]);
    const { user } = useSelector(state => state.usuario);
    const [resultCategoriaJSON, setResultCategoriaJSON] = useState([]);
    const [resultEstadoJSON, setResultEstadoJSON] = useState([]);
    const [resultEstado, setresultEstado] = useState([]);
    const [EstadoFiltrado, setEstadoFiltrado] = useState('Todos');
    const [idEstado, setIdEstado] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [today, setToday] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);

    const onchangeIni = (event, selectedDate) => {
        const currentDate = selectedDate.getFullYear() + '-' + (selectedDate.getMonth() + 1) + '-' + selectedDate.getDate();
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
        setShowDateIni(ini)
        setShowDateFin(fin)
        ini.setMonth(ini.getMonth() - 1)
        const inicio = ini.getFullYear() + '-' + (ini.getMonth() + 1) + '-' + ini.getDate();
        const final = fin.getFullYear() + '-' + (fin.getMonth() + 1) + '-' + fin.getDate();
        setDateIni(inicio)
        setDateFin(final)
    }

    const Historial = async (fin, ini) => {
        try {
            const inicio = ini.getFullYear() + '-' + (ini.getMonth() + 1) + '-' + ini.getDate();
            const final = fin.getFullYear() + '-' + (fin.getMonth() + 1) + '-' + fin.getDate();
            const request = await fetch('http://10.100.1.27:5055/api/GastoViajeDetalle/' + user + '/' + inicio + '/' + final + '/1/10');
            let data = await request.json()
            setHistorialJSON(data)
            setShowHistorialJSON(data)
            setPage(2);
        } catch (error) {
            console.log('No se obtuvo el Historial')
        }
    }

    const HistorialFiltrado = async () => {
        try {
            const request = await fetch('http://10.100.1.27:5055/api/GastoViajeDetalle/' + user + '/' + dateIni + '/' + dateFin + '/' + page + '/10');
            let data = await request.json();
            if (data.length == 0) {
                setIsLoading(false)
                return
            }
            setHistorialJSON(historialJSON.concat(data))
            setShowHistorialJSON(showHistorialJSON.concat(data))
            setIsLoading(false)
            setPage(page + 1);
        } catch (error) {
            console.log('Historial no filtrado')
        }
    }

    useEffect(() => {
        if (idEstado == 0) {
            setShowHistorialJSON(historialJSON)
        } else {
            let array = [];
            historialJSON.forEach(element => {
                if (element['idEstado'] == idEstado) {
                    array.push(element)
                }
            })
            setShowHistorialJSON(array)
        }
    }, [idEstado])

    useEffect(() => {
        HistorialFiltradoRefresh()
    }, [showdateIni, showdateFin])

    useEffect(() => {
        onchange(showdateFin, showdateIni)
        Historial(showdateFin, showdateIni)
        llenarEstado()
        setIsLoading(false)
    }, [])

    useEffect(() => {
        let array = ['Todos'];
        if (resultEstadoJSON) {
            resultEstadoJSON.forEach(element => {
                array.push(element['nombre'])
            })
        }
        setresultEstado(array)
    }, [resultEstadoJSON])

    const onchangeFIn = (event, selectedDate) => {
        const currentDate = selectedDate.getFullYear() + '-' + (selectedDate.getMonth() + 1) + '-' + selectedDate.getDate();
        setOpenDateFin(false)
        if (event.type === 'set') {
            if (showdateIni) {
                if (selectedDate >= showdateIni && selectedDate <= today) {
                    setDateFin(currentDate)
                    setShowDateFin(selectedDate)
                } else {
                    Alert.alert('La fecha final debe ser mayor o igual que fecha inicial y deber ser una fecha igual o menor a la actual')
                }
            } else {
                setDateFin(currentDate)
                setShowDateFin(selectedDate)
            }
        }
    }
    const llenarEstado = async () => {
        try {
            const request = await fetch('http://10.100.1.27:5055/api/Estado');
            let data = await request.json();
            setResultEstadoJSON(data)
        } catch (error) {
            console.log('No se obtuvo el estado')
        }
    }
    const onSelectEstado = (selectedItem) => {
        if (selectedItem == 'Todos') {
            setEstadoFiltrado('Todos')
            setIdEstado(0)
        } else {
            resultEstadoJSON.forEach(element => {
                if (element['nombre'] == selectedItem) {
                    let id = element['idEstado'];
                    setIdEstado(id);
                }
            })
        }
    }


    const renderItem = (item) => {
        const cambioFecha = (fecha) => {
            return fecha.substring(0, 10);
        };

        const EstadoColor = (estado) => {
            let colorEstado = '#000';
            switch (estado) {
                case 'Pendiente':
                    colorEstado = '#000';
                    break;
                case 'Aprobado':
                    colorEstado = '#0078AA';
                    break;
                case 'Rechazado':
                    colorEstado = '#F32424';
                    break;
                case 'PendienteAX':
                    colorEstado = '#FF9F29'
                    break;
                default:
                    colorEstado = '#000';
            }
            return colorEstado;
        }
        return (
            <View style={{ borderWidth: 1, width: "98%", flexDirection: 'row', margin: 5, padding: 3, borderRadius: 10, borderColor: EstadoColor(item.estado) }}>
                <TouchableOpacity style={{ width: '100%', flexDirection: 'row' }} onPress={() => { props.navigation.navigate('ScreenHistoryDetalle', { ID: item.idGastoViajeDetalle }) }}>
                    <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center' }}>
                        <FontAwesome5
                            name='file-invoice-dollar'
                            style={{ color: EstadoColor(item.estado) }}
                            size={40}
                            solid />
                    </View>
                    <View style={{ width: '80%' }}>
                        <Text style={[styles.text, { textAlign: 'left', color: EstadoColor(item.estado) }]}>Categoria: {item.categoria}</Text>
                        <Text style={[styles.text, { textAlign: 'left', color: EstadoColor(item.estado) }]}>Valor: {item.valorFactura}</Text>
                        <Text style={[styles.text, { color: EstadoColor(item.estado) }]}>Fecha Creacion: {cambioFecha(item.fechaCreacion)}</Text>
                        <Text style={[styles.text, { color: EstadoColor(item.estado) }]}>Fecha Factura: {cambioFecha(item.fechaFactura)}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    const renderFooter = () => {
        return (
            isLoading &&
            <View style={styles.loader}>
                < ActivityIndicator size='large' />
            </View >
        )
    }

    const handleLoadMore = () => {
        setIsLoading(true);
        HistorialFiltrado();

    }
    const HistorialFiltradoRefresh = async () => {
        setShowHistorialJSON([]);
        setHistorialJSON([]);
        Historial(showdateFin, showdateIni)
    }

    return (
        <View style={styles.container}>
            <HeaderLogout />
            <View style={styles.filtersContainer}>
                <ScrollView backgroundColor={'#fff'} horizontal={true} contentContainerStyle={{ paddingHorizontal: 5 }} showsHorizontalScrollIndicator={false}>
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
                            <View style={{ width: 180, justifyContent: "flex-end" }}>
                                <DropdownList defaultButtonText='-- Estado --' data={resultEstado} onSelect={onSelectEstado} />
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
                data={showHistorialJSON}

                keyExtractor={(item) => item.idGastoViajeDetalle.toString()}
                renderItem={({ item }) => renderItem(item)}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={HistorialFiltradoRefresh} colors={['#069A8E']} />
                }
                showsVerticalScrollIndicator={false}
                onEndReached={handleLoadMore}
                ListFooterComponent={renderFooter}
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
        paddingVertical: 2,
    },
    textInputDateContainer: {
        alignItems: "flex-start",
        width: 200,
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
        width: 130,
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
        backgroundColor: '#fff'
    },
    loader: {
        width: '100%',
        alignItems: 'center'
    }
})

export default History;