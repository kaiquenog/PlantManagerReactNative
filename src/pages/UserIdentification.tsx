import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    TextInput,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Platform,
    Keyboard,
    Alert
} from 'react-native'

import { Button } from '../components/Button'
import AsyncStorage from '@react-native-async-storage/async-storage'

import colors from '../styles/colors';
import fonts from '../styles/fonts';


export function UserIdentification() {

    const [isFocused, setIsFocused] = useState(false)
    const [isFilled, setIsFilled] = useState(false)
    const [name, setName] = useState<string>();

    const navigation = useNavigation();

    function handleInputblur() {
        setIsFocused(false);
        setIsFilled(!!name);
    }

    function handlrInputFocus() {
        setIsFocused(true);
    }

    function handlrInputChange(value: string) {
        setIsFilled(!!value);
        setName(value);
    }


    async function handleSubmit() {

        if (!name)
            return Alert.alert('Me diz como chmar você 😅');

        try {
            await AsyncStorage.setItem('@plantmanager:user', name);
            navigation.navigate('Confirmation', {
                title: 'Prontinho',
                subtitle: 'Agora vamos começar a cuidar das suas plantinhas com muito cuidado',
                buttonTitle: 'Começar',
                icon: 'smile',
                nextScreen: 'PlantSelect'
            });
        } catch {
            Alert.alert(' Nao foi possivel salvar o seu nome 😅')
        }


    }


    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.content}>
                        <View style={styles.form}>
                            <View style={styles.header}>
                                <Text style={styles.emoji}>
                                    {isFilled ? '😄' : '😃'}
                                </Text>
                                <Text style={styles.title}>
                                    Como podemos{'\n'} chamar você?
                    </Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        (isFocused || isFilled) && { borderColor: colors.green }
                                    ]}
                                    placeholder="Digite o nome"
                                    onBlur={handleInputblur}
                                    onFocus={handlrInputFocus}
                                    onChangeText={handlrInputChange}
                                />

                                <View style={styles.footer}>
                                    <Button
                                        title="Confirmar"
                                        onPress={handleSubmit}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: "center",
        justifyContent: 'space-around'

    },
    content: {
        flex: 1,
        width: '100%'
    },
    form: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 54,

    },
    header: {
        alignItems: 'center'
    },
    emoji: {
        fontSize: 44
    },
    input: {
        borderBottomWidth: 1,
        borderColor: colors.gray,
        color: colors.heading,
        width: '100%',
        fontSize: 18,
        marginTop: 50,
        padding: 10,
        textAlign: 'center'
    },
    title: {
        fontSize: 34,
        lineHeight: 32,
        textAlign: 'center',
        color: colors.heading,
        fontFamily: fonts.heading,
        marginTop: 20
    },
    footer: {
        marginTop: 40,
        width: '100%',
        paddingHorizontal: 20

    }
});