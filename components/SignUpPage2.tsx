// npx expo install expo-location
import { StyleSheet, Text, View, ImageBackground, Dimensions, Image, TouchableOpacity, TextInput, Pressable } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useFonts, NunitoSans_200ExtraLight, NunitoSans_300Light,
NunitoSans_400Regular, NunitoSans_700Bold, NunitoSans_800ExtraBold } from '@expo-google-fonts/nunito-sans';
import AppLoading from 'expo-app-loading';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Geocoder from 'react-native-geocoding';

Geocoder.init('AIzaSyASBMsXBCiMO2JZVJJr-DbdnINeqZnJ5O8');

const {width, height} = Dimensions.get('window');
const baseWidth = 375;
const baseHeight = 812;

const scaleWidth = width/baseWidth;
const scaleHeight = height / baseHeight;

const MapSquare = ({mapRef, cityName, latitude, longitude}) => {
    return (
        <View style={styles.map}>
            <MapView
                style={{ width: '100%', height: 200 }}
                ref={mapRef}
                initialRegion={{
                    latitude: 42.361145,
                    longitude: -71.057083,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
            {cityName && (
                <Marker
                    coordinate={{latitude: latitude, longitude: longitude}}
                    title={cityName}
                />
            )}
            </MapView>
        </View>
    )
}

const scale = Math.min(scaleWidth,scaleHeight);
const finalScale = scale > 1 ? 1:scale;
const scaledSize = (size: number) => Math.ceil(size * finalScale);


const SignUpPage2 = () => {
    const [cityName, setCityName] = useState<string>('');
    const [latitude, setLatitude] = useState<number>(42.361145);
    const [longitude, setLongitude] = useState<number>(-71.057083);
    const mapRef: React.LegacyRef<MapView> | undefined = useRef(null);

    const mark = (lat: number, lng: number) => {
        mapRef.current!.animateToRegion({
            latitude: lat,
            longitude: lng,
            latitudeDelta: 1,
            longitudeDelta: 1,
        }, 500);
    }

    const handleGeocode = (city: string) => {
        setCityName(city);
        Geocoder.from(city)
        .then((response) => {
            const lat = response.results[0].geometry.location["lat"];
            const lng = response.results[0].geometry.location["lng"];
            setLatitude(lat);
            setLongitude(lng);
            mark(lat, lng);
        })
        .catch((error) => console.warn(error));
    };

    const getLocation = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                // Handle permission not granted
                return;
            } else {
                let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation});
                let { latitude, longitude } = location.coords;
                setLatitude(latitude);
                setLongitude(longitude);

                // Reverse geocode the latitude and longitude to get the city name
                let geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
                if (geocode && geocode.length > 0 && geocode[0].city) {
                    setCityName(geocode[0].city);
                    mark(latitude, longitude);
                }
            }
        } catch (error) {
            console.error('Error fetching location: ', error);
        }
    }

    useEffect(() => {
        // Check and ask for location permissions when the component mounts
        (async () => {})();
    }, []);

    let [fontsLoaded] = useFonts({
        NunitoSans_200ExtraLight, NunitoSans_300Light, NunitoSans_400Regular, NunitoSans_700Bold, NunitoSans_800ExtraBold,
    });
    if (!fontsLoaded) {
        return <AppLoading />;
    }else{}

    return (
        <View style={styles.container}>
            <ImageBackground style={styles.ImageBackground} resizeMode="stretch" source={require('../assets/background.png')}>
                <Text style = {styles.title}>
                    Hi xxx, Let's get local!
                </Text>
                <Text style = {styles.subtitle}>
                    Where are you joining us from?
                </Text>
                <View style={styles.input}>
                    <GooglePlacesAutocomplete
                        styles={{ listView: {maxHeight: 100} }}
                        placeholder="Your city"
                        onPress={(data) => handleGeocode(data.description)}
                        query={{
                            key: 'AIzaSyASBMsXBCiMO2JZVJJr-DbdnINeqZnJ5O8',
                            language: 'en', // Language preference
                        }}
                        keyboardShouldPersistTaps='never'
                    />
                </View>
                <TouchableOpacity onPress = {getLocation}>
                    <Text style = {styles.hyperLocate}>Locate me</Text>
                </TouchableOpacity>
                <MapSquare mapRef={mapRef} cityName={cityName} latitude={latitude} longitude={longitude} />
                {/* <View style={styles.map}>
                    <MapView
                        style={{ width: '100%', height: 200 }}
                        ref={mapRef}
                        initialRegion={{
                            latitude: 42.361145,
                            longitude: -71.057083,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                    >
                    {cityName && (
                        <Marker
                            coordinate={{latitude: latitude, longitude: longitude}}
                            title={cityName}
                        />
                    )}
                    </MapView>
                </View> */}
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
        top: 100*scaleHeight,
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
        top: 140*scaleHeight,
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
        height: 170*scaleHeight,
        left: 23*scaleWidth,
        top: 180*scaleHeight,

        // borderWidth: 0.7,
        // borderColor: '#D0D0D0',
        // borderRadius: 8,
        // paddingLeft: 23,
        fontSize: 14,
    },
    hyperLocate: {
        /* Locate me */
        position: 'absolute',
        width: 58*scaleWidth,
        height: 18*scaleHeight,
        left: 292*scaleWidth,
        top: 259*scaleHeight,
        fontFamily: 'NunitoSans_400Regular',
        fontSize: 12,
        lineHeight: 14,
        letterSpacing: 0.02,
        color: 'rgba(239, 30, 30, 0.8)',
//         color: 'red',
        textDecorationLine: 'underline',
    },
    map: {
        position: 'absolute',
        width: 362*scaleWidth,
        height: 257 * scaleHeight,
        left: 6*scaleWidth,
        top: 337*scaleHeight,
        alignItems: 'center',
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