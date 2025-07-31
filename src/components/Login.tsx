import { Alert, Button, Dimensions, Image, ImageBackground, PermissionsAndroid, Platform, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, ScrollView, StatusBar } from 'react-native'
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
import { GlobalStyles, colors, spacing, borderRadius, shadow } from '../styles/GlobalStyles';

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
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
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
        <SafeAreaView style={[GlobalStyles.safeArea, { backgroundColor: colors.background }]}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.container}>
                        <View style={styles.logoContainer}>
                            <View style={styles.logoWrapper}>
                                <Image
                                    source={require('../assets/ic_logo.png')}
                                    style={styles.logo}
                                    resizeMode="contain"
                                />
                            </View>
                            <Text style={styles.title}>Welcome Back</Text>
                            <Text style={styles.subtitle}>Sign in to your EliteCap account</Text>
                        </View>

                        <View style={styles.formContainer}>
                            <View style={styles.inputContainer}>
                                <Image
                                    source={require('../assets/ic_person.png')}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={[
                                        GlobalStyles.input,
                                        styles.input,
                                        emailFocused && GlobalStyles.inputFocused
                                    ]}
                                    placeholder="Email address"
                                    placeholderTextColor={colors.gray[400]}
                                    value={email}
                                    onChangeText={setEmail}
                                    onFocus={() => setEmailFocused(true)}
                                    onBlur={() => setEmailFocused(false)}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Image
                                    source={require('../assets/ic_key.png')}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={[
                                        GlobalStyles.input,
                                        styles.input,
                                        passwordFocused && GlobalStyles.inputFocused
                                    ]}
                                    placeholder="Password"
                                    placeholderTextColor={colors.gray[400]}
                                    value={password}
                                    onChangeText={setPassword}
                                    onFocus={() => setPasswordFocused(true)}
                                    onBlur={() => setPasswordFocused(false)}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                                <TouchableOpacity
                                    style={styles.eyeIcon}
                                    onPress={() => setShowPassword(!showPassword)}
                                    activeOpacity={0.7}
                                >
                                    <Image
                                        source={require('../assets/ic_eyeview.png')}
                                        style={[
                                            styles.eyeImage,
                                            { tintColor: showPassword ? colors.primary : colors.gray[400] }
                                        ]}
                                    />
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                style={[
                                    GlobalStyles.button,
                                    styles.loginButton,
                                    isLoading && styles.loginButtonDisabled
                                ]}
                                onPress={handleLogin}
                                disabled={isLoading}
                                activeOpacity={0.8}
                            >
                                <Text style={[GlobalStyles.buttonText, styles.loginButtonText]}>
                                    {isLoading ? 'Signing In...' : 'Sign In'}
                                </Text>
                            </TouchableOpacity>

                            <View style={styles.linkContainer}>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('ForgotPassword')}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.linkText}>Forgot Password?</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.divider}>
                                <View style={styles.dividerLine} />
                                <Text style={styles.dividerText}>or</Text>
                                <View style={styles.dividerLine} />
                            </View>

                            <TouchableOpacity
                                style={[GlobalStyles.buttonOutline, styles.registerButton]}
                                onPress={() => navigation.navigate('Register')}
                                activeOpacity={0.8}
                            >
                                <Text style={[GlobalStyles.buttonTextOutline, styles.registerButtonText]}>
                                    Create New Account
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        minHeight: screenHeight * 0.9,
    },
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: spacing.lg,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: screenHeight * 0.08,
        marginBottom: spacing.xl,
    },
    logoWrapper: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.lg,
        ...shadow.lg,
    },
    logo: {
        width: 60,
        height: 60,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: colors.text.primary,
        marginBottom: spacing.sm,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        color: colors.text.secondary,
        textAlign: 'center',
        lineHeight: 22,
    },
    formContainer: {
        flex: 1,
        paddingTop: spacing.lg,
    },
    inputContainer: {
        position: 'relative',
        marginBottom: spacing.md,
    },
    input: {
        paddingLeft: 52,
        fontSize: 16,
        borderRadius: borderRadius.lg,
        fontWeight: '500',
    },
    inputIcon: {
        position: 'absolute',
        left: 16,
        top: 18,
        width: 20,
        height: 20,
        tintColor: colors.gray[400],
        zIndex: 1,
    },
    eyeIcon: {
        position: 'absolute',
        right: 16,
        top: 14,
        padding: 8,
        borderRadius: borderRadius.md,
    },
    eyeImage: {
        width: 20,
        height: 20,
    },
    loginButton: {
        marginTop: spacing.md,
        backgroundColor: colors.primary,
        borderRadius: borderRadius.lg,
        ...shadow.md,
    },
    loginButtonDisabled: {
        backgroundColor: colors.gray[400],
        ...shadow.sm,
    },
    loginButtonText: {
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    linkContainer: {
        alignItems: 'center',
        marginTop: spacing.lg,
        marginBottom: spacing.xl,
    },
    linkText: {
        color: colors.primary,
        fontSize: 15,
        fontWeight: '600',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: spacing.xl,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: colors.border,
    },
    dividerText: {
        marginHorizontal: spacing.md,
        color: colors.text.tertiary,
        fontSize: 14,
        fontWeight: '500',
    },
    registerButton: {
        borderColor: colors.primary,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderRadius: borderRadius.lg,
    },
    registerButtonText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
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