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

import { StackActions, NavigationActions } from "react-navigation";
import Toast from 'react-native-simple-toast';
import Colors from '../common/Colors';
import Fonts from '../common/Fonts';
import CheckBox from 'react-native-check-box'
const { width, height } = Dimensions.get('window')
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import API from '../common/Api';
import Loader from '../common/Loader';
import timeout from '../common/timeout';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'

export default class Login extends Component {
    static navigationOptions = ({ navigation }) => ({
        header: null,
    });

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            visible:true,
            username: '',
            password: '',
            CheckData:true,
            inputBorderColor: Colors.medium_gray,
            inputBorderColor2: Colors.medium_gray,
        };
    }


    Login = () => {
        if (!this.state.username) {
            Toast.show(
                "Please enter an email address.",
                Toast.SHORT,
                
            );
        }
        else if (!this.state.password) {
            Toast.show(
                "Please enter password",
                Toast.SHORT,
                
            );
        } else {



           this.loginAPI()
        }

    };
    onClick(index) {

    }


    loginAPI = () => {

        this.setState({loading: true});
        AsyncStorage.getItem('id').then(id =>{
        AsyncStorage.getItem('token').then(token =>{
        
          var Request = {
           security:1,
           token: JSON.parse(token),
           username: this.state.username,
           password: this.state.password,
          
          };
          console.log(API.login);
          console.log(JSON.stringify(Request));
          NetInfo.fetch().then(state => {
            if (state.isConnected) {
              timeout(
                15000,
                fetch(API.login, {
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
                     AsyncStorage.setItem('id', res.id);
                     AsyncStorage.setItem('phone', res.phone);
                     AsyncStorage.setItem('email', res.email);
                     AsyncStorage.setItem('name', res.name);
                     
                
                 AsyncStorage.setItem('profile', res.profile); 
                
                 AsyncStorage.setItem('wallet', res.wallet);
                     if(this.state.CheckData){
                        AsyncStorage.setItem('password', this.state.password);
                     }
                     AsyncStorage.setItem('profile', res.profile);
       
                       this.setState({ loading: false,}, ()=> {
                         const resetAction = StackActions.reset({
                           index: 0,
                           actions: [
                             NavigationActions.navigate({ routeName: "Home" })
                           ]
                         });
                         this.props.navigation.dispatch(resetAction);
                       })
       
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

                            <Text style={{ fontFamily: Fonts.bold, fontSize: 18, color: Colors.white,marginTop:-10 }}>Sign In</Text>
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
                                        style={{ height:20,width:30 }} />
                                    <TextInput
                                        placeholder="Email"
                                        placeholderTextColor={Colors.medium_gray}
                                        selectionColor={Colors.primary}
                                        style={[styles.textInput, {
                                            textAlignVertical: this.props.multiline ? "top" : "center",
                                           
                                            
                                        }]}
                                        autoCapitalize='none'
                                        keyboardType={"email-address"}
                                        onFocus={() => this.setState({ inputBorderColor: Colors.primary })}
                                        onBlur={() =>
                                            this.setState({ inputBorderColor: Colors.medium_gray })
                                        }
                                        onChangeText={username => this.setState({ username })}
                                        returnKeyType={"next"}
                                        onSubmitEditing={(event) => {
                                            this.refs.password.focus();
                                        }}

                                    />
                                </View>


                                <View style={{ height: 20 }}></View>
                                <View style={{justifyContent:'space-between',flexDirection:'row',borderBottomWidth: 1,
                                alignItems:'center',   borderColor: this.state.inputBorderColor2 }} >

                                <View style={{ flex:1, flexDirection: 'row',alignItems:'center',
                                   }}>
                                    <Image
                                        resizeMode="contain"
                                        source={require('../images/Sign-up_10.png')}
                                        style={{ height:20,width:30 }} />
                                <TextInput
                                    placeholder="Password"
                                    selectionColor={Colors.primary}
                                    placeholderTextColor={Colors.medium_gray}
                                    style={[styles.textInput, {
                                        textAlignVertical: this.props.multiline ? "top" : "center",
                                      
                                      
                                    }]}
                                    autoCapitalize='none'
                                    // keyboardType={""}
                                    secureTextEntry={this.state.visible}
                                    onFocus={() => this.setState({ inputBorderColor2: Colors.primary })}
                                    onBlur={() =>
                                        this.setState({ inputBorderColor2: Colors.medium_gray })
                                    }
                                    ref='password'
                                    onChangeText={password => this.setState({ password })}
                                    returnKeyType={"next"}
                                    onSubmitEditing={(event) => {
                                        this.Login()
                                    }}

                                />
                               </View>
                               <TouchableOpacity
                                onPress={()=>{
                                    this.setState({visible:!this.state.visible})
                                  }}
                               style={{ height: 30,width:30, }}>
                               <Image
                                        resizeMode="contain"
                                        source={require('../images/Login_17.png')}
                                        style={{ height: '80%',width:'80%', tintColor: this.state.visible? Colors.black : Colors.medium_gray }} />
                               </TouchableOpacity>
                                
                               
                                  
                              

                                </View>
                               

                                <View style={{flexDirection:'row',alignItems:'center',
                                paddingHorizontal:0,paddingVertical:20}}>

                                  <TouchableOpacity 
                                  onPress={()=>{
                                    this.setState({CheckData:!this.state.CheckData})
                                  }}
                                  style={{
                                  height:30,width:30,
                                  justifyContent:'center',alignItems:'center'
                                  }}>
                                      
                                    {this.state.CheckData ? 
                                    <Image  
                                    resizeMode={'contain'}
                                     style={{height:height*0.04,width:width*0.07}}
                                     source={require('../images/checked.png')}/> 
                                        :
                                     <View style={{paddingHorizontal:10,paddingVertical:10,
                                     backgroundColor:'#ededed'}}></View>
                                     }
                                  </TouchableOpacity>      


                                    <Text style={{ fontSize: 14, fontFamily: Fonts.Regular,
                                     paddingHorizontal:10
                                     }}>Save Password</Text>

                                </View>


                                <TouchableOpacity
                                    onPress={() => this.Login()}
                                   
                                    activeOpacity={0.8}
                                    style={{
                                        width: '80%', borderRadius:40, elevation: 1,
                                        marginTop:20,
                                        marginBottom:10,
                                        justifyContent: 'center', alignItems: 'center',alignSelf:'center',
                                        backgroundColor: Colors.acent, paddingVertical:10
                                    }}>
                                   
                                    <Text style={{ fontFamily: Fonts.bold, fontSize: 18, color: Colors.white }}>Sign In</Text>

                                </TouchableOpacity>


                                <View style={{ flexDirection: 'row', alignSelf: 'center', paddingVertical: 20 }}>
                                    <Text style={{ fontSize: 16,  fontFamily: Fonts.Light}}>Dont have an account?  </Text>

                                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('Registration') }}>
                                        <Text style={{ fontSize: 16, fontFamily: Fonts.Regular,color:Colors.primary}}>Sign up</Text>
                                    </TouchableOpacity>

                                </View>

                                <View style={{width:'100%',backgroundColor:Colors.light_gray,height:1}}></View>

                                <View style={{ flexDirection: 'row', alignSelf: 'center', paddingVertical: 20 }}>
                                    <Text style={{ fontSize: 16, fontFamily: Fonts.Light }}>Forgot your password?  </Text>

                                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('ForgetPassword') }}>
                                        <Text style={{ fontSize: 16, fontFamily: Fonts.Regular,color:Colors.primary}}>Click here</Text>
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
      flex:1,
        paddingHorizontal:10,
        fontSize: 16,
        paddingVertical: Platform.OS == 'ios' ? 8 : 8,
        fontFamily: Fonts.regular,
        justifyContent: 'center',
        color: Colors.black,
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