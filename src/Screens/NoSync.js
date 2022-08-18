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
    const { user, monedaAbreviacion, APIURL, APIURLAVENTAS } = useSelector(state => state.usuario);
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [mensajeAlerta, setmensajeAlerta] = useState('');
    const [showMensajeAlerta, setShowMensajeAlerta] = useState(false);
    const [tipoMensaje, setTipoMensaje] = useState(false);
    const [sincronizando, setSincronizando] = useState(false);
    const [idSync, setIdSync] = useState('')

    const historial = async () => {
        try {
            const request = await fetch(APIURL + 'api/GastoViajeDetalle/' + user + '/4/1/10');
            let data = await request.json();
            setHistorialJSON(data)
            setIsLoading(false)
            setPage(2)
        } catch (error) {
            console.log('no cargo el historial ' + error)
        }
    }

    const historialMas = async () => {
        try {
            const request = await fetch(APIURL + 'api/GastoViajeDetalle/' + user + '/4/' + page + '/10');
            let data = await request.json();
            setHistorialJSON(historialJSON.concat(data))
            setIsLoading(false)
            setPage(page + 1)
        } catch (error) {
            console.log('no cargo el historial ' + error)
        }
    }
    const cantidadNoSync = async () => {
        let num = 0;
        try {
            const request = await fetch(APIURL + "api/GastoViajeDetalle/" + user + '/4');
            num = await request.json();
        } catch (error) {
            console.log('No hay sincronizados')
        }
        dispatch(noSincronizado({ nosync: num }))
    }

    const SincronizarAX = async (id) => {
        console.log(id)
        console.log(APIURLAVENTAS + 'api/DatosEnviarAX/' + id)
        const request = await fetch(APIURLAVENTAS + 'api/DatosEnviarAX/' + id)
        let result = await request.json()
        console.log(result.Content)
        if (result.Content == '"OK"') {
            const request2 = await fetch(APIURLAVENTAS + 'api/ActualizarEstadoGasto/' + id + '/2/-/-/-', {
                method: 'POST'
            })
            const result2 = await request2.json();
            console.log(result2)
            if (result2 == 1) {
                setmensajeAlerta('Gasto sincronizado con AX')
                setShowMensajeAlerta(true)
                setTipoMensaje(true)
            }
        } else {
            setmensajeAlerta('Error: ' + result.Content + '\nEspere a que el administrador actualize el Cai para reintentar ')
            setShowMensajeAlerta(true)
            setTipoMensaje(false)
        }
        setSincronizando(false)
        cantidadNoSync()
        historial()
    }

    const renderItem = (item) => {
        const cambioFecha = (fecha) => {
            return fecha.substring(0, 10);
        };
        const icono = (id) =>{
            if(id == idSync){
                return 'spinner'
            }else{
                return 'sync-alt'
            }
        }
        
        return (
            <View style={{ borderBottomWidth: 1, width: "100%", flexDirection: 'row', paddingHorizontal: 3, borderRadius: 0, borderColor: '#000', backgroundColor: '#f0f0f0' }}>
                <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center' }}>
                    {
                        !sincronizando ?
                            <TouchableOpacity onPress={() => {SincronizarAX(item.idGastoViajeDetalle); setSincronizando(true);setIdSync(item.idGastoViajeDetalle)}}>
                                <FontAwesome5
                                    name='sync-alt'
                                    style={{ color: '#000' }}
                                    size={IconHeader}
                                    solid />
                            </TouchableOpacity>
                            :
                            <FontAwesome5
                                    name={icono(item.idGastoViajeDetalle)}
                                    style={{ color: '#000' }}
                                    size={IconHeader}
                                    solid 
                                    />
                    }
                </View>
                <View style={{ width: '80%' }}>
                    <Text style={[styles.text, { textAlign: 'left' }]}>
                        <Text style={styles.text2}>Categoria:</Text> {item.categoria}
                    </Text>
                    <Text style={[styles.text, { textAlign: 'left' }]}>
                        <Text style={styles.text2}>Valor: </Text>{monedaAbreviacion}{item.valorFactura}
                    </Text>
                    <Text style={styles.text}>
                        <Text style={styles.text2}>Fecha Creacion:</Text> {item.fechaCreacion.replace('T', ' ').substring(0, 16).replace('-', '/').replace('-', '/')}
                    </Text>
                    <Text style={styles.text}>
                        <Text style={styles.text2}>Fecha Factura:</Text> {cambioFecha(item.fechaFactura)}
                    </Text>
                </View>
                <MyAlert visible={showMensajeAlerta} tipoMensaje={tipoMensaje} mensajeAlerta={mensajeAlerta} onPress={() => setShowMensajeAlerta(false)} />
            </View>
        );
    }

    const handleLoadMore = async () => {
        setIsLoading(true);
        historialMas();
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
            <FlatList
                data={historialJSON}
                keyExtractor={(item) => item.idGastoViajeDetalle.toString()}
                renderItem={({ item }) => renderItem(item)}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={historial} colors={['#069A8E']} />
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
        textAlign: "right",
        fontStyle: "italic",
        fontFamily: 'sans-serif'
    },
    text2: {
        fontSize: 16,
        textAlign: "right",
        fontStyle: "italic",
        fontWeight: "bold",
        fontStyle: "normal",
        fontFamily: 'sans-serif'
    },
})

export default NoSync;