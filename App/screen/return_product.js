import React from 'react';
import {
    Text,
    View,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Dimensions,
    Image,
    Modal,
    StyleSheet,
    TouchableWithoutFeedback
} from 'react-native';
import Colors from '../common/Colors'

import ImagePicker from 'react-native-image-crop-picker';
import Header from '../component/Header'
import Fonts from '../common/Fonts';
import Line from '../common/Line';
const { width: width, height: height } = Dimensions.get('window');

import { StackActions, NavigationActions, NavigationEvents } from "react-navigation";
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import API from '../common/Api';
import Loader from '../common/Loader';
import timeout from '../common/timeout';
import Toast from 'react-native-simple-toast';
import moment from 'moment';


export default class ReturnProduct extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            modalVisible: false,
            product:'',
            bill:'',
            cartCount : 0,
            msg:'',
            type:''
        }
    }
    componentDidMount(){
       
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


    setModalVisible(visible) {

        this.setState({ modalVisible: visible, });
    }



    returnAPI = () => {
        if(this.state.msg == ''){
            Toast.show(
                "Please enter your message",
                Toast.SHORT,
                
              );
        } else if(this.state.product == '' && this.state.bill == ''){
            Toast.show(
                "Please add photo",
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
           msg: this.state.msg,
           product: this.state.product,
           bill: this.state.bill

          
          };
          console.log(API.return);
          console.log(JSON.stringify(Request));
          NetInfo.fetch().then(state => {
            if (state.isConnected) {
              timeout(
                15000,
                fetch(API.return, {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify(Request)
                })
                  .then(res => res.json())
                  .then(res => {
                    console.log("orders RESPONCE:::  ", res);
                    if (res.status == "success") {
                   
                        Toast.show(res.message,Toast.SHORT,);
                        setTimeout(() => {
                            const resetAction = StackActions.reset({
                                index: 0,
                                actions: [
                                  NavigationActions.navigate({ routeName: "Home" })
                                ]
                              });
                              this.props.navigation.dispatch(resetAction);
                        }, 1000);
                       this.setState({ loading: false,  },)
       
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
      }


    camera() {

        ImagePicker.openCamera({
            multiple: false,
            includeBase64: true,
            forceJpg: true,
            maxFiles: 1,
            compressImageQuality: 0.5,
           
        }).then(images => {
         
            console.log('Temp data', images);
            let source = { uri: images.path };
            if(this.state.type == 'bill'){
              
                this.setState({
                    bill:images.data,
                });
                 this.setState({
                     modalVisible: false, loading: false
                 });
            }else{
                this.setState({
                 product:images.data,
                });
                 this.setState({
                     modalVisible: false, loading: false
                 });
            }
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
            forceJpg: true,
            maxFiles: 1,
            compressImageQuality: 0.5,
           
        }).then(images => {
         
            console.log('Temp data', images);
           
            if(this.state.type == 'bill'){
               
                this.setState({
                    bill:images.data,
                });
                 this.setState({
                     modalVisible: false, loading: false
                 });
            }else{
                this.setState({
                 product:images.data,
                });
                 this.setState({
                     modalVisible: false, loading: false
                 });
            }
         
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

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }}>
                <View style={{flex: 1, backgroundColor: Colors.white}}>
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
                    cartCount={this.state.cartCount}
                    pageTitle={'Return product'}
                    iconName={require('../images/home_05.png')}
                    Notification={() => {
                        this.props.navigation.navigate('Notification')
                    }}
                    Cart={() => {
                        this.props.navigation.navigate('Cart')
                    }}
                />
                
                <ScrollView
                    showsVerticalScrollIndicator={false}>
                    <View style={{
                        flex: 1, backgroundColor: Colors.white,
                        alignItems: 'center'
                        , paddingHorizontal: 20,
                        paddingVertical: 20
                    }}>

                        <Text style={{
                            fontFamily: Fonts.Regular,
                            fontSize: 16,
                            // textAlign: 'left'
                        }}>Capture photo and return your product</Text>
                        <Line style={{ marginVertical: 10 }}></Line>

                        <TextInput
                            placeholder="type here"
                            selectionColor={Colors.primary}
                            placeholderTextColor={Colors.medium_gray}
                            style={{
                                
                                backgroundColor: Colors.viewBox,
                                height: height * 0.15,
                                width: '96%',
                                alignSelf:'center',
                                paddingHorizontal: 10,
                                textAlignVertical: "top",
                                color: Colors.black

                            }}
                            multiline={true}
                            autoCapitalize='none'
                            onChangeText={msg => this.setState({ msg })}
                            returnKeyType={"next"}
                            onSubmitEditing={(event) => {

                            }}
                        />

                        <View
                            style={{
                                flexDirection: 'row',
                                width: '100%',
                                paddingVertical: 40,
                                justifyContent: 'space-around'
                            }}>

<View style={{
height: height * 0.2 / 1.1,
width: width * 0.4 / 1.1,
backgroundColor: 'white',
elevation: 2,
}}>
<TouchableOpacity 
                            onPress={()=>{
                                this.setState({
                                    type:'product'
                                })
                                this.setModalVisible(true)
                            }}
                            activeOpacity={0.5}
                            style={{
                                height:'100%',
                                width:'100%',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>

<Image
                                    resizeMode="contain"
                                    style={{
                                        height:this.state.product?'100%':  '40%',
                                        width:this.state.product?'100%':  '40%',
                                    }}
                                    source={this.state.product? {uri: 'data:image/png;base64,' +this.state.product} :require('../images/addproductphoto.png')} />

                             {this.state.product?null:   <Text style={{
                                    fontFamily: Fonts.Regular,
                                    fontSize: 16,
                                    textAlign: 'center',
                                    paddingHorizontal:10,
                                }}>+ Add product photo</Text>}

                            </TouchableOpacity >


                         

</View>
                          
 
                           <View style={{
                                 height: height * 0.2 / 1.1,
                                 width: width * 0.4 / 1.1,
                                 backgroundColor: 'white',
                                 elevation: 2,
                           }}>
                           <TouchableOpacity 
                           onPress={()=>{
                               this.setState({
                                   type:'bill'
                               })
                            this.setModalVisible(true)
                           }}
                            activeOpacity={0.5}
                            style={{
                                height:'100%',
                                width:'100%',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>

<Image
                                    resizeMode="contain"
                                    style={{
                                        height:this.state.bill?'100%':  '40%',
                                        width:this.state.bill?'100%':  '40%',
                                    }}

                                    source={this.state.bill? {uri: 'data:image/png;base64,' +this.state.bill} :require('../images/addproductphoto.png')} />
                              
  {this.state.bill?null: 
                                <Text style={{
                                    fontFamily: Fonts.Regular,
                                    fontSize: 16,
                                    paddingHorizontal:10,
                                    textAlign: 'center'
                                }}>+ Add bill Photo</Text>}

                                

                            </TouchableOpacity>

                           
                     
                               </View> 

                       

                        </View>
                        <TouchableOpacity
                            // onPress={() => this.Login()}
                            onPress={() => {

                               this.returnAPI()
                            }}
                            activeOpacity={0.8}
                            style={{
                                width: '80%', borderRadius: 40, elevation: 1,
                                justifyContent: 'center', alignItems: 'center', alignSelf: 'center',
                                backgroundColor: Colors.acent, height: height * 0.2 / 3
                            }}>

                            <Text style={{ fontFamily: Fonts.bold, fontSize: 18, color: Colors.white }}>Submit</Text>

                        </TouchableOpacity>
                    </View>
                </ScrollView>
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

</View>

            </SafeAreaView>
        )
    }

}

const styles = StyleSheet.create({

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