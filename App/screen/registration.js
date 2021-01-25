
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
    Modal,
    TouchableWithoutFeedback
} from 'react-native';

import { StackActions, NavigationActions } from "react-navigation";
import Toast from 'react-native-simple-toast';
import Colors from '../common/Colors';
import Fonts from '../common/Fonts';
import CheckBox from 'react-native-check-box'
const { width, height } = Dimensions.get('window')
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import API from '../common/Api';
import Loader from '../common/Loader';
import timeout from '../common/timeout';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'


export default class Registration extends Component {
    static navigationOptions = ({ navigation }) => ({
        header: null,
    });

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            visible: true,
            visible1: true,
            modalVisible: false,
            username: '',
            password: '',
            repassword: '',
            email: '',
            mobile: '',
            rcode: '',
            refferal:'',
            inputBorderColor: Colors.medium_gray,
            inputBorderColor2: Colors.medium_gray,
            inputBorderColor3: Colors.medium_gray,
            inputBorderColor4: Colors.medium_gray,
            inputBorderColor5: Colors.medium_gray,
            inputBorderColor6: Colors.medium_gray,
            inputBorderColor7: Colors.medium_gray,

        };
    }

    setModalVisible(visible) {

        this.setState({ modalVisible: visible, });
    }

    camera() {

        ImagePicker.openCamera({
            multiple: false,
            includeBase64: true,
            waitAnimationEnd: false,
            
            loading: true,
            forceJpg: true,
            maxFiles: 1,
            compressImageQuality: 0.5,
            mediaType: 'photo',
           
        }).then(images => {
         
            console.log('Temp data', images);
            let source = { uri: images.path };
           this.setState({
             avatarSource:images.data,
           });
            this.setState({
                modalVisible: false, loading: false
            });
        }).catch(e => {
            console.log('e', e);

            this.setState({
                modalVisible: false, loading: false
            });

            setTimeout(() => {
                Toast.show(e.toString(), Toast.LONG, )
            }, 100);
           
        }
        );
    }

    gallary() {

        ImagePicker.openPicker({
            multiple: false,
            includeBase64: true,
            waitAnimationEnd: false,
           
            loading: true,
            forceJpg: true,
            maxFiles: 1,
            compressImageQuality: 0.5,
            mediaType: 'photo',
            
        }).then(images => {
         
            console.log('Temp data', images);
           
           this.setState({
             avatarSource: images.data,
           });
            this.setState({
                modalVisible: false, loading: false
            });
        }).catch(e => {
            console.log('e', e);

            this.setState({
                modalVisible: false, loading: false
            });

            setTimeout(() => {
                Toast.show(e.toString(), Toast.LONG, )
            }, 100);
           
        }
        );
    }



    Register = () => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (!this.state.username) {
            Toast.show(
                "Please Enter name.",
                Toast.SHORT,
                
            );
        } else if (!this.state.password) {
            Toast.show(
                "Please Enter password",
                Toast.SHORT,
                
            );
        }  else if (this.state.password != this.state.repassword) {
            Toast.show(
                "Password do not match",
                Toast.SHORT,
                
            );
        } else if (!this.state.email.trim()) {
            Toast.show(
                "Please Enter an email address",
                Toast.SHORT,
                
            );
        }  else if (reg.test(this.state.email.trim()) === false) {
            Toast.show("Please Enter your email correctly..",Toast.SHORT,);
          } else if (!this.state.mobile) {
            Toast.show(
                "Please Enter mobile",
                Toast.SHORT,
                
            );
        } else {

           this.registrationAPI()
        }
    };



    registrationAPI = () => {

        this.setState({loading: true});
        AsyncStorage.getItem('id').then(id =>{
        AsyncStorage.getItem('token').then(token =>{
        
          var Request = {
           security:1,
           token: JSON.parse(token),
           name: this.state.username,
           password: this.state.password,
           ref_code: this.state.refferal,
           email: this.state.email.trim(),
           phone: this.state.mobile,
           profile: this.state.avatarSource

          
          };
          console.log(API.signup);
          console.log(JSON.stringify(Request));
          NetInfo.fetch().then(state => {
            if (state.isConnected) {
              timeout(
                15000,
                fetch(API.signup, {
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
                     AsyncStorage.setItem('id', JSON.stringify(res.id));
                     AsyncStorage.setItem('phone', this.state.mobile);
                     AsyncStorage.setItem('email', this.state.email);
                     AsyncStorage.setItem('name', this.state.username);
                   
                        AsyncStorage.setItem('password', this.state.password);
                     
                     AsyncStorage.setItem('profile', res.profile);
                     setTimeout(() => {
                        Toast.show(res.message,Toast.SHORT);
                      }, 200);
                       this.setState({ loading: false,}, ()=> {
                           setTimeout(() => {
                               
                          
                         const resetAction = StackActions.reset({
                           index: 0,
                           actions: [
                             NavigationActions.navigate({ routeName: "Home" })
                           ]
                         });
                         this.props.navigation.dispatch(resetAction);
                        }, 1000);
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

                            <Text style={{ fontFamily: Fonts.bold, fontSize: 18, color: Colors.white, marginTop: -10 }}>Sign up</Text>
                        </View>


                        <View style={{
                            flex: 1, elevation: 0, backgroundColor: Colors.acent,
                        }}>

                            <View style={{
                                flex: 1, backgroundColor: 'white',
                                borderTopRightRadius: 50, paddingHorizontal: 28
                            }}>

                                <View style={{ height: 96, width: 96, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop:30, marginVertical: 20 }}>

                                    <Image style={{
                                        height: '100%', width: '100%', borderRadius: 48,
                                        resizeMode: this.state.avatarSource ? 'cover' : 'contain'
                                    }}
                                        source={this.state.avatarSource ? {uri: 'data:image/jpeg;base64,'  +this.state.avatarSource} : require('../images/profile1.png')} />

                            <TouchableOpacity onPress={() => {
                                        this.setModalVisible(true)
                                    }}
                                    style={{
                                        alignSelf: 'flex-end', marginTop:-20,
                                        height: '20%', width: '20%', backgroundColor: Colors.white
                                    }}>
                                    <Image style={{
                                        alignSelf: 'flex-end', height: '100%', width: '100%',
                                        resizeMode: 'cover', tintColor: Colors.acent
                                    }}
                                        source={require('../images/Profile_14.png')} />
                                </TouchableOpacity>
                                </View>

                                <View style={{
                                    flexDirection: 'row', alignItems: 'center', width: '100%',
                                    borderBottomWidth: 1, borderColor: this.state.inputBorderColor
                                }}>
                                    <View style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: 20, width: 20
                                    }}>
                                        <Image
                                            resizeMode="contain"
                                            source={require('../images/Sign-up_07.png')}
                                            style={{ height: '100%', width: '100%' }} />
                                    </View>

                                    <TextInput
                                        placeholder="Name"
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
                                        onChangeText={username => this.setState({ username })}
                                        returnKeyType={"next"}
                                        onSubmitEditing={(event) => {
                                            this.refs.password.focus();
                                        }}

                                    />
                                </View>


                                <View style={{ height: 15 }}></View>

                                <View style={{
                                    flexDirection: 'row', borderBottomWidth: 1,
                                    alignItems: 'center', borderColor: this.state.inputBorderColor2
                                }} >

                                    <View style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: 20, width: 20
                                    }}>
                                        <Image
                                            resizeMode="contain"
                                            source={require('../images/Sign-up_10.png')}
                                            style={{ height: '100%', width: '100%' }} />
                                    </View>
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
                                            this.refs.repassword.focus();
                                        }}

                                    />

                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({ visible: !this.state.visible })
                                        }}
                                        style={{
                                            position: 'absolute', alignItems: 'center', right: 0,
                                            height: 30, width: 30
                                        }}>
                                        <Image
                                            resizeMode="contain"
                                            source={require('../images/Login_17.png')}
                                            style={{ height: '80%', width: '80%', tintColor: this.state.visible ? Colors.black : Colors.medium_gray }} />
                                    </TouchableOpacity>





                                </View>

                                <View style={{ height: 15 }}></View>

                                <View style={{
                                    flexDirection: 'row', borderBottomWidth: 1,
                                    alignItems: 'center', borderColor: this.state.inputBorderColor6,
                                }} >


                                    <View style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: 20, width: 20
                                    }}>

                                        <Image
                                            resizeMode="contain"
                                            source={require('../images/Sign-up_10.png')}
                                            style={{ height: '100%', width: '100%' }} />
                                    </View>
                                    <TextInput
                                        placeholder="Retype Password"
                                        selectionColor={Colors.primary}
                                        placeholderTextColor={Colors.medium_gray}
                                        style={[styles.textInput, {
                                            textAlignVertical: this.props.multiline ? "top" : "center",


                                        }]}
                                        autoCapitalize='none'
                                        // keyboardType={""}
                                        secureTextEntry={this.state.visible1}
                                        onFocus={() => this.setState({ inputBorderColor6: Colors.primary })}
                                        onBlur={() =>
                                            this.setState({ inputBorderColor6: Colors.medium_gray })
                                        }
                                        ref='repassword'
                                        onChangeText={repassword => this.setState({ repassword })}
                                        returnKeyType={"next"}
                                        onSubmitEditing={(event) => {
                                            this.refs.email.focus();
                                        }}

                                    />




                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({ visible1: !this.state.visible1 })
                                        }}
                                        style={{
                                            position: 'absolute', alignItems: 'center', right: 0,
                                            height: 30, width: 30
                                        }}>
                                        <Image
                                            resizeMode="contain"
                                            source={require('../images/Login_17.png')}
                                            style={{ height: '80%', width: '80%', tintColor: this.state.visible1 ? Colors.black : Colors.medium_gray }} />
                                    </TouchableOpacity>





                                </View>


                                <View style={{ height: 15 }}></View>
                                <View style={{
                                    flexDirection: 'row', alignItems: 'center',
                                    borderBottomWidth: 1, borderColor: this.state.inputBorderColor3
                                }}>
                                    <View style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: 20, width: 20
                                    }}>
                                        <Image
                                            resizeMode="contain"
                                            source={require('../images/Sign-up_21.png')}
                                            style={{ height: '100%', width: '100%' }} />
                                    </View>
                                    <TextInput
                                        placeholder="Email Address"
                                        selectionColor={Colors.primary}
                                        placeholderTextColor={Colors.medium_gray}
                                        style={[styles.textInput, {
                                            textAlignVertical: this.props.multiline ? "top" : "center",


                                        }]}
                                        keyboardType={"email-address"}
                                        autoCapitalize='none'
                                        keyboardType={"default"}
                                        onFocus={() => this.setState({ inputBorderColor3: Colors.primary })}
                                        onBlur={() =>
                                            this.setState({ inputBorderColor3: Colors.medium_gray })
                                        }
                                        ref='email'
                                        onChangeText={email => this.setState({ email })}
                                        returnKeyType={"next"}
                                        onSubmitEditing={(event) => {
                                            this.refs.phone.focus();
                                        }}

                                    />
                                </View>
                                <View style={{ height: 15 }}></View>
                                <View style={{
                                    flexDirection: 'row', alignItems: 'center',
                                    borderBottomWidth: 1, borderColor: this.state.inputBorderColor4
                                }}>
                                    <View style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: 20, width: 20
                                    }}>
                                        <Image
                                            resizeMode="contain"
                                            source={require('../images/Sign-up_26.png')}
                                            style={{ height: '100%', width: '100%' }} />
                                    </View>
                                    <TextInput
                                        placeholder="Mobile Number"
                                        selectionColor={Colors.primary}
                                        placeholderTextColor={Colors.medium_gray}
                                        style={[styles.textInput, {
                                            textAlignVertical: this.props.multiline ? "top" : "center",


                                        }]}
                                        keyboardType={"numeric"}
                                        autoCapitalize='none'
                                        onFocus={() => this.setState({ inputBorderColor4: Colors.primary })}
                                        onBlur={() =>
                                            this.setState({ inputBorderColor4: Colors.medium_gray })
                                        }
                                        ref='phone'
                                        onChangeText={mobile => this.setState({ mobile })}
                                        returnKeyType={"next"}
                                        onSubmitEditing={(event) => {
                                            this.refs.refferal.focus();
                                        }}

                                    />
                                </View>

                                <View style={{ height: 15 }}></View>
                                <View style={{
                                    flexDirection: 'row', alignItems: 'center',
                                    borderBottomWidth: 1, borderColor: this.state.inputBorderColor5
                                }}>
                                    <View style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: 20, width: 20
                                    }}>
                                        <Image
                                            resizeMode="contain"
                                            source={require('../images/Sign-up_30.png')}
                                            style={{ height: '100%', width: '100%' }} />
                                    </View>
                                    <TextInput
                                        placeholder="Enter refferal code"
                                        selectionColor={Colors.primary}
                                        placeholderTextColor={Colors.medium_gray}
                                        style={[styles.textInput, {
                                            textAlignVertical: this.props.multiline ? "top" : "center",


                                        }]}
                                        autoCapitalize='none'
                                        keyboardType={"default"}
                                        onFocus={() => this.setState({ inputBorderColor5: Colors.primary })}
                                        onBlur={() =>
                                            this.setState({ inputBorderColor5: Colors.medium_gray })
                                        }
                                        keyboardType={"number-pad"}
                                        ref='refferal'
                                        onChangeText={refferal => this.setState({ refferal })}
                                        returnKeyType={"next"}
                                        onSubmitEditing={(event) => {

                                        }}

                                    />
                                </View>

                                <View style={{ height: 40 }}></View>

                                <TouchableOpacity
                                    onPress={() => this.Register()}
                                  
                                    activeOpacity={0.8}
                                    style={{

                                        paddingVertical: Platform.OS == 'ios' ? 0 : 20,
                                        width: '80%', borderRadius: 40, elevation: 1,
                                        justifyContent: 'center', alignItems: 'center',
                                        alignSelf: 'center',
                                        backgroundColor: Colors.acent, height: '6.5%'
                                    }}>

                                    <Text style={{ fontFamily: Fonts.bold, fontSize: 18, color: Colors.white }}>Submit</Text>

                                </TouchableOpacity>


                                <View style={{ flexDirection: 'row', alignSelf: 'center', paddingVertical: 25 }}>
                                    <Text style={{ fontSize: 16, fontFamily: Fonts.Light }}>Already have an account?  </Text>

                                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('Login') }}>
                                        <Text style={{ fontSize: 16, fontFamily: Fonts.Regular, color: Colors.primary }}>Sign In</Text>
                                    </TouchableOpacity>

                                </View>




                                <View style={{ height: 50 }}></View>

                            </View>


                        </View>

                        <Modal
                            transparent={true}
                            animationType={"fade"}
                            visible={this.state.modalVisible}
                            onRequestClose={() => { }}
                        >
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: "rgba(0, 0, 0, 0.6)"
                                }}
                                activeOpacity={1}
                                onPressOut={() => {
                                    this.setModalVisible(!this.state.modalVisible);
                                }}
                            >
                                <View style={styles.ModalInsideView}>

                                    <TouchableWithoutFeedback onPress={this.camera.bind(this)}>

                                        <View
                                            style={{
                                                flex: 1,
                                                flexDirection: "column",
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }}
                                        >
                                            <Image
                                                source={require("../images/photo-camera.png")}
                                                style={{ tintColor: Colors.black, height: 40, width: 40 }}
                                            />
                                            <Text style={{ paddingTop: 10, color: Colors.black }}>
                                                Open Camera
                        </Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                    <View
                                        style={{
                                            width: 1,
                                            backgroundColor: Colors.colorPrimary,
                                            marginVertical: 35
                                        }}
                                    />
                                    <TouchableWithoutFeedback onPress={this.gallary.bind(this)}>
                                        <View
                                            style={{
                                                flex: 1,
                                                flexDirection: "column",
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }}
                                        >
                                            <Image
                                                source={require("../images/gallery.png")}
                                                style={{ tintColor: Colors.black, height: 40, width: 40 }}
                                            />
                                            <Text style={{ paddingTop: 10, color: Colors.black }}>
                                                Open Gallery
                                              </Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </TouchableOpacity>
                        </Modal>



                    </ScrollView>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({

    textInput: {
        paddingHorizontal: 10,
        width: '80%',
        paddingVertical: Platform.OS == 'ios' ? 8 : 8,
        paddingLeft:20,
        fontSize: 16,
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
    },
    ModalInsideView: {
        flexDirection: 'row',

        backgroundColor: "#fff",
        height: 140,
        width: '85%',
        borderRadius: 3,
        borderWidth: 1,
        borderColor: '#fff'

    },
});