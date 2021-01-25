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
    ImageBackground
} from 'react-native';

import Colors from '../common/Colors';
import Fonts from '../common/Fonts';
import CheckBox from 'react-native-check-box'
const { width, height } = Dimensions.get('window')

import { StackActions, NavigationActions } from "react-navigation";
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import API from '../common/Api';
import Loader from '../common/Loader';
import timeout from '../common/timeout';
import Toast from 'react-native-simple-toast';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'
export default class ForgetPass extends Component {
    static navigationOptions = ({ navigation }) => ({
        header: null,
    });

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            visible:true,
            email: '',
            CheckData:false,
            inputBorderColor: Colors.medium_gray,

        };
    }



    forgetAPI = () => {

        this.setState({loading: true});
        AsyncStorage.getItem('id').then(id =>{
        AsyncStorage.getItem('token').then(token =>{
        
          var Request = {
           security:1,
           token: JSON.parse(token),
           email: this.state.email.trim()

          
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
                    console.log("otp RESPONCE:::  ", res);
                    if (res.status == "success") {
                   
                      setTimeout(() => {
                        Toast.show(res.message,Toast.SHORT);
                      }, 200);
                        this.props.navigation.navigate('Verification', {email: this.state.email.trim(), otp: res.otp})
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
                 
                      setTimeout(() => {
                        Toast.show(res.message,Toast.SHORT);
                      }, 200);
                      this.setState({data: res, loading: false, DataSource:[], message: res.message });
                     
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





    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
                <StatusBar hidden />
                <Loader loading={this.state.loading} />
                <KeyboardAwareScrollView>
                   <ScrollView
                        showsVerticalScrollIndicator={false}
                        style={{ flex: 1 }}>

                        <View
                            style={{
                                height: height * 0.36, width: '100%', backgroundColor: Colors.acent,
                                borderBottomLeftRadius: 50, justifyContent: 'center', alignItems: 'center'
                            }}>

                            <Image
                                resizeMode="contain"
                                source={require('../images/logo.png')}
                                style={{ height: '80%', width: '80%' }} />

                            <Text style={{ fontFamily: Fonts.bold, fontSize: 18, color: Colors.white,marginTop:-10 }}>Forget Password</Text>
                        </View>

                      
                        <View style={{
                            flex: 1, elevation: 0, backgroundColor: Colors.acent,

                        }}>

                            <View style={{
                                flex: 1, backgroundColor: 'white',
                                borderTopRightRadius: 50, paddingHorizontal: 28
                            }}>
                                <View style={{ height: 20 }}></View>
                                <View style={{ flexDirection: 'row',alignItems:'center',
                                   borderBottomWidth: 1, borderColor: this.state.inputBorderColor }}>
                                    <Image
                                        resizeMode="contain"
                                        source={require('../images/Sign-up_07.png')}
                                        style={{ height: 20,width:30 }} />
                                    <TextInput
                                        placeholder="Email Address"
                                        selectionColor={Colors.primary}
                                        placeholderTextColor={Colors.medium_gray}
                                        style={[styles.textInput, {
                                            textAlignVertical: this.props.multiline ? "top" : "center",
                                           
                                            
                                        }]}
                                        autoCapitalize='none'
                                        keyboardType={"default"}
                                        onFocus={() => this.setState({ inputBorderColor: Colors.primary })}
                                        onBlur={() =>
                                            this.setState({ inputBorderColor: Colors.medium_gray })
                                        }
                                        onChangeText={email => this.setState({ email })}
                                        returnKeyType={"next"}
                                        onSubmitEditing={(event) => {
                                            
                                        }}

                                    />
                                </View>


<Text 
style={{fontFamily:Fonts.Regular,
marginVertical:15,
fontSize:14,
textAlign:'center',
}}>
    we will send you a new password to your registered email address
</Text>


                                <TouchableOpacity
                                    // onPress={() => this.Login()}
                                    onPress={() => {
                                      
                                       this.forgetAPI()
                                    }}
                                    activeOpacity={0.8}
                                    style={{
                                        marginVertical:20,
                                        width: '80%', borderRadius:40, elevation: 1,
                                        justifyContent: 'center', alignItems: 'center',alignSelf:'center',
                                        backgroundColor: Colors.acent, height: '16%'
                                    }}>
                                   
                                    <Text style={{ fontFamily: Fonts.bold, fontSize: 18, color: Colors.white }}>Submit</Text>

                                </TouchableOpacity>

                                <View style={{ flexDirection: 'row', alignSelf: 'center', paddingVertical: 18 }}>
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
        paddingVertical: Platform.OS == 'ios' ? 8 : 8,
        fontFamily: Fonts.regular,
        justifyContent: 'center',
        alignItems: 'center',
        color: Colors.black,
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