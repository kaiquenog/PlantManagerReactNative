import React, { useState } from 'react';
import {
    Touchable,
    TouchableOpacity,
    StyleSheet,
    Text,
    Alert,
    Image,
    Platform,
    View
} from 'react-native'
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { SvgFromUri } from 'react-native-svg'

import waterdrop from '../assets/waterdrop.png'
import { Button } from '../components/Button';
import colors from '../styles/colors';
import fonts from '../styles/fonts';
import { useNavigationBuilder, useRoute } from '@react-navigation/core'
import DateTimePicker, { Event } from '@react-native-community/datetimepicker'
import { format, isBefore } from 'date-fns';
import { PlantProps, savePlant } from '../../libs/storage';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';


interface Params {
    plant: PlantProps

}

export function PlantSave() {

    const [selectDateTime, setSelectDateTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(Platform.OS == 'ios');

    const route = useRoute();
    const { plant } = route.params as Params;

    const navigation = useNavigation();

    async function handleSave() {

        try {
            await savePlant({
                ...plant,
                dateTimeNotification: selectDateTime
            });

            navigation.navigate('Confirmation', {
                title: 'Tudo Certo',
                subtitle: 'Fique tranquilo que sempre vamos lembrar você de cuidar da sua plantinha com bastante amor.',
                buttonTitle: 'Muito Obrigado',
                icon: 'hug',
                nextScreen: 'MyPlants'
            });


        } catch {
            Alert.alert('Não foi possivel salvar! ⌚');
        }
    }

    function handleChangeTIme(evente: Event, dateTime: Date | undefined) {

        if (Platform.OS == 'android') {
            setShowDatePicker(oldState => !oldState)
        }

        if (dateTime && isBefore(dateTime, new Date())) {

            setSelectDateTime(new Date())
            return Alert.alert('Escolha uma hora no futuro! ⌚');
        }

        if (dateTime) setSelectDateTime(dateTime);

    }

    function handleOpenDatePickerForAndroid() {
        setShowDatePicker(oldState => !oldState);
    }

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            <View style={styles.container}>
                <View style={styles.plantInfo}>
                    <SvgFromUri
                        uri={plant.photo}
                        height={150}
                        width={150}
                    />

                    <Text style={styles.plantName}>
                        {plant.name}
                    </Text>
                    <Text style={styles.plantAbout}>
                        {plant.about}
                    </Text>

                </View>
                <View style={styles.controler}>
                    <View style={styles.tipContainer}>
                        <Image
                            source={waterdrop}
                            style={styles.tipImage}
                        />

                        <Text style={styles.tipText} >
                            {plant.water_tips}
                        </Text>
                    </View>

                    <Text style={styles.alertLabel} >
                        Ecolha o melhor horário para ser lembrado:
                  </Text>

                    {
                        showDatePicker && (
                            <DateTimePicker
                                value={selectDateTime}
                                mode="time"
                                display="spinner"
                                onChange={handleChangeTIme}
                            />
                        )}

                    {
                        Platform.OS == 'android' && (
                            <TouchableOpacity
                                onPress={handleOpenDatePickerForAndroid}
                                style={styles.datetimepickerButton}>
                                <Text style={styles.datetimepickerText}>
                                    {`Mudar Horário ${format(selectDateTime, 'HH:mm')}`}
                                </Text>
                            </TouchableOpacity>
                        )


                    }


                    <Button
                        title="Cadastrar Planta"
                        onPress={handleSave}
                    />



                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: colors.shape
    },
    plantInfo: {
        flex: 1,
        paddingHorizontal: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.shape
    },
    controler: {
        backgroundColor: colors.white,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: getBottomSpace() || 20
    },
    plantName: {
        fontFamily: fonts.heading,
        fontSize: 24,
        color: colors.heading,
        marginTop: 15
    },
    plantAbout: {
        textAlign: 'center',
        fontFamily: fonts.text,
        color: colors.heading,
        fontSize: 17,
        marginTop: 10
    },
    tipContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.blue_light,
        padding: 20,
        borderRadius: 20,
        position: 'relative',
        bottom: 60
    },
    tipImage: {
        width: 56,
        height: 56
    },
    //38,01 do video Aula 04
    tipText: {
        flex: 1,
        marginLeft: 20,
        fontFamily: fonts.text,
        color: colors.blue,
        fontSize: 17,
        textAlign: 'justify'
    },
    alertLabel: {
        textAlign: 'center',
        fontFamily: fonts.complement,
        color: colors.heading,
        fontSize: 12,
        marginTop: 5

    },
    datetimepickerText: {

        color: colors.heading,
        fontSize: 24,
        fontFamily: fonts.text
    },
    datetimepickerButton: {

        width: '100%',
        alignItems: 'center',
        paddingVertical: 40

    }



})