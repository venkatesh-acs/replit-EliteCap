import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const Home = ({ navigation }) => {
  const [userName, setUserName] = useState('User');

  const menuItems = [
    {
      id: 1,
      title: 'Capture Photo',
      subtitle: 'Take professional photos',
      icon: require('../assets/camera.png'),
      color: '#4a90e2',
      onPress: () => navigation.navigate('Camera'),
    },
    {
      id: 2,
      title: 'Record Video',
      subtitle: 'Create video content',
      icon: require('../assets/video.png'),
      color: '#50c878',
      onPress: () => navigation.navigate('VideoRecorder'),
    },
    {
      id: 3,
      title: 'My Media',
      subtitle: 'View your content',
      icon: require('../assets/picture.png'),
      color: '#ff6b6b',
      onPress: () => navigation.navigate('MyMedia'),
    },
    {
      id: 4,
      title: 'Shared Media',
      subtitle: 'Collaborative content',
      icon: require('../assets/share.png'),
      color: '#ffa500',
      onPress: () => navigation.navigate('SharedMedia'),
    },
  ];

  const quickActions = [
    {
      id: 1,
      title: 'Quick Capture',
      icon: require('../assets/record.png'),
      color: '#e74c3c',
    },
    {
      id: 2,
      title: 'Upload',
      icon: require('../assets/upload_icon.png'),
      color: '#9b59b6',
    },
    {
      id: 3,
      title: 'Share All',
      icon: require('../assets/shares.png'),
      color: '#3498db',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Image source={require('../assets/ic_person.png')} style={styles.profileIcon} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickActionsList}>
            {quickActions.map((action) => (
              <TouchableOpacity key={action.id} style={[styles.quickActionCard, { backgroundColor: action.color }]}>
                <Image source={action.icon} style={styles.quickActionIcon} />
                <Text style={styles.quickActionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.mainMenuContainer}>
          <Text style={styles.sectionTitle}>Main Features</Text>
          <View style={styles.menuGrid}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuCard}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View style={[styles.menuIconContainer, { backgroundColor: item.color + '20' }]}>
                  <Image source={item.icon} style={[styles.menuIcon, { tintColor: item.color }]} />
                </View>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Your Activity</Text>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>24</Text>
              <Text style={styles.statLabel}>Photos</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Videos</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Shared</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  greeting: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  profileButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#4a90e2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    width: 24,
    height: 24,
    tintColor: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    marginTop: 25,
  },
  quickActionsContainer: {
    marginBottom: 10,
  },
  quickActionsList: {
    marginBottom: 10,
  },
  quickActionCard: {
    width: 100,
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  quickActionIcon: {
    width: 24,
    height: 24,
    tintColor: '#ffffff',
    marginBottom: 8,
  },
  quickActionText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  mainMenuContainer: {
    marginBottom: 10,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuCard: {
    width: (width - 50) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  menuIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  menuIcon: {
    width: 28,
    height: 28,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  statsContainer: {
    marginBottom: 30,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4a90e2',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
});

export default Home;