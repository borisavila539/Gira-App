import { useState, useEffect } from "react";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { StyleSheet, View, Text, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity } from "react-native";
import { HeaderLogout } from "../Components/indexComponents";
import { useSelector } from 'react-redux';

const NoSync = (props) => {

    const [resultCategoriaJSON, setResultCategoriaJSON] = useState([]);
    const [resultEstadoJSON, setResultEstadoJSON] = useState([]);
    const [page, setPage] = useState(1);
    const [historialJSON, setHistorialJSON] = useState([]);
    const [idEstado, setIdEstado] = useState('')
    const { user } = useSelector(state => state.usuario);
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const historial = async () => {
        try {
            const request = await fetch('http://10.100.1.27:5055/api/GastoViajeDetalle/' + user + '/' + idEstado + '/' + page + '/8');
            let data = await request.json();
            setHistorialJSON(data)
            setIsLoading(false)
        } catch (error) {
            console.log('no cargo el historial ' + error)
        }
    }

    const historialMas = async () => {
        try {

            const request = await fetch('http://10.100.1.27:5055/api/GastoViajeDetalle/' + user + '/' + idEstado + '/' + (page + 1) + '/8');
            let data = await request.json();
            setHistorialJSON(historialJSON.concat(data))
            setIsLoading(false)
            setPage(page + 1)
        } catch (error) {
            console.log('no cargo el historial ' + error)
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

    const llenarCategoria = async () => {
        try {
            const request = await fetch('http://10.100.1.27:5055/api/CategoriaTipoGastoViaje/');
            let data = await request.json();
            setResultCategoriaJSON(data)
        } catch (error) {
            console.log('No se lleno la Categoria')
        }
    }

    const renderItem = (item) => {
        const cambioFecha = (fecha) => {
            return fecha.substring(0, 10);
        };
        const cambioFechahora = (fecha) => {
            let date = fecha.substring(0, 10)
            let hora = fecha.substring(11, 16)
            let FechaHora = date + ' ' + hora
            return FechaHora;
        };

        const tipoGasto = (id) => {
            let categoria = '';
            if (resultCategoriaJSON) {
                resultCategoriaJSON.forEach(element => {
                    if (element['idCategoriaTipoGastoViaje'] == id)
                        categoria = element['nombre'];
                });
            }
            return categoria;
        }

        const EstadoColor = (id) => {
            let colorEstado = '#000';
            if (resultEstadoJSON) {
                resultEstadoJSON.forEach(element => {
                    if (element['idEstado'] == id) {
                        switch (element['nombre']) {
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
                    }
                })
            }
            return colorEstado;
        }
        return (
            <View style={{ borderWidth: 1, width: "98%", flexDirection: 'row', margin: 5, padding: 3, borderRadius: 10, borderColor: EstadoColor(item.idEstado) }}>
                <TouchableOpacity style={{ width: '100%', flexDirection: 'row' }} onPress={() => { props.navigation.navigate('ScreenHistoryDetalle', { ID: item.idGastoViajeDetalle }) }}>
                    <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center' }}>
                        <FontAwesome5
                            name='file-invoice-dollar'
                            style={{ color: EstadoColor(item.idEstado) }}
                            size={40}
                            solid />
                    </View>
                    <View style={{ width: '80%' }}>
                        <Text style={[styles.text, { textAlign: 'left', color: EstadoColor(item.idEstado) }]}>Categoria: {tipoGasto(item.idCategoriaTipoGastoViaje)}</Text>
                        <Text style={[styles.text, { textAlign: 'left', color: EstadoColor(item.idEstado) }]}>Valor: {item.valorFactura}</Text>
                        <Text style={[styles.text, { textAlign: 'right', color: EstadoColor(item.idEstado) }]}>Fecha Creacion: {item.fechaCreacion}</Text>
                        <Text style={[styles.text, { textAlign: 'right', color: EstadoColor(item.idEstado) }]}>Fecha Factura: {cambioFecha(item.fechaFactura)}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    const HistorialFiltradoRefresh = async () => {
        setPage(1);
        await setHistorialJSON([]);
        historial();
    }
    const handleLoadMore = async () => {
        setIsLoading(false);
        historialMas();
    }

    const renderFooter = () => {
        return (
            isLoading &&
            <View style={styles.loader}>
                < ActivityIndicator size='large' />
            </View >
        )
    }

    useEffect(() => {
        if (resultEstadoJSON) {
            resultEstadoJSON.forEach(element => {
                if (element['nombre'] == 'PendienteAX') {
                    setIdEstado(element['idEstado'])
                }
            })
        }
    }, [resultEstadoJSON])

    useEffect(() => {
        llenarEstado();
        llenarCategoria();
        historial();
    }, [])

    useEffect(() => {
        historial();
    }, [idEstado])

    useEffect(() => {
        if (page == 1) {
            historial();
        }
    }, [page])



    return (
        <View style={styles.container}>
            <HeaderLogout />
            <FlatList
                data={historialJSON}
                keyExtractor={(item) => item.idGastoViajeDetalle.toString()}
                renderItem={({ item }) => renderItem(item)}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={HistorialFiltradoRefresh} colors={['#069A8E']} />
                }
                showsVerticalScrollIndicator={false}
                onEndReached={handleLoadMore}
                ListFooterComponent={renderFooter}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%'
    },
    loader: {
        width: '100%',
        alignItems: 'center'
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
    }
})

export default NoSync;