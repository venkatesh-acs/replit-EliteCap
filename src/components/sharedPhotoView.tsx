import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { Component, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginService } from '../services/LoginService';
import Video from 'react-native-video';

const sharedPhotoView = () => {
    const [photoData, setPhotoData] = useState<any>([]);
    console.log('photoData', photoData);
    const [mediaId, setMediaIds] = useState<any>([]);
    const [grades, setGrades] = useState<any[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    console.log('selectedImage', selectedImage)
    const [modalVisible, setModalVisible] = useState(false);
    const [photoImgData, setPhotoImageData] = useState<any>([])
    useFocusEffect(
        React.useCallback(() => {
            getMedia();
        }, [])
    );

    const getMedia = async () => {
        const photoItem = await AsyncStorage.getItem('selected_shared_photo') as any;
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
})

export default sharedPhotoView