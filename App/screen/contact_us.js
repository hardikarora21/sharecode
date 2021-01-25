
import React from 'react';
import {
    Text,
    View,
    SafeAreaView,
    StatusBar,
    Image,
    Dimensions,
    ScrollView,
    Linking
} from 'react-native';
import Colors from '../common/Colors';
import Header from '../component/Header';
import Fonts from '../common/Fonts';
import Line from '../common/Line';

const { width: width, height: height } = Dimensions.get('window');

import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import API from '../common/Api';
import Loader from '../common/Loader';
import timeout from '../common/timeout';
import Toast from 'react-native-simple-toast';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { NavigationEvents } from 'react-navigation';

export default class ContactUs extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
          loading: false,
          email: '',
          phone:'',
          mobile:'',
          address:'',
          cartCount : 0,
        };
    
      
      }
      componentDidMount(){
          this.contactAPI();
      }

    contactAPI = () => {

        this.setState({loading: true});
        AsyncStorage.getItem('id').then(id =>{
        AsyncStorage.getItem('token').then(token =>{
        
          var Request = {
           security:1,
           token: JSON.parse(token),
           

          
          };
          console.log(API.contact);
          console.log(JSON.stringify(Request));
          NetInfo.fetch().then(state => {
            if (state.isConnected) {
              timeout(
                15000,
                fetch(API.contact, {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify(Request)
                })
                  .then(res => res.json())
                  .then(res => {
                    console.log("Login RESPONCE:::  ", res);
                    if (res.status == "success") {
                   
                     
       
                       this.setState({ loading: false, address: res.address, mobile: res.mobile, phone: res.phone, email: res.email, },)
       
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
                 
                      Toast.show(res.message,Toast.SHORT,);
                      this.setState({data: res, loading: false });
                     
                    }
                  })
                  .catch(e => {
                    this.setState({ loading: false });
                    console.log(e);
                    Toast.show(
                      "Something went wrong...",
                      Toast.SHORT,
                      
                    );
                  })
              ).catch(e => {
                console.log(e);
                this.setState({ loading: false });
                Toast.show(
                  "Please Check your internet connection",
                  Toast.SHORT,
                  
                );
              });
            } else {
              this.setState({ loading: false });
       
              Toast.show(
                "Please Check your internet connection",
                Toast.SHORT,
                
              );
            }
          });
        })
       })
      }

      countFunction = () => {
        AsyncStorage.getItem('cart').then(cart=> {
          console.log(cart);
          
          if(cart){
              this.setState({cartCount: JSON.parse(cart).length})
              console.log(this.state.cartCount);
              
          } else {
            this.setState({cartCount: 0})
          }
      })
      }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }}>
                <Loader loading={this.state.loading} />
                <NavigationEvents onDidFocus={()=> {
                      this.countFunction()
                    }} />
                <StatusBar barStyle='default'
                    hidden={false} backgroundColor={Colors.primary} />
                <Header
                    Back={() => {
                        this.props.navigation.goBack();
                    }}
                    pageTitle={'Contact us'}
                    iconName={require('../images/home_05.png')}
                    Notification={() => {
                        this.props.navigation.navigate('Notification')
                    }}
                    cartCount={this.state.cartCount}
                    Cart={() => {
                        this.props.navigation.navigate('Cart')
                    }}
                />

                <ScrollView
                showsVerticalScrollIndicator={false}
                style={{flex: 1, backgroundColor: Colors.white}}>

                    <Text style={{
                        fontFamily: Fonts.Regular,
                        fontSize: 16,
                        textAlign: 'left',
                        paddingHorizontal: 25,
                    paddingVertical: 20
                    }}>
                      {this.state.address}
                  </Text>

                  <Line style={{ height: 10, width: '100%', backgroundColor: Colors.light_gray, marginVertical: 25 }}></Line>
                     
                     <View style={{
                          paddingHorizontal: 25,
                          paddingVertical: 4,
                          width:'100%'
                          
                     }}>

                         <Text
                         style={{fontFamily:Fonts.SemiBold,fontSize:16,
                         textAlign:'left',color:Colors.primary}}>Email Address</Text>

                         <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}}
                         onPress={()=> {
                          Linking.openURL('mailto:' + this.state.email)
                         }}>
                         <Image
                                                resizeMode="contain"
                                                style={{
                                                    
                                                    height:height*0.05,
                                                    width:width*0.05
                                                }}
                                                source={ require('../images/Sign-up_21.png')}
                                            />
                         <Text
                         style={{fontFamily:Fonts.Regular,fontSize:12,
                         textAlign:'left',paddingHorizontal:10}}>{this.state.email}</Text>
                         </TouchableOpacity>

                     </View>


                     <Line style={{ height: 10, width: '100%', backgroundColor: Colors.light_gray, marginVertical: 25 }}></Line>
                     
                     <View style={{
                          paddingHorizontal: 25,
                          paddingVertical: 4,
                          width:'100%'
                          
                     }}>

                         <Text
                         style={{fontFamily:Fonts.SemiBold,fontSize:16,
                         textAlign:'left',color:Colors.primary}}>Telephone Number</Text>

                         <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}}
                         onPress={()=> {
                          Linking.openURL('tel:$' + this.state.phone)
                          
                         }}>
                         <Image
                                                resizeMode="contain"
                                                style={{
                                                    
                                                    height:height*0.05,
                                                    width:width*0.05
                                                }}
                                                source={ require('../images/Contact-us_06.png')}
                                            />
                         <Text
                         style={{fontFamily:Fonts.Regular,fontSize:12,
                         textAlign:'left',paddingHorizontal:10}}>{this.state.phone}</Text>
                         </TouchableOpacity>

                     </View>

                     <Line style={{ height: 10, width: '100%', backgroundColor: Colors.light_gray, marginVertical: 25 }}></Line>
                     
                     <View style={{
                          paddingHorizontal: 25,
                          paddingVertical: 4,
                          width:'100%',
                          marginBottom:40
                          
                     }}>

                         <Text
                         style={{fontFamily:Fonts.SemiBold,fontSize:16,
                         textAlign:'left',color:Colors.primary}}>Mobile Number</Text>

                         <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}}
                         onPress={()=> {
                          Linking.openURL('tel:$' + this.state.mobile)
                          
                         }}>
                         <Image
                                                resizeMode="contain"
                                                style={{
                                                    
                                                    height:height*0.05,
                                                    width:width*0.05
                                                }}
                                                source={ require('../images/Contact-us_09.png')}
                                            />
                         <Text
                         style={{fontFamily:Fonts.Regular,fontSize:12,
                         textAlign:'left',paddingHorizontal:10}}>{this.state.mobile}</Text>
                         </TouchableOpacity>

                     </View>


                </ScrollView>

            </SafeAreaView>
        )
    }

}
