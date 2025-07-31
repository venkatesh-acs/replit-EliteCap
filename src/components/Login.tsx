import { Alert, Button, Dimensions, Image, ImageBackground, PermissionsAndroid, Platform, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { Component, useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginService } from '../services/LoginService';
import { Dialog } from 'react-native-paper';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
// import Geolocation from 'react-native-geolocation-service';

import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const imagename = require('../assets/elite.png');
const caplogimg = require('../assets/ec_icon.png');
const emailimg = require('../assets/ic_email.png');
const keyimg = require('../assets/ic_key.png');
interface LoginProps {
    onLogin: () => string;
}
const Login = ({ onLogin }: LoginProps) => {
    const [email, setEmail] = useState<any>(null);
    const [password, setPassword] = useState<any>(null);
    const [showPassword, setShowPassword] = useState(false);
    const navigation = useNavigation();
    const [storagepermissions, setStoragePermission] = useState<boolean | null>(null);
    const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
    const [openDialog, setDialog] = useState<any>(null);
    const [passwords, setPasswords] = useState<any>(null);
    const [showPasswordEnv, setShowPasswordEnv] = useState(false);
    const [currentLat, setLat] = useState('')
    const [currentLong, setLong] = useState('')
    const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
    useEffect(() => {
        requestCameraPermission()
        requestStoragePermission();

    }, []);

    const requestStoragePermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'Storage Permission',
                        message: 'App needs access to your storage to save files.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    //console.log('You can use the storage');
                    setStoragePermission(true)
                } else {
                    //console.log('Storage permission denied');
                    setStoragePermission(false)
                }
            } catch (err) {
                console.warn(err);
                setStoragePermission(false)

            }
        }
        else if (Platform.OS === 'ios') {
            // For iOS, you typically don't need to request permissions at runtime for file access.
            // However, check the `react-native-permissions` documentation for iOS-specific permissions if needed.
        }
        // requestLocationPermission();
    }
    //location permissions
    async function requestLocationPermission() {
        try {
            let permission;
            if (Platform.OS === 'ios') {
                permission = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
            } else {
                permission = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
            }
            //console.log("permission", permission);

            if (permission === RESULTS.GRANTED) {
                //console.log('Location permission granted');
                setLocationPermission(true);
                // Get the location values
                getLocation();
            } else {
                //console.log('Location permission denied');
                setLocationPermission(false);
            }
        } catch (err) {
            // console.warn(err);
            setLocationPermission(false);
        }
    };


    const getLocationFromIP = async () => {
      try {
        const response = await axios.get('http://ip-api.com/json/');
        const { lat, lon } = response.data; // Returns latitude and longitude separately
        //console.log('Latitude:', lat);
        //console.log('Longitude:', lon);
        return { latitude: lat, longitude: lon };
      } catch (error) {
        // console.error('Error fetching location:', error);
        return null;
      }
    };

    // Usage
    getLocationFromIP().then((location) => {
      if (location) {
        //console.log('Location:', location);
        showposition1(location)
      }
    });
    const showposition1 = async (position: any) => {
        try {
            //console.log("showposition: is called");
            const currentLat = position.latitude;
            const currentLong = position.longitude;
            // Store latitude and longitude in AsyncStorage
            await AsyncStorage.setItem('latitude', currentLat.toString());
            await AsyncStorage.setItem('longitude', currentLong.toString());
            if (currentLong) {
                // Fetch geocode data
                const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${currentLat},${currentLong}&key=AIzaSyBUK8sY83sV1sp2T3GEyOPUln-lOlgUx94`);
                const responseJson = await response.json();
                //console.log('ADDRESS GEOCODE is BACK!! => ' + JSON.stringify(responseJson));
                if (responseJson.results.length > 0) {
                    const result = responseJson.results[0];
                    const address = result.formatted_address || '';
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
                        if (types.includes('sublocality_level_1')) {
                            city = component.long_name;
                        }
                        if (city == '') {
                            if (types.includes('locality')) {
                                city = component.long_name;
                            }
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
                        //console.log('Address Components:', addressComponents);

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

                    //console.log('postalCode', postalCode)

                    // Store address components in AsyncStorage
                    await AsyncStorage.setItem('countryname', country);
                    await AsyncStorage.setItem('countrycode', countryCode);
                    await AsyncStorage.setItem('statename', state);
                    await AsyncStorage.setItem('city', city);
                    await AsyncStorage.setItem('zipcode', postalCode);
                    //console.log('postalCode', postalCode)
                    await AsyncStorage.setItem('address', address);
                    await AsyncStorage.setItem('districtname', district);
                }
            }

            // Update state after geocode fetch
            setLong(currentLong);
            setLat(currentLat);

        } catch (error) {
            // console.error('Error in showposition:', error);
        }
        requestCameraPermission()

    };


    //To get location lat and longi
    const getLocation = () => {
        //console.log('get location called')
        // Geolocation.getCurrentPosition(info => //console.log(info));

        Geolocation.getCurrentPosition(
            (position) => {
                //console.log(position);
                showposition(position)
            },
            (error) => {
                //console.log(error.code, error.message);
            },
            // { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }

        );
    };
    const showposition = async (position: any) => {
        try {
            //console.log("showposition: is called");
            const currentLat = position.coords.latitude;
            const currentLong = position.coords.longitude;
            // Store latitude and longitude in AsyncStorage
            await AsyncStorage.setItem('latitude', currentLat.toString());
            await AsyncStorage.setItem('longitude', currentLong.toString());
            if (currentLong) {
                // Fetch geocode data
                const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${currentLat},${currentLong}&key=AIzaSyBUK8sY83sV1sp2T3GEyOPUln-lOlgUx94`);
                const responseJson = await response.json();
                //console.log('ADDRESS GEOCODE is BACK!! => ' + JSON.stringify(responseJson));
                if (responseJson.results.length > 0) {
                    const result = responseJson.results[0];
                    const address = result.formatted_address || '';
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
                        if (types.includes('sublocality_level_1')) {
                            city = component.long_name;
                        }
                        if (city == '') {
                            if (types.includes('locality')) {
                                city = component.long_name;
                            }
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
                        //console.log('Address Components:', addressComponents);

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

                    //console.log('postalCode', postalCode)

                    // Store address components in AsyncStorage
                    await AsyncStorage.setItem('countryname', country);
                    await AsyncStorage.setItem('countrycode', countryCode);
                    await AsyncStorage.setItem('statename', state);
                    await AsyncStorage.setItem('city', city);
                    await AsyncStorage.setItem('zipcode', postalCode);
                    //console.log('postalCode', postalCode)
                    await AsyncStorage.setItem('address', address);
                    await AsyncStorage.setItem('districtname', district);
                }
            }

            // Update state after geocode fetch
            setLong(currentLong);
            setLat(currentLat);

        } catch (error) {
            // console.error('Error in showposition:', error);
        }
        requestCameraPermission()

    };
    //camera permissions
    async function requestCameraPermission() {
        try {
            let permission;
            if (Platform.OS === 'ios') {
                permission = PERMISSIONS.IOS.CAMERA;
            } else {
                permission = PERMISSIONS.ANDROID.CAMERA;
            }

            // Check current permission status
            const status = await check(permission);
            if (status === RESULTS.GRANTED) {
                //console.log('You already have camera permission');
                setCameraPermission(true);
            } else {
                // Request permission
                const result = await request(permission, {
                    title: 'Camera Permission',
                    message: 'This app needs access to your camera.',
                    //   buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                });

                if (result === RESULTS.GRANTED) {
                    //console.log('You can use the camera');
                    setCameraPermission(true);
                } else {
                    //console.log('Camera permission denied');
                    setCameraPermission(false);
                }
            }
        } catch (err) {
            // console.warn(err);
            setCameraPermission(false);
        }
        // requestStoragePermission();
        requestMicrophonePermission();

    }
    async function requestMicrophonePermission() {
        if (Platform.OS === 'ios') {
            try {
                // Request permission for the iOS microphone
                const result = await request(PERMISSIONS.IOS.MICROPHONE);

                // Check if permission is granted, denied, or blocked
                if (result === RESULTS.GRANTED) {
                    //console.log('Microphone permission granted on iOS');
                    // Proceed with functionality like starting the audio recording
                } else if (result === RESULTS.DENIED) {
                    //console.log('Microphone permission denied on iOS');
                    Alert.alert('Permission Denied', 'You need to grant microphone access to record audio.');
                } else if (result === RESULTS.BLOCKED) {
                    //console.log('Microphone permission blocked on iOS');
                    // Alert.alert(
                    //   'Permission Blocked',
                    //   'Please enable microphone permission in settings.',
                    //   [
                    //     {
                    //       text: 'Go to Settings',
                    //       onPress: () => Linking.openSettings(),
                    //     },
                    //     { text: 'Cancel' },
                    //   ]
                    // );
                }
            } catch (err) {
                console.warn('Error requesting microphone permission on iOS:', err);
            }
        }
        requestLocationPermission();

    }

    // Toggle Password
    const toggleSwitch = () => {
        setShowPassword((prevState) => !prevState);
    };
    const toggleSwitch1 = () => {
        setShowPasswordEnv((prevState) => !prevState);
    };
    //to store data
    const storeData = async (res: any) => {
        try {
            //console.log("uid_check", res.uid)
            // const fname1 = await decryptCipherTextWithRandomIV(res.name, key1);
            // const phone1 = await decryptCipherTextWithRandomIV(res.name, key1);
            // //console.log('fname1',fname1)
            // //console.log('phone1',phone1)
            await AsyncStorage.setItem('uid', res.uid);
            await AsyncStorage.setItem('email', res.email);
            await AsyncStorage.setItem('name', res.name);
            // await AsyncStorage.setItem('phone', phone1);
            // await AsyncStorage.setItem('name', fname1);
            await AsyncStorage.setItem('phone', res.phone);
            await AsyncStorage.setItem('deletetype', res.deletetype);
        } catch (e) {
            //console.log('Error while saving data:', e);
        }
    };




    //login
    const handleLogin = async () => {
        const apiname = '/ws_login.php';
        if (email && password) {
            const payload = {
                email: email, password: password
            }
            //console.log("payload", payload)
            // await AsyncStorage.setItem('password',password)
            const response = await LoginService.getData(apiname, payload)
            console.log("response", response);
            if (response.uid) {
                await storeData(response);
                onLogin();
                navigation.navigate('bottomnavigation' as never);
            } else {
                Alert.alert(response.error_msg, "", [{ text: 'OK' }])
            }
        } else {
            Alert.alert("Please Enter All The Details")
        }
    }
    const forgotpass = async () => {
        navigation.navigate('forgotpassword' as never);
    };
    const register = async () => {
        navigation.navigate('register' as never);
    };
    const support = async () => {
        navigation.navigate('Support' as never);
    };


    //GeneratePassword
    const generatePassword = async () => {
        const date = new Date();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString().slice(-2);
        return `eli${month}${year}`
    }
    const env = async () => {
        setDialog(true)
        // navigation.navigate('env' as never);
    };
    const handleAdd = async () => {
        const currnetPassword = await generatePassword();
        //console.log('currnetPassword', currnetPassword.trim())
        //console.log('passwords', passwords)

        if (currnetPassword === passwords) {
            navigation.navigate('env' as never);
        } else {
            Alert.alert('Error', 'Invalid password! Please try again.')
        }
        setPasswords(null);
    }
    const closedialog = () => {
        setDialog(false)
        setPasswords(null);
    }
    const pkg = require('../../package.json');
    const appVersion = pkg.version;
    return (
        <View style={styles.container}>
            <ImageBackground source={imagename} style={styles.image}>
                <View style={styles.imageContainer}>
                    <Image source={caplogimg} style={styles.centeredImage} />
                    <Text style={styles.logoText}>EliteCap</Text>
                    <Text style={[styles.logoText, { fontSize: 16, opacity: 0.8 }]}>Version: {appVersion}</Text>
                </View>

                <View style={styles.inputContainer}>
                    <Image source={emailimg} style={styles.inputIcon} />
                    <TextInput
                        onChangeText={(text) => setEmail(text)}
                        style={styles.textInput}
                        placeholder="Email"
                        placeholderTextColor="#666"
                        value={email}
                        autoCapitalize='none'
                        keyboardType="email-address"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Image source={keyimg} style={styles.inputIcon} />
                    <TextInput
                        onChangeText={(text) => setPassword(text)}
                        style={styles.textInput}
                        secureTextEntry={!showPassword}
                        placeholder="Enter Password"
                        placeholderTextColor="#666"
                        value={password}
                        autoCapitalize='none'
                    />
                </View>

                <View style={styles.checkboxContainer}>
                    <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={showPassword ? '#f5dd4b' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={showPassword}
                    />
                    <Text style={styles.label}>Show Password</Text>
                </View>

                <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
                    <Text style={styles.loginButtonText}>LOGIN</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={forgotpass} style={styles.linkButton}>
                    <Text style={styles.linkText}>Forgot Your Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={register} style={styles.linkButton}>
                    <Text style={styles.linkText}>Not a Member? Sign Up Now</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={support} style={styles.linkButton}>
                    <Text style={styles.linkText}>Contact Us</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={env} style={styles.hiddenButton}>
                    <Text style={styles.hiddenText}>.</Text>
                </TouchableOpacity>
            </ImageBackground>

            <Dialog visible={openDialog} style={{ zIndex: 10 }} >
                <View style={styles.dialogContainer}>
                    <Text style={styles.dialogTitle}>Enter Password</Text>
                    <TextInput
                        style={styles.dialogInput}
                        placeholder="Enter Password"
                        value={passwords}
                        onChangeText={setPasswords}
                        placeholderTextColor='#666'
                        secureTextEntry={!showPasswordEnv}
                        autoCapitalize='none'
                    />

                    <View style={[styles.checkboxContainer, { justifyContent: 'flex-start', marginLeft: 0 }]}>
                        <Switch
                            trackColor={{ false: '#767577', true: '#81b0ff' }}
                            thumbColor={showPasswordEnv ? '#f5dd4b' : '#f4f3f4'}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleSwitch1}
                            value={showPasswordEnv}
                        />
                        <Text style={[styles.label, { color: '#333' }]}>Show Password</Text>
                    </View>

                    <View style={styles.dialogButtonContainer}>
                        <TouchableOpacity style={[styles.dialogButton, styles.okButton]} onPress={handleAdd}>
                            <Text style={styles.dialogButtonText}>OK</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.dialogButton, styles.cancelButton]} onPress={closedialog}>
                            <Text style={styles.dialogButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Dialog>
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
    imageContainer: {
        alignItems: 'center',
        marginBottom: 40,
        marginTop: -100,
    },
    centeredImage: {
        width: screenWidth * 0.25,
        height: screenWidth * 0.25,
        marginBottom: 15,
    },
    logoText: {
        fontSize: 28,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
        marginBottom: 5,
    },
    inputContainer: {
        marginHorizontal: 20,
        marginBottom: 15,
        position: 'relative',
    },
    textInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 12,
        paddingVertical: 15,
        paddingHorizontal: 50,
        fontSize: 16,
        color: 'black',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    inputIcon: {
        position: 'absolute',
        left: 15,
        top: 15,
        width: 20,
        height: 20,
        tintColor: '#666',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    label: {
        marginLeft: 10,
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    loginButton: {
        backgroundColor: '#2196F3',
        marginHorizontal: 40,
        borderRadius: 25,
        paddingVertical: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
        marginBottom: 20,
    },
    loginButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        letterSpacing: 1,
    },
    linkButton: {
        alignItems: 'center',
        marginVertical: 8,
    },
    linkText: {
        color: 'white',
        fontSize: 16,
        textDecorationLine: 'underline',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    hiddenButton: {
        alignItems: 'center',
        marginTop: 20,
    },
    hiddenText: {
        color: 'transparent',
        fontSize: 16,
    },
    dialogContainer: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        margin: 30,
    },
    dialogTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
        marginBottom: 20,
    },
    dialogInput: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        color: 'black',
        marginBottom: 15,
    },
    dialogButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    dialogButton: {
        borderRadius: 25,
        paddingVertical: 12,
        paddingHorizontal: 25,
        minWidth: 80,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        elevation: 5,
    },
    okButton: {
        backgroundColor: '#4CAF50',
    },
    cancelButton: {
        backgroundColor: '#2196F3',
    },
    dialogButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});



export default Login