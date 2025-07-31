import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Home from './Home';
import MyMedia from './MyMedia';
import SharedMedia from './SharedMedia';

const homeimg = require('../assets/home.png');
const calimg = require('../assets/picture.png');
const shareimg = require('../assets/shares.png');

const Tab = createBottomTabNavigator();

const  BottomTabNavigator = () =>  {
    return (
        <Tab.Navigator
          initialRouteName="home"
          screenOptions={{
            tabBarActiveTintColor: '#694fad', // Label color for the active tab
            tabBarInactiveTintColor: 'gray', // Label color for inactive tabs
            tabBarStyle: {
              backgroundColor: '#ffffff', 
              height:60
            },
            headerShown: false, // Hide headers if not needed
          }}
        >
          <Tab.Screen
            name="home"
            component={Home}
            options={{
              tabBarLabel: 'Home',
              tabBarLabelStyle:{fontSize:15},
              tabBarIcon: ({ focused }) => (
                <Image
                  source={homeimg}
                  style={[styles.icon, focused && styles.activeIcon]}
                />
              ),
            }}
          />
          <Tab.Screen
            name="mymedia"
            component={MyMedia}
            options={{
              tabBarLabel: 'MyMedia',
              tabBarLabelStyle:{fontSize:15},
              tabBarIcon: ({ focused }) => (
                <Image
                  source={calimg}
                  style={[styles.icon, focused && styles.activeIcon]}
                />
              ),
            }}
          />
           <Tab.Screen
            name="sharedmedia"
            component={SharedMedia}
            options={{
              tabBarLabel: 'Shared Media',
              tabBarLabelStyle:{fontSize:15},
              tabBarIcon: ({ focused }) => (
                <Image
                  source={shareimg}
                  style={[styles.icon, focused && styles.activeIcon]}
                />
              ),
            }}
          />         
        </Tab.Navigator>
      );
    };
    
    const styles = StyleSheet.create({
      icon: {
        width: 30,
        height: 30,
        marginBottom: 4,
      },
      activeIcon: {
        transform: [{ scale: 1.3 }], // Slightly increase size for active icon
      },
    });
    
    

export default BottomTabNavigator