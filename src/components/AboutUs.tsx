import { Text, View } from 'react-native'
import React from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'

const AboutUs = () => {

    const pkg = require('../../package.json');

    const appVersion = pkg.version;
    const navigation = useNavigation();

    
    return (

        <View>
            <Text style={{ fontSize: 20, marginLeft: '30%', marginTop: 20, color: 'black' }}>
                EliteCap
            </Text>
            <Text style={{ fontSize: 20, marginLeft: '30%', marginTop: 10, color: 'black' }}>
                Version: {appVersion}
            </Text>
            <ScrollView style={{ margin: 10 }}>
                <Text style={{ fontSize: 18, marginVertical: 5, lineHeight: 22, marginLeft: 10, color: 'black' }}>
                    EliteCap mobile app facilitate to Capture proofs of realtime
                    Videos and Photos of specific event (s), incident(s) or actions
                    being carried out as they are happening  instantly. Ofcourse,
                    the quaity of proof is very much dependent on the quality of capture.
                    You will never struggle to tell /reconstruct your story again and again.
                </Text>
                <Text style={{ fontSize: 18, marginVertical: 5, lineHeight: 22, marginLeft: 10, color: 'black' }}>
                    Be it Business discussions and agrements of any size, involving groups of
                    parties or a personal incident of verbal agreement in a one-on-one
                    meetings.EliteCap Mobile app is proven to reduce the fouling  with
                    its captured proof of Videos and Photos.
                </Text>
                <Text style={{ fontSize: 18, marginVertical: 5, lineHeight: 22, marginLeft: 10, color: 'black' }}>
                    Videos and Photos which are captured and uploaded by the users,
                    are secured strongly with industry standard technologies to avoid
                    any unauthorized access and modifications.
                </Text>
                <Text style={{ fontSize: 18, marginVertical: 5, lineHeight: 22, marginLeft: 10, color: 'black' }}>
                    are secured strongly with industry standard technologies to avoid
                    any unauthorized access and modifications.
                </Text>
                <Text style={{ fontSize: 18, marginVertical: 5, lineHeight: 22, marginLeft: 10, color: 'black' }}>
                    These captured Videos or Photos along with date time and location
                    will be standing as a strong proof for use whenever and wherever it is required.
                </Text>
                <Text style={{ fontSize: 18, marginVertical: 5, lineHeight: 22, marginLeft: 10, color: 'black' }}>
                    The Videos and Photos can be viewed , securely shared to the concerned
                    subscribed users across the globe for the appropriate use as proof either
                    through Mobile or through EliteCap website.
                </Text>


            </ScrollView>
        </View>
    )
}


export default AboutUs