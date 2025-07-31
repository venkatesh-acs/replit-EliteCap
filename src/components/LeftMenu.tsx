import { Image, Linking, Platform, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { Component, useState } from 'react'
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { openSettings } from 'react-native-permissions';
import { Divider } from 'react-native-paper';

const imagename = require('../assets/elite.png');
const caplogimg = require('../assets/ec_icon.png');
const camimg = require('../assets/cog.png');
const abtus = require('../assets/list.png');
const share = require('../assets/share.png');
const contact = require('../assets/emailus.png');
const logs = require('../assets/logout.png');
const keyimg = require('../assets/ic_key.png');
const deldac = require('../assets/delete-2.png');
const candelimg = require('../assets/users.png');

interface LeftMenuProps extends DrawerContentComponentProps {
  onLogout: () => void;
}
const LeftMenu: React.FC<LeftMenuProps> = ({ navigation, onLogout, }) => {
  const handleLogout = async () => {
    try {
      // Remove the 'uid' or any authentication token from AsyncStorage
      await AsyncStorage.removeItem('uid');
      await AsyncStorage.removeItem('selectedItem');

      //   setIsLoggedIn(false);    
      onLogout()
      navigation.navigate('login')
    } catch (error) {
      console.log('Error during logout:', error);
    }
  };
  const opensett = async () => {
    if (Platform.OS === 'ios') {
      openSettings().catch(() => console.warn('cannot open settings'));
    } else {
      Linking.openSettings();
    }
  }
  const onShare = async () => {
    try {
      const message = Platform.select({
        ios: 'Please install this app and stay safe. AppLink: https://apps.apple.com/us/app/EliteCap/1406820737', // Replace with your iOS App ID
        android: 'Please install this app and stay safe. AppLink: https://play.google.com/store/apps/details?id=acs.com.elitecap&pcampaignid=web_share',
        default: 'https://play.google.com/store/apps/details?id=acs.com.elitecap&pcampaignid=web_share', // Fallback message
      });

      const url = Platform.select({
        ios: 'https://apps.apple.com/us/app/EliteCap/1406820737', // Replace with your iOS App ID
        android: 'https://play.google.com/store/apps/details?id=acs.com.elitecap&pcampaignid=web_share',
        default: 'https://play.google.com/store/apps/details?id=acs.com.elitecap&pcampaignid=web_share',
      });

      const result = await Share.share({
        title: 'App link',
        message: message,
        url: url,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      console.error(error.message);
      // Optionally show an alert
    }
  };
  const changePassword = async () => {
    navigation.navigate('passwordchange')
  }
  const [deletetype, setDeleteType] = useState<string | null>('');
  return (
    <>
      <ScrollView>
        <View style={{ backgroundColor: '#00B2CE', }}>
          <Image source={caplogimg} style={{ width: 60, height: 60, marginLeft: 10, marginTop: 8 }} />
          <Text style={{ height: 30, marginLeft: 10, fontSize: 20, color: 'white' }}>EliteCap</Text>
          <Text style={{ height: 30, marginLeft: 10, fontSize: 20, color: '#FAF9F6' }}>To Capture Your Identity</Text>

        </View>
        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Support1')}>
            <Image source={contact} style={styles.imgstyle} />
            <Text style={styles.menuItemText}>Contact Us</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={onShare}>
            <Image source={share} style={styles.imgstyle} />
            <Text style={styles.menuItemText}>Share App</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('wkapp')}>
            <Image source={share} style={styles.imgstyle} />
            <Text style={styles.menuItemText}>Walk Through App</Text>
          </TouchableOpacity>
          <Divider></Divider>
          <Divider></Divider>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Aboutus')}>
            <Image source={abtus} style={styles.imgstyle} />
            <Text style={styles.menuItemText}>About Us</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={opensett}>
            <Image source={camimg} style={styles.imgstyle} />
            <Text style={styles.menuItemText}>Settings</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.menuItem} onPress={opensett}>
                    <Image source={camimg} style={styles.imgstyle} />
                    <Text style={styles.menuItemText}>Clear Data</Text>
                </TouchableOpacity> */}
          <TouchableOpacity style={styles.menuItem} onPress={changePassword}>
            <Image source={keyimg} style={styles.imgstyle} />
            <Text style={styles.menuItemText}>Reset Password</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.menuItem} onPress={opensett}>
                    <Image source={keyimg} style={styles.imgstyle} />
                    <Text style={styles.menuItemText}>Deactivate/Del Account</Text>
                </TouchableOpacity> */}
          {(deletetype !== 'perminent' && deletetype !== 'temporary') && (
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('deactivate')}>
              <Image source={deldac} style={styles.imgstyle} />
              <Text style={styles.menuItemText}>Deactivate/Deletion</Text>
            </TouchableOpacity>
          )}
          {(deletetype === 'perminent' || deletetype === 'temporary') && (
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('canceldeactivate')}>
              <Image source={candelimg} style={styles.imgstyle} />
              <Text style={styles.menuItemText}>Cancel Deactivate</Text>
            </TouchableOpacity>
          )}
          {/* <TouchableOpacity style={styles.menuItem} onPress={opensett}>
                    <Image source={keyimg} style={styles.imgstyle} />
                    <Text style={styles.menuItemText}>CancelDeletion</Text>
                </TouchableOpacity> */}
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <Image source={logs} style={styles.imgstyle} />
            <Text style={styles.menuItemText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>)
}
const styles = StyleSheet.create({
  menu: {
    flex: 1,
    backgroundColor: 'white',
    // padding: 30,
    marginTop: 20,
    marginLeft: 30
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  menuItem: {
    // paddingVertical: 7,
    flexDirection: "row",
    marginTop: 5
  },
  menuItemText: {
    fontSize: 20,
    color: 'black',
    marginTop: 5
  },
  imgstyle: {
    width: 30,
    height: 30,
    marginRight: 10,
    marginLeft: -20
  }
});

export default LeftMenu