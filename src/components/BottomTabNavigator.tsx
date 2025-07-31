
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, StyleSheet, Platform } from 'react-native';
import Home from './Home';
import MyMedia from './MyMedia';
import SharedMedia from './SharedMedia';
import Support from './Support';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconSource;

          switch (route.name) {
            case 'Home':
              iconSource = require('../assets/home.png');
              break;
            case 'MyMedia':
              iconSource = require('../assets/picture.png');
              break;
            case 'SharedMedia':
              iconSource = require('../assets/share.png');
              break;
            case 'Support':
              iconSource = require('../assets/emailus.png');
              break;
            default:
              iconSource = require('../assets/home.png');
          }

          return (
            <Image
              source={iconSource}
              style={[
                styles.tabIcon,
                {
                  tintColor: focused ? '#4a90e2' : '#7f8c8d',
                  transform: [{ scale: focused ? 1.1 : 1 }],
                },
              ]}
            />
          );
        },
        tabBarActiveTintColor: '#4a90e2',
        tabBarInactiveTintColor: '#7f8c8d',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e1e8ed',
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 10,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 2,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={Home}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen 
        name="MyMedia" 
        component={MyMedia}
        options={{ tabBarLabel: 'My Media' }}
      />
      <Tab.Screen 
        name="SharedMedia" 
        component={SharedMedia}
        options={{ tabBarLabel: 'Shared' }}
      />
      <Tab.Screen 
        name="Support" 
        component={Support}
        options={{ tabBarLabel: 'Support' }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabIcon: {
    width: 24,
    height: 24,
  },
});

export default BottomTabNavigator;
