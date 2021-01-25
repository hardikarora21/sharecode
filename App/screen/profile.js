
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

import { StackActions, NavigationActions, NavigationEvents } from "react-navigation";
import AsyncStorage from '@react-native-community/async-storage';

import Colors from '../common/Colors';
import Fonts from '../common/Fonts';
import Header from '../component/Header';
import ImagePicker from 'react-native-image-crop-picker';

import NetInfo from '@react-native-community/netinfo';
import API from '../common/Api';
import Loader from '../common/Loader';
import timeout from '../common/timeout';
import Toast from 'react-native-simple-toast';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'


const { width, height } = Dimensions.get('window')

export default class Profile extends Component {
    static navigationOptions = ({ navigation }) => ({
        header: null,
    });

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            visible: true,
            modalVisible: false,
            profile:null,
            visible1: true,
            username: '',
            cartCount : 0,
            password: '',
            password1:'',
            repassword: '',
            email: '',
            phone: '',
            ImageSource:null,
            inputBorderColor: Colors.medium_gray,
            inputBorderColor2: Colors.medium_gray,
            inputBorderColor3: Colors.medium_gray,
            inputBorderColor4: Colors.medium_gray,
            inputBorderColor5: Colors.medium_gray,
            inputBorderColor6: Colors.medium_gray,


        };
    }

    componentDidMount(){
        this.profileAPI()
      
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


    profileAPI = () => {

        this.setState({loading: true});
        AsyncStorage.getItem('id').then(id =>{
        AsyncStorage.getItem('token').then(token =>{
        
          var Request = {
           security:0,
           token: JSON.parse(token),
           id: id,


          
          };
          console.log(API.profile);
          console.log(JSON.stringify(Request));
          NetInfo.fetch().then(state => {
            if (state.isConnected) {
              timeout(
                15000,
                fetch(API.profile, {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify(Request)
                })
                  .then(res => res.json())
                  .then(res => {
                    console.log("notificaton RESPONCE:::  ", res);
                    if (res.status == "success") {
                   
                     
       
                       this.setState({ loading: false, password: res.data.password, password1: res.data.password, email: res.data.email,username: res.data.name, phone:res.data.phone,
                       profile: res.data.img},)
       
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



      profileUpdateAPI = () => {

        if(this.state.username == ""){
            Toast.show(
                "Please enter your name",
                Toast.SHORT,
                
              );
        } else if(this.state.password != this.state.password1 && this.state.repassword ==""){
            Toast.show(
                "Please enter your confirm password",
                Toast.SHORT,
                
              );
        } else if(this.state.password != this.state.repassword){
            Toast.show(
                "Password do not match",
                Toast.SHORT,
                
              );
        } else {

        this.setState({loading: true});
        AsyncStorage.getItem('id').then(id =>{
        AsyncStorage.getItem('token').then(token =>{
        
          var Request = {
           security:0,
           token: JSON.parse(token),
           id: id,
            name: this.state.username,
            profile: this.state.ImageSource,
            pass: this.state.password,
            cnf_pass : this.state.repassword
          
          };
          console.log(API.profile_update);
          console.log(JSON.stringify(Request));
          NetInfo.fetch().then(state => {
            if (state.isConnected) {
              timeout(
                15000,
                fetch(API.profile_update, {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify(Request)
                })
                  .then(res => res.json())
                  .then(res => {
                    console.log("notificaton RESPONCE:::  ", res);
                    if (res.status == "success") {
                   
                        Toast.show(res.message,Toast.SHORT,);
                        this.profileAPI();
                       this.setState({ loading: false, },)
                       AsyncStorage.setItem('password', this.state.password);
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
      }


    setModalVisible(visible) {

        this.setState({ modalVisible: visible, });
    }




    camera() {

        ImagePicker.openCamera({
            multiple: false,
            includeBase64: true,
            waitAnimationEnd: false,
            includeExif: true,
            loading: true,
            forceJpg: true,
            maxFiles: 1,
            compressImageQuality: 0.5,
            mediaType: '',
            mime: ""
        }).then(images => {
         
            console.log('Temp data', images);
         
           
           this.setState({
             ImageSource:images.data,
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
            includeExif: true,
            loading: true,
            forceJpg: true,
            maxFiles: 1,
            compressImageQuality: 0.5,
            mediaType: '',
            mime: ""
        }).then(images => {
         
            console.log('Temp data', images);
            let source = { uri: images.path };
           
           this.setState({
             ImageSource:images.data,
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

    Login = () => {
        if (!this.state.username) {
            Toast.show(
                "Please Enter Username.",
                Toast.SHORT,
                
            );
        }
        else if (!this.state.password) {
            Toast.show(
                "Please Enter password",
                Toast.SHORT,
                
            );
        } else {



            const resetAction = StackActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({ routeName: 'Home' })
                ],
            });
            this.props.navigation.dispatch(resetAction);
        }

    };
    onClick(index) {

    }


    render() {

        let imageName = require('../images/DeaultImageNoProfilePicture.png');
        if(this.state.ImageSource){
            imageName = {uri: 'data:image/jpeg;base64,' + this.state.ImageSource}
        } else if(this.state.profile){
            imageName = {uri: this.state.profile}
        } else {
            imageName = require('../images/DeaultImageNoProfilePicture.png');
        }

        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
                <NavigationEvents onDidFocus={()=> {
                      this.countFunction()
                    }} />
                <Header
                    Back={() => {
                        this.props.navigation.goBack();
                    }}
                    pageTitle={'Profile'}
                    iconName={require('../images/home_05.png')}
                    Notification={() => {
                        this.props.navigation.navigate('Notification')
                    }}
                    cartCount={this.state.cartCount}
                    Cart={() => {
                        this.props.navigation.navigate('Cart')
                    }}
                />
                <Loader loading={this.state.loading} />
                <KeyboardAwareScrollView>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        style={{ flex: 1 }}>





                        <View style={{
                            flex: 1, backgroundColor: 'white',
                            paddingHorizontal: 20
                        }}>

                            <View style={{ height: 96, width: 96, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginVertical: 20 }}>

                                <Image style={{
                                    height: '100%', width: '100%', borderRadius: 48,
                                    resizeMode: 'cover'
                                }}
                                source={imageName} />

                                <TouchableOpacity
                                    onPress={() => {
                                        this.setModalVisible(true)
                                    }}
                                    style={{
                                        alignSelf: 'flex-end',
                                        height: '20%', width: '20%',
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
                                    height: 30, width: 30
                                }}>
                                    <Image
                                        resizeMode="contain"
                                        source={require('../images/Sign-up_07.png')}
                                        style={{ tintColor: Colors.primary, height: '100%', width: '100%' }} />
                                </View>

                                <TextInput
                                    placeholder="Username"
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
                                    value={this.state.username}
                                    onChangeText={username => this.setState({ username })}
                                    returnKeyType={"next"}
                                    onSubmitEditing={(event) => {
                                        this.refs.password.focus();
                                    }}

                                />
                                <TouchableOpacity
                                    onPress={() => {
                                        // this.setState({ visible1: !this.state.visible1 })
                                    }}
                                    style={{
                                        position: 'absolute', alignItems: 'center', right: 8,
                                        height: 18, width: 18
                                    }}>
                                    <Image
                                        resizeMode="contain"
                                        source={require('../images/edit.png')}
                                        style={{ tintColor: Colors.primary, height: '100%', width: '100%' }} />
                                </TouchableOpacity>
                            </View>


                            <View style={{ height: 15 }}></View>

                            <View style={{
                                flexDirection: 'row', borderBottomWidth: 1,
                                alignItems: 'center', borderColor: this.state.inputBorderColor2
                            }} >

                                <View style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: 30, width: 30
                                }}>
                                    <Image
                                        resizeMode="contain"
                                        source={require('../images/Sign-up_10.png')}
                                        style={{ tintColor: Colors.primary, height: '100%', width: '100%' }} />
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
                                    value={this.state.password}
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
                                        style={{ tintColor: Colors.primary, height: '100%', width: '100%' }} />
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
                                    height: 30, width: 30
                                }}>

                                    <Image
                                        resizeMode="contain"
                                        source={require('../images/Sign-up_10.png')}
                                        style={{ tintColor: Colors.primary, height: '100%', width: '100%' }} />
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
                                    value={this.state.repassword}
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
                                        style={{ tintColor: Colors.primary, height: '100%', width: '100%' }} />
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
                                    height: 30, width: 30
                                }}>
                                    <Image
                                        resizeMode="contain"
                                        source={require('../images/Sign-up_21.png')}
                                        style={{ tintColor: Colors.primary, height: '100%', width: '100%' }} />
                                </View>
                                <TextInput
                                    placeholder="Email Address"
                                    selectionColor={Colors.primary}
                                    placeholderTextColor={Colors.medium_gray}
                                    style={[styles.textInput, {
                                        textAlignVertical: this.props.multiline ? "top" : "center",


                                    }]}
                                    autoCapitalize='none'
                                    keyboardType={"default"}
                                    onFocus={() => this.setState({ inputBorderColor3: Colors.primary })}
                                    onBlur={() =>
                                        this.setState({ inputBorderColor3: Colors.medium_gray })
                                    }
                                    ref='email'
                                    onChangeText={email => this.setState({ email })}
                                    returnKeyType={"next"}
                                    value={this.state.email}
                                    onSubmitEditing={(event) => {
                                        this.refs.phone.focus();
                                    }}

                                />
                                <TouchableOpacity
                                    onPress={() => {
                                        // this.setState({ visible1: !this.state.visible1 })
                                    }}
                                    style={{
                                        position: 'absolute', alignItems: 'center', right: 8,
                                        height: 18, width: 18
                                    }}>
                                    <Image
                                        resizeMode="contain"
                                        source={require('../images/edit.png')}
                                        style={{ tintColor: Colors.primary, height: '100%', width: '100%' }} />
                                </TouchableOpacity>
                            </View>

                            <View style={{ height: 15 }}></View>
                            <View style={{
                                flexDirection: 'row', alignItems: 'center',
                                borderBottomWidth: 1, borderColor: this.state.inputBorderColor4
                            }}>
                                <View style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: 30, width: 30
                                }}>
                                    <Image
                                        resizeMode="contain"
                                        source={require('../images/Sign-up_26.png')}
                                        style={{ tintColor: Colors.primary, height: '100%', width: '100%' }} />
                                </View>
                                <TextInput
                                    placeholder="Mobaile Address"
                                    selectionColor={Colors.primary}
                                    placeholderTextColor={Colors.medium_gray}
                                    style={[styles.textInput, {
                                        textAlignVertical: this.props.multiline ? "top" : "center",


                                    }]}
                                    autoCapitalize='none'
                                    keyboardType={"default"}
                                    onFocus={() => this.setState({ inputBorderColor4: Colors.primary })}
                                    onBlur={() =>
                                        this.setState({ inputBorderColor4: Colors.medium_gray })
                                    }
                                    ref='phone'
                                    onChangeText={phone => this.setState({ phone })}
                                    returnKeyType={"next"}
                                    value={this.state.phone}
                                    onSubmitEditing={(event) => {
                                        this.refs.refferal.focus();
                                    }}

                                />
                                <TouchableOpacity
                                    onPress={() => {
                                        // this.setState({ visible1: !this.state.visible1 })
                                    }}
                                    style={{
                                        position: 'absolute', alignItems: 'center', right: 8,
                                        height: 18, width: 18
                                    }}>
                                    <Image
                                        resizeMode="contain"
                                        source={require('../images/edit.png')}
                                        style={{ tintColor: Colors.primary, height: '100%', width: '100%' }} />
                                </TouchableOpacity>
                            </View>


                            <View style={{
                                flexDirection: 'row', alignSelf: 'center',
                                paddingVertical: 40
                            }}>


                                <TouchableOpacity onPress={() => { this.props.navigation.navigate('MyLocation'); }}>
                                    <Text style={{ textDecorationLine: 'underline', fontSize: 16, fontFamily: Fonts.bold, color: Colors.primary }}>My Saved Location</Text>
                                </TouchableOpacity>

                            </View>

                            <TouchableOpacity
                                // onPress={() => this.Login()}
                                onPress={() => {

                                    this.profileUpdateAPI()
                                }}
                                activeOpacity={0.8}
                                style={{

                                    paddingVertical: Platform.OS == 'ios' ? 0 : 18,
                                    width: '80%', borderRadius: 40, elevation: 1,
                                    justifyContent: 'center', alignItems: 'center',
                                    alignSelf: 'center',
                                    backgroundColor: Colors.acent, height: '7.6%'
                                }}>

                                <Text style={{ fontFamily: Fonts.bold, fontSize: 18, color: Colors.white }}>Update</Text>

                            </TouchableOpacity>






                            <View style={{ height: 50 }}></View>

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
                                                style={{ tintColor: Colors.black, height: 30, width: 30 }}
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
                                                style={{ tintColor: Colors.black, height: 30, width: 30 }}
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
        paddingVertical: Platform.OS == 'ios' ? 10 : 8,
        fontSize: 16,
        color: Colors.black,
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
    },
    label: {
        padding: 2,
        fontFamily: Fonts.regular,
        fontSize: 14,
        color: Colors.dark_gray,
        width: width * 0.3,
        paddingLeft: 15,
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

