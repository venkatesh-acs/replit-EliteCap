import { FlatList, Image, Text, TouchableOpacity, View, useWindowDimensions, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { TabView, SceneMap } from 'react-native-tab-view';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { LoginService } from '../services/LoginService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Video from 'react-native-video';

const upimg = require('../assets/ic_eyeview.png');

const FirstRoute = () => {
  const navigation = useNavigation();
  const [photosData, setPhotosData] = useState<any>([]);

  // To get my photos list when focusing the screen
  useFocusEffect(
    React.useCallback(() => {
      myPhotos();
    }, [])
  );
  // To get my photos list
  const myPhotos = async () => {
    const uid = await AsyncStorage.getItem('uid');
    const apiname = '/shared_photo_list.php';
    const payload = { uid: uid };
    const res = await LoginService.getData(apiname, payload);
    console.log("shared_photo_list", res);
    if (res) {
      setPhotosData(res.SharedPhotoArray);
    }
  };
  //To open photo
  const openPhoto = async (item: any) => {
    AsyncStorage.setItem("selected_shared_photo", JSON.stringify(item))
    navigation.navigate('selectedsharedphoto' as never,)
  }


  const renderItem = ({ item }: { item: any }) => {
    console.log(item.imageurl);
    return (
      <View style={styles.card}>
        <Image source={{ uri: item.imageurl }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.vdate}>{item.vdate}</Text>
          <Text style={styles.address}>{item.address}</Text>
        </View>

        <TouchableOpacity style={styles.eyeIcon} onPress={() => openPhoto(item)}>
          <Image source={upimg} style={styles.icon} />
        </TouchableOpacity>
      </View>
    )
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={photosData}
        renderItem={renderItem}
        keyExtractor={(item) => item.mid}
      />
    </View>
  );
}
const SecondRoute = () => {
  const navigation = useNavigation();
  const [videosData, setVideosData] = useState<any>([]);

  // To get my photos list when focusing the screen
  useFocusEffect(
    React.useCallback(() => {
      myVideos();
    }, [])
  );
  // To get my photos list
  const myVideos = async () => {
    const uid = await AsyncStorage.getItem('uid');
    const apiname = '/shared_video_list.php';
    const payload = { uid: uid };
    const res = await LoginService.getData(apiname, payload);
    console.log("shared_video_list", res);
    if (res) {
      setVideosData(res.SharedVideoArray);
    }
  };
  //To open video
  const openVideo = async (item: any) => {
    AsyncStorage.setItem("selected_shared_video", JSON.stringify(item))
    navigation.navigate('selectedsharedvideo' as never,)
  }

  const renderItem = ({ item }: { item: any }) => {
    console.log(item.imageurl);
    return (
      <View style={styles.card}>
        <Image source={{ uri: item.imageurl }} />
        <Video
          source={{ uri: item.url }}
          style={styles.image}
          resizeMode="cover"
          repeat={false}
        />
        <View style={styles.textContainer}>
          <Text style={styles.vdate}>{item.vdate}</Text>
          <Text style={styles.address}>{item.address}</Text>
        </View>

        <TouchableOpacity style={styles.eyeIcon} onPress={() => openVideo(item)}>
          <Image source={upimg} style={styles.icon} />
        </TouchableOpacity>
      </View>
    )
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={videosData}
        renderItem={renderItem}
        keyExtractor={(item) => item.mid}
      />
    </View>
  );
}
const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
});
const routes = [
  { key: 'first', title: 'Photos' },
  { key: 'second', title: 'Videos' },
];
const SharedMedia = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  return (
    <View style={{ flex: 1 }}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
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
  image: {
    width: 60,
    height: 60,
  },
  textContainer: {
    marginLeft: 10,
    flex: 1,
  },
  vdate: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black'
  },
  address: {
    fontSize: 12,
    color: '#666',
  },
  eyeIcon: {
    marginLeft: 10,
  },
  icon: {
    width: 20,
    height: 20,
  },
});

export default SharedMedia