
import React from 'react';
import {
    Text,
    View,
    SafeAreaView,
    FlatList,
    Dimensions,
    TouchableOpacity,
    Platform,
    Alert,
    Image
} from 'react-native';
import Colors from '../common/Colors';
import Header from '../component/Header';
import Fonts from '../common/Fonts';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
import {check, request, PERMISSIONS, openSettings, RESULTS} from 'react-native-permissions';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import { StackActions, NavigationActions, NavigationEvents } from "react-navigation";
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import API from '../common/Api';
import Loader from '../common/Loader';
import timeout from '../common/timeout';
import Toast from 'react-native-simple-toast';


export default class MyLocation extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            DataSource: [],
            cartCount : 0,
        }

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

    componentDidMount(){
        this.addressAPI()
    }

    placeFunc = (type) => {
      if(type == 1){
          return "Home";
      } else if(type == 2){
          return "Office";
      } else if(type == 3){
          return "Other";
      } else {
          return "Home";
      }
    }

    delAddress = (aid) => {
      this.setState({loading: true});
      AsyncStorage.getItem('id').then(id =>{
      AsyncStorage.getItem('token').then(token =>{
      
        var Request = {
         security:0,
         token: JSON.parse(token),
         id: id,
         aid: aid

        
        };
        console.log(API.address_delete);
        console.log(JSON.stringify(Request));
        NetInfo.fetch().then(state => {
          if (state.isConnected) {
            timeout(
              15000,
              fetch(API.address_delete, {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(Request)
              })
                .then(res => res.json())
                .then(res => {
                  console.log("address RESPONCE:::  ", res);
                  if (res.status == "success") {
                 
                    this.addressAPI()
     
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
                    this.setState({data: res, loading: false, message: res.message });
                   
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

    addressAPI = () => {

        this.setState({loading: true});
        AsyncStorage.getItem('id').then(id =>{
        AsyncStorage.getItem('token').then(token =>{
        
          var Request = {
           security:0,
           token: JSON.parse(token),
           id: id

          
          };
          console.log(API.address);
          console.log(JSON.stringify(Request));
          NetInfo.fetch().then(state => {
            if (state.isConnected) {
              timeout(
                15000,
                fetch(API.address, {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify(Request)
                })
                  .then(res => res.json())
                  .then(res => {
                    console.log("address RESPONCE:::  ", res);
                    if (res.status == "success") {
                   
                     
       
                       this.setState({ loading: false, DataSource: res.data },)
       
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

      getPermissions = () => {
        async function requestAll() {

            const Location = Platform.select({
                // android: PERMISSIONS.ANDROID.SYSTEM_ALERT_WINDOW,
                android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
                ios: PERMISSIONS.IOS.LOCATION_ALWAYS
            });
            const isLocation = await request(Location);
            return {isLocation};
        }
        requestAll().then(statuses => {
            if (statuses.isLocation == "granted") {
              if(Platform.OS == "ios"){
                this.props.navigation.navigate('AddAddress');
              } else {
                RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
                    .then(data => {
                        console.log(data);
                        this.props.navigation.navigate('AddAddress');
                        console.log(err);
                    });
            }
          }
            console.log(statuses)
        });
    }

    Permissions = () => {
        const Location = Platform.select({
            android: PERMISSIONS.ANDROID.SYSTEM_ALERT_WINDOW,
            android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
            ios: PERMISSIONS.IOS.LOCATION_ALWAYS
        });
        check(Location)
            .then(result => {
                switch (result) {
                    case RESULTS.UNAVAILABLE:
                        Toast.show("This feature is not available (on this device / in this context)", Toast.SHORT, Toast.BOTTOM);
                        break;
                    case RESULTS.DENIED:
                        this.getPermissions()
                        break;
                    case RESULTS.GRANTED:
                      if(Platform.OS == "android"){
                        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
                        .then(data => {
                            console.log(data);
                            this.props.navigation.navigate('AddAddress');     
                                                 }).catch(err => {
                            console.log(err);
                        });
                      } else {
                        this.props.navigation.navigate('AddAddress');  
                      }
                      
                        break;
                    case RESULTS.BLOCKED:
                        Toast.show("The permission is Blocked and not requestable anymore", Toast.SHORT, Toast.BOTTOM);
                        setTimeout(() => {
                            openSettings().catch(() => console.warn('cannot open settings'));
                        }, 2000);
                        break;
                }
            })
            .catch(error => {
                console.log('errror', error);
            });
    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }}>
                <NavigationEvents onDidFocus={()=> {
                    this.addressAPI();
                    this.countFunction()
                }} />
                <Loader loading={this.state.loading} />
                <Header
                    Back={() => {
                        this.props.navigation.goBack();
                    }}
                    pageTitle={'My location'}
                    iconName={require('../images/home_05.png')}
                    Notification={() => {
                        this.props.navigation.navigate('Notification')
                    }}
                    cartCount={this.state.cartCount}

                    Cart={() => {
                        this.props.navigation.navigate('Cart')
                    }}
                                        />
                <View style={{ flex: 1, backgroundColor: Colors.white }}>
<Text
 style={{fontFamily:Fonts.SemiBold,
 fontSize:16,paddingLeft: 10,paddingTop: 16,}}>
    Your Saved Location
</Text>
                    <FlatList
                        ListFooterComponent={() => <View style={{ height: height * 0.1 }} />}
                        showsVerticalScrollIndicator={false}
                        style={{ backgroundColor: 'white', paddingHorizontal:16 }}
                        extraData={this.state.refresh}
                        listKey={(item, index) => index.toString()}
                        data={this.state.DataSource}
                        renderItem={({ item, index }) => (
                          <View style={{ flex: 1, margin: 0,flexDirection:'row',alignItems:'center',justifyContent:'space-between' }}>

                                <TouchableOpacity
                                onPress={()=> {
                                    this.props.navigation.navigate('AddAddress', {item: item});
                                }}
                                    style={{
                                        flex: 1,
                                        paddingVertical: 16,
                                        flexDirection:'column',
                                        borderBottomWidth: this.state.DataSource.length - 1 == index ? 0 :2,
                                        borderBottomColor: Colors.light_gray
                                    }}>
                                       <Text
                                        numberOfLines={3}
                                        style={{
                                            fontFamily: Fonts.Regular,
                                            fontSize: 16,
                                            color: Colors.primary,
                                            paddingHorizontal: 0
                                        }}>
                                       {index+1}. {this.placeFunc(item.type)}</Text>



                                    <Text
                                        numberOfLines={3}
                                        style={{
                                            fontFamily: Fonts.Light,
                                            fontSize: 16,
                                            paddingHorizontal: 0
                                        }}>
                                      {item.flat}, {item.street}, {item.area}, {item.pin}.</Text>

                                    


                                </TouchableOpacity>

                                <TouchableOpacity
                                style={{paddingHorizontal:5}}
                                onPress={()=> {
                                  Alert.alert(
                                    "Are you sure want to delete?",
                                    "",
                                    [
                                      {
                                        text: "Cancel",
                                        onPress: () => console.log("Cancel Pressed"),
                                        style: "cancel"
                                      },
                                      { text: "OK", onPress: () => this.delAddress(item.id) }
                                    ],
                                    { cancelable: false }
                                  );
                                }}>

<Image source={require('../images/del.png')} resizeMode="contain" style={{height:22,width:22}}></Image>

                                </TouchableOpacity>

                            </View>
                        )}

                        keyExtractor={(item, index) => index.key}
                    />
                      <TouchableOpacity
                            // onPress={() => this.Login()}
                            onPress={() => {
                              this.getPermissions()
                            }}
                            activeOpacity={0.8}
                            style={{
                                width: '80%', borderRadius: 40, elevation: 1,
                                justifyContent: 'center', alignItems: 'center', alignSelf: 'center',
                                backgroundColor: Colors.acent, height: 60,
                                marginBottom:20
                            }}>

                            <Text style={{ fontFamily: Fonts.bold, fontSize: 18, color: Colors.white }}>Add location</Text>

                        </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }

}
