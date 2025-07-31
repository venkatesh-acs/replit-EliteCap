import { Alert, Dimensions, Image, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { Component, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { LoginService } from '../services/LoginService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const phoneimg = require('../assets/ic_key.png');

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const imagename = require('../assets/elite.png');
const caplogimg = require('../assets/ec_icon.png');
// const logoimg = require('../assets/medical.png');
const emailimg = require('../assets/ic_email.png');
const ForgotPassword:React.FC = () => {
    const [email, setEmail] = useState<any>('');
    const [phone, setPhone] = useState<any>('');

    const [showPassword, setShowPassword] = useState(false);
    const navigation = useNavigation<any>();

    const toggleSwitch = () => {
        setShowPassword(previousState => !previousState);
    };

    const forgot = async () => {
        if (email) {
            const currentURL = await AsyncStorage.getItem('currentURL');
            const apiname = '/ws_forgot_pass.php';
            const payload = { email: email,liveurl:currentURL };
            console.log(payload)
            try {
                const res = await LoginService.getData(apiname, payload);
                Alert.alert(
                    '',
                    res.message,
                    [{ text: 'OK' }]
                );
                setEmail('');
                setEmail(null);

                //   if(res.message ==='You have to Activate Your Account please check Email'){
                // navigation.navigate('login');
                //   }else if(res.message === 'We send a mail to your account'){
                navigation.navigate('login');

                //   }

            } catch (error) {
                Alert.alert('Login Error', 'An error occurred during login');
            }
        } else {
            Alert.alert('Please fill all the details')
        }
    };

    const logins = async () => {
        navigation.navigate('login');
    }
    return (
        <View style={styles.container}>
            <ImageBackground source={imagename} style={styles.image}>

                <View style={styles.imageContainer}>
                  <Image source={caplogimg} style={styles.centeredImage} />
                  {/* <Image source={logoimg} style={styles.centeredImage1} /> */}
                  <Text style={styles.logoText}>EliteCap</Text>
              </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        onChangeText={(text) => setEmail(text)}
                        style={styles.textInput}
                        placeholder="Enter Email"
                        placeholderTextColor='black'
                        autoCapitalize='none'
                        value ={email}
                    />
                    <Image
                        source={emailimg}
                        style={styles.images}
                    />
                </View>
              
                <TouchableOpacity style={styles.button} onPress={forgot}>
                    <Text style={styles.buttonText}>FORGOT PASSWORD</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ alignItems: 'center', marginTop: 30 }} onPress={logins}>
                    <Text style={styles.buttonTexts}>Login</Text>
                </TouchableOpacity>
            </ImageBackground>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E90FF',
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
        marginLeft: 10,
        width: '95%',
        color: 'black'
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
        backgroundColor: "#088F8F",
        marginLeft: 10,
        width: '95%'
    },
    buttons: {
        marginTop: 30,
        borderColor: "lightgray",
        borderWidth: 1,
        borderStyle: "solid",
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: "center",
        backgroundColor: "grey",
        marginLeft: 10,
        width: '95%'
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 22,
    },
    buttonTexts: {
        color: "white",
        fontWeight: "bold",
        fontSize: 25,
        textDecorationLine: 'underline',
    },
    inputContainer: {
        position: 'relative',
        // borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        width: '100%',
    },
    images: {
        position: 'absolute',
        right: 20,
        top: 15,
        width: '10%',
    },
    imageContainer: {
        alignItems: 'center',
        marginVertical: screenHeight * 0.01,
        marginTop:-270
    },
    centeredImage: {
        width: screenWidth * 0.3,
        height: screenWidth * 0.3,
    },
    centeredImage1: {
        width: 300,
        height: 50,
    },
    centimg: {
        width: screenWidth * 0.9,
        height: screenHeight * 0.05,
        marginTop: 10,
    },
    logoText: {
        fontSize: 20,
        color: 'white',
        fontWeight: '500'
    }
});




export default ForgotPassword