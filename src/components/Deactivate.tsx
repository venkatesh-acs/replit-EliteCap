import { Alert, Dimensions, Linking, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'react-native';
import { LoginService } from '../services/LoginService';

const caplogimg = require('../assets/ec_icon.png');

const { width, height } = Dimensions.get('window');
// Set the height based on the screen width
const isMobile = width <= 767;
const isTablet = width >= 768 && width <= 1024;
const centimgHeight = isMobile ? 100 : isTablet ? 150 : 100;
interface DeactivateProps {
    onLogout: () => void;
}

const Deactivate: React.FC<DeactivateProps> = ({ onLogout }) => {
// const Deactivate: React.FC = () => {
    const [isDeactivateChecked, setDeactivaeCheck] = useState(false);
    const [isPermanentChecked, setPermanentCheck] = useState(false);
    const [type, setType] = useState<string>('')
    // Function to handle checkbox press
    const handleCheckboxPress = (checked: any) => {
        setDeactivaeCheck(checked);
        if (checked) {
            setType('Deactive Account')
            setPermanentCheck(false)
        }
    };
    //handle permanent check
    const handlePermanentCheckboxPress = (checked: any) => {
        setPermanentCheck(checked);
        if (checked) {
            setType('Permanently Delete Account')
            setDeactivaeCheck(false)
        }
    };

    //to deactivate / delete account
    const delaccount = async () => {
        const storedUid = await AsyncStorage.getItem('uid') as any;
        const apiname = '/ws_deactivate.php';
        const payload = { uid: storedUid, type: type };
        if (storedUid && type) {
            const res = await LoginService.getData(apiname, payload);
            Alert.alert(
                '',
                res.message,
                [{ text: 'OK' }]
            );
            setType('');
            setDeactivaeCheck(false)
            setPermanentCheck(false)

            if (res.message === 'Your account is Permanently deleted' || res.message === 'Your account is deactivated') {
                await AsyncStorage.clear();
                navigation.navigate('login' as never);
            }
        } else {
            Alert.alert(
                '',
                'Please enter all the details',
                [{ text: 'OK' }]
            );
        }
    };
    const navigation = useNavigation();
    const buttonText = isPermanentChecked ? 'Permanently Delete' : 'Deactivate';

    const openLink = (url: any) => {
        Linking.openURL(url).catch((err) => console.error("Failed to open URL:", err));
    };
    return (
        <ScrollView>
            <View style={{ marginTop: 30, }}>
                <>
                    <Image source={caplogimg} style={styles.centeredImage} />
                    <Text style={styles.logoText}>EliteCap</Text>
                    <View style={{ flexDirection: 'row', marginTop: 20, marginLeft: '10%', }}>
                        <BouncyCheckbox isChecked={isDeactivateChecked} onPress={handleCheckboxPress} />
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginVertical: 10, color: 'black' }}>Deactive Account</Text>
                    </View>
                    <Text style={{ color: 'black', alignSelf: 'center', margin: 8, fontSize: 15 }}>
                        Deactivating your account can be temporary. Your Account will be disabled and business acounts and images will be not be deleted. You'll be able to continue using your account, once you reactivate your account.
                    </Text>
                    <View style={{ flexDirection: 'row', marginTop: 5, marginLeft: '10%' }}>
                        <BouncyCheckbox isChecked={isPermanentChecked} onPress={handlePermanentCheckboxPress} />
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginVertical: 10, marginLeft: 10, color: 'black' }}>Permanently Delete Account</Text>
                    </View>
                    <Text style={{ color: 'black', alignSelf: 'center', margin: 8, fontSize: 15 }}>
                        Deleting your account is permanent. When you delete account, you won't be able to retrieve the content or business transactions you've saved after grace period 30 days. Your special accounts and all of the businesses and income/expenses transaction with attached images will also be deleted
                    </Text>
                    <TouchableOpacity onPress={delaccount} style={{ backgroundColor: 'red', borderRadius: 30, paddingVertical: 5, paddingHorizontal: 20, alignSelf: 'center', marginTop: 5 }} >
                        <Text style={{ color: 'white', fontSize: 20 }}>{buttonText}</Text>
                    </TouchableOpacity>
                    <Text style={{ color: '#AA0144', textDecorationLine: 'underline', alignSelf: 'center', marginTop: 10, fontSize: 20, marginBottom: 30 }} onPress={() => openLink('https://elitecap.net/deletepolicy.html')}>
                        Delete Policy
                    </Text>

                </>
            </View>
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    centeredImage: {
        width: 130,
        height: 130,
        marginBottom: 15,
        alignSelf: 'center'
    },
    centimg: {
        width: 180,
        marginTop: 20,
        height: 50,
        alignSelf: 'center'
    },
    logoText: {
        fontSize: 20,
        color: 'black',
        fontWeight: '500',
        alignSelf:'center'
    }

})
export default Deactivate