import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, Text, Button, Alert, Image } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import { ImageBackground } from 'react-native';
import { LoginService } from '../services/LoginService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DocumentPicker from 'react-native-document-picker';

const imagename = require('../assets/elite.png');
const caplogimg = require('../assets/ec_icon.png');
// const pimg = require('../assets/gfn/gfnlogo.png');
const { width, height } = Dimensions.get('window');

// Set the height based on the screen width
const isMobile = width <= 767;
const isTablet = width >= 768 && width <= 1024;

const centimgHeight = isMobile ? 100 : isTablet ? 150 : 100;
const Support: React.FC = () => {
    const [fileName, setFileName] = useState<any>('')
    const [fileUri, setFileUri] = useState<any>('')
    const [files, setFile] = useState<any>('')
    const [selectedValue, setSelectedValue] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [dropData, setDropData] = useState<Array<{ label: string, value: string }>>([]);
    const [email, setEmail] = useState<any>(null);
    const [subject, setSubject] = useState<any>(null)
    const [message, setMessage] = useState<any>(null)
    const [uid, setUid] = useState<any>(null)
    console.log("support_uid",uid)
    const [dropValue,setDropValue] = useState<any>([])

    useEffect(() => {
        const fetchuid = async () => {
            const uid = await AsyncStorage.getItem('uid') as any;
            const email = await AsyncStorage.getItem('email') as any;
            setEmail(email)
            setUid(uid)
        }
        fetchuid()
    }, [uid, setUid,setEmail])

    const navigation = useNavigation<any>();
    const logins = async () => {
        navigation.navigate('login');
    }
    const selectFile = async () => {
        try {
            const pickedFile = await DocumentPicker.pickSingle({
                type: [DocumentPicker.types.allFiles],
            });
            setFileUri(pickedFile.uri)
            setFileName(pickedFile.name)
            setFile(pickedFile)
            console.log(pickedFile)
        } catch (error) {

        }
    }
    useEffect(() => {
        setDropValue(dropdowndata());
      }, []);
    const dropdowndata = () => {
        return [
            { label: 'Request', value: 'request' },
            { label: 'Suggestions', value: 'suggestions' }
        ]
    }
    const submit = async () => {
        if ( !email && !dropData && !subject && !message) {
            Alert.alert('Please Provide all the details')
        }
        const formData = new FormData() as any;
        formData.append('email', email)
        formData.append('feedback', selectedValue)
        // formData.append('dropData', JSON.stringify(dropData))
        formData.append('message', message)
        formData.append('subject', subject)
        if(fileName){
                    
        formData.append('fileToUpload', {
            uri: fileUri,
            name: fileName,
            type: files.type
        })
    }
        console.log('formData',formData)
        const apiname = '/support.php'
        try {
            const response = await LoginService.uploadimage(apiname, formData)
            Alert.alert(response)
            // setEmail(null);
            // setEmail('');
            setMessage(null);
            setMessage('');
            setSubject(null);
            setSubject('');
            setFile(null);
            setFileName(null);
            setFileUri(null);

        } catch (error) {

        }

    }
    return (
        <>
            <View style={styles.container}>
                <ImageBackground source={imagename} style={styles.image}>
                    {/* {isTablet && ( */}
                    <View style={styles.imageContainer}>
                        <Image source={caplogimg} style={styles.centeredImage} />
                        {/* <Image source={pimg} style={[styles.centimg]} /> */}
                    </View>
                    {/* )} */}
                    <View style={{ alignItems: 'center' }}>
                      
                        <DropDownPicker
                            open={open}
                            value={selectedValue}
                            setOpen={setOpen}
                            setValue={setSelectedValue}
                            setItems={setDropData}
                            // items={dropdowndata()}
                            items={dropValue}
                            style={styles.dropdown}
                            dropDownContainerStyle={{ alignSelf: 'center', backgroundColor: 'white', width: 380 }}
                            placeholder="Select Feedback Type"
                        />
                        <TextInput
                            onChangeText={(text) => setEmail(text)}
                            style={styles.textInput}
                            value={email}
                            placeholder="Enter Email"
                            placeholderTextColor='black'
                            autoCapitalize='none'
                        />
                        <TextInput
                            onChangeText={(text) => setSubject(text)}
                            style={styles.textInput}
                            value={subject}
                            placeholder="Enter Subject"
                            placeholderTextColor='black'
                            autoCapitalize='none'
                        />
                        <TextInput
                            onChangeText={(text) => setMessage(text)}
                            style={styles.textInput}
                            value={message}
                            placeholder="Enter Message"
                            placeholderTextColor='black'
                            numberOfLines={3}
                            autoCapitalize='none'
                        />
                        <TouchableOpacity style={styles.button} onPress={selectFile}>
                            <Text style={styles.buttonText1}>Choose File</Text>
                        </TouchableOpacity>
                        {fileUri && <Text style={{ color: 'white', }}>Selected_File:{fileName}</Text>}

                        <TouchableOpacity style={styles.buttons} onPress={submit}>
                            <Text style={styles.buttonText}>Send</Text>
                        </TouchableOpacity>
                        {!uid && (
                            <TouchableOpacity style={{ alignItems: 'center', }} onPress={logins}>
                                <Text style={styles.buttonTexts}>Login</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </ImageBackground>
            </View>
        </>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // width: width,
        // height: height,
        backgroundColor: '#1E90FF',

    },
    image: {
        flex: 1,
        resizeMode: 'contain',
        justifyContent: 'center',
    },
    dropdown: {
        width: 380,
        height: 40,
        alignSelf: 'center'
    },
    loader: {
        position: 'absolute',
        top: height / 2 - 20,
    },
    button: {
        marginTop: 10,
        borderColor: "lightgray",
        borderWidth: 1,
        borderStyle: "solid",
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: "center",
        backgroundColor: "white",
        marginLeft: 10,
        width: '50%'
    },
    buttons: {
        marginTop: 10,
        borderColor: "lightgray",
        borderWidth: 1,
        borderStyle: "solid",
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: "center",
        backgroundColor: "black",
        marginLeft: 10,
        width: '50%',
        borderRadius: 10
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 22,
    },
    buttonText1: {
        color: "black",
        fontWeight: "bold",
        fontSize: 22,
    },
    textInput: {
        borderColor: "black",
        borderBottomWidth: 1,
        borderStyle: "solid",
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: 20,
        backgroundColor: 'white',
        width: 380,
        color: 'black'
    },
    buttonTexts: {
        color: "white",
        fontWeight: "bold",
        fontSize: 22,
        textDecorationLine: 'underline',
    },
    imageContainer: {
        alignItems: 'center',
        marginTop: 15,
    },
    centeredImage: {
        width: 90,
        height: 90,
        // marginBottom: 30
    },
    centimg: {
        width: "85%",
        marginTop: -10,
        height:80
    },
});

export default Support;
