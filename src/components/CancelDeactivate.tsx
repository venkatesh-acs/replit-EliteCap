import { Alert, Dimensions, ImageBackground, StyleSheet, Text, View } from 'react-native'
import React, { Component } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LoginService } from '../services/LoginService'
import { Image } from 'react-native'

const caplogimg = require('../assets/ec_icon.png');
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const { width, height } = Dimensions.get('window');
// Set the height based on the screen width
const isMobile = width <= 767;
const isTablet = width >= 768 && width <= 1024;
const centimgHeight = isMobile ? 150 : isTablet ? 200 : 100;
const CancelDeactivate: React.FC = () => {
    const activates = async () => {
        const uid = await AsyncStorage.getItem('uid') as string;
        const email = await AsyncStorage.getItem('email') as string;

        const apiname = '/ws_canceldeactivate.php'
        const payload = { uid: uid, type: email };
        const res = await LoginService.getData(apiname, payload);
        console.log('res', res)
        if (res.message === "Your account is activated") {
            Alert.alert(
                '',
                res.message,
                [{ text: 'OK' }]
            );
        } else {
            Alert.alert(
                '',
                res.error_msg,
                [{ text: 'OK' }]
            );
        }
    }
    return (
        <View style={styles.container}>
            <Image source={caplogimg} style={styles.centeredImage} />
            <Text style={styles.logoText}>EliteCap</Text>
            <Text style={{ color: 'black', marginTop: 30, marginLeft: 20, marginRight: 20, fontSize: 18 }}>You’ll need to reactivate your Page to cancel deletion. To cancel your Page deletion:
                Within 14 days of scheduling to delete your Page, from your main profile click your profile photo in the top right of DailyRoll.
            </Text>
            <TouchableOpacity style={styles.ovalButton4} onPress={activates}>
                <Text style={styles.buttonTexts}>Cancel Delete Account</Text>
            </TouchableOpacity>
        </View>
    )

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ovalButton4: {
        backgroundColor: 'blue',
        borderRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginHorizontal: 10,
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 30
    },
    buttonTexts: {
        color: 'white',
        fontWeight: '600',
        fontSize: 20,
    },
    image: {
        flex: 1,
        resizeMode: 'cover',
        // justifyContent: 'center',
    },
    imageContainer: {
        alignItems: 'center',
        marginVertical: screenHeight * 0.05,
    },
    centeredImage: {
        width: 150,
        height: 150,
        marginBottom: 10,
        alignSelf: 'center'
    },
    centimg: {
            width: 200,
            marginTop: 20,
            height:50,
        alignSelf: 'center'
    },
    logoText: {
        fontSize: 20,
        color: 'white',
        fontWeight: '500'
    }
})

export default CancelDeactivate;