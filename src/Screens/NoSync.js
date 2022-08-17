import { useState, useEffect } from "react";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { StyleSheet, View, Text, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity } from "react-native";
import { HeaderLogout } from "../Components/indexComponents";
import { useSelector } from 'react-redux';
import { IconHeader } from "../Components/constant";
import { noSincronizado } from '../store/slices/usuarioSlice';
import { useDispatch } from 'react-redux';

const NoSync = (props) => {
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const [historialJSON, setHistorialJSON] = useState([]);
    const { user, monedaAbreviacion, APIURL, APIURLSAV } = useSelector(state => state.usuario);
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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

    const  SincronizarAX= async (id) =>{
        console.log(id)
        /*
        const request = await fetch(APIURLSAV+'/api/DatosEnviarAX/'+id)
        if(request.data.content=='"OK"'){
            const request2 = await fetch(APIURL+'/api/ActualizarEstadoGasto/'+id+'/2/-/-/-',{
            method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            })
        }*/
        cantidadNoSync()
    }

    const renderItem = (item) => {
        const cambioFecha = (fecha) => {
            return fecha.substring(0, 10);
        };
        return (
            <View style={{ borderBottomWidth: 1, width: "100%", flexDirection: 'row', paddingHorizontal: 3, borderRadius: 0, borderColor: '#000', backgroundColor: '#f0f0f0' }}>
                <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={()=>SincronizarAX(item.idGastoViajeDetalle)}>
                        <FontAwesome5
                            name='sync-alt'
                            style={{ color: '#000' }}
                            size={IconHeader}
                            solid />
                    </TouchableOpacity>
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