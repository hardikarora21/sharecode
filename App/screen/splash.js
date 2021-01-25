
import React from 'react';
import {
     Text,
    View,
    Image,
    StatusBar,
    ImageBackground,
    Dimensions,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Linking
} from 'react-native';
import Colors from '../common/Colors';
import { StackActions, NavigationActions } from "react-navigation";
console.disableYellowBox = true;
import OneSignal from 'react-native-onesignal';

import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import API from '../common/Api';
import Loader from '../common/Loader';
import timeout from '../common/timeout';
import Fonts from '../common/Fonts';
const { width, height } = Dimensions.get('window')
import Toast from 'react-native-simple-toast';

const android_version = "1.3.3";
const ios_version = "1.0";
var androidurl = "";
var iosurl = "";

export default class Splash extends React.Component{
  constructor(props){
    super(props)
    this.state={
      modalVisible: false
    }

    OneSignal.init("77f702ce-8c8e-4ca8-a845-f4a08a3b9ea0", { kOSSettingsKeyAutoPrompt: true });
    console.log(OneSignal);

    this.onReceived = this.onReceived.bind(this);
    this.onOpened = this.onOpened.bind(this);
    this.onIds = this.onIds.bind(this);
    OneSignal.addEventListener('ids', this.onIds);
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);


    OneSignal.setLogLevel(7, 0);

    let requiresConsent = false;

    OneSignal.setRequiresUserPrivacyConsent(requiresConsent);

