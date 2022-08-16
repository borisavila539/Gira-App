import { useState, useEffect } from "react";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { StyleSheet, View, Text, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity } from "react-native";
import { HeaderLogout } from "../Components/indexComponents";
import { useSelector } from 'react-redux';

const NoSync = (props) => {

    const [page, setPage] = useState(1);
    const [historialJSON, setHistorialJSON] = useState([]);
    const { user, monedaAbreviacion, APIURL } = useSelector(state => state.usuario);
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
        return (
            <View style={{ borderBottomWidth: 1, width: "100%", flexDirection: 'row', paddingHorizontal: 3, borderRadius: 0, borderColor: '#000', backgroundColor: '#f0f0f0' }}>
                <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity>
                        <FontAwesome5
                            name='sync-alt'
                            style={{ color: '#000' }}
                            size={40}
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