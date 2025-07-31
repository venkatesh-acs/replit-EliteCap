import React, { useEffect, useState } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';

import { ActivityIndicator, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Login from './src/components/Login';
import LeftMenu from './src/components/LeftMenu';
import BottomTabNavigator from './src/components/BottomTabNavigator';
import EnvironmentSelect from './src/components/Environment';
import Support from './src/components/Support';
import ForgotPassword from './src/components/ForgotPassword';
import WalkThrough from './src/components/WalkThrough';
import AboutUs from './src/components/AboutUs';
import ResetPassword from './src/components/ResetPassword';
import Deactivate from './src/components/Deactivate';
import CancelDeactivate from './src/components/CancelDeactivate';
import PhotoView from './src/components/PhotoView';
import VideoView from './src/components/VideoView';
import sharedPhotoView from './src/components/sharedPhotoView';
import sharedVideo from './src/components/sharedVideo';
import Register from './src/components/Register';



const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const vidimg = require('./src/assets/icons-back.png');



interface AppDrawerProps {
  onLogout: () => void;
}
const AppDrawer = ({ onLogout }: AppDrawerProps) => (
  <Drawer.Navigator drawerContent={(props) => <LeftMenu {...props} onLogout={onLogout} />}>
    <Drawer.Screen name="bottomnavigation" component={BottomTabNavigator}
      options={({ navigation }) => ({

        title: 'EliteCap',
        headerTitleAlign: 'center'
      })}
    />
    <Drawer.Screen name="Support1" component={Support}
      options={({ navigation }) => ({
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate('bottomnavigation')} style={{ padding: 10 }}>
            <Image source={vidimg} style={{ marginRight: 10 }} />
          </TouchableOpacity>
        ),
        title: 'EliteCap', // Optional: Set your screen title
        headerTitleAlign: 'center'
      })}
    />
    <Drawer.Screen name="wkapp" component={WalkThrough}
      options={({ navigation }) => ({
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate('bottomnavigation')} style={{ padding: 10 }}>
            <Image source={vidimg} style={{ marginRight: 10 }} />
          </TouchableOpacity>
        ),
        title: 'EliteCap', // Optional: Set your screen title
        headerTitleAlign: 'center'
      })}
    />
    <Drawer.Screen name="Aboutus" component={AboutUs}
      options={({ navigation }) => ({
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate('bottomnavigation')} style={{ padding: 10 }}>
            <Image source={vidimg} style={{ marginRight: 10 }} />
          </TouchableOpacity>
        ),
        title: 'EliteCap', // Optional: Set your screen title
        headerTitleAlign: 'center'
      })}
    />
    <Drawer.Screen name="passwordchange" component={ResetPassword}
      options={({ navigation }) => ({
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate('bottomnavigation')} style={{ padding: 10 }}>
            <Image source={vidimg} style={{ marginRight: 10 }} />
          </TouchableOpacity>
        ),
        title: 'EliteCap', // Optional: Set your screen title
        headerTitleAlign: 'center'
      })}
    />
    {/* <Drawer.Screen name="deactivate" component={Deactivate}
      options={({ navigation }) => ({
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate('bottomnavigation')} style={{ padding: 10 }}>
            <Image source={vidimg} style={{ marginRight: 10 }} />
          </TouchableOpacity>
        ),
        title: 'EliteCap', // Optional: Set your screen title
        headerTitleAlign: 'center'
      })}
    /> */}
     <Drawer.Screen name="deactivate" 
      options={({ navigation }) => ({
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate('bottomnavigation')} style={{ padding: 10 }}>
            <Image source={vidimg} style={{ marginRight: 10 }} />
          </TouchableOpacity>
        ),
        title: 'EliteCap', // Optional: Set your screen title
        headerTitleAlign: 'center'
      })}
      initialParams={{ onLogout }}
      >
        {(props) => <Deactivate {...props} onLogout={onLogout} />}
        </Drawer.Screen>
    <Drawer.Screen name="canceldeactivate" component={CancelDeactivate}
      options={({ navigation }) => ({
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate('bottomnavigation')} style={{ padding: 10 }}>
            <Image source={vidimg} style={{ marginRight: 10 }} />
          </TouchableOpacity>
        ),
        title: 'EliteCap', // Optional: Set your screen title
        headerTitleAlign: 'center'
      })}
    />
   
    <Drawer.Screen name="selectedphoto" component={PhotoView}
      options={({ navigation }) => ({
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate('bottomnavigation')} style={{ padding: 10 }}>
            <Image source={vidimg} style={{ marginRight: 10 }} />
          </TouchableOpacity>
        ),
        title: 'EliteCap',
        headerTitleAlign: 'center'
      })}
    />
     <Drawer.Screen name="selectedvideo" component={VideoView}
      options={({ navigation }) => ({
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate('bottomnavigation')} style={{ padding: 10 }}>
            <Image source={vidimg} style={{ marginRight: 10 }} />
          </TouchableOpacity>
        ),
        title: 'EliteCap',
        headerTitleAlign: 'center'
      })}
    />
    <Drawer.Screen name="selectedsharedphoto" component={sharedPhotoView}
      options={({ navigation }) => ({
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate('bottomnavigation')} style={{ padding: 10 }}>
            <Image source={vidimg} style={{ marginRight: 10 }} />
          </TouchableOpacity>
        ),
        title: 'EliteCap',
        headerTitleAlign: 'center'
      })}
    />
    <Drawer.Screen name="selectedsharedvideo" component={sharedVideo}
      options={({ navigation }) => ({
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate('bottomnavigation')} style={{ padding: 10 }}>
            <Image source={vidimg} style={{ marginRight: 10 }} />
          </TouchableOpacity>
        ),
        title: 'EliteCap',
        headerTitleAlign: 'center'
      })}
    />
  </Drawer.Navigator>

)

type RootStackParamist = {
  Login: undefined;
  Home: undefined;
}
type LoginNavigationProp = StackNavigationProp<RootStackParamist, 'Login'>;

interface AuthStackProps {
  navigation?: LoginNavigationProp;
  onLogin: () => any;
}
const AuthStack = ({ navigation, onLogin }: AuthStackProps) => (
  <Stack.Navigator>
    <Stack.Screen name="login" component={() => <Login onLogin={onLogin} />} options={{ headerShown: false }} />
    <Stack.Screen name="Support" component={Support} options={{ headerShown: false }} />
    <Stack.Screen name="forgotpassword" component={ForgotPassword} options={{ headerShown: false }} />
    <Stack.Screen name="env" component={EnvironmentSelect} options={{ headerShown: false }} />
    <Stack.Screen name="register" component={Register} options={{ headerShown: false }} />

  </Stack.Navigator>
)
const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  console.log("isLoggedIn", isLoggedIn)
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const uid = await AsyncStorage.getItem('uid');
        console.log("loginuid", uid)
        if (uid) {
          setIsLoggedIn(true);
        }
      } catch (e) {
        console.log('Error retrieving data:', e);
      } finally {
        setLoading(false);
      }
    };
    checkLoginStatus();
  }, [setIsLoggedIn,]);
  const handleLogin = () => {
    setIsLoggedIn(true)
  }
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <AppDrawer onLogout={handleLogout} />
      ) : (
        <AuthStack onLogin={handleLogin} />
      )}
    </NavigationContainer>
  );
};

export default App;