    OneSignal.setLocationShared(true);
    OneSignal.inFocusDisplaying(2);
    OneSignal.configure();
    OneSignal.setSubscription(true); 



  } 
  componentDidMount(){
    this.onReceived = this.onReceived.bind(this);
    this.onOpened = this.onOpened.bind(this);
    this.onIds = this.onIds.bind(this);
  // this.appVersion()
    }
    onReceived(notification) { }
  
    onOpened(openResult) { }

    onIds(device) {
      console.log(device);
      AsyncStorage.getItem('token').then(token => {
        if(device.userId){
        
            if(token){
              this.appVersion();
            } else {
              AsyncStorage.setItem("token", JSON.stringify(device.userId))
              this.appVersion()
            }
          
        }
      })
  
    }

    setModalVisible(visible){
      this.setState({modalVisible: visible})
    }


    loginAPI = () => {
      this.setState({loading: true});
   AsyncStorage.getItem('id').then(id =>{
   AsyncStorage.getItem('token').then(token =>{
    AsyncStorage.getItem('email').then(email =>{
      AsyncStorage.getItem('password').then(password =>{
       
  
      if(id){
     var Request = {
      security:0,
      token: JSON.parse(token),
      id: id,
      username: email,
      password: password,
     
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
                AsyncStorage.setItem('password', password);
                AsyncStorage.setItem('profile', res.profile);

               
                AsyncStorage.setItem('wallet', res.wallet);
         
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
            
                 this.setState({data: res, loading: false });
                 this.setState({ loading: false,}, ()=> {
                  const resetAction = StackActions.reset({
                    index: 0,
                    actions: [
                      NavigationActions.navigate({ routeName: "Login" })
                    ]
                  });
                  this.props.navigation.dispatch(resetAction);
                })
               }
             })
             .catch(e => {
               this.setState({ loading: false });
               console.log(e);
               this.setState({ loading: false,}, ()=> {
                const resetAction = StackActions.reset({
                  index: 0,
                  actions: [
                    NavigationActions.navigate({ routeName: "Login" })
                  ]
                });
                this.props.navigation.dispatch(resetAction);
              })
             })
         ).catch(e => {
           console.log(e);
           this.setState({ loading: false });
           this.setState({ loading: false,}, ()=> {
            const resetAction = StackActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({ routeName: "Login" })
              ]
            });
            this.props.navigation.dispatch(resetAction);
          })
         });
       } else {
         this.setState({ loading: false });
  
         this.setState({ loading: false,}, ()=> {
          const resetAction = StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({ routeName: "Login" })
            ]
          });
          this.props.navigation.dispatch(resetAction);
        })
       }
     });
    } else {
      this.setState({ loading: false,}, ()=> {
        setTimeout(()=> {
        const resetAction = StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: "Login" })
          ]
        });
        this.props.navigation.dispatch(resetAction);
      }, 3000)
      })
      
    }
   })
  })
   })
  })
    }
  
  
    checklogin = () => {
      AsyncStorage.getItem('id').then(id=> {
  if(id){
   this.loginAPI();
  
  } else {
    setTimeout(() => {
      const resetAction = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: "Login" })
        ]
      });
      this.props.navigation.dispatch(resetAction);
    }, 2000);
  
  }
     
  })
    }
  
  
    appVersion = () => {
      AsyncStorage.getItem('id').then(id =>{
      AsyncStorage.getItem('token').then(token =>{
        AsyncStorage.getItem('ifirst').then(ifirst=> {
        var Request = {
         security:1
        };
  
        console.log(JSON.stringify(Request));
        NetInfo.fetch().then(state => {
          if (state.isConnected) {
            timeout(
              15000,
              fetch(API.app_version, {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(Request)
              })
                .then(res => res.json())
                .then(res => {
                  console.log("App Version RESPONCE:::  ", res);
                  if (res.status == "success") {
                  
                    
                      AsyncStorage.setItem('Logo', res.logo); 
                      AsyncStorage.setItem('payapi_key', res.payapi_key)
                      AsyncStorage.setItem('android_url', res.android_url);
                      AsyncStorage.setItem('ios_url', res.ios_url);
                      AsyncStorage.setItem('cancel_order', JSON.stringify(res.cancel_order));
                      androidurl = res.android_url;
                      iosurl = res.ios_url;
                      
                    
                      
                         
                        
                   
    
                      if(res.maintenance == 1){
                        setTimeout(()=> {
                 
                          const resetAction = StackActions.reset({
                            index: 0,
                            actions: [NavigationActions.navigate({ routeName: 'Maintenance' })],
                        });
                         this.props.navigation.dispatch(resetAction);
                        }, 1000)
                      } else {
                        if(Platform.OS == 'android'){
                          if (android_version != res.android_version) {
    
                            this.setModalVisible(true);
                          }
                           else {
                            const resetAction = StackActions.reset({
                              index: 0,
                              actions: [
                                NavigationActions.navigate({ routeName: "Home" })
                              ]
                            });
                            this.props.navigation.dispatch(resetAction);
                          } 
                        } else{
                          if (ios_version != res.ios_version) {
    
                            this.setModalVisible(true);
                          }
                           else {
                            this.checklogin()
                          } 
                        }
                       
    
    
                      }
  
  
                   
  
               
              
               
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
                    setTimeout(()=> {
                     
                      const resetAction = StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({ routeName: 'Login' })],
                    });
                this.props.navigation.dispatch(resetAction);
                    }, 1000)
                  
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
              
            );
          }
        });
      })
    })
  })
    }
  


    render(){
        return(
            // <SafeAreaView style={{ flex: 1}}>
              <ImageBackground 
             resizeMode="stretch"
              source={require('../images/Splash.png')}
              style={{height:'100%',width:'100%',justifyContent:'center',alignItems:'center'}}>
                 <StatusBar
                    hidden />
               <Image
               resizeMode={'contain'} 
               style={{ height: height*0.50, width: width*0.8 }}
                    source={require('../images/logo.png')} />

<Modal
        ref= {"updateModal"}
          style={{
              justifyContent:'center',
              alignItems:'center',


          }}
          visible={this.state.modalVisible}
          position = 'bottom'
          backdrop={true}
          coverScreen={true}
          backdropPressToClose={false}
          backdropOpacity = {0.5}
          transparent={true}
          swipeToClose={false}
          onRequestClose={() => {
      //        alert('Modal Closed');
          }}
        >


      <View style={styles.ModalContainer}>
      <View style={styles.netAlert}>





      <View style={styles.netAlertContent}>
      <View style={{ alignItems:'center', justifyContent:'flex-start', marginTop:10 }}>
   
     
   <Image
             style={{
             
             }}
             resizeMode='cover'
             source={require("../images/update.png")}
             style={{ width: width, height:width , }}
           />
    
</View>
      <Text style={styles.netAlertTitle}>
        Updated Required
      </Text>
      <Text style={styles.netAlertDesc}>
        Please update our app for an improved experience!! This version is no longer supported.
      </Text>
      </View>
 
    
     
    <TouchableOpacity onPress={()=> this.get()} style={{padding:10, marginHorizontal: width*.08, backgroundColor: Colors.primary, marginVertical:20, borderTopRightRadius:5, borderBottomLeftRadius:5, borderTopLeftRadius:15, borderBottomRightRadius:15}}>
           <Text style={{textAlign:'center', color: Colors.white, fontSize:16, fontFamily: Fonts.bold}}>Upgrade Now</Text>
         </TouchableOpacity>
      </View>

        </View>

      </Modal>

              </ImageBackground>
            // </SafeAreaView>
    )
}

  get = () => {
    
    if (Platform.OS == "android") {
      Linking.openURL(androidurl);
    } else if(Platform.OS == "ios"){
      Linking.openURL(iosurl);
    }
  };

}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    flex: 1,
    backgroundColor: Colors.white,
    paddingTop: Platform.OS === "ios" ? 0 : 0
  },
  ModalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  netAlert: {
    overflow: "hidden",
    borderRadius: 10,
    shadowRadius: 10,
    width: width ,
    height: height,
    borderColor:"#f1f1f1",
    borderWidth:1,
    backgroundColor: Colors.white
  },
  netAlertContent: {
    flex: 1,
    padding: 20

    //  marginTop:20,
  },
  netAlertTitle: {
    fontSize: 20,
    paddingTop:20,
    color: Colors.primary,
    textAlign:'center',
    fontFamily: Fonts.bold,
  },
  netAlertDesc: {
    fontSize: 16,
    paddingTop:10,
    alignSelf: 'center',
    width: width*.8,
    color: Colors.dark_gray,
    fontFamily: Fonts.light,
    paddingVertical: 5,
    textAlign:'center'
  }
});
