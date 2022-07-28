import { useState, useEffect } from "react";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { StyleSheet, View, Text, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity } from "react-native";
import { HeaderLogout } from "../Components/indexComponents";
import { useSelector } from 'react-redux';

const NoSync = (props) => {

    const [page, setPage] = useState(1);
    const [historialJSON, setHistorialJSON] = useState([]);
    const { user } = useSelector(state => state.usuario);
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const historial = async () => {
        try {
            const request = await fetch('http://10.100.1.27:5055/api/GastoViajeDetalle/' + user + '/4/' + page + '/8');
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

            const request = await fetch('http://10.100.1.27:5055/api/GastoViajeDetalle/' + user + '/4/' + (page + 1) + '/8');
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
            <View style={{ borderWidth: 1, width: "98%", flexDirection: 'row', margin: 5, padding: 3, borderRadius: 10, borderColor: '#000' }}>
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
                    <Text style={[styles.text, { textAlign: 'left', color: '#000' }]}>Categoria: {item.categoria}</Text>
                    <Text style={[styles.text, { textAlign: 'left', color: '#000' }]}>Valor: {item.valorFactura}</Text>
                    <Text style={[styles.text, { textAlign: 'right', color: '#000' }]}>Fecha Creacion: {cambioFecha(item.fechaCreacion)}</Text>
                    <Text style={[styles.text, { textAlign: 'right', color: '#000' }]}>Fecha Factura: {cambioFecha(item.fechaFactura)}</Text>
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
        fontWeight: 'bold',
    }
})

export default NoSync;