import React, { useEffect, useState } from 'react';
import {
    Touchable,
    TouchableOpacity,
    StyleSheet,
    Text,
    Alert,
    Image,
    Platform,
    View
} from 'react-native';

import colors from '../styles/colors';
import waterdrop from '../assets/waterdrop.png'
import { loadPlant, PlantProps, removePlant } from '../../libs/storage';
import { formatDistance } from 'date-fns';
import { pt } from 'date-fns/locale';
import { FlatList } from 'react-native-gesture-handler';
import { Header } from '../components/Header';
import fonts from '../styles/fonts';
import { PlantCardSecondary } from '../components/PlantCardSecondary';
import { Load } from '../components/Load';


export function MyPlants() {
    const [myPlants, setMyPlants] = useState<PlantProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [nextWaterd, setNextWatered] = useState<string>();

    function handleRemove(plant: PlantProps) {
        Alert.alert('Remover', `Deseja remover a ${plant.name}?`, [

            {
                text: 'Não  🙏',
                style: 'cancel'
            },
            {
                text: 'Sim 😓',
                onPress: async () => {
                    try {
                        await removePlant(plant.id)
                        setMyPlants((oldData) =>
                            oldData.filter((item) => item.id !== plant.id)
                        );

                    } catch (error) {

                        Alert.alert('Não foi possivel remover! 😓')

                    }
                }
            }
        ])
    }

    useEffect(() => {
        async function loadStorageData() {
            const plantsStorage = await loadPlant();

            const nextTime = formatDistance(
                new Date(plantsStorage[0].dateTimeNotification).getTime(),
                new Date().getTime(),
                { locale: pt }
            );

            setNextWatered(
                `Não esqueça de regar a ${plantsStorage[0].name} á ${nextTime} horas.`
            )
            setMyPlants(plantsStorage);
            setLoading(false);
        }

        loadStorageData();

    }, [])

    if (loading)
        return <Load />

    return (
        <View style={styles.container}>
            <Header />

            <View style={styles.spotlight}>
                <Image
                    source={waterdrop}
                    style={styles.spotligthImage}
                />

                <Text style={styles.spotligthText}>
                    {nextWaterd}
                </Text>

            </View>

            <View style={styles.plants}>
                <Text style={styles.plantsTitle}>


                </Text>

                <FlatList
                    data={myPlants}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => (
                        <PlantCardSecondary
                            data={item}
                            handleRemove={() => { handleRemove(item) }}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flex: 1 }}

                />
            </View>

        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        paddingTop: 50,
        backgroundColor: colors.background
    },
    spotlight: {
        backgroundColor: colors.blue_light,
        paddingHorizontal: 20,
        borderRadius: 20,
        height: 110,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'

    },
    spotligthImage: {
        width: 60,
        height: 60

    },
    spotligthText: {
        flex: 1,
        color: colors.blue,
        paddingHorizontal: 20,

    },
    plants: {
        flex: 1,
        width: '100%'
    },
    plantsTitle: {
        fontSize: 24,
        fontFamily: fonts.heading,
        color: colors.heading,
        marginVertical: 20

    }



})