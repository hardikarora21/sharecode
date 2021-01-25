import React, { Component } from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, Image, Dimensions, ImageBackground } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../common/Colors';
import Fonts from '../common/Fonts'
import { ScrollView } from 'react-native-gesture-handler';
import API, { wallet_data } from '../common/Api';
import timeout from '../common/timeout';
import Loader from '../common/Loader';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from "@react-native-community/netinfo";
import { StackActions, NavigationActions, NavigationEvents } from "react-navigation";
const Datasource = [

  {
    icon: require('../images/Slider_15.png'),
    title: 'Home',
    navigate: 'Home',
    visible: false,
    id: 0
  },
  {
    icon: require('../images/Slider_19.png'),
    title: 'Order history',
    navigate: 'Order',
    visible: false,
    id: 1
  },
  {
    icon: require('../images/Slider_22.png'),
    title: 'Offers',
    navigate: 'Offers',
    visible: false,
    id: 2
  },
  {
    icon: require('../images/Slider_25.png'),
    title: 'Wallet',
    navigate: 'Wallet',
   
    visible: false,
    id: 3

  },
  {
    icon: require('../images/Slider_29.png'),
    title: 'Reffer & Earn',
    navigate: 'Refer',
    visible: false,
    id: 4

  },
  {
    icon: require('../images/Slider_33.png'),
    title: 'Return product',
    navigate: 'ReturnProduct',
    visible: false,
    id: 5

  },
  {
    icon: require('../images/Slider_37.png'),
    title: 'Terms & condition',
    navigate: 'TermsCondition',
    visible: false,
    id: 6

  },
  {
    icon: require('../images/question.png'),
    title: 'FAQs',
    navigate: 'Faq',
    visible: false,
    id: 7

  },
  {
    icon: require('../images/Slider_41.png'),
    title: 'Contact Us',
    navigate: 'ContactUs',
    visible: false,
    id: 8

  },
  {
    icon: require('../images/Slider_45.png'),
    title: 'About Us',
    navigate: 'AboutUs',
    visible: false,
    id: 9

  },
  {
    icon: require('../images/Slider_48.png'),
    title: 'Sign Out',
   
    visible: false,
    id: 10

  }
];

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;


export default class Sidebar extends Component {

  state = {
    user: '',
    wallet:0,
    profile:'',
    name:'',
    mobile:'',
    call: false,
    userid: '', refresh: false,profile:null,
    avatarSource: null, visible: false, Profile: 0
  }

  componentDidUpdate(){
   
    if(this.props.navigation.state.isDrawerOpen){
      AsyncStorage.getItem('name').then(name => {
        AsyncStorage.getItem('profile').then(profile => {
          AsyncStorage.getItem('phone').then(phone => {
            AsyncStorage.getItem('wallet').then(wallet => {
        this.setState({name: name, mobile: phone, profile: profile, wallet: wallet})
      })
    })
  })
})
    }
    console.log(this.props.navigation.state.isDrawerOpen);

    if(this.props.navigation.state.isDrawerOpen === true && this.state.call === false){
      this.WalletAPI()
       
    } else {
        if(this.state.call === false){
          this.setState({call: true})
        }
     
    }
    
}




WalletAPI = () => {
  this.setState({loading: true, call: true});
 AsyncStorage.getItem('id').then(id =>{
 AsyncStorage.getItem('token').then(token =>{
 
   var Request = {
    security:0,
    id: JSON.parse(id),
    token: JSON.parse(token),
   
   };
   console.log(API.wallet);
   console.log(JSON.stringify(Request));
   NetInfo.fetch().then(state => {
     if (state.isConnected) {
       timeout(
         15000,
         fetch(API.wallet, {
           method: "POST",
           headers: {
             Accept: "application/json",
             "Content-Type": "application/json"
           },
           body: JSON.stringify(Request)
         })
           .then(res => res.json())
           .then(res => {
             console.log("Walet RESPONCE:::  ", res);
             if (res.status == "success") {
              
                this.setState({ loading: false,  wallet: res.wallet, name: res.name, profile: res.profile,mobile: res.phone})
            
                 AsyncStorage.setItem('name', res.name);
                 AsyncStorage.setItem('profile', res.profile); 
                 AsyncStorage.setItem('phone', res.phone);
                 AsyncStorage.setItem('wallet', res.wallet);
          
               } else if (res.status == "failed") {
               this.setState({loading: false });
               AsyncStorage.removeItem("id");
               
               const resetAction = StackActions.reset({
                 index: 0,
                 actions: [
                   NavigationActions.navigate({ routeName: "Login" })
                 ]
               });
               this.props.navigation.dispatch(resetAction);
             } else {
          
              //  Toast.show(res.message,Toast.SHORT,Toast.BOTTOM);
               this.setState({data: res, loading: false });
              
             }
           })
           .catch(e => {
             this.setState({ loading: false });
             console.log(e);
             setTimeout(()=> {
             
               const resetAction = StackActions.reset({
                 index: 0,
                 actions: [NavigationActions.navigate({ routeName: 'Login' })],
             });
         this.props.navigation.dispatch(resetAction);
             }, 1000)
             Toast.show(
               "Something went wrong...",
               Toast.SHORT,
               Toast.BOTTOM
             );
           })
       ).catch(e => {
         console.log(e);
         setTimeout(()=> {
          
           const resetAction = StackActions.reset({
             index: 0,
             actions: [NavigationActions.navigate({ routeName: 'Login' })],
         });
     this.props.navigation.dispatch(resetAction);
         }, 1000)
         this.setState({ loading: false });
         Toast.show(
           "Please Check your internet connection",
           Toast.SHORT,
           Toast.BOTTOM
         );
       });
     } else {
       this.setState({ loading: false });
       setTimeout(()=> {
       
         const resetAction = StackActions.reset({
           index: 0,
           actions: [NavigationActions.navigate({ routeName: 'Login' })],
       });
   this.props.navigation.dispatch(resetAction);
       }, 1000)
       Toast.show(
         "Please Check your internet connection",
         Toast.SHORT,
         Toast.BOTTOM
       );
     }
   });
 })
})

}



  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
        <View style={{ flex: 1 }}>
         
