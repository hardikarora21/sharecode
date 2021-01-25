import React from 'react';
import {
    Text,
    View,
    SafeAreaView,
    Image,
    Dimensions,
    TouchableOpacity
} from 'react-native';

import Colors from '../common/Colors';
import Header from '../component/Header';
import Fonts from '../common/Fonts';
import Line from '../common/Line';
import { ScrollView } from 'react-native-gesture-handler';
import API from '../common/Api';
import timeout from '../common/timeout';
import Loader from '../common/Loader';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from "@react-native-community/netinfo";
import { StackActions, NavigationActions } from "react-navigation";
import RazorpayCheckout from 'react-native-razorpay';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
export default class Success extends React.Component {
 




    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }}>
                <View style={{flex: 1, backgroundColor: Colors.white}}>
                <Header
                    Back={() => {
                        this.props.navigation.goBack();
                    }}
                    pageTitle={'Confirmation'}
                    iconName={require('../images/home_05.png')}
                    Notification={() => {
                        this.props.navigation.navigate('Notification')
                    }}
                    Cart={() => {
                        this.props.navigation.navigate('Cart')
                    }}


                />

<ScrollView keyboardShouldPersistTaps='handled'>



        <View
          style={{
            //  backgroundColor: "#b6b9ba",
            flex:1,
            width: width,
            paddingHorizontal: width*.08
          }}
        >
          <View
          style={{
            backgroundColor: 'transparent',
            justifyContent: "center",
            alignItems: "center",
            height: width * 0.6
          }}
        >
          <Image
          resizeMode="cover"
            source={require("../images/success.jpg")}
            style={{width: width *.7, height: width * 0.4}}
          />
        </View>

        <Text style={{textAlign:'center', color: Colors.black, fontSize:22, fontFamily: Fonts.bold}}>Thank You</Text>
        <Text style={{textAlign:'center', color: Colors.dark_gray, fontSize:16, fontFamily: Fonts.regular}}>Your order number is<Text style={{textAlign:'center', color: Colors.primary, fontSize:16, fontFamily: Fonts.bold}}> #{this.props.navigation.state.params.orderno}</Text>
</Text>
        <Text style={{textAlign:'center', color: Colors.dark_gray, fontSize:16, fontFamily: Fonts.regular}}>Your payment is successfully completed.
</Text>
<Text style={{textAlign:'center', color: Colors.medium_gray, fontSize:14, fontFamily: Fonts.light}}>We'll reach out to you shortly with your order.</Text>






        </View>

       
        </ScrollView>

        <TouchableOpacity
                            // onPress={() => this.Login()}
                            onPress={() => {

                                const resetAction = StackActions.reset({
                                    index: 0,
                                    actions: [
                                        NavigationActions.navigate({ routeName: 'Home' }),
                                    ],
                                });
                                this.props.navigation.dispatch(resetAction);
                            }}
                            activeOpacity={0.8}
                            style={{
                                width: '80%', borderRadius: 40, elevation: 1,marginVertical:18,
                                justifyContent: 'center', alignItems: 'center', alignSelf: 'center',
                                backgroundColor: Colors.acent, height: height * 0.2 /2.5
                            }}>

                            <Text style={{ fontFamily: Fonts.bold, fontSize: 18, color: Colors.white }}>Continue</Text>

                        </TouchableOpacity>
                        </View>
            </SafeAreaView>
        )
    }

}
