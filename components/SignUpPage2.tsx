// npx expo install expo-location
import { StyleSheet, Text, View, ImageBackground, Dimensions, Image, TouchableOpacity, TextInput, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useFonts, NunitoSans_200ExtraLight, NunitoSans_300Light,
NunitoSans_400Regular, NunitoSans_700Bold, NunitoSans_800ExtraBold } from '@expo-google-fonts/nunito-sans';
import AppLoading from 'expo-app-loading';
import * as Location from 'expo-location';

const {width, height} = Dimensions.get('window');
const baseWidth = 375;
const baseHeight = 812;

const scaleWidth = width/baseWidth;
const scaleHeight = height/baseHeight;

const scale = Math.min(scaleWidth,scaleHeight);
const finalScale = scale > 1 ? 1:scale;
const scaledSize = (size:number) => Math.ceil(size * finalScale)

const SignUpPage2 = () => {
    const [cityName, setCityName] = useState(null);
    const [text, setText] = useState('');
    useEffect(() => {
        // Check and ask for location permissions when the component mounts
        (async () => {})();
    }, []);

//     const handleChangeText = (inputText) => {
//         setText(inputText);
//     };

    let [fontsLoaded] = useFonts({
        NunitoSans_200ExtraLight, NunitoSans_300Light, NunitoSans_400Regular, NunitoSans_700Bold, NunitoSans_800ExtraBold,
    });
    if (!fontsLoaded) {
        return <AppLoading />;
    }else{}

    const getLocation = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                // Handle permission not granted
                    return;
            }else{
                let location = await Location.getCurrentPositionAsync({});
                let { latitude, longitude } = location.coords;

                // Reverse geocode the latitude and longitude to get the city name
                let geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
                if (geocode && geocode.length > 0) {
                    setCityName(geocode[0].city);
                }
            }
        } catch (error) {
            console.error('Error fetching location: ', error);
        }
    };

    return (
        <View style={styles.container}>
            <ImageBackground style={styles.ImageBackground} resizeMode="stretch" source={require('../assets/background.png')}>
                <Text style = {styles.title}>
                    Hi xxx, Let's get local!
                </Text>
                <Text style = {styles.subtitle}>
                    Where are you joining us from?
                </Text>
                <TextInput style={styles.input} onChangeText={(text) => setCityName(text)} value={cityName} placeholder="Your City"/>
                <TouchableOpacity onPress = {getLocation}>
                    <Text style = {styles.hyperLocate}>Locate me</Text>
                </TouchableOpacity>
                <View style = {styles.bottom}>
                    <Text style = {styles.bottomWord}>Knowing your location will help us connect</Text>
                    <Text style = {styles.bottomWord}>you with relevant actions, projects, and</Text>
                    <Text style = {styles.bottomWord}>community members.</Text>
                </View>
                <Pressable style = {styles.button}>
                    <Text style = {styles.buttonText}>Continue</Text>
                </Pressable>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position:'relative',
    },
    ImageBackground:{
        width:'100%',
        height:'100%',
    },
    title: {
        position: 'absolute',
        width: 230*scaleWidth,
        height: 36*scaleHeight,
        left: 72*scaleWidth,
        top: 132*scaleHeight,
        fontSize: 22,
        lineHeight: 36,
        textAlign: 'center',
        letterSpacing: 0.02,
        color: '#092C4C',
        fontFamily: 'NunitoSans_700Bold',
    },
    subtitle: {
        /* Where are you joining us from? */
        position: 'absolute',
        width: 198*scaleWidth,
        height: 19*scaleHeight,
        left: 88*scaleWidth,
        top: 175*scaleHeight,
        fontFamily: 'NunitoSans_400Regular',
        fontSize: 14,
        lineHeight: 18.6,
        textAlign: 'center',
        letterSpacing: 0.005,
        color: '#000000',
//         borderWidth: 0.7,
//         borderColor: '#D0D0D0',
//         borderRadius: 10,
    },
    input: {
        position: 'absolute',
        width: 327*scaleWidth,
        height: 45*scaleHeight,
        left: 23*scaleWidth,
        top: 240*scaleHeight,

        borderWidth: 0.7,
        borderColor: '#D0D0D0',
        borderRadius: 8,
        paddingLeft: 20,
        fontSize: 14,
    },
    hyperLocate: {
        /* Locate me */
        position: 'absolute',
        width: 58*scaleWidth,
        height: 14*scaleHeight,
        left: 292*scaleWidth,
        top: 289*scaleHeight,
        fontFamily: 'NunitoSans_400Regular',
        fontSize: 12,
        lineHeight: 14,

        letterSpacing: 0.02,
        color: 'rgba(239, 30, 30, 0.8)',
//         color: 'red',
        textDecorationLine: 'underline',
    },
    bottom: {
        position: 'absolute',
        width: 291*scaleWidth,
        height: 57*scaleHeight,
        left: 47*scaleWidth,
        top: 627*scaleHeight,
        alignItems: 'center',
    },
    bottomWord: {
        fontFamily: 'NunitoSans_400Regular',
        fontSize: 14,
//         lineHeight: 19,
        textAlign: 'center',
        letterSpacing: 0.005,
        color: '#696969',
    },
    button: {
        position: 'absolute',
        width: 327*scaleWidth,
        height: 52*scaleHeight,
        left: 24*scaleWidth,
        top: 718*scaleHeight,
        backgroundColor: '#F9C642',
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontFamily: 'NunitoSans_700Bold',
        fontSize: 18,
//         lineHeight: 14,
        letterSpacing: 0.02,
        /* White */
        color: '#FFFFFF',
    }
})

export default SignUpPage2