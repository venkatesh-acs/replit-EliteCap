import { Alert, Dimensions, Image, ImageBackground, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native-gesture-handler';
import { LoginService } from '../services/LoginService';

const pwdpng = require('../assets/ic_key.png');
const imagename = require('../assets/elite.png');
const caplogimg = require('../assets/ec_icon.png');
const { width, height } = Dimensions.get('window');
// Set the height based on the screen width
const isMobile = width <= 767;
const isTablet = width >= 768 && width <= 1024;

const centimgHeight = isMobile ? 150 : isTablet ? 200 : 200;

const ResetPassword: React.FC = () => {
    const [uid, setUid] = useState('');
    const [email, setEmail] = useState('');
    console.log('email', email)
    const [newpass, setNewPass] = useState('');
    const [oldpass, setOldPass] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    //to get sesiion values
    useEffect(() => {
        async function fetchsessvalues() {
            const storedUid = await AsyncStorage.getItem('uid') as any;
            const storedemail = await AsyncStorage.getItem('email') as any;
            setUid(storedUid);
            setEmail(storedemail);
        }
        fetchsessvalues()
    }, [setUid, setEmail])
    //to toggle password
    const toggleSwitch = () => {
        setShowPassword(previousState => !previousState);
    };
    //to change password
    const passwordchange = async () => {
        const countrycode = await AsyncStorage.getItem('countrycode')
        if (oldpass && newpass) {
            const apiname = '/ws_changepass.php';
            const payload = { email: email, oldpass: oldpass, newpass: newpass, countrycode: countrycode };
            console.log('payload', payload)
            const res = await LoginService.getDatas(apiname, payload)
            Alert.alert(res.message)

        } else {
            Alert.alert("Please fill all the details")
        }
    }
    return (
        <View style={styles.container}>
            <ImageBackground source={imagename} style={styles.image}>
                <View style={styles.imageContainer}>
                    <Image source={caplogimg} style={styles.centeredImage} />
                    <Text style={styles.logoText}>EliteCap</Text>
                </View>
                <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 10 }}>
                    <Text style={{ color: 'white', fontSize: 20 }}>Email: </Text>
                    <Text style={{ color: 'white', fontSize: 20 }}>{email} </Text>
                </View>
                <View style={{ flexDirection: 'row', }}>
                    <TextInput
                        onChangeText={(text) => setOldPass(text)}
                        style={styles.textInput}
                        secureTextEntry={!showPassword}
                        placeholder="Enter Old Password"
                        placeholderTextColor='black'
                        value={oldpass}
                        autoCapitalize='none'
                    />
                    <Image source={pwdpng} style={styles.inputimg} />
                </View>
                <View style={{ flexDirection: 'row', }}>
                    <TextInput
                        onChangeText={(text) => setNewPass(text)}
                        style={styles.textInput}
                        secureTextEntry={!showPassword}
                        placeholder="Enter New Password"
                        placeholderTextColor='black'
                        value={newpass}
                        autoCapitalize='none'
                    />
                    <Image source={pwdpng} style={styles.inputimg} />
                </View>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={showPassword ? "#f5dd4b" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={showPassword}
                    style={{ alignSelf: 'center', marginTop: 15 }}
                />
                <TouchableOpacity style={{ alignItems: 'center' }} onPress={passwordchange}>
                    <Text style={{ color: "white", fontWeight: "bold", fontSize: 22, textDecorationColor: 'white', backgroundColor: '#088F8F', paddingVertical: 5, paddingHorizontal: 40, borderRadius: 5, marginTop: 20 }}>Update Password</Text>
                </TouchableOpacity>
            </ImageBackground>
        </View>
    )

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    inputcss: {
        marginTop: 50,
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        width: '90%',
        color: 'white',
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
        width: 200,
        marginTop: 20,
        height: 50
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
        height: 40
    },
    inputimg: {
        width: 40,
        height: 40,
        backgroundColor: 'white',
        marginTop: 20,
    },
    logoText: {
        fontSize: 20,
        color: 'white',
        fontWeight: '500'
    }

})

export default ResetPassword