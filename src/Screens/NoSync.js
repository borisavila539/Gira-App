import { useState, useEffect } from "react";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { StyleSheet, View, Text, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity } from "react-native";
import { HeaderLogout, MyAlert } from "../Components/indexComponents";
import { useSelector } from 'react-redux';
import { IconHeader } from "../Components/constant";
import { noSincronizado } from '../store/slices/usuarioSlice';
import { useDispatch } from 'react-redux';

const NoSync = (props) => {
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const [historialJSON, setHistorialJSON] = useState([]);
    const { user, monedaAbreviacion, APIURLAVENTAS } = useSelector(state => state.usuario);
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [mensajeAlerta, setmensajeAlerta] = useState('');
    const [showMensajeAlerta, setShowMensajeAlerta] = useState(false);
    const [tipoMensaje, setTipoMensaje] = useState(false);
    const [sincronizando, setSincronizando] = useState(false);
    const [idSync, setIdSync] = useState('');
    const [recargando, setRecargando] = useState(false);
    const [recargar, setRecargar] = useState(true);

    const historial = async () => {
        setRecargando(true)
        setRecargar(true)
        console.log('sincronizando')
        try {
            const request = await fetch(APIURLAVENTAS + 'Gira/GastoViajeDetalle/' + user + '/4/1/10');
            let data = await request.json();
            setHistorialJSON(data)
            setIsLoading(false)
            setPage(2)
        } catch (error) {
            setHistorialJSON([])
            console.log('no cargo el historial ' + error)
        }
        cantidadNoSync()
        setRecargando(false)
    }

    const historialMas = async () => {
        console.log('sincronizando mas')
        try {
            const request = await fetch(APIURLAVENTAS + 'Gira/GastoViajeDetalle/' + user + '/4/' + page + '/10')
                .then(async (data) => {
                    let datos = await data.json().then((data) => {
                        setHistorialJSON(historialJSON.concat(data))
                        setIsLoading(false)
                        setPage(page + 1)
                        if (data.length < 10) {
                            setIsLoading(false)
                            setRecargar(false)
                            return
                        }
                    })
                });
        } catch (error) {
            console.log('no cargo el historial ' + error)
        }
        cantidadNoSync()
    }
    const cantidadNoSync = async () => {
        let num = 0;
        try {
            const request = await fetch(APIURLAVENTAS + "Gira/GastoViajeDetalle/" + user + '/4');
            num = await request.json();
        } catch (error) {
            console.log('No hay sincronizados')
        }
        dispatch(noSincronizado({ nosync: num }))
    }

    const SincronizarAX = async (id) => {
        const request = await fetch(APIURLAVENTAS + 'Gira/DatosEnviarAX/' + id)
        let result = await request.json()
        if (result.Content == '"OK"') {
            const request2 = await fetch(APIURLAVENTAS + 'Gira/ActualizarEstadoGasto/' + id + '/2/-/-/-', {
                method: 'POST'
            })
            const result2 = await request2.json();
            console.log('result:'+result2)
            if (result2 == 1) {
                if(historialJSON.length != 1)
                {
                    setmensajeAlerta('Gasto sincronizado con AX')
                    setShowMensajeAlerta(true)
                    setTipoMensaje(true)
                }
                
            }
        } else {
            if(result.Content.length > 50){
                setmensajeAlerta("Error al sincronizar, intentelo mas tarde...")
            }else{
                setmensajeAlerta("" + result.Content)
            }
            
            setShowMensajeAlerta(true)
            setTipoMensaje(false)
        }
        setIdSync('')
        setSincronizando(false)
        cantidadNoSync()
        historial()
    }

    const renderItem = (item) => {
        const cambioFecha = (fecha) => {
            return fecha.substring(0, 10);
        };
        const icono = (id) => {
            if (id == idSync) {
                return 'spinner'
            } else {
                return 'sync-alt'
            }
        }

        return (
            <View style={{ borderWidth: 1, width: "98%", flexDirection: 'row', paddingHorizontal: 3, borderRadius: 5, borderColor: '#628E90', backgroundColor: '#f0f0f0', marginHorizontal: '1%', marginVertical:2 }}>
                <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center' }}>
                    {
                        idSync != item.IdGastoViajeDetalle  ?
                            <TouchableOpacity onPress={() => { SincronizarAX(item.IdGastoViajeDetalle); setSincronizando(true); setIdSync(item.IdGastoViajeDetalle) }}>
                                <FontAwesome5
                                    name='sync-alt'
                                    style={{ color: '#000' }}
                                    size={IconHeader}
                                    solid />
                            </TouchableOpacity>
                            :
                            < ActivityIndicator size='large' color={'#000'} />
                    }
                </View>
                <View style={{ width: '80%' }}>
                    <Text style={[styles.text, { textAlign: 'left' }]}>
                        <Text style={styles.text2}>Categoria:</Text> {item.categoria}
                    </Text>
                    <Text style={[styles.text, { textAlign: 'left' }]}>
                        <Text style={styles.text2}>Valor: </Text>{monedaAbreviacion}{item.ValorFactura.toFixed(2)}
                    </Text>
                    <Text style={styles.text}>
                        <Text style={styles.text2}>Fecha Creacion:</Text> {item.FechaCreacion.replace('T', ' ').substring(0, 16).replace('-', '/').replace('-', '/')}
                    </Text>
                    <Text style={styles.text}>
                        <Text style={styles.text2}>Fecha Factura:</Text> {cambioFecha(item.FechaFactura)}
                    </Text>
                </View>
                <MyAlert visible={showMensajeAlerta} tipoMensaje={tipoMensaje} mensajeAlerta={mensajeAlerta} onPress={() => setShowMensajeAlerta(false)} />
            </View>
        );
    }

    const handleLoadMore = async () => {
        if (recargar) {
            setIsLoading(true);
            historialMas();
        }
        return
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

    useEffect(() => {
        historial();
    }, [])

    return (
        <View style={styles.container}>
            <HeaderLogout />
            {
                historialJSON.length > 0 || showMensajeAlerta ?
                    <FlatList
                        data={historialJSON}
                        keyExtractor={(item) => item.IdGastoViajeDetalle.toString()}
                        renderItem={({ item }) => renderItem(item)}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={historial} colors={['#069A8E']} />
                        }
                        showsVerticalScrollIndicator={false}
                        onEndReached={handleLoadMore}
                        ListFooterComponent={renderFooter}
                    />
                    :
                            <View style={{ flex: 1, width: '100%', justifyContent: "center" }}>
                                <Text style={[styles.text, { textAlign: 'center' }]}>No se han encontrado gastos no sincronizados...</Text>
                                <View style={{ alignItems: "center" }}>
                                    <Text></Text>
                                    {
                                        !recargando ?
                                            <TouchableOpacity onPress={historial} style={{ alignItems: "center", width: IconHeader, }}>
                                                <FontAwesome5
                                                    name='sync'
                                                    style={{ color: '#dde' }}
                                                    size={IconHeader}
                                                    solid />
                                            </TouchableOpacity>
                                            :
                                            < ActivityIndicator size='large' color={'#dde'} />
                                    }
                                </View>
                            </View>
            }
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
        textAlign: "right",
        fontStyle: "italic",
        //fontFamily: 'sans-serif'
    },
    text2: {
        fontSize: 16,
        textAlign: "right",
        fontStyle: "italic",
        fontWeight: "bold",
        fontStyle: "normal",
        //fontFamily: 'sans-serif'
    },
})

export default NoSync;