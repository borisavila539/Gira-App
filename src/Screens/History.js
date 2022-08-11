import { StyleSheet, View, Text, TouchableOpacity, TextInput, Alert, FlatList, RefreshControl, ActivityIndicator } from "react-native";
import { HeaderLogout, DropdownList, MyAlert } from "../Components/indexComponents";
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
    const { user, monedaAbreviacion, APIURL } = useSelector(state => state.usuario);
    const [resultEstadoJSON, setResultEstadoJSON] = useState([]);
    const [resultEstado, setresultEstado] = useState([]);
    const [estadoID, setEstadoID] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const [today, setToday] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [mensajeAlerta, setmensajeAlerta] = useState('');
    const [showMensajeAlerta, setShowMensajeAlerta] = useState(false);
    const [tipoMensaje, setTipoMensaje] = useState(false);
    let cont = 0;

    const onchangeIni = (event, selectedDate) => {
        const currentDate = selectedDate.getFullYear() + '-' + (selectedDate.getMonth() + 1) + '-' + selectedDate.getDate();
        setOpenDateIni(false)
        if (event.type === 'set') {
            if (showdateFin) {
                if (selectedDate <= showdateFin) {
                    setDateIni(currentDate)
                    setShowDateIni(selectedDate)
                } else {
                    setmensajeAlerta('La fecha inicial debe ser menor o igual que fecha final')
                    setShowMensajeAlerta(true)
                    setTipoMensaje(false)
                }
            } else {
                setDateIni(currentDate)
                setShowDateIni(selectedDate)
            }
        }
        console.log(event)
    }

    const onchangeFIn = (event, selectedDate) => {
        const currentDate = selectedDate.getFullYear() + '-' + (selectedDate.getMonth() + 1) + '-' + selectedDate.getDate();
        setOpenDateFin(false)
        if (event.type === 'set') {
            if (showdateIni) {
                if (selectedDate >= showdateIni && selectedDate <= today) {
                    setDateFin(currentDate)
                    setShowDateFin(selectedDate)
                } else {
                    setmensajeAlerta('La fecha final debe ser mayor o igual que fecha inicial y deber ser una fecha igual o menor a la actual')
                    setShowMensajeAlerta(true)
                    setTipoMensaje(false)
                }
            } else {
                setDateFin(currentDate)
                setShowDateFin(selectedDate)
            }
        }
    }

    const onchange = (fin, ini) => {
        ini.setMonth(ini.getMonth() - 1)
        const inicio = ini.getFullYear() + '-' + (ini.getMonth() + 1) + '-' + ini.getDate();
        const final = fin.getFullYear() + '-' + (fin.getMonth() + 1) + '-' + fin.getDate();
        setDateIni(inicio)
        setDateFin(final)
    }

    const Historial = async () => {
        try {
            console.log(APIURL + 'api/GastoViajeDetalle/' + user + '/' + dateIni + '/' + dateFin + '/1/10/' + estadoID)
            const request = await fetch(APIURL + 'api/GastoViajeDetalle/' + user + '/' + dateIni + '/' + dateFin + '/1/10/' + estadoID);
            let data = await request.json()
            setHistorialJSON(data)
            setShowHistorialJSON(data)
            setPage(2);
            cont++;
        } catch (error) {
            console.log('No se obtuvo el Historial')
        }
    }

    const HistorialFiltrado = async () => {
        try {
            console.log(APIURL + 'api/GastoViajeDetalle/' + user + '/' + dateIni + '/' + dateFin + '/' + page + '/10/' + estadoID)
            const request = await fetch(APIURL + 'api/GastoViajeDetalle/' + user + '/' + dateIni + '/' + dateFin + '/' + page + '/10/' + estadoID);
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

    const llenarEstado = async () => {
        try {
            const request = await fetch(APIURL + 'api/Estado');
            let data = await request.json();
            setResultEstadoJSON(data)
        } catch (error) {
            console.log('No se obtuvo el estado')
        }
    }
    const onSelectEstado = (selectedItem, index) => {
        setEstadoID(index)
    }


    const renderItem = (item) => {
        const cambioFecha = (fecha) => {
            return fecha.substring(0, 10).replace('-', '/').replace('-', '/');
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
            <View style={{ borderBottomWidth: 1.5, width: "100%", flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 0, borderColor: '#A2B5BB', backgroundColor: '#f0f0f0' }}>
                <TouchableOpacity style={{ width: '100%', flexDirection: 'row' }} onPress={() => { props.navigation.navigate('ScreenHistoryDetalle', { ID: item.idGastoViajeDetalle }) }}>
                    <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center'}}>
                        <FontAwesome5
                            name='file-invoice-dollar'
                            style={{ color: EstadoColor(item.estado) }}
                            size={40}
                            solid />
                            <Text style={[styles.text, { textAlign: 'left', color: EstadoColor(item.estado) }]}>{item.estado}</Text>
                    </View>
                    <View style={{ width: '80%' }}>
                        <Text style={[styles.text, { textAlign: 'left', color: EstadoColor(item.estado) }]}>
                            <Text style={styles.text2}>Categoria:</Text> {item.categoria}
                        </Text>
                        <Text style={[styles.text, { textAlign: 'left', color: EstadoColor(item.estado) }]}>
                            <Text style={styles.text2}>Valor: </Text>{monedaAbreviacion}{item.valorFactura}
                        </Text>
                        <Text style={[styles.text, { color: EstadoColor(item.estado) }]}>
                            <Text style={styles.text2}>Fecha Creacion:</Text> {item.fechaCreacion.replace('T', ' ').substring(0, 16).replace('-', '/').replace('-', '/')}
                        </Text>
                        <Text style={[styles.text, { color: EstadoColor(item.estado) }]}>
                            <Text style={styles.text2}>Fecha Factura:</Text> {cambioFecha(item.fechaFactura)}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    const renderFooter = () => {
        return (
            isLoading &&
            <View style={styles.loader}>
                <Text style={[styles.text, { color: '#ddd' }]}>Cargando...</Text>
                < ActivityIndicator size='large' />
            </View >
        )
    }

    const handleLoadMore = () => {
        setIsLoading(true);
        HistorialFiltrado();

    }

    useEffect(() => {
        onchange(showdateFin, showdateIni)
        llenarEstado()
        setIsLoading(false)
    }, [])

    useEffect(() => {
        if (dateIni != '' && dateFin != '') {
            Historial()
            console.log(cont)
        }
        console.log('recargado')
    }, [dateIni, dateFin, estadoID])

    useEffect(() => {
        let array = ['Todos'];
        if (resultEstadoJSON) {
            resultEstadoJSON.forEach(element => {
                array.push(element['nombre'])
            })
        }
        setresultEstado(array)
    }, [resultEstadoJSON])

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
                    <RefreshControl refreshing={refreshing} onRefresh={Historial} colors={['#069A8E']} />
                }
                showsVerticalScrollIndicator={false}
                onEndReached={handleLoadMore}
                ListFooterComponent={renderFooter}
                style={{ backgroundColor: '#fff' }}
            />
            <MyAlert visible={showMensajeAlerta} tipoMensaje={tipoMensaje} mensajeAlerta={mensajeAlerta} onPress={() => setShowMensajeAlerta(false)} />
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
        fontStyle: "italic"
    },
    text2: {
        fontSize: 16,
        textAlign: "right",
        fontStyle: "italic",
        fontWeight: "bold",
        fontStyle: "normal"
    },
    inputIconContainer: {
        flexDirection: 'row',
        width: '100%',
        alignItems: "center",
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#30475E',
        paddingHorizontal: 5,
    },
    input: {
        width: 130,
        fontSize: 16,
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