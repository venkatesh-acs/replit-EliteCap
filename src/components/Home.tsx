/// <reference types="node" />
import { ActivityIndicator, Alert, Dimensions, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Image } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { LoginService } from '../services/LoginService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera, useCameraDevice, useCameraDevices } from 'react-native-vision-camera';
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';
import RNPhotoManipulator from 'react-native-photo-manipulator';
import QRCode from 'react-native-qrcode-svg';
import { useFocusEffect } from '@react-navigation/native';
import { FFmpegKit } from 'ffmpeg-kit-react-native';  // Correct import


const imagename = require('../assets/bgcap.jpg');
const camimg = require('../assets/camera.png');
const vidimg = require('../assets/video.png');
const audiogreen = require('../assets/circle.png');
const audiored = require('../assets/mic-red.png');
const upimg = require('../assets/upload_icon.png');
const preimg = require('../assets/previous.png');
const centerimg = require('../assets/ic_logo.png');


const audioRecorderPlayer = new AudioRecorderPlayer();

const Home = () => {
    const [description, setDescription] = useState<any>(null);
    const [uploadCount, setUploadCount] = useState(0);
    const [isCompressing, setIsCompressing] = useState(false);
    const [capturedMedia, setCapturedMedia] = useState<any>([]);
    const [recordingTime, setRecordingTime] = useState(0); // Timer state
    const [isRecording, setIsRecording] = useState(false);
    const [loading, setLoading] = useState(true); // Track loading state
    const [device, setDevice] = useState<any>(null);
    //for camera
    const camera = useRef<Camera>(null);
    // const device = useCameraDevice('back');
    // const devices = useCameraDevices();
    const devices = Camera.getAvailableCameraDevices()
    console.log(devices)


    // console.log("devices", devices)
    useEffect(() => {

        let interval: NodeJS.Timeout | null = null;
        if (isRecording) {
            interval = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);
        } else {
            setRecordingTime(0);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isRecording]);
    //to make camera always working
    useEffect(() => {
        // Make sure devices are ready before starting the interval check
        if (devices && devices.length > 0) {
            // Get the back camera or front camera if needed
            const backDevice = devices.find(device => device.position === 'back');
            const frontDevice = devices.find(device => device.position === 'front');

            if (backDevice) {
                setDevice(backDevice);
            } else if (frontDevice) {
                setDevice(frontDevice);
            }
        }

    }, [devices]); // Trigger this effect only when 'devices' changes
    useFocusEffect(
        React.useCallback(() => {
            if (devices && devices.length > 0) {
                // Get the back camera or front camera if needed
                const backDevice = devices.find(device => device.position === 'back');
                const frontDevice = devices.find(device => device.position === 'front');

                if (backDevice) {
                    setDevice(backDevice);
                } else if (frontDevice) {
                    setDevice(frontDevice);
                }
            }
        }, [])
    );

    // Handle case where device is not found after initial load
    useEffect(() => {
        const interval = setInterval(() => {
            if (!device && devices && devices.length > 0) {
                const backDevice = devices.find(device => device.position === 'back');
                const frontDevice = devices.find(device => device.position === 'front');

                if (backDevice) {
                    setDevice(backDevice);
                } else if (frontDevice) {
                    setDevice(frontDevice);
                }
            }
        }, 1000); // Check every second for available device

        // Cleanup interval when the component unmounts or device is found
        return () => clearInterval(interval);
    }, [device, devices]);
    // useEffect(() => {
    //     // Monitor devices and update the state when available
    //     const interval = setInterval(() => {
    //         if (devices && devices.length > 0) {
    //             const backDevice = devices.find(device => device.position === 'back');
    //             const frontDevice = devices.find(device => device.position === 'front');
    //             // const frontDevice = devices.find(device => device.position === 'back');

    //             console.log('frontDevice',frontDevice)
    //             if (backDevice) {
    //                 setDevice(backDevice);
    //             } else if (frontDevice) {
    //                 setDevice(frontDevice);
    //             }
    //         }
    //     }, 1000); // Try checking every second until device is available

    //     return () => clearInterval(interval);
    // }, [devices]);

    useEffect(() => {
        getdataVal()
    }, [])
    const [barcodeData, setBarcodeData] = useState<any>()
    const getdataVal = async () => {
        let currentDate: Date = new Date();

        let day: number = currentDate.getDate();
        let month: number = currentDate.getMonth() + 1; // months are 0-based
        let year: number = currentDate.getFullYear();
        let hours: number = currentDate.getHours();
        let minutes: number = currentDate.getMinutes();
        let seconds: number = currentDate.getSeconds();

        const dateValueInLong = (`${day}/${month}/${year} ${hours}:${minutes}:${seconds}`);
        const latitude = await AsyncStorage.getItem('latitude');
        const longitude = await AsyncStorage.getItem('longitude');
        const barcodeData = `${dateValueInLong}\n${latitude}\n${longitude}`;
        console.log(barcodeData)
        setBarcodeData(barcodeData)
    }
    const canvasRef = useRef(null);
    //for audio
    const [recording, setRecording] = useState(false);
    const [duration, setDuration] = useState(0);
    const [audioFilePath, setAudioFilePath] = useState('');

    //for camera
    const [cameraMode, setCameraMode] = useState<'photo' | 'video'>('photo'); // Track camera mode
    const [showCamera, setShowCamera] = useState(false);

    const clearDesc = async () => {
        setDescription(null)
    }
    //start audio
    const onStartRecord = async () => {
        try {
            const result = await audioRecorderPlayer.startRecorder();
            console.log("result", result)
            setAudioFilePath(result); // Store the recorded audio file path
            setRecording(true);
        } catch (error) {
            console.error('Error starting recorder:', error);
        }
    };

    const onStopRecord = async () => {
        try {
            const result = await audioRecorderPlayer.stopRecorder();
            setRecording(false);
            const normalizedFilePath = result.replace('file://', '');
            setAudioFilePath(normalizedFilePath);
            sendAudioToServer(result);
        } catch (error) {
            console.error('Error stopping recorder:', error);
        }
    };

    const sendAudioToServer = async (filePath: any) => {
        const storedUid = await AsyncStorage.getItem('uid') as any;
        const filename = filePath.substring(filePath.lastIndexOf('/') + 1);
        const formData = new FormData() as any;
        formData.append('uploaded_file', {
            uri: filePath,
            type: 'audio/aac',
            name: filename
        });
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        formData.append('lastModDate', formattedDate);
        formData.append('uid1', storedUid);
        try {
            const apiname = '/UploadToServer.php';
            const response = await LoginService.uploadimage(apiname, formData);
            console.log('upload_res', response)
            if (response !== undefined && response !== null && response !== '') {
                const storedUid = await AsyncStorage.getItem('uid') as string;
                const address = await AsyncStorage.getItem('address') as any;
                const latitude = await AsyncStorage.getItem('latitude') as any;
                const longitude = await AsyncStorage.getItem('longitude') as any;
                // const storedUid = '5e4ae49d8a9a87.17240384'
                const payload = { lat: latitude, lng: longitude, uid: storedUid, formatted_address: address, description: description, filename: response, lastdatetime: formattedDate }
                const apiname = '/ws_offlinedata.php';
                // const payload = { country: countryname, countrycode: countrycode, uid: storedUid, lat: latitude, lng: longitude, province: statename, city: city, postal_code: zipcode, formatted_address: address, filename: response, lastdatetime: formattedDate, video_name: filename, shortstatecode: shortstatecode, amberid: amberid }
                console.log(apiname, payload);

                const resmsg = await LoginService.getData(apiname, payload);
                console.log('res_audio', resmsg)
                setShowCamera(false);
                if (resmsg.error === true) {
                    Alert.alert(
                        'Upload Status',
                        'Please Enter Description',
                        [{ text: 'OK' }]
                    );
                } else {
                    Alert.alert(
                        'Upload Status',
                        resmsg.error_msg,
                        [{ text: 'OK' }]
                    );
                }
                setShowCamera(false)
                setDescription(null)

            }
        } catch (error) {
            console.error('Error uploading photo:', error);
        };
    };
    useEffect(() => {
        // let interval: NodeJS.Timeout | undefined = undefined;
        let interval: any
        if (recording) {
            console.log("recording started");
            interval = setInterval(() => {
                setDuration(prevDuration => prevDuration + 1);
            }, 1000);
        } else {
            clearInterval(interval);
            setDuration(0); // Reset duration when stopped
        }

        return () => clearInterval(interval);
    }, [recording]);
    //upload
    const handleUpload = async () => {
        try {
            const storedMedia = await AsyncStorage.getItem('capturedMedia');
            const existingMedia = JSON.parse(storedMedia || '[]') || [];
            for (let media of existingMedia) {
                // await Promise.all(existingMedia.map(async (media: any) => {
                console.log('media', media)
                if (media.type === 'photo') {
                    console.log(media.description)
                    await uploadPhoto(media.uri, media.description);
                } else if (media.type === 'video') {
                    await uploadVideo(media.uri, media.description);
                }

                await removeMediaFromStorage(media); // Remove after upload
            }

            setUploadCount(0); // Reset count after upload
            setCapturedMedia([]); // Clear captured media after upload
        } catch (error) {
            console.error('Error uploading media:', error);
            Alert.alert('Upload Status', 'Failed to upload media.', [{ text: 'OK' }]);
        }
    };
    const uploadVideo = async (videoUri: any, description: string) => {
        console.log("videopath", videoUri)

        const storedUid = await AsyncStorage.getItem('uid') as any;
        const formattedUri = addFileScheme(videoUri);
        const filename = videoUri.substring(videoUri.lastIndexOf('/') + 1);
        const formData = new FormData() as any;
        formData.append('uploaded_file', {
            // uri: videoUri,
            uri: formattedUri,
            type: 'video/mp4',
            name: filename,
        });
        console.log("formData", formData)

        const today = new Date();
        console.log('today,', today);
        // const formattedDate = today.toISOString().split('T')[0];
        const formattedDate = today.toISOString();
        console.log('formattedDate,', formattedDate);

        formData.append('lastModDate', formattedDate);
        // formData.append('desc1', desc);
        formData.append('desc1', description);
        // formData.append('desc1', currentDescription);

        formData.append('uid1', storedUid);
        console.log('Entered videoupload formdata', formData)

        try {
            const apiname = '/UploadToServer.php';
            const response = await LoginService.uploadimage(apiname, formData);
            if (response !== undefined && response !== null && response !== '') {
                const storedUid = await AsyncStorage.getItem('uid') as string;
                const address = await AsyncStorage.getItem('address') as any;
                const latitude = await AsyncStorage.getItem('latitude') as any;
                const longitude = await AsyncStorage.getItem('longitude') as any;
                const apiname = '/ws_offlinedata.php';
                // const payload = { lat: latitude, lng: longitude, uid: storedUid, formatted_address: address, country: countryname, city: city, state: statename, postalCode: zipcode, description: description, filename: response, lastdatetime: formattedDate, }
                const payload = { lat: latitude, lng: longitude, uid: storedUid, formatted_address: address, description: description, filename: response, lastdatetime: formattedDate }
                const resmsg = await LoginService.getData(apiname, payload);
                console.log('resmsg', resmsg);

                setShowCamera(false);
                Alert.alert(
                    'Upload Status',
                    resmsg.error_msg,
                    [{ text: 'OK' }]
                );
            }

            setDescription(null);
            setDescription('')
            setIsCompressing(false);
        } catch (error) {
            console.error('Error uploading video:', error);
        };
    };
    //To retutn file with url
    const addFileScheme = (uri: any) => {
        if (!uri.startsWith('file://')) {
            return `file://${uri}`;
        }
        return uri;
    };
    //To remove video from async storage after upload
    const removeMediaFromStorage = async (media: any) => {
        try {
            const storedMedia = await AsyncStorage.getItem('capturedMedia');
            const existingMedia = JSON.parse(storedMedia || '[]') || []; // Check for null
            const updatedMedia = existingMedia.filter((item: any) => item.uri !== media.uri);
            await AsyncStorage.setItem('capturedMedia', JSON.stringify(updatedMedia));
        } catch (error) {
            console.error('Error removing media from AsyncStorage:', error);
        }
    };
    //to upload photo
    const uploadPhoto = async (photoUri: any, description: any) => {
        const storedUid = await AsyncStorage.getItem('uid') as any;
        const filename = photoUri.substring(photoUri.lastIndexOf('/') + 1);
        const formData = new FormData() as any;
        formData.append('uploaded_file', {
            uri: photoUri,
            type: 'image/*',
            name: filename,
        });

        const today = new Date();
        // const formattedDate = today.toISOString().split('T')[0];
        const formattedDate = today.toISOString();
        formData.append('lastModDate', formattedDate);

        formData.append('desc1', description);
        formData.append('uid1', storedUid);

        try {
            const apiname = '/UploadToServer.php';
            console.log(apiname, formData);
            const response = await LoginService.uploadimage(apiname, formData);
            if (response !== undefined && response !== null && response !== '') {
                const storedUid = await AsyncStorage.getItem('uid') as string;
                const address = await AsyncStorage.getItem('address') as any;
                const latitude = await AsyncStorage.getItem('latitude') as any;
                const longitude = await AsyncStorage.getItem('longitude') as any;
                const apiname = '/ws_offlinedata.php';
                // const storedUid = '5e4ae49d8a9a87.17240384'
                const payload = { lat: latitude, lng: longitude, uid: storedUid, formatted_address: address, description: description, filename: response, lastdatetime: formattedDate }
                console.log(apiname, payload);

                const resmsg = await LoginService.getData(apiname, payload);
                setShowCamera(false);
                console.log('resmsg', resmsg);
                Alert.alert(
                    'Upload Status',
                    resmsg.error_msg,
                    [{ text: 'OK' }]
                );
                setDescription(null);
                setDescription('')
            }
        } catch (error) {
            console.error('Error uploading photo:', error);
        };
        // setUploadAlert(0)
    };

    const [qrCodeBase64, setQrCodeBase64] = useState<string | null>(null);

    // Function to resolve URIs to actual file paths
    const resolveUriToPath = async (uri: any) => {
        if (uri.startsWith("content://")) {
            // Resolve content URI to a file path (example for Android)
            const resolvedPath = await RNFS.copyAssetsFileIOS(uri, "/tmp/image.jpg", 0, 0);
            return resolvedPath;
        }
        return uri; // If it's already a file path, return it
    };

    const handleCapture = async () => {
        try {
            if (camera.current) {
                if (cameraMode === 'photo') {
                    // Step 1: Capture the photo
                    const photo = await camera.current.takePhoto({});
                    console.log('Captured photo:', photo);

                    // Step 2: Generate barcode data
                    let currentDate: Date = new Date();

                    let day: number = currentDate.getDate();
                    let month: number = currentDate.getMonth() + 1; // months are 0-based
                    let year: number = currentDate.getFullYear();
                    let hours: number = currentDate.getHours();
                    let minutes: number = currentDate.getMinutes();
                    let seconds: number = currentDate.getSeconds();

                    const dateValueInLong = (`${day}/${month}/${year} ${hours}:${minutes}:${seconds}`);
                    const latitude = await AsyncStorage.getItem('latitude');
                    const longitude = await AsyncStorage.getItem('longitude');
                    const barcodeData = `${dateValueInLong}\n${latitude}\n${longitude}`;
                    console.log('Barcode data:', barcodeData);

                    // Step 3: Render the QR code off-screen
                    setQrCodeBase64(null); // Reset the base64 string

                    // Step 4: Wait for the QR code to be generated
                    await new Promise((resolve) => {
                        const interval = setInterval(() => {
                            if (qrCodeBase64) {
                                clearInterval(interval);
                                resolve(null);
                            }
                        }, 100);
                    });

                    if (!qrCodeBase64) {
                        console.error('QR Code Base64 is null');
                        return;
                    }

                    // Step 5: Save the QR code base64 as an image file
                    const qrCodeFilePath = `${RNFS.CachesDirectoryPath}/qrcode.png`;
                    await RNFS.writeFile(qrCodeFilePath, qrCodeBase64, 'base64');
                    console.log('QR Code saved at:', qrCodeFilePath);

                    // Step 6: Resolve paths to ensure they are file paths (with file://)
                    const resolvedPhotoPath = await resolveUriToPath(photo.path);  // Resolve photo URI to path
                    const resolvedQrCodePath = await resolveUriToPath(qrCodeFilePath);  // Resolve QR code URI to path
                    // Ensure paths are prefixed with file://
                    const photoFilePath = `file://${resolvedPhotoPath}`;
                    const qrCodeFilePathWithPrefix = `file://${resolvedQrCodePath}`;
                    // Step 7: Overlay QR code onto the captured photo (bottom-right corner)
                    // const position = {
                    //     x: 1280 - 200 - 10, // Adjust position as needed (bottom-right corner)
                    //     y: 960 - 200 - 10,  // Adjust position as needed (bottom-right corner)
                    // };
                    const containerWidth = 1280;
                    const containerHeight = 960;
                    const imageWidth = 520;
                    const imageHeight = -120;
                    const margin = 10; // Margin from edges

                    const position = {
                        x: containerWidth - imageWidth - margin,  // Align to right
                        y: containerHeight - imageHeight - margin // Align to bottom
                    };
                    const centerImageSize = 100;
                    const positionCenterImage = {
                        x: (1280 / 3) - (centerImageSize / 6),  // Center the image horizontally
                        y: (960 / 2) - (centerImageSize / 6),   // Center the image vertically
                    };
                    // Assuming you have the path for the second image (center image)
                    const centerImage = require('../assets/ic_logo.png');
                    const centerImageSource = Image.resolveAssetSource(centerImage);
                    let centerImageFilePath = centerImageSource; // Get the URI of the image
                    // Resize the center image using react-native-image-resizer
                    const resizedCenterImagePath = await ImageResizer.createResizedImage(
                        centerImageFilePath.uri, // Path to the original center image (now a string)
                        centerImageSize, // Width
                        centerImageSize, // Height
                        'PNG', // Format (PNG or JPEG)
                        100, // Quality (0 to 100)
                    );
                    console.log('Resized center image path:', resizedCenterImagePath.uri);
                    const photoWithQrCode = await RNPhotoManipulator.overlayImage(
                        photoFilePath,  // Use the resolved photo path with file:// prefix
                        qrCodeFilePathWithPrefix,  // Use the resolved QR code file path with file:// prefix
                        position
                    );
                    if (!photoWithQrCode) {
                        console.error('Photo with QR code path is null');
                        return;
                    }

                    // Now overlay the second image (center image)
                    const finalImagePath = await RNPhotoManipulator.overlayImage(
                        photoWithQrCode, // Use the intermediate photo with QR code
                        resizedCenterImagePath.uri, // Use the center image
                        positionCenterImage
                    );



                    // const finalImagePath = await RNPhotoManipulator.overlayImage(
                    //     photoFilePath, // Use the resolved photo path with file:// prefix
                    //     qrCodeFilePathWithPrefix, // Use the resolved QR code file path with file:// prefix
                    //     position
                    // );
                    console.log('Final image path:', finalImagePath);

                    if (!finalImagePath) {
                        console.error('Final image path is null');
                        return;
                    }

                    // Step 8: Save the final image to AsyncStorage
                    const mediaItem = {
                        uri: finalImagePath,
                        type: 'photo',
                        description: description || '',
                        timestamp: Date.now(),
                    };

                    console.log('Saving media item:', mediaItem);
                    await saveMedia(mediaItem);
                    setCapturedMedia((prevMedia: any) => [...prevMedia, mediaItem]);
                    setUploadCount((prevCount) => prevCount + 1); // Increment count
                    setShowCamera(false);
                    setDescription(null);
                    setDescription('');

                    Alert.alert('Success', 'Photo saved with QR code!');
                } else if (cameraMode === 'video') {

                    if (!isRecording) {
                        await camera.current.startRecording({
                            onRecordingFinished: async (video) => {
                                try {
                                    let currentDate = new Date();
                                    let day = currentDate.getDate();
                                    let month = currentDate.getMonth() + 1; // months are 0-based
                                    let year = currentDate.getFullYear();
                                    let hours = currentDate.getHours();
                                    let minutes = currentDate.getMinutes();
                                    let seconds = currentDate.getSeconds();

                                    const dateValueInLong = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
                                    const latitude = await AsyncStorage.getItem('latitude');
                                    const longitude = await AsyncStorage.getItem('longitude');
                                    const barcodeData = `${dateValueInLong}\n${latitude}\n${longitude}`;
                                    console.log('Barcode data:', barcodeData);

                                    // Generate the QR code as before
                                    setQrCodeBase64(null);
                                    await new Promise((resolve) => {
                                        const interval = setInterval(() => {
                                            if (qrCodeBase64) {
                                                clearInterval(interval);
                                                resolve(null);
                                            }
                                        }, 100);
                                    });

                                    if (!qrCodeBase64) {
                                        console.error('QR Code Base64 is null');
                                        return;
                                    }

                                    // Step 1: Save the QR code image as before
                                    const qrCodeFilePath = `${RNFS.CachesDirectoryPath}/qrcode.png`;
                                    await RNFS.writeFile(qrCodeFilePath, qrCodeBase64, 'base64');
                                    console.log('QR Code saved at:', qrCodeFilePath);

                                    // Step 2: Prepare paths for video and QR code
                                    const resolvedVideoPath = `file://${video.path}`;
                                    const resolvedQrCodePath = `file://${qrCodeFilePath}`;
                                    console.log('Resolved Video path:', resolvedVideoPath);
                                    console.log('Resolved QR Code path:', resolvedQrCodePath);

                                    // Generate a timestamp to append to the video filename
                                    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_'); // Create a safe timestamp

                                    // Set the output path with the timestamp
                                    const outputVideoPath = `${RNFS.CachesDirectoryPath}/output_video_with_qrcode_${timestamp}.mp4`;
                                    console.log('Output video path:', outputVideoPath);

                                    const command = `-i ${resolvedVideoPath} -i ${resolvedQrCodePath} -filter_complex "[0:v][1:v] overlay=W-w-10:H-h-10" -codec:a copy ${outputVideoPath}`;

                                    console.log('command', command);

                                    const session = await FFmpegKit.execute(command);
                                    console.log('session', session);

                                    // Check if the FFmpeg command was successful
                                    const returnCode = await session.getReturnCode() as any;
                                    console.log('returncode', returnCode);
                                    // if (returnCode === 0) {
                                    console.log('Video with QR Code saved to:', outputVideoPath);

                                    // Step 6: Save the final video to AsyncStorage
                                    const mediaItem = {
                                        uri: outputVideoPath,
                                        type: 'video',
                                        description: description || '',
                                        timestamp: Date.now(),
                                    };

                                    setCapturedMedia((prevMedia: any) => [...prevMedia, mediaItem]);
                                    await saveMedia(mediaItem);
                                    setUploadCount((prevCount) => prevCount + 1);
                                    setIsRecording(false);
                                    setShowCamera(false);
                                    setDescription(null);
                                    setDescription('');
                                    // } else {
                                    //     console.error('FFmpegKit failed with code', returnCode);
                                    // }
                                } catch (error) {
                                    console.error('Error during video processing:', error);
                                }
                            },
                            onRecordingError: (error) => {
                                console.error('Recording error:', error);
                                setIsRecording(false);
                            },
                        });

                        setIsRecording(true);

                        // Stop recording after 30 seconds (if needed)
                        setTimeout(async () => {
                            if (camera.current) {
                                await camera.current.stopRecording();
                                setIsRecording(false);
                            }
                        }, 30000);
                    } else {
                        await camera.current.stopRecording();
                        setIsRecording(false);
                    }

                }
            }
        } catch (error) {
            console.error('Error capturing media:', error);
            Alert.alert('Error', 'Failed to capture media. Please try again.');
        }
    };


    const saveMedia = async (media: any) => {
        try {
            const storedMedia = await AsyncStorage.getItem('capturedMedia');
            const existingMedia = JSON.parse(storedMedia as string) || []; // Type assertion here
            existingMedia.push(media);
            await AsyncStorage.setItem('capturedMedia', JSON.stringify(existingMedia));
        } catch (error) {
            console.error('Error saving media to AsyncStorage:', error);
        }
    };
    const backtocapture = () => {
        setShowCamera(false);
    };
    return (
        <View style={styles.container}>
            <ImageBackground source={imagename} style={styles.image}>
                {isCompressing && (
                    <ActivityIndicator
                        size="large"
                        color="#0000ff"
                        style={{ position: 'absolute', top: '50%', left: '50%' }}
                    />
                )}

                <View style={styles.inputContainer}>
                    <TextInput
                        onChangeText={(text) => setDescription(text)}
                        style={styles.textInput}
                        value={description}
                        placeholder="Enter Description"
                        placeholderTextColor='#666'
                        autoCapitalize='none'
                    />
                    <TouchableOpacity onPress={clearDesc} style={styles.clearButton}>
                        <Text style={styles.clearButtonText}>Clear</Text>
                    </TouchableOpacity>
                </View>
                
                <View style={styles.actionButtonsContainer}>
                    <TouchableOpacity 
                        onPress={() => { setShowCamera(true); setCameraMode('photo'); }}
                        style={styles.actionButton}
                    >
                        <Image source={camimg} style={styles.buttonImage} />
                    </TouchableOpacity>
                    
                    {!recording ? (
                        <TouchableOpacity onPress={onStartRecord} style={styles.actionButton}>
                            <Image source={audiogreen} style={styles.buttonImage} />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={onStopRecord} style={[styles.actionButton, styles.recordingButton]}>
                            <Image source={audiored} style={[styles.buttonImage, { tintColor: 'white' }]} />
                        </TouchableOpacity>
                    )}
                    
                    <TouchableOpacity 
                        onPress={() => { setShowCamera(true); setCameraMode('video'); }}
                        style={styles.actionButton}
                    >
                        <Image source={vidimg} style={styles.buttonImage} />
                    </TouchableOpacity>
                </View>
                
                {recording && (
                    <View style={styles.durationContainer}>
                        <Text style={styles.durationText}>{duration}s</Text>
                    </View>
                )}
                
                <View style={styles.uploadContainer}>
                    <TouchableOpacity onPress={handleUpload} style={styles.uploadButton}>
                        <Image source={upimg} style={styles.uploadButtonImage} />
                        {uploadCount > 0 && (
                            <View style={styles.uploadBadge}>
                                <Text style={styles.uploadCount}>{uploadCount}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
                {device ? (
                    <>
                        {showCamera && (
                            <>
                                <View style={StyleSheet.absoluteFill}>
                                    <View style={[StyleSheet.absoluteFill, { zIndex: 100 }]}>
                                        <Camera
                                            ref={camera}
                                            style={{ width: '100%', height: '100%' }}
                                            device={device}
                                            isActive={true}
                                            photo={cameraMode === 'photo'}
                                            video={cameraMode === 'video'}
                                        />
                                        <View style={styles.timerContainer}>
                                            {isRecording && (
                                                <Text style={styles.timerText}>
                                                    {`${Math.floor(recordingTime / 60)}:${('0' + (recordingTime % 60)).slice(-2)}`}
                                                </Text>
                                            )}
                                        </View>
                                        <View style={styles.buttonContainer}>
                                            <TouchableOpacity
                                                style={[
                                                    styles.captureButton,
                                                    isRecording && styles.captureButtonRecording
                                                ]}
                                                onPress={handleCapture}
                                            >
                                                <Text style={[
                                                    styles.buttonText,
                                                    isRecording && styles.buttonTextRecording
                                                ]}>
                                                    {cameraMode === 'photo' ? 'Capture Photo' : isRecording ? 'Stop Video' : 'Start Video'}
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={backtocapture} style={styles.backButton}>
                                                <Image source={preimg} style={styles.backButtonImage} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </>
                        )}
                    </>
                ) : (
                    <Text style={styles.noCameraText}>No camera device available</Text> // Display this message when no camera is found
                )}

            </ImageBackground>
            {/* <View>
                    <QRCode
                        value={ barcodeData}
                    />
                </View> */}
            <View style={{ position: 'absolute', top: -1000, left: -1000 }}>
                <QRCode
                    value={barcodeData}
                    size={75} // Adjust size as needed
                    getRef={(ref) => {
                        if (ref) {
                            ref.toDataURL((base64: any) => {
                                // console.log('QR Code Base64 generated:', base64);
                                setQrCodeBase64(base64); // Save the base64 string in state
                            });
                        }
                    }}
                />
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    image: {
        flex: 1,
        resizeMode: 'cover',
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 20,
    },
    textInput: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 12,
        padding: 15,
        fontSize: 16,
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
    clearButton: {
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
        borderRadius: 12,
        paddingHorizontal: 20,
        paddingVertical: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    clearButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: 40,
        paddingHorizontal: 20,
    },
    actionButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5.46,
        elevation: 9,
        marginHorizontal: 10,
    },
    buttonImage: {
        width: 45,
        height: 45,
        tintColor: '#333',
    },
    recordingButton: {
        backgroundColor: '#FF4444',
    },
    durationContainer: {
        alignItems: 'center',
        marginTop: 10,
    },
    durationText: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
    },
    uploadContainer: {
        alignItems: 'center',
        marginTop: 40,
    },
    uploadButton: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.3,
        shadowRadius: 7.49,
        elevation: 12,
    },
    uploadButtonImage: {
        width: 50,
        height: 50,
        tintColor: '#2196F3',
    },
    uploadBadge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#FF4444',
        borderRadius: 15,
        minWidth: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
    },
    uploadCount: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    noCameraText: {
        textAlign: 'center',
        fontSize: 18,
        color: '#FF4444',
        margin: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 15,
        borderRadius: 10,
        marginHorizontal: 40,
    },
    timerContainer: {
        position: 'absolute',
        top: 60,
        alignSelf: 'center',
        zIndex: 101,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    timerText: {
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 100,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    captureButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingVertical: 18,
        paddingHorizontal: 30,
        borderRadius: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
        flex: 1,
        marginHorizontal: 5,
    },
    captureButtonRecording: {
        backgroundColor: '#FF4444',
    },
    buttonText: {
        color: '#333',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonTextRecording: {
        color: 'white',
    },
    backButton: {
        padding: 15,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 25,
        marginHorizontal: 5,
    },
    backButtonImage: {
        width: 30,
        height: 30,
        tintColor: 'white',
    },
})

export default Home