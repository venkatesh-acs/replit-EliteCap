import { Text, View, StyleSheet, Image, TouchableOpacity, TextInput, FlatList } from 'react-native'
import React, { Component, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginService } from '../services/LoginService';
import Video from 'react-native-video';
import { Dialog } from 'react-native-paper';
import { Alert } from 'react-native';

const shareImg = require('../assets/share2.png');
const arcImg = require('../assets/arc2.png');
const emailimg = require('../assets/ic_email.png');
const exclaim = require('../assets/exclamation-mark.png');
const unshareImg = require('../assets/unshare.png');

const PhotoView: React.FC = () => {
    const [uid, setUid] = useState<any>(null);
    const [photoData, setPhotoData] = useState<any>([]);
    console.log('photoData', photoData);
    const [mediaId, setMediaIds] = useState<any>([]);
    const [grades, setGrades] = useState<any[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    console.log('selectedImage', selectedImage)
    const [modalVisible, setModalVisible] = useState(false);
    const [photoImgData, setPhotoImageData] = useState<any>([])
    const [email, setEmail] = useState<any>(null);
    const [shareMessage, setShareMessage] = useState<any>(null);
    const [shareDialog, setShareDialog] = useState<any>(false);
    const [archiveVisible, setArchiveVisible] = useState(false);
    const [sharedList, setsharedList] = useState<any>([]);
    console.log('sharedlist',sharedList)
    useFocusEffect(
        React.useCallback(() => {
            getUid();
            getMedia();
            sharedMedia();
        }, [])
    );
    
    const getUid = async () => {
        const uid = await AsyncStorage.getItem('uid')
        setUid(uid)
    }
    const getMedia = async () => {
        const photoItem = await AsyncStorage.getItem('selected_photo') as any;
        console.log('photoItem', photoItem)
        const parsedData = typeof photoItem === 'string' ? JSON.parse(photoItem) : photoItem
        const { mid } = parsedData;
        const apiname = '/ws_mediaview.php';
        const payload = { mediaid: mid };
        console.log('setPhotoData_payload', payload)
        const res = await LoginService.getData(apiname, payload)
        console.log('setPhotoData', res)
        if (res) {
            setPhotoData(res.MediaViewArray[0]);
            setPhotoImageData(res.MediaViewArray[0]);

            setMediaIds(res.mediaids.split(','));
            console.log('split', res.mediaids.split(','))
            console.log('res.mediaids', res.mediaids)
            const dynamicGrades = res.mediaids.split(',').map((_: any, index: any) => `a${index + 1}`);
            console.log('dynamicGrades', dynamicGrades)
            setGrades(dynamicGrades);
        }
    }
    const getMedia1 = async (grade: any) => {
        const gradeIndex = grades.indexOf(grade); // Find the index of the clicked grade
        if (gradeIndex >= 0 && gradeIndex < mediaId.length) {
            const eventid = mediaId[gradeIndex];
            const apiname = '/ws_mediaview.php';
            const payload = { mediaid: eventid };
            console.log('setPhotoData_payload', payload)
            const res = await LoginService.getData(apiname, payload)
            console.log('setPhotoData', res)
            if (res) {
                setPhotoData(res.MediaViewArray[0]);
                setPhotoImageData(res.MediaViewArray[0]);

                setMediaIds(res.mediaids.split(','));
                console.log('split', res.mediaids.split(','))
                console.log('res.mediaids', res.mediaids)
                const dynamicGrades = res.mediaids.split(',').map((_: any, index: any) => `a${index + 1}`);
                console.log('dynamicGrades', dynamicGrades)
                setGrades(dynamicGrades);
            }
        }
    }
    //to get list of photosS

    const sharedMedia = async () => {
        const uid = await AsyncStorage.getItem('uid')
        const photoItem = await AsyncStorage.getItem('selected_photo') as any;
        console.log('photoItem', photoItem)
        const parsedData = typeof photoItem === 'string' ? JSON.parse(photoItem) : photoItem
        const { mid } = parsedData;
        const apiname = '/share_media_user_list.php'
        const payload = { mid: mid, uid: uid, typeoffile: photoData.type }
        console.log('view_payload', payload)
        // const payload = { issueid: 26 }
        const res = await LoginService.getData(apiname, payload)
        console.log("share_media_user_list data", res)
        if (res) {
            if(res.message !== 'Nodata'){
            setsharedList(res.SharedUserArray)
            }else{
                setsharedList([])
                Alert.alert(
                    '',
                    res.message,
                    [{ text: 'OK' }]
                );
            }
        }
    };
    //to get share email details
    const share = async (photoData: any) => {
        console.log('photoData', photoData)
        // issueid
        const uid = await AsyncStorage.getItem('uid');
        const photoItem = await AsyncStorage.getItem('selected_photo') as any;
        console.log('photoItem', photoItem)
        const parsedData = typeof photoItem === 'string' ? JSON.parse(photoItem) : photoItem
        const { mid } = parsedData;
        const apiname = '/share_media.php';
        const payload = { uid: uid, email: email, mid: mid }
        const res = await LoginService.getData(apiname, payload);
        console.log('res_share', res);
        if (res) {
            setShareMessage(res.message);
            setShareDialog(true);
            setModalVisible(false);
        }

    }
    const archive = async (photoData: any) => {
        console.log('photoData', photoData)
        setArchiveVisible(true)
    }
    const openDialog = async () => {
        setModalVisible(true)
    }
    //to share
    const acceptShare = async (photoData: any) => {
        const uid = await AsyncStorage.getItem('uid');
        const photoItem = await AsyncStorage.getItem('selected_photo') as any;
        console.log('photoItem', photoItem)
        const parsedData = typeof photoItem === 'string' ? JSON.parse(photoItem) : photoItem
        const { mid } = parsedData;
        const apiname = '/ws_share_media.php';
        const payload = { uid: uid, email: email, mid: mid };
        const res = await LoginService.getData(apiname, payload);
        console.log('res', res);
        if (res) {
            Alert.alert(
                '',
                res.message,
                [{ text: 'OK' }]
            );
        }
        setEmail(null)
        setShareDialog(false);
        sharedMedia();
    }
    //To archive
    const Archived = async (photoData: any) => {
        const uid = await AsyncStorage.getItem('uid');
        const photoItem = await AsyncStorage.getItem('selected_photo') as any;
        console.log('photoItem', photoItem)
        const parsedData = typeof photoItem === 'string' ? JSON.parse(photoItem) : photoItem
        const { mid } = parsedData;
        const apiname = '/archive_media.php';
        const payload = { uid: uid, mid: mid };
        const res = await LoginService.getData(apiname, payload);
        console.log('res', res);
        if (res) {
            setsharedList([])
            Alert.alert(
                '',
                res.message,
                [{ text: 'OK' }]
            );
        }
        setArchiveVisible(false);
        sharedMedia();
    }
    //to unshare
    const unshared = async (item: any) => {
        const uid = await AsyncStorage.getItem('uid');
        const apiname = '/unshare_media.php';
        const payload = { uid: uid, sid: item.shared_userid, eid: item.event_id };
        console.log('unshared-payload',payload)

        const res = await LoginService.getData(apiname,payload)
        console.log(res)
        if(res){
            Alert.alert(
                '',
                res.message,
                [{ text: 'OK' }]
            );
        }
        sharedMedia();
    }
    //to renser shared list data
    const renderItem = ({ item }: { item: any }) => {
        console.log(item.imageurl);
        return (
            <View style={styles.card}>
                <Text style={styles.vdate}>{item.nameoftheuser}</Text>

                <TouchableOpacity style={styles.eyeIcon} onPress={() => unshared(item)}>
                    <Image source={unshareImg} style={styles.icon} />
                </TouchableOpacity>
            </View>
        )
    };
    return (
        <View style={styles.container}>
            {photoImgData.type == 'photo' ?
                (
                    < Image source={{ uri: photoImgData.imageurl }} style={{ width: '100%', height: 200, marginTop: 5 }}></Image>
                ) : (
                    <Video
                        source={{ uri: photoImgData.youtube }}
                        style={{ width: '100%', height: 200, marginTop: 5 }}
                        controls
                        resizeMode="cover"
                        repeat={true}
                    />
                )
            }
            <Text style={styles.date}>{photoData.vdate}</Text>
            <View style={styles.name_phone}>
                <Text style={styles.names}>{photoData.address}</Text>
            </View>
            <Text style={styles.date}>{photoData.description}</Text>
            <View style={{ flexDirection: 'row' }} >
                <Text style={styles.files}>Media Files:</Text>
                {grades.map((grade, index) => (
                    <TouchableOpacity key={index} onPress={() => getMedia1(grade)} >
                        <Text style={styles.files}>{grade}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }} >
                <TouchableOpacity onPress={openDialog} >
                    <Image source={shareImg} style={styles.buttonImage} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => archive(photoData)} >
                    <Image source={arcImg} style={styles.buttonImage} />
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1, marginTop: 10 }}>
                <Text style={styles.heading}>Shared With</Text>
                <FlatList
                    data={sharedList}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.mid}
                />
            </View>
            <Dialog visible={modalVisible} style={{ zIndex: 10, marginTop: 10, margin: 60 }} >
                <View>
                    <Text style={{ marginLeft: '10%', fontSize: 20 }}>Enter Email *</Text>
                    <View>
                        <TextInput
                            onChangeText={(text) => setEmail(text)}
                            style={styles.textInput}
                            placeholder="Email"
                            placeholderTextColor="black"
                            value={email}
                            autoCapitalize='none'
                        />
                        <Image source={emailimg} style={styles.images} />
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'flex-end', marginRight: '10%', marginBottom: 20 }}>
                        <TouchableOpacity style={{ marginRight: '15%' }} onPress={() => setModalVisible(false)}>
                            <Text style={styles.closeButton}>CANCEL</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => share(photoData)}>
                            <Text style={styles.closeButton}>OK</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </Dialog>
            <Dialog visible={shareDialog} style={{ zIndex: 10, marginTop: 10, margin: 60 }} >
                <View>
                    <Image source={exclaim} style={{ alignSelf: 'center', width: 50, height: 50 }} />

                    <Text style={{ fontSize: 25, alignSelf: 'center', color: 'black' }}>Sharing with?</Text>
                    <View>
                        <Text style={{ fontSize: 20, alignSelf: 'center', maxWidth: '50%', color: 'black', marginLeft: '10%' }}>{shareMessage}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'flex-end', marginRight: '10%', marginBottom: 20 }}>
                        <TouchableOpacity style={{ marginRight: '15%' }} onPress={() => setShareDialog(false)}>
                            <Text style={{ borderWidth: 1, fontSize: 30, backgroundColor: 'red', color: 'white', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 10 }}>CANCEL</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => acceptShare(photoData)}>
                            <Text style={{ borderWidth: 1, fontSize: 30, backgroundColor: 'green', color: 'white', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 10 }}>Share</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </Dialog>
            <Dialog visible={archiveVisible} style={{ zIndex: 10, marginTop: 10, margin: 60 }} >
                <View>
                    <View>
                        <Text style={{ fontSize: 25, alignSelf: 'center', maxWidth: '50%', color: 'black', marginLeft: '10%' }}>Do you really want archive this media ?</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'flex-end', marginRight: '10%', marginBottom: 20 }}>
                        <TouchableOpacity style={{ marginRight: '15%' }} onPress={() => setArchiveVisible(false)}>
                            <Text style={styles.closeButton}>CANCEL</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => Archived(photoData)}>
                            <Text style={styles.closeButton}>OK</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </Dialog>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5
    },
    date: {
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold',
        alignSelf: 'center',
        marginTop: 5
    },
    name_phone: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
        fontSize: 20,
    },
    names: {
        marginRight: 20,
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold',
    },
    phones: {
        marginRight: 20,
        fontSize: 15,
        color: 'black',
        fontWeight: 'bold',
    },
    files: {
        marginLeft: 5,
        color: 'black',
        fontWeight: 'bold'
    },
    heading: {
        alignSelf: 'center',
        color: 'white',
        backgroundColor: '#6F8FAF',
        fontSize: 20,
        width: '98%',
        textAlign: 'center',
        marginTop: 5,
        paddingVertical: 5,
    },
    buttonImage: {
        width: 70,
        height: 70,
        marginLeft: 20,
        backgroundColor: 'white',
        borderRadius: 40
    },
    modal: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        alignItems: 'center',
        borderRadius: 10,
    },
    closeButton: {
        color: '#FF69B4',
        fontSize: 30,
        fontWeight: 'bold'
    },
    textInput: {
        borderColor: 'black',
        borderBottomWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: 20,
        backgroundColor: 'white',
        marginLeft: '2.5%',
        width: '95%',
        color: 'black',
        height: 50
    },
    images: {
        position: 'absolute',
        right: 20,
        top: 20,
        width: '10%',
    },
    card: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 3,
    },
    vdate: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black',
        flex:1
    },
    eyeIcon: {
        marginRight:10,
    },
    icon: {
        width: 20,
        height: 20,
    },

})

export default PhotoView