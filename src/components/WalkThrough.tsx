import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, Text, View, StyleSheet } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import Icon from 'react-native-vector-icons/Ionicons';

const slides = [
    
    {
        key: 'one',
        title: 'Home',
        text: 'Discover new features.',
         image: require('../assets/s1.png'),
        backgroundColor: '#fff',
    },
    {
        key: 'two',
        title: 'Emergency Call',
        text: 'Discover new features.',
         image: require('../assets/s2.png'),
        backgroundColor: '#fff',
    },
    {
      key: 'three',
      title: 'Home',
      text: 'Discover new features.',
       image: require('../assets/s3.png'),
      backgroundColor: '#fff',
  },
  // {
  //     key: 'four',
  //     title: 'Emergency Call',
  //     text: 'Discover new features.',
  //      image: require('../assets/s4.PNG'),
  //     backgroundColor: '#fff',
  // },
  {
    key: 'five',
    title: 'Emergency Call',
    text: 'Discover new features.',
     image: require('../assets/s5.png'),
    backgroundColor: '#fff',
},
   
    // Add more slides as needed
];
const WalkThrough:React.FC = () =>  {
    const navigate = useNavigation();
    const redirect = async () => {
        try {
        //   navigate.navigate('Home' as never);
            navigate.navigate('bottomnavigation' as never);
        } catch (error) {
          console.error('Navigating to Home has failed', error);
        }
      };

    const renderItem = ({ item }: { item: any }) => (
        <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.text}>{item.text}</Text>
        </View>
    );

    const _renderNextButton = () => {
        return (
          <View style={styles.buttonCircle}>
            <Icon
              name="skip-next"
              color="rgba(255, 255, 255, .9)"
              size={24}
            />
          </View>
        );
      };
      const _renderDoneButton = () => {
        return (
          <View style={styles.buttonCircle}>
            <Icon
              name="stepforward"
              color="rgba(255, 255, 255, .9)"
              size={24}
            />
          </View>
        );
      };

    return (
        <AppIntroSlider
            renderItem={renderItem}
            data={slides}
            dotStyle={styles.dot}
            activeDotStyle={styles.activeDot}
            showSkipButton={true}
            showDoneButton={true}
            // renderDoneButton={_renderDoneButton}
            // renderNextButton={_renderNextButton}
            onDone={() => redirect()}
        />
    );
}

const styles = StyleSheet.create({
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
        textAlign: 'center',
    },
    dot: {
        backgroundColor: '#bbb',
    },
    activeDot: {
        backgroundColor: '#eb2828',
    },
    buttonCircle: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(0, 0, 0, .2)',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
      },
});


export default WalkThrough