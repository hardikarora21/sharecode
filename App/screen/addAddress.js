
import React, { Component } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
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
import Header from '../component/Header';
import Fonts from '../common/Fonts';
const { width, height } = Dimensions.get('window')
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import Geolocation from '@react-native-community/geolocation';
import MapView, {PROVIDER_GOOGLE}  from 'react-native-maps';
import { StackActions, NavigationActions, NavigationEvents } from "react-navigation";
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import API from '../common/Api';
import Loader from '../common/Loader';
import timeout from '../common/timeout';
import Toast from 'react-native-simple-toast';
var radioItems = [
    {
      label: "Home",
      size: 20,
      color: "#333333",
      type:1,
      selected: true,
    },
    {
      label: "Office",
      color: "#333333",
      size: 20,
      type:2,
      selected: false
    },
    {
      label: "Other",
      color: "#333333",
      size: 20,
      type:3,
      selected: false
      },
  ];

export default class AddAddress extends Component {
    static navigationOptions = ({ navigation }) => ({
        header: null,
    });

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            MapVisible: true,
            visible: true,
            cartCount : 0,
            flat: '',
            street: '',
            type:1,
            area: '',
            pin: '',
            lat:null,
            lng: null,
            inputBorderColor: Colors.medium_gray,
            inputBorderColor2: Colors.medium_gray,
            inputBorderColor3: Colors.medium_gray,
            region: {
                latitude: 10,
                longitude: 10,
                latitudeDelta: 0.001,
                longitudeDelta: 0.001
            },
            isMapReady: false,
            Modalvisible:false,
            marginTop: 1,
            userLocation: "",
            regionChangeProgress: false
        };
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
    radioItems.map(item => {
        if (item.selected == true) {
          this.setState({ selectedItem: item.label, type: item.type }, ()=> {
            this.setState({refresh: !this.state.refresh})
          });
        }
      });
    if (this.props.navigation.state.params) {
        this.setState({
            flat: this.props.navigation.state.params.item.flat,
            street: this.props.navigation.state.params.item.street,
            area: this.props.navigation.state.params.item.area,
            type: this.props.navigation.state.params.item.type ? this.props.navigation.state.params.item.type : 1,
            pin: this.props.navigation.state.params.item.pin,
            lat: Number(this.props.navigation.state.params.item.lat),
            lng: Number(this.props.navigation.state.params.item.lon),
            region: {
                latitude: Number(this.props.navigation.state.params.item.lat),
                longitude: Number(this.props.navigation.state.params.item.lon),
                latitudeDelta: 0.001,
                longitudeDelta: 0.001
            },
        }, ()=> {
            this.changeActiveRadioButton(this.state.type - 1);
            if(this.state.lat && this.state.lng){

            } else {
                Geolocation.getCurrentPosition(
                    (position) => {
                        const region = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            latitudeDelta: 0.001,
                            longitudeDelta: 0.001
                        };
                        this.setState({
                            region: region,
                            MapVisible: false,
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                            refresh: !this.state.refresh,
                            error: null,
                        });
                    },
                    (error) => {
                        console.log('eeeeee', error);
                        // Toast.show(
                        //         `${error}`,
                        //         Toast.SHORT,
                        //     );
                        this.setState({
                            error: error.message,
                            MapVisible: false
                        })
                    },
                    { enableHighAccuracy: false, timeout: 20000, maximumAge: 3600000 },
                );
            }
        })
    } else {
        Geolocation.getCurrentPosition(
            (position) => {
                const region = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001
                };
                this.setState({
                    region: region,
                    MapVisible: false,
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    refresh: !this.state.refresh,
                    error: null,
                });
            },
            (error) => {
                console.log('eeeeee', error);
                // Toast.show(
                //         `${error}`,
                //         Toast.SHORT,
                //     );
                this.setState({
                    error: error.message,
                    MapVisible: false
                })
            },
            { enableHighAccuracy: false, timeout: 20000, maximumAge: 3600000 },
        );
    }
}

  Save = () => {
    if (this.state.flat == '') {
        Toast.show(
            "Please enter yout flat no.",
            Toast.SHORT,
            
        );
    }
    else if (this.state.street == '') {
        Toast.show(
            "Please enter your street",
            Toast.SHORT,
            
        );
    } else if (this.state.area == '') {
        Toast.show(
            "Please enter your area",
            Toast.SHORT,
            
        );
    } else if (this.state.pin == '') {
        Toast.show(
            "Please enter your pin",
            Toast.SHORT,
            
        );
    } else {

      this.AddAddressAPI()

      
    }
  }

  changeActiveRadioButton(index) {
      console.log(index);
      if(index >= 0){
    radioItems.map(item => {
      item.selected = false;
    });
console.log(index);

    radioItems[index].selected = true;

    this.setState({ radioItems: radioItems }, () => {
      this.setState({ selectedItem: radioItems[index].label, type: radioItems[index].type  }, () => {

      });
    });
} else {
    radioItems.map(item => {
        item.selected = false;
      });
  
  
      radioItems[0].selected = true;
  
      this.setState({ radioItems: radioItems }, () => {
        this.setState({ selectedItem: radioItems[0].label, type: radioItems[0].type  }, () => {
  
        });
      });
}
  }



  AddAddressAPI = () => {

    this.setState({loading: true});
    AsyncStorage.getItem('id').then(id =>{
    AsyncStorage.getItem('token').then(token =>{
    
      var Request = {
       security:0,
       token: JSON.parse(token),
       id: id,
       aid: this.props.navigation.state.params ? this.props.navigation.state.params.item.id : null,
       flat: this.state.flat,
       street: this.state.street,
       area: this.state.area,
       lat:this.state.lat,
       lon:this.state.lng,
       pin: this.state.pin,
       type: this.state.type
      
      };
      console.log(API.add_address);
      console.log(JSON.stringify(Request));
      NetInfo.fetch().then(state => {
        if (state.isConnected) {
          timeout(
            15000,
            fetch(API.add_address, {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
              },
              body: JSON.stringify(Request)
            })
              .then(res => res.json())
              .then(res => {
                console.log("add address RESPONCE:::  ", res);
                if (res.status == "success") {
                    setTimeout(() => {
                        Toast.show(res.message,Toast.SHORT,);
                        this.props.navigation.goBack()
                    }, 200);
                    
                    
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
             
                    setTimeout(() => {
                        Toast.show(res.message,Toast.SHORT,);
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
  



onMapReady = () => {
    this.setState({ isMapReady: true, marginTop: 0 });
}

fetchAddress = () => {
    fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" + this.state.region.latitude + "," + this.state.region.longitude + "&key=" + "AIzaSyDrBjw4t_DswmVlBI2b-XJcI-gpO-wYVuM")
        .then((response) => response.json())
        .then((responseJson) => {
            console.log('responseJson', responseJson);

            if (responseJson.status == 'OK') {
                console.log('userLocation', responseJson.results[0]);
                this.setState({
                    lat: responseJson.results[0].geometry.location.lat,
                    lng: responseJson.results[0].geometry.location.lng,
                    flat: responseJson.results[0].address_components[0].long_name,
                    street: responseJson.results[0].address_components[1].long_name + responseJson.results[0].address_components[2].long_name,
                    area: responseJson.results[0].address_components[responseJson.results[0].address_components.length - 4].long_name + " " +
                        responseJson.results[0].address_components[responseJson.results[0].address_components.length - 3].long_name + " " +
                        responseJson.results[0].address_components[responseJson.results[0].address_components.length - 2].long_name + " " +
                        responseJson.results[0].address_components[responseJson.results[0].address_components.length - 1].long_name,
                    regionChangeProgress: false,
                    //  pin: responseJson.results[0].address_components[responseJson.results[0].address_components.length - 1].long_name,
                });
            } else {

            }
        })
        .catch(e => {
            console.log(e);
            Toast.show(
                'Request Time Out',
                Toast.SHORT,
            );
        });
}

onRegionChange = region => {
    console.log('fff');
    this.setState({
        region: region, lat: region.latitude, lng: region.longitude,
            regionChangeProgress: true
    }, () => {
        if(this.props.navigation.state.params){

        } else {
            this.fetchAddress()
        }
    });
}

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
                
<NavigationEvents onDidFocus={()=> {
                      this.countFunction()
                    }} />
                <StatusBar hidden />
                <Loader loading={this.state.loading} />
                <KeyboardAvoidingView
                    behavior={Platform.OS == 'ios' ? 'padding' : null}
                    style={{ flex: 1, backgroundColor: Colors.white, }}>

                    <Header
                    Back={() => {
                        this.props.navigation.goBack();
                    }}
                    pageTitle={'Delivery Address'}
                    iconName={require('../images/home_05.png')}
                    Notification={() => {
                        this.props.navigation.navigate('Notification')
                    }}
                     
                    cartCount={this.state.cartCount}
                    Cart={() => {
                        this.props.navigation.navigate('Cart')
                    }}
                />


{this.state.lat && this.state.lng ?
                              <>
                              {Platform.OS == 'ios' ?
                              <MapView
                                  style={{flex: 1}}
                                  provider={PROVIDER_GOOGLE}
                                  region={this.state.region}
                               
                                  onRegionChangeComplete={this.onRegionChange}>
                              </MapView>
                              : 
                              <MapView
                              style={{flex: 1}}
                              provider={PROVIDER_GOOGLE}
                              region={this.state.region}
                              pointerEvents="none"
                              onRegionChangeComplete={this.onRegionChange}>
                          </MapView>
                                 }
                                 </>
                                : null
                            }
                            <View style={{
                                left: '47%',
                                position: 'absolute',
                                top: '26%'
                            }}>
                                <Image
                                    resizeMode={'contain'}
                                    source={require('../images/location.png')}
                                    style={{ height: 27, width: 27, tintColor: 'red' }} />
                            </View>
                       
                    
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        style={{ flex: 1 }}>

                      


                        <View style={{
                            flex: 1, elevation: 0, backgroundColor: Colors.acent,

                        }}>

                            <View style={{
                                flex: 1, backgroundColor: 'white',
                              paddingHorizontal: 30
                            }}>

                                <Text style={{
                                    fontSize:18,
                                    marginVertical:20,
                                    fontFamily:Fonts.SemiBold,
                                    color:Colors.primary
                                }}>
                                    Please add below details
                                </Text>

                              
                                <View style={{
                                    flexDirection: 'row', alignItems: 'center', width: '100%',
                                    borderBottomWidth: 1, borderColor: this.state.inputBorderColor
                                }}>
                                   

                                    <TextInput
                                        placeholder="Flat number"
                                        selectionColor={Colors.primary}
                                        placeholderTextColor={Colors.medium_gray}
                                        style={[styles.textInput, {
                                            textAlignVertical: this.props.multiline ? "top" : "center",


                                        }]}
                                        value={this.state.flat}
                                        autoCapitalize='none'
                                        keyboardType={"default"}
                                        onFocus={() => this.setState({ inputBorderColor: Colors.primary })}
                                        onBlur={() =>
                                            this.setState({ inputBorderColor: Colors.medium_gray })
                                        }
                                        onChangeText={flat => this.setState({ flat })}
                                        returnKeyType={"next"}
                                        onSubmitEditing={(event) => {
                                            this.refs.street.focus();
                                        }}

                                    />
                                </View>


                                <View style={{ height: 15 }}></View>

                                <View style={{
                                    flexDirection: 'row', borderBottomWidth: 1,
                                    alignItems: 'center', borderColor: this.state.inputBorderColor2
                                }} >

                                 
                                    <TextInput
                                        placeholder="Street"
                                        selectionColor={Colors.primary}
                                        placeholderTextColor={Colors.medium_gray}
                                        style={[styles.textInput, {
                                            textAlignVertical: this.props.multiline ? "top" : "center",


                                        }]}
                                        value={this.state.street}
                                        autoCapitalize='none'
                                        // keyboardType={""}
                                       
                                        onFocus={() => this.setState({ inputBorderColor2: Colors.primary })}
                                        onBlur={() =>
                                            this.setState({ inputBorderColor2: Colors.medium_gray })
                                        }
                                        ref='street'
                                        onChangeText={street => this.setState({ street })}
                                        returnKeyType={"next"}
                                        onSubmitEditing={(event) => {
                                            this.refs.area.focus();
                                        }}

                                    />

                                  

                                </View>

                                <View style={{ height: 15 }}></View>

                                <View style={{
                                    flexDirection: 'row', borderBottomWidth: 1,
                                    alignItems: 'center', borderColor: this.state.inputBorderColor3,
                                }} >


                                    <TextInput
                                        placeholder="Area"
                                        selectionColor={Colors.primary}
                                        placeholderTextColor={Colors.medium_gray}
                                        style={[styles.textInput, {
                                            textAlignVertical: this.props.multiline ? "top" : "center",


                                        }]}
                                        value={this.state.area}
                                        autoCapitalize='none'
                                        // keyboardType={""}
                                       
                                        onFocus={() => this.setState({ inputBorderColor3: Colors.primary })}
                                        onBlur={() =>
                                            this.setState({ inputBorderColor3: Colors.medium_gray })
                                        }
                                        ref='area'
                                        onChangeText={area => this.setState({ area })}
                                        returnKeyType={"next"}
                                        onSubmitEditing={(event) => {
                                            this.refs.pin.focus();
                                        }}

                                    />


                                </View>


                                <View style={{ height: 15 }}></View>
                        
                                <View style={{
                                    flexDirection: 'row', alignItems: 'center',
                                    borderBottomWidth: 1, borderColor: this.state.inputBorderColor3
                                }}>
                                   
                                    <TextInput
                                        placeholder="Pin"
                                        selectionColor={Colors.primary}
                                        placeholderTextColor={Colors.medium_gray}
                                        style={[styles.textInput, {
                                            textAlignVertical: this.props.multiline ? "top" : "center",


                                        }]}
                                        value={this.state.pin}
                                        autoCapitalize='none'
                                        keyboardType={"numeric"}
                                        onFocus={() => this.setState({ inputBorderColor3: Colors.primary })}
                                        onBlur={() =>
                                            this.setState({ inputBorderColor3: Colors.medium_gray })
                                        }
                                        ref='pin'
                                        onChangeText={pin => this.setState({ pin })}
                                        returnKeyType={"next"}
                                        onSubmitEditing={(event) => {
                                            
                                        }}

                                    />
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical:15 }} refresh={this.state.refresh}>
                {radioItems.map((item, key) => (
                  <RadioButton
                    key={key}
                    button={item}
                    onClick={this.changeActiveRadioButton.bind(this, key)}
                  />
                ))}
              </View>
                                <View style={{ height: 40 }}></View>

                                <TouchableOpacity
                                    // onPress={() => this.Login()}
                                    onPress={() => {
                                       
                                      this.Save()
                                    }}
                                    activeOpacity={0.8}
                                    style={{

                                        paddingVertical: 20,
                                        width: '80%', borderRadius: 40, elevation: 1,
                                        justifyContent: 'center', alignItems: 'center',
                                        alignSelf: 'center',
                                        backgroundColor: Colors.acent,
                                    }}>

                                    <Text style={{ fontFamily: Fonts.bold, fontSize: 18, color: Colors.white }}>Submit</Text>

                                </TouchableOpacity>



                                <View style={{ height: 50 }}></View>

                            </View>


                        </View>

                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }
}


class RadioButton extends Component {
    render() {
      return (
        <TouchableOpacity
          onPress={this.props.onClick}
          activeOpacity={0.8}
          style={[
            { flexDirection: "row", width: width * 0.3 },
            styles.radioButton
          ]}
        >
          <View
            style={[
              styles.radioButtonHolder,
              {
                flexDirection: "row",
                height: this.props.button.size,
                width: this.props.button.size,
                borderColor: this.props.button.color
              }
            ]}
          >
            {this.props.button.selected ? (
              <View
                style={[
                  styles.radioIcon,
                  {
                    flexDirection: "row",
                    height: this.props.button.size / 2,
                    width: this.props.button.size / 2,
                    backgroundColor: Colors.primary
                  }
                ]}
              />
            ) : null}
          </View>
          <Text style={[styles.label, { color: Colors.black }]}>
            {this.props.button.label}
          </Text>
        </TouchableOpacity>
      );
    }
  }



const styles = StyleSheet.create({

    textInput: {
        paddingHorizontal: 10,
        width: '80%',
        paddingVertical:8,
        color: Colors.black,
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
    },
    radioButton: {
        //  flexDirection: 'row',
        margin: 0
      },
    radioButtonHolder: {
        borderRadius: 50,
        borderWidth: 1.5,
        justifyContent: "center",
        alignItems: "center"
    },
    radioIcon: {
        //  flexDirection:'row',
        borderRadius: 50
    },
    
      label: {
        top: 0,
        marginLeft: 10,
        fontSize: 16
      },
      item: {
        width: width * 0.9,
        flexDirection: "row"
      },
      line: {
        flex: 1,
        height: 0.3,
        backgroundColor: "transparent"
      }
});