import { Dimensions, Image, ImageBackground, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import DropDownPicker from 'react-native-dropdown-picker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const imagename = require('../assets/elite.png');
const caplogimg = require('../assets/ec_icon.png');
const EnvironmentSelect: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<any>('prod');
    const [items, setItems] = useState([
        { label: 'DEV', value: 'deve' },
        { label: 'VAL', value: 'val' },
        { label: 'PROD', value: 'prod' }
    ]);
    const storedEnv = AsyncStorage.getItem('selectenv') as any;

    useEffect(() => {
        const getStoredEnv = async () => {
            try {
                const storedEnv = await AsyncStorage.getItem('selectenv');
                if (storedEnv) {
                    setValue(storedEnv);  // Set the dropdown value to the stored value
                }
            } catch (error) {
                // console.error('Failed to load the selected environment:', error);
            }
        };

        getStoredEnv();  // Call the async function to retrieve the stored value
    }, []);

    const navigation = useNavigation<any>();
    //To redirect to login
    const logins = async () => {
        await AsyncStorage.setItem('selectenv', value);
        navigation.navigate('login');
    }
    return (
        <View style={styles.container}>
            <ImageBackground source={imagename} style={styles.image}>
                <View style={styles.imageContainer}>
                    <Image source={caplogimg} style={styles.centeredImage} />
                    <Text style={styles.logoText}>EliteCap</Text>
                </View>
                <DropDownPicker
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    style={{ backgroundColor: 'white', marginTop: 20, width: '90%', alignSelf: 'center' }}
                    placeholder='Select an Environment'
                    dropDownContainerStyle={{ alignSelf: 'center', backgroundColor: 'white', width: '90%', marginTop: 20 }}
                />
                {storedEnv === '' && (
                    <TouchableOpacity style={styles.button} onPress={logins}>
                        <Text style={styles.buttonText}>BACK</Text>
                    </TouchableOpacity>
                )}
                {storedEnv !== '' && (
                    <TouchableOpacity style={styles.buttons} onPress={logins}>
                        <Text style={styles.buttonText}>BACK</Text>
                    </TouchableOpacity>
                )}
            </ImageBackground>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: 'skyblue',
        justifyContent: 'center'
    },
    image: {
        flex: 1,
        resizeMode: 'center',
        justifyContent: 'center',
    },
    imageContainer: {
        alignItems: 'center',
        marginVertical: screenHeight * 0.01,
        marginTop:-250
    },
    centeredImage: {
        width: screenWidth * 0.3,
        height: screenWidth * 0.3,
    },
    centeredImage1: {
        width: 300,
        height: 50,
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
        width: '95%'
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
        backgroundColor: "grey",
        marginLeft: '5%',
        width: '90%',
        borderRadius: 20
    },
    buttons: {
        marginTop: 30,
        borderColor: "lightgray",
        borderWidth: 1,
        borderStyle: "solid",
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: "center",
        backgroundColor: "blue",
        marginLeft: '20%',
        width: '60%',
        borderRadius: 20
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 22,
        alignContent: 'center',
        // marginTop: 30,
        // textDecorationLine: 'underline'
    },
    logoText: {
        fontSize: 20,
        color: 'white',
        fontWeight: '500'
    }
});

export default EnvironmentSelect