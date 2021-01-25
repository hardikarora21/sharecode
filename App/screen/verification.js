import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Platform,
    TouchableOpacity,
    StatusBar,
    TextInput,
    Dimensions,
    ScrollView,
    SafeAreaView,
    KeyboardAvoidingView,
    ImageBackground,
    Keyboard
} from 'react-native';

import Colors from '../common/Colors';
import Fonts from '../common/Fonts';
import CodeInput from '../component/CodeInput';
const { width, height } = Dimensions.get('window')

import { StackActions, NavigationActions } from "react-navigation";
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import API from '../common/Api';
import Loader from '../common/Loader';
import timeout from '../common/timeout';
import Toast from 'react-native-simple-toast';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'

export default class Verification extends Component {
    static navigationOptions = ({ navigation }) => ({
        header: null,
    });

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            visible:true,
            timer:59,
            email: this.props.navigation.state.params.email,
            otp: this.props.navigation.state.params.otp,
            CheckData:false,
            inputBorderColor: Colors.medium_gray,
            intervalId: null,
            typeOtp:''

        };
    }

    componentDidMount(){
        this.setTimer()
        // this.verificationAPI()
    }

    verificationAPI = () => {

        this.setState({loading: true});
        AsyncStorage.getItem('id').then(id =>{
        AsyncStorage.getItem('token').then(token =>{
        
          var Request = {
           security:1,
           token: JSON.parse(token),
           email: this.state.email

          
          };
          console.log(API.otp);
          console.log(JSON.stringify(Request));
          NetInfo.fetch().then(state => {
            if (state.isConnected) {
              timeout(
                15000,
                fetch(API.otp, {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify(Request)
                })
                  .then(res => res.json())
                  .then(res => {
                    console.log("forget_password RESPONCE:::  ", res);
                    if (res.status == "success") {
                   
                        Toast.show(res.message,Toast.SHORT,);
                      
                       this.setState({ loading: false, otp: res.otp})
       
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
                      this.setState({data: res, loading: false, });
                     
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


      forgotAPI = () => {

        this.setState({loading: true});
        AsyncStorage.getItem('id').then(id =>{
        AsyncStorage.getItem('token').then(token =>{
        
          var Request = {
           security:1,
           token: JSON.parse(token),
           email: this.state.email

          
          };
          console.log(API.forget_password);
          console.log(JSON.stringify(Request));
          NetInfo.fetch().then(state => {
            if (state.isConnected) {
              timeout(
                15000,
                fetch(API.forget_password, {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify(Request)
                })
                  .then(res => res.json())
                  .then(res => {
                    console.log("forget_password RESPONCE:::  ", res);
                    if (res.status == "success") {
                   
                        Toast.show(res.message,Toast.SHORT,);
                        const resetAction = StackActions.reset({
                          index: 0,
                          actions: [
                            NavigationActions.navigate({ routeName: "Login" })
                          ]
                        });
                        this.props.navigation.dispatch(resetAction);
                       this.setState({ loading: false, })
       
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
                      this.setState({data: res, loading: false, });
                     
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


      _onFinishCheckingCode2 (isValid, code) {
        Keyboard.dismiss ();
        console.log (isValid);
        this.setState({typeOtp: isValid})
       if(this.state.otp != isValid){
        Toast.show(
          "Invalid OTP",
          Toast.SHORT,
          
        );
       } else {
         this.forgotAPI()
       }
      }

      Final = () => {
        if(this.state.otp != this.state.typeOtp){
          Toast.show(
            "Invalid OTP",
            Toast.SHORT,
            
          );
         } else {
           this.forgotAPI()
         }
      }

      setTimer = () => {
          this.clearTimer()
       this.interval = setInterval(() => {
         if(this.state.timer == 0){
          this.clearTimer()
         } else {
          this.setState({timer:  this.state.timer - 1}) 
         }
            
          }, 1000);
        this.setState({intervalId: this.interval})
      }
      clearTimer = () => {
        if(this.state.timer === 0){ 
            clearInterval(this.interval);
            this.setState({intervalId: null})
          }
      }
    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }}>
                <StatusBar hidden />
                <Loader loading={this.state.loading} />
                <KeyboardAwareScrollView>
                   <ScrollView
                        showsVerticalScrollIndicator={false}
                        style={{ flex: 1 }}>

                        <View
                            style={{
                                height: height * 0.34, width: '100%', backgroundColor: Colors.acent,
                                borderBottomLeftRadius: 50, justifyContent: 'center', alignItems: 'center'
                            }}>

                            <Image
                                resizeMode="cover"
                                source={require('../images/logo.png')}
                                style={{ height: '50%', width: '50%' }} />

                            <Text style={{ fontFamily: Fonts.bold, fontSize: 18, color: Colors.white,marginTop:10 }}>Verification</Text>
                        </View>

                      
                        <View style={{
                            flex: 1, elevation: 0, backgroundColor: Colors.acent,

                        }}>


                            <View style={{
                                flex: 1, backgroundColor: 'white',
                                borderTopRightRadius: 50, paddingHorizontal: 28
                            }}>
                                <View style={{ height: 20 }}></View>
                                <Text 
style={{fontFamily:Fonts.Regular,
marginVertical:10,
paddingHorizontal: 20,
fontSize:16,
textAlign:'center',
}}>
    we have sent you an OTP to your Registered Mobile Number
</Text>

                                <CodeInput
                        ref="codeInputRef2"
                        keyboardType="numeric"
                        codeLength={6}
                        activeColor="transparent"
                        inactiveColor="transparent"
                        autoFocus={true}
                        ignoreCase={true}
                        inputPosition="center"
                        size={width * 0.12}
                        onFulfill={(isValid, code) => {
                           this._onFinishCheckingCode2(isValid, code)
                        }}
                        codeLength={6}
                        containerStyle={{paddingVertical: 10}}
                        codeInputStyle={{
                          fontSize: 24,
                          paddingTop: 5,

                          color: '#344356',
                        }}
                      />

                      <View style={{marginTop: 20}}>
                        <Text style={{fontFamily:Fonts.SemiBold,
marginVertical:15,
fontSize:14,
textAlign:'center' }}>
                          00:{this.state.timer < 10 ? '0'+ this.state.timer : this.state.timer}
                        </Text>
                      </View>





                      <View style={{ height: 20 }}></View>

<TouchableOpacity  onPress={() => {
                                      if(this.state.intervalId){

                                      } else {
                                        this.Final()
                                      }
                                    }}>
<Text verificationAPI
style={{
    textDecorationLine: 'underline',
    fontFamily:Fonts.Regular,
marginVertical:10,
color: this.state.intervalId ? Colors.medium_gray :  Colors.black,
fontSize:18,
textAlign:'center',
}}>
  Resent OTP
</Text>
</TouchableOpacity>
                                <TouchableOpacity
                                    // onPress={() => this.Login()}
                                    onPress={() => {
                                    
                                        this.Final()
                                      
                                    }}
                                    activeOpacity={0.8}
                                    style={{
                                        marginVertical:20,
                                        width: '80%', borderRadius:40, elevation: 1,
                                        justifyContent: 'center', alignItems: 'center',alignSelf:'center',
                                        backgroundColor: Colors.acent, height: '10%'
                                    }}>
                                   
                                    <Text style={{ fontFamily: Fonts.bold, fontSize: 18, color: Colors.white }}>Submit</Text>

                                </TouchableOpacity>

                                <View style={{ flexDirection: 'row', alignSelf: 'center', paddingVertical: 25 }}>
                                    <Text style={{ fontSize: 16, fontFamily: Fonts.Light }}>Already have an account?  </Text>

                                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('Login') }}>
                                        <Text style={{ fontSize: 16, fontFamily: Fonts.Regular, color: Colors.primary }}>Sign In</Text>
                                    </TouchableOpacity>

                                </View>


                               



<View style={{height:50}}></View>                               

                            </View>


                        </View>

                    </ScrollView>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({

    textInput: {
        paddingHorizontal:10,
        fontSize: 16,
        fontFamily: Fonts.regular,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white,
    },
    label: {

        marginTop: 15,
        color: Colors.primary,
        fontSize: 14,
        paddingVertical: 3,
        fontFamily: Fonts.medium,
    },
    required: {
        marginTop: 15,
        color: 'red',
        fontSize: 14,
        paddingLeft: 3,
        paddingVertical: 3,
        fontFamily: Fonts.medium,
    },
    TextStyle: {
        fontSize: 18,
        color: Colors.primary,
        fontFamily: Fonts.black,
    }
});