          <ScrollView showsVerticalScrollIndicator={false}>

        
       
     
 
            <View style={{ height: height * 1 / 4, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.primary, width: '100%' }}>

              <View style={{ flexDirection: 'row', width: '90%', alignItems: 'center', justifyContent: 'space-between' }}>

                <View style={{ height: height * 0.1,  width: width * 0.2, justifyContent: 'center', alignItems: 'center', borderRadius: 10, }}>

                  <Image style={{
                    height: '100%', width: '100%', tintColor: 'white',
                   
                  }}
                  resizeMode="contain"
    source={require('../images/logo.png')} /> 
                </View>

                <View style={{ flexDirection: 'column', }}>

                <Text style={{ fontSize: 20, fontFamily: Fonts.SemiBold, color: 'white', paddingTop: 0 }}>{this.state.name}</Text>
                  <Text style={{ fontSize: 15, fontFamily: Fonts.Regular, color: 'white', paddingTop: 6 }}>{this.state.mobile}</Text>

                </View>
                <View style={{width:20}}></View>
                <TouchableOpacity 
                onPress={()=>
                {
                  this.props.navigation.navigate('Profile');
                  this.props.navigation.closeDrawer()
                }}
                style={{paddingTop:0,alignSelf:'flex-end',padding: 10, }}>

                  <Image style={{ height: 20, width: 20,bottom:0 }} resizeMode="contain"
                    source={require('../images/Slider_10.png')} />


                </TouchableOpacity>
              </View>
              <View style={{
             position: 'absolute',
             left: 0,
             bottom: -35,
             width: 0,
             height: 0,
            //  elevation:1,
             borderBottomWidth: 35,
             borderBottomColor: 'transparent',
            //  borderLeftWidth: 55,
             borderLeftColor: 'red',
             borderRightWidth: width*1,
             borderRightColor: Colors.primary
        }} />
     
            </View>

        <View style={{height:50,width:'100%'}}></View>

            <FlatList
              style={{}}
              data={Datasource}
              renderItem={({ item, index }) =>
                <View style={{
                  padding: 0, width: '100%',
                  paddingVertical: 0,
                  marginVertical: 1.5,
                  borderTopLeftRadius: 20,
                  borderBottomLeftRadius: 20, justifyContent: 'center',
                  alignItems: 'center'
                }}>

                  <TouchableOpacity
                    onPress={() => {

                      if(item.title == 'Sign Out'){
                      const resetAction = StackActions.reset({
                        index: 0,
                        actions: [
                            NavigationActions.navigate({ routeName: 'Login' }),
                        ],
                    });
                   
                    AsyncStorage.removeItem('id');
                    AsyncStorage.removeItem('phone');
                    AsyncStorage.removeItem('email');
                    AsyncStorage.removeItem('name');
                    AsyncStorage.removeItem('password');
                    AsyncStorage.removeItem('profile');
                    this.props.navigation.dispatch(resetAction);
                  }
                  else{
                      for (let i = 0; i < Datasource.length; i++) {
                        if (index == Datasource[i].id) {
                          Datasource[i].visible = true
                        } else {
                          Datasource[i].visible = false
                        }
                      }
                      this.setState({ refresh: !this.state.refresh })
                      this.props.navigation.navigate(item.navigate ? item.navigate : '')
                      this.props.navigation.closeDrawer()
                    }
                    }}
                    style={{
                      paddingHorizontal: 0,
                      height: height * 0.10, 
                      width: '100%', flexDirection: 'row'
                    }}>
{item.title == 'FAQs' ?   <Image
                      resizeMode={"contain"}
                      style={{
                        height: 25, width: 25,

                        tintColor: item.visible ? Colors.primary
                          : Colors.black,
                        paddingVertical: 10,
                        paddingHorizontal: 30
                      }}
                      source={item.icon} />
                      :
                    <Image
                      resizeMode={"contain"}
                      style={{
                        height: 25, width: 20,

                        tintColor: item.visible ? Colors.primary
                          : Colors.black,
                        // paddingVertical: 20,
                        paddingHorizontal: 30
                      }}
                      source={item.icon} />}

                    <View style={{
                      flex: 1, height: '60%', paddingHorizontal: 10,marginVertical: 0,
                      justifyContent: 'space-between', flexDirection: 'row',
                      borderBottomWidth: 1, borderBottomColor: Colors.light_gray
                    }}>
                      <Text style={{
                        textAlign: 'left',
                        color: item.visible ? Colors.primary : Colors.black,
                        fontFamily: item.visible ? Fonts.SemiBold : Fonts.Regular, fontSize: 16
                      }}>{item.title}</Text>
                      {item.title == 'Wallet' ?
                        <Text style={{
                          color: item.visible ? Colors.primary : Colors.black,marginRight:8,
                          fontFamily: item.visible ? Fonts.SemiBold : Fonts.Regular, fontSize: 16
                        }}>Rs. {this.state.wallet}</Text>
                        : null}
                        
                    </View>



                  </TouchableOpacity>


                </View>
              }
            />
          </ScrollView>
        </View>
      </SafeAreaView>
    )
  }
}


