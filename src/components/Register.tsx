import { Alert, Dimensions, ImageBackground, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { Component, useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginService } from '../services/LoginService';
import { randomBytes } from 'react-native-randombytes';
import AppSettings from '../services/Constants';

const imagename = require('../assets/elite.png');
const caplogimg = require('../assets/ec_icon.png');
const emailpng = require('../assets/ic_email.png');
const pwdpng = require('../assets/ic_key.png');
const nameimg = require('../assets/ic_person.png');
const phonepng = require('../assets/phone.png');

const { width, height } = Dimensions.get('window');

// Set the height based on the screen width
const isMobile = width <= 767;
const isTablet = width >= 768 && width <= 1024;

const centimgHeight = isMobile ? 100 : isTablet ? 150 : 100;

const Register: React.FC = () => {
    const [useremail, setEmail] = useState<any>(null);
    const [phone, setPhone] = useState<any>(null);
    const [fname, setFullName] = useState<any>(null);
    const [userpassword, setPassword] = useState<any>(null);
    const [state, setState] = useState<any>(null)
    const [country, setCountry] = useState<any>(null)
    const navigation = useNavigation<any>();
    const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
    const [latitude, setLat] = useState('')
    const [longitude, setLong] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [district, setDistrictName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [countrycode, setCountryCode] = useState('');
    const [key1, setSecretKey] = useState<any>('')
    const [ivstring, setIvString] = useState<any>('')

    useEffect(() => {
        // requestLocationPermission();
        getEncryptKey()
    }, []);

    const getEncryptKey = async () => {
        const apiname = '/ws_getencryptkey.php';
        const payload = {}
        const res = await LoginService.getData(apiname, payload)
        console.log('key_res', res)
        setSecretKey(res.secretyKey)
        setIvString(res.ivstring)
    }


    //to get location access
    const requestLocationPermission = async () => {
        try {
            const permission = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION); // For Android
            // const permission = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE); // For iOS
            console.log("permission", permission);

            if (permission === RESULTS.GRANTED) {
                console.log('Location permission granted');
                setLocationPermission(true);
                // Get the location values
                getLocation();
            } else {
                console.log('Location permission denied');
                setLocationPermission(false);
            }
        } catch (err) {
            console.warn(err);
            setLocationPermission(false);
        }
    };
    const getLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                console.log(position);
                showposition(position)
            },
            (error) => {
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };
    const showposition = async (position: any) => {
        try {
            console.log("showposition:   is called")
            const currentLat = position.coords.latitude;
            const currentLong = position.coords.longitude;
            await AsyncStorage.setItem('latitude', currentLat.toString());
            await AsyncStorage.setItem('longitude', currentLong.toString());
            if (currentLong) {
                const mylocation = false;
                const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${currentLat},${currentLong}&key=AIzaSyBUK8sY83sV1sp2T3GEyOPUln-lOlgUx94`);
                const responseJson = await response.json();
                console.log('ADDRESS GEOCODE is BACK!! => ' + JSON.stringify(responseJson));
                if (responseJson.results.length > 0) {
                    const result = responseJson.results[0];
                    setAddress(result.formatted_address || '');
                    const addressComponents = result.address_components;
                    let city = '';
                    let state = '';
                    let district = '';
                    let country = '';
                    let countryCode = '';
                    let postalCode = '';
                    let knownName = '';
                    let stateCode = '';
                    addressComponents.forEach((component: any) => {
                        const types = component.types;
                        if (types.includes('locality')) {
                            city = component.long_name;
                        }
                        if (types.includes('administrative_area_level_1')) {
                            state = component.long_name;
                            stateCode = component.short_name;
                        }
                        if (types.includes('administrative_area_level_2')) {
                            district = component.long_name;
                        }
                        if (types.includes('country')) {
                            country = component.long_name;
                            countryCode = component.short_name;
                        }
                        if (types.includes('postal_code')) {
                            postalCode = component.long_name;
                        }
                        if (types.includes('point_of_interest')) {
                            knownName = component.long_name;
                        }
                    });
                    for (const result of responseJson.results) {
                        const addressComponents = result.address_components;
                        // Log address components to inspect
                        console.log('Address Components:', addressComponents);
                        addressComponents.forEach((component: any) => {
                            const types = component.types;
                            if (types.includes('postal_code')) {
                                postalCode = component.long_name;
                            }
                        });
                        // If we found a postal code, break out of the loop
                        if (postalCode) {
                            break;
                        }
                    }
                    setCity(city);
                    setState(state);
                    setDistrictName(district);
                    setCountry(country);
                    setCountryCode(countryCode);
                    setPostalCode(postalCode);
                    //   setk(knownName);
                    await AsyncStorage.setItem('countryname', country);
                    await AsyncStorage.setItem('countrycode', countryCode);
                    await AsyncStorage.setItem('statename', city);
                    await AsyncStorage.setItem('city', city);
                    await AsyncStorage.setItem('zipcode', postalCode);
                    await AsyncStorage.setItem('address', address);
                    await AsyncStorage.setItem('districtname', district);
                }
            }
            setLong(currentLong);
            setLat(currentLat);
        } catch (error) {
            console.error('Error in showposition:', error);
        }
    }

 
    //Registration function
    const registers = async () => {
        if (useremail && phone && fname && userpassword) {
            if (phone.length === 10) {
                console.log('entered if')
                // const apiname = 'ws_register.php';
                const apiname = '/ws_register.php';
               
                const url = AppSettings.getUrl()
                const payload = { name: fname, email: useremail, password: userpassword, phone: phone,liveurl:url};
                console.log(payload)
                try {
                    const res = await LoginService.getData(apiname, payload);
                    console.log(res)
                    Alert.alert(
                        '',
                        res.error_msg,
                        [{ text: 'OK' }]
                    );
                    // Alert.alert(res.message)
                    if (res.error_msg === "Registration Success") {
                        setFullName(null);
                        setEmail(null);
                        setPassword(null);
                        setPhone(null)
                        navigation.navigate('login')
                    }
                } catch (error) {
                    Alert.alert('Login Error', 'An error occurred during login');
                }
            } else {
                Alert.alert(
                    '',
                    'Phone Numbers must be 10 digits',
                    [{ text: 'OK' }]
                );
            }
        } else {
            Alert.alert('Please fill all the details')
        }
    };
    //To redirect to login
    const logins = async () => {
        navigation.navigate('login');
    }
    const handlePhoneChange = (text: any) => {
        // Allow only numeric input
        if (/^\d*$/.test(text)) {
            setPhone(text);
        }
    };
    return (
        <View style={styles.container}>

            <ImageBackground source={imagename} style={styles.image}>
                <View style={styles.imageContainer}>
                    <Image source={caplogimg} style={styles.centeredImage} />
                    <Text style={styles.logoText}>EliteCap</Text>
                    {/* <Image source={loimg} style={[styles.centimg, { height: centimgHeight }]} /> */}
                </View>
                <View style={{ flexDirection: 'row', }}>

                    <TextInput
                        onChangeText={(text) => setFullName(text)}
                        style={styles.textInput}
                        placeholder="Enter Full Name"
                        placeholderTextColor='black'
                        autoCapitalize='none'
                        value={fname}
                    />
                    <Image source={nameimg} style={styles.inputimg} />
                </View>
                <View style={{ flexDirection: 'row', }}>

                    <TextInput
                        onChangeText={(text) => setEmail(text)}
                        style={styles.textInput}
                        placeholder="Enter Email"
                        placeholderTextColor='black'
                        autoCapitalize='none'
                        value={useremail}
                    />
                    <Image source={emailpng} style={styles.inputimg} />
                </View>
                <View style={{ flexDirection: 'row', }}>
                    <TextInput
                        onChangeText={(text) => setPassword(text)}
                        style={styles.textInput}
                        placeholder="Enter Password"
                        placeholderTextColor='black'
                        autoCapitalize='none'
                        value={userpassword}
                    />
                    <Image source={pwdpng} style={styles.inputimg} />
                </View>
                <View style={{ flexDirection: 'row', }}>
                    <TextInput onChangeText={(text) => setPhone(text)} style={styles.textInput} placeholder="Enter Phone" keyboardType="numeric" maxLength={10}
                        // onChange={(e) => {
                        //     const { text } = e.nativeEvent;
                        //     if (/^\d*$/.test(text)) {
                        //         setPhone(text);
                        //     }
                        // }}
                        onChange={(e) => handlePhoneChange(e.nativeEvent.text)}
                        placeholderTextColor='black'
                    />
                    <Image source={phonepng} style={styles.inputimg} />
                </View>
                <TouchableOpacity style={{ alignItems: 'center' }} onPress={registers}>
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={logins} style={{ alignItems: 'center', marginTop: 20 }}>
                    <Text style={styles.buttonTexts}>Already Registered? Login Me.</Text>
                </TouchableOpacity>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    textInput: {
        borderColor: "black",
        borderBottomWidth: 1,
        borderStyle: "solid",
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: 20,
        backgroundColor: 'white',
        marginLeft: '5%',
        width: '85%',
        color: 'black',
        height: 42
    },
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
        marginLeft: 10,
    },
    label: {
        marginLeft: 10,
    },
    button: {
        marginTop: 30,
        borderColor: "lightgray",
        borderWidth: 1,
        borderStyle: "solid",
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: "center",
        backgroundColor: "blue",
        marginLeft: 10,
        width: '95%'
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 22,
        textDecorationColor: 'white',
        backgroundColor: 'black',
        borderWidth: 2,
        paddingVertical: 5,
        paddingHorizontal: 40,
        borderRadius: 5,
        marginTop: 20
    },
    buttonTexts: {
        color: "white",
        fontWeight: "bold",
        fontSize: 22,
        textDecorationLine: 'underline',
    },
    inputimg: {
        width: 40,
        height: 40,
        backgroundColor: 'white',
        marginTop: 20,
    },
    imageContainer: {
        alignItems: 'center',
        marginTop: 15,
    },
    centeredImage: {
        width: 150,
        height: 150,
        marginBottom: 30
    },
    centimg: {
        width: "80%",
        marginTop: 20
    },
    logoText: {
        fontSize: 20,
        color: 'white',
        fontWeight: '500'
    }
});


export default Register