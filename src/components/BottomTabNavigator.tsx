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
            tabBarActiveTintColor: '#2196F3',
            tabBarInactiveTintColor: '#666',
            tabBarStyle: {
              backgroundColor: '#ffffff',
              height: 70,
              paddingBottom: 10,
              paddingTop: 5,
              borderTopWidth: 1,
              borderTopColor: '#E0E0E0',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: -2,
              },
              shadowOpacity: 0.1,
              shadowRadius: 3.84,
              elevation: 5,
            },
            headerShown: false,
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '600',
            },
          }}
        >
          <Tab.Screen
            name="home"
            component={Home}
            options={{
              tabBarLabel: 'Home',
              tabBarIcon: ({ focused }) => (
                <Image
                  source={homeimg}
                  style={[
                    styles.icon, 
                    { tintColor: focused ? '#2196F3' : '#666' },
                    focused && styles.activeIcon
                  ]}
                />
              ),
            }}
          />
          <Tab.Screen
            name="mymedia"
            component={MyMedia}
            options={{
              tabBarLabel: 'My Media',
              tabBarIcon: ({ focused }) => (
                <Image
                  source={calimg}
                  style={[
                    styles.icon, 
                    { tintColor: focused ? '#2196F3' : '#666' },
                    focused && styles.activeIcon
                  ]}
                />
              ),
            }}
          />
           <Tab.Screen
            name="sharedmedia"
            component={SharedMedia}
            options={{
              tabBarLabel: 'Shared',
              tabBarIcon: ({ focused }) => (
                <Image
                  source={shareimg}
                  style={[
                    styles.icon, 
                    { tintColor: focused ? '#2196F3' : '#666' },
                    focused && styles.activeIcon
                  ]}
                />
              ),
            }}
          />         
        </Tab.Navigator>
      );
    };
    
    const styles = StyleSheet.create({
      icon: {
        width: 28,
        height: 28,
        marginBottom: 2,
      },
      activeIcon: {
        transform: [{ scale: 1.2 }],
        tintColor: '#2196F3',
      },
    });
    
    

export default BottomTabNavigator