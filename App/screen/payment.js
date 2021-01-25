import React, {Component} from "react";
import {
    Text,
    View,
    SafeAreaView,
    Image,
    Dimensions,
    TouchableOpacity,
    StyleSheet,Alert
} from 'react-native';

import Colors from '../common/Colors';
import Header from '../component/Header';
import Fonts from '../common/Fonts';
import Line from '../common/Line';
import { ScrollView } from 'react-native-gesture-handler';
import API from '../common/Api';
import timeout from '../common/timeout';
import Loader from '../common/Loader';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from "@react-native-community/netinfo";
import { StackActions, NavigationActions, NavigationEvents } from "react-navigation";
import RazorpayCheckout from 'react-native-razorpay';

var radioItems = [
  {
    label: "Online",
    size: 20,
    color: "#333333",
    selected: true,
  },
  {
    label: "COD",
    color: "#333333",
    size: 20,
    selected: false
  }
];

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
export default class Payment extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            CheckData: false,
            walletBalance:0,
            wallet:0,
            pay_wallet:0,
            cartCount : 0,
            is_wallet:0,
             finalPrice : this.props.navigation.state.params.finalPrice,
             errorText:'',
             pay_id:'',
             cod: null,
             selectedItem:''
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


    radioItems = [
      {
        label: "Online",
        size: 20,
        color: "#333333",
        selected: true,
      },
      {
        label: "COD",
        color: "#333333",
        size: 20,
        selected: false
      }
    ];
  this.setState({
    
    CheckData: false,
   
   
    pay_wallet: 0,
    cartCount: 0,
    is_wallet: 0,
    finalPrice: this.props.navigation.state.params.finalPrice,
    errorText: '',
    pay_id: '',
    cod: null,
    selectedItem: '',
   
  }, ()=> {
    this.wallet();
  })
  radioItems.map(item => {
    if (item.selected == true) {
      this.setState({ selectedItem: item.label }, ()=> {
        this.setState({refresh: !this.state.refresh})
      });
    }
  });


    }


    componentDidMount() {
      {
        radioItems.map(item => {
          if (item.selected == true) {
            this.setState({selectedItem: item.label});
          }
        });
      }
      this.wallet();
         }
    
    
         wallet = () => {
           this.setState({loading: true});
          AsyncStorage.getItem('id').then(id =>{
          AsyncStorage.getItem('token').then(token =>{
          
            var Request = {
             security:0,
             id: JSON.parse(id),
             token: JSON.parse(token),
            
            };
            console.log(API.wallet);
            console.log(JSON.stringify(Request));
            NetInfo.fetch().then(state => {
              if (state.isConnected) {
                timeout(
                  15000,
                  fetch(API.wallet, {
                    method: "POST",
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify(Request)
                  })
                    .then(res => res.json())
                    .then(res => {
                      console.log("Walet RESPONCE:::  ", res);
                      if (res.status == "success") {
                       
                         this.setState({ loading: false, walletBalance: res.wallet, wallet: res.wallet})
                     
                          
        
                        
                   
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
         
        }
    


        Pay = () => {

            console.log(this.state.walletBalance, this.state.finalPrice);
            if(this.state.finalPrice == 0 || this.state.cod == 1){
                this.paymentApi()
            } else {
                AsyncStorage.getItem('payapi_key').then(RPKey=> {
                    AsyncStorage.getItem('Logo').then(Logo=> {
                        AsyncStorage.getItem('email').then(email=> {
                            AsyncStorage.getItem('phone').then(mobile=> {
                                AsyncStorage.getItem('name').then(name=> {
                     var options = {
                       description: '',
                       image: Logo,
                       currency: 'INR',
                       key: RPKey,
                       amount: (((this.state.finalPrice) * 100).toFixed(2)),
                       external: {
                         wallets: ['paytm']
                       },
                       name: name,
                       prefill: {
                         email: email,
                         contact: mobile,
                         name: name
                       },
                       theme: {color: Colors.primary}
                     }
                     RazorpayCheckout.open(options).then((data) => {
                       // handle success
                       var WER = data;
                    //    this.payment(data.razorpay_payment_id)
                       this.setState({pay_id:data.razorpay_payment_id})
                       console.log(JSON.stringify(WER));
                       console.log(`Success: ${data}`);
                       this.paymentApi();
                     }).catch((error) => {
                       //handle failure
                       Toast.show(
                        error.description,
                        Toast.SHORT,
                        
                      );
                      
                      //  const resetAction = StackActions.reset({
                      //    index: 0,
                      //    actions: [
                      //      NavigationActions.navigate({ routeName: "Failed" })
                      //    ]
                      //  });
                      //  this.props.navigation.dispatch(resetAction);
                       console.log(`Error: ${error.code} | ${error.description}`);
                     });
                     // RazorpayCheckout.onExternalWalletSelection(data => {
                     //   alert(`External Wallet Selected: ${data.external_wallet} `);
                     // });
                    })
                  })
                })
            })
        })
            }
           
        }
        

        paymentApi = () => {
            this.setState({loading: true});
           AsyncStorage.getItem('id').then(id =>{
           AsyncStorage.getItem('token').then(token =>{
           
             var Request = {
              security:0,
              id: JSON.parse(id),
              token: JSON.parse(token),
              data: this.props.navigation.state.params.cart, 
              finaltotal : this.state.finalPrice,
              total_qty : this.props.navigation.state.params.totalQty,
              total : this.props.navigation.state.params.total,
              totalsave : this.props.navigation.state.params.totalSave,
              lat:this.props.navigation.state.params.lat,
              lon:this.props.navigation.state.params.lon,
              flat: this.props.navigation.state.params.flat,
              street: this.props.navigation.state.params.street,
              area: this.props.navigation.state.params.area,
              pincode: this.props.navigation.state.params.pin,
              is_wallet: this.state.is_wallet,
              pay_wallet: this.state.pay_wallet,
              wallet: this.state.walletBalance,
              pay_id: this.state.pay_id,
              del_charge: this.props.navigation.state.params.del_charge,
              del_date: this.props.navigation.state.params.date,
              // slot_id: this.props.navigation.state.params.timeid,
              cod: this.state.cod
             };
             console.log(API.add_order);
             console.log(JSON.stringify(Request));
             NetInfo.fetch().then(state => {
               if (state.isConnected) {
                 timeout(
                   15000,
                   fetch(API.add_order, {
                     method: "POST",
                     headers: {
                       Accept: "application/json",
                       "Content-Type": "application/json"
                     },
                     body: JSON.stringify(Request)
                   })
                     .then(res => res.json())
                     .then(res => {
                       console.log("AddOrder RESPONCE:::  ", res);
                       if (res.status == "success") {
                        
                          this.setState({ loading: false, })
                      AsyncStorage.removeItem('cart')
                          const resetAction = StackActions.reset ({
                            index: 0,
                            actions: [NavigationActions.navigate ({routeName: 'Success', params: {orderno: res.orderno}})],
                          });
                          this.props.navigation.dispatch (resetAction);
         
                         
                    
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
                        const resetAction = StackActions.reset ({
                            index: 0,
                            actions: [NavigationActions.navigate ({routeName: 'Failure'})],
                          });
                          this.props.navigation.dispatch (resetAction);
                        this.setState({loading : false,})
                         Toast.show(res.message,Toast.SHORT,);
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
          
         }


         changeActiveRadioButton(index) {
          radioItems.map(item => {
            item.selected = false;
          });
      
          radioItems[index].selected = true;
      if(radioItems[index].label=="COD"  )
       {
if(this.props.navigation.state.params.finalPrice>500)
{
  this.setState({radioItems: radioItems}, () => {
    this.setState({selectedItem: radioItems[index].label}, ()=> {
      if(this.state.selectedItem == "COD"){
        this.setState({
          CheckData: false,
         
          pay_wallet:0,
         
          is_wallet:0,
           finalPrice : this.props.navigation.state.params.finalPrice,
           errorText:'',
           cod:1,
           pay_id:'cod',

        })
      } else {
        this.setState({
          CheckData: false,
         
          pay_wallet:0,
       
          is_wallet:0,
           finalPrice : this.props.navigation.state.params.finalPrice,
           errorText:'',
           cod: null,
           pay_id:'cod',

        })
      }
    });
  });
}else
{
  Alert.alert("Alert !","COD is available for the orders above Rs.500")
}

       } 
       else
       {
        this.setState({radioItems: radioItems}, () => {
          this.setState({selectedItem: radioItems[index].label}, ()=> {
            if(this.state.selectedItem == "Online"){
              this.setState({
                CheckData: false,
               
                pay_wallet:0,
               
                is_wallet:0,
                 finalPrice : this.props.navigation.state.params.finalPrice,
                 errorText:'',
                 cod:1,
                 pay_id:'cod',

              })
            } else {
              this.setState({
                CheckData: false,
               
                pay_wallet:0,
             
                is_wallet:0,
                 finalPrice : this.props.navigation.state.params.finalPrice,
                 errorText:'',
                 cod: null,
                 pay_id:'cod',

              })
            }
          });
        });
       }

        }
      
    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }}>
              <View style={{flex:1, backgroundColor: Colors.white}}>
              <NavigationEvents onDidFocus={()=> {
                      this.countFunction()
                    }} />
                <Header
                    Back={() => {
                        this.props.navigation.goBack();
                    }}
                    pageTitle={'Payment'}
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
                <ScrollView showsVerticalScrollIndicator={false} >


                    <View style={{ flex: 1, backgroundColor: Colors.white }}>
                        {/* <View style={{ paddingVertical: 18 }}>
                            <Text style={{
                                fontFamily: Fonts.Regular,
                                fontSize: 16, textAlign: 'center'
                            }}>Reward Points</Text>
                            <View style={{ flexDirection: 'row', alignSelf: 'center', alignItems: 'center' }}>
                                <Text style={{
                                    fontFamily: Fonts.Regular,
                                    fontSize: 16, textAlign: 'center'
                                }}>for this order is</Text>
                                <Text style={{
                                    paddingHorizontal: 6,
                                    color: Colors.primary, fontFamily: Fonts.SemiBold,
                                    fontSize: 16, textAlign: 'center'
                                }}>Rs. 200</Text>
                            </View>
                        </View> */}

<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
               <Image
                 style={{
                   height: width * 0.8,
                   width: width * 0.8,
                   alignSelf: 'center',
                 
                 }}
                 resizeMode="contain"
                 source={require ('../images/payment.jpg')}
               />

               </View>

               <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                 <TouchableOpacity style={{flexDirection:'row'}}>

                 </TouchableOpacity>
                 <TouchableOpacity style={{flexDirection:'row'}}>
                   
                 </TouchableOpacity>
               </View>
               <View style={{flex:1, flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
               {radioItems.map((item, key) => (
                    <RadioButton
                      key={key}
                      button={item}
                      onClick={this.changeActiveRadioButton.bind(this, key)}
                    />
                  ))}
</View>

{!this.state.cod &&
                        <View style={{ flexDirection: 'row', alignSelf: 'center', alignItems: 'center', paddingTop:18 }}>

                            <TouchableOpacity
                                onPress={() => {
                                    if(this.state.wallet > 0){
                                        this.setState({CheckData: !this.state.CheckData, errorText:''}, ()=> {
                                             if(this.state.CheckData){
                                                if(parseInt(this.state.finalPrice) > parseInt(this.state.wallet)){
                                                    this.setState({is_wallet : 1, pay_wallet:0,  walletBalance: parseInt(this.state.wallet), finalPrice: (parseInt(this.state.finalPrice) - parseInt(this.state.wallet)), })
                                        
                                                } else if(parseInt(this.state.finalPrice) == parseInt(this.state.wallet)){
                                                    this.setState({is_wallet:1, pay_wallet:1,  walletBalance: parseInt(this.state.wallet), finalPrice: 0, "pay_id":"wallet" })
                                                } else if(parseInt(this.state.finalPrice) < parseInt(this.state.wallet)){
                                                    this.setState({is_wallet:1, pay_wallet:1,  walletBalance: parseInt(this.state.finalPrice), finalPrice:0, "pay_id":"wallet" })
                                                }
                                            } else {
                                                
                                                
                                                this.setState({walletBalance: 0, finalPrice: parseInt(this.state.finalPrice), is_wallet:0, pay_wallet:0,  })
                                            }
                                        })
                                            } else {
                                                this.setState({errorText:"You do'nt have a sufficient balance"})
                                            }
                                }}
                                style={{
                                    height: 30, width: 30,
                                    paddingHorizontal: 25,
                                    justifyContent: 'center', alignItems: 'center'
                                }}>

                                {this.state.CheckData ?
                                    <Image
                                        resizeMode={'center'}
                                        style={{ height: height * 0.04, width: width * 0.07 }}
                                        source={require('../images/checked.png')} />
                                    :
                                    <View style={{
                                        paddingHorizontal: 10, paddingVertical: 10,
                                        backgroundColor: '#ededed'
                                    }}></View>
                                }
                            </TouchableOpacity>
                            <Text style={{
                                fontFamily: Fonts.Light,
                                fontSize: 15, textAlign: 'center'
                            }}>Use Wallet balance</Text>
                            <Text style={{
                                paddingHorizontal: 6,
                                color: Colors.primary, fontFamily: Fonts.SemiBold,
                                fontSize: 16, textAlign: 'center'
                            }}>Rs. {this.state.wallet}</Text>

                        </View>

                        }
                        {this.state.errorText ? 
                        <Text style={{
                                fontFamily: Fonts.Light,
                                color:'red',
                                fontSize: 12, textAlign: 'center'
                        }}>{this.state.errorText}</Text>
                        : null }
                        <Text
                            numberOfLines={2}
                            style={{
                                fontFamily: Fonts.SemiBold,
                                width: '80%',
                                alignSelf: 'center',
                                marginVertical: 20,
                                color: Colors.red,
                                fontSize: 16, textAlign: 'center'
                            }}>Your Payable Amount is Rs. {(this.props.navigation.state.params.finalPrice).toFixed(2)} </Text>

                        {/* <Line style={{ height: 8, width: '100%', backgroundColor: Colors.light_gray, marginVertical: 20 }}></Line> */}


                        {/* <Text style={{
                            fontFamily: Fonts.Light,
                            fontSize: 15, textAlign: 'center'
                        }}>Choose Your Card</Text>

                        <View style={{
                            width: '92%',
                            backgroundColor: Colors.light_gray,
                            borderRadius: 8,

                            height: height * 0.1,
                            //    justifyContent:'center',
                            //    alignItems:'center',
                            alignSelf: 'center',
                            marginVertical: 10

                        }}>
                            <Text style={{ padding: 6, fontFamily: Fonts.Light, fontSize: 12, color: Colors.dark_gray }}>credit Card Number</Text>
                            <View style={{ flexDirection: 'row', paddingHorizontal: 10 }} >
                                <Text
                                    style={{
                                        fontSize: 12,
                                        fontFamily: Fonts.BoldItalic
                                    }}>VISA</Text>
                                <Text style={{
                                    fontSize: 14,
                                    paddingLeft: 10,
                                    fontFamily: Fonts.Regular
                                }}>0123 4567 8910 1112</Text>
                            </View>
                        </View> */}


                        {/* <View style={{
                            width: '92%',
                            backgroundColor: Colors.light_gray,
                            borderRadius: 8,

                            height: height * 0.1,
                            //    justifyContent:'center',
                            //    alignItems:'center',
                            alignSelf: 'center',
                            marginVertical: 10

                        }}>
                            <Text style={{ padding: 6, fontFamily: Fonts.Light, fontSize: 12, color: Colors.dark_gray }}>credit Card Number</Text>
                            <View style={{ flexDirection: 'row', paddingHorizontal: 10 }} >
                                <Text
                                    style={{
                                        fontSize: 12,
                                        fontFamily: Fonts.BoldItalic
                                    }}>VISA</Text>
                                <Text style={{
                                    fontSize: 14,
                                    paddingLeft: 10,
                                    fontFamily: Fonts.Regular
                                }}>0123 4567 8910 1112</Text>
                            </View>
                        </View>

                        <View style={{
                            height:height*0.3,
                            borderRadius: 10,
                            marginVertical: 10,
                            width:'90%',
                            alignSelf:"center",
                            justifyContent:'space-between',
                            flexDirection:'column',
                            backgroundColor:Colors.primary
                        }}>

<View style={{flexDirection:'row',justifyContent:'space-between',padding:15}}>
    <View style={{flexDirection:'column'}}>
    <Text style={{color:'white',fontFamily:Fonts.Regular,fontSize:11}}>Credit Card Number</Text>
    <Text style={{color:'white',fontFamily:Fonts.Regular,fontSize:14,paddingVertical:4}}>0123 4567 8910 1112</Text>
    </View>
    

    <Text
                                    style={{
                                        fontSize: 14,
                                        color:'white',
                                        //  fontWeight:'bold',
                                        fontFamily: Fonts.BoldItalic
                                    }}>VISA</Text>
    </View>                         
    <View style={{flexDirection:'row',justifyContent:'space-between',padding:10}}>
    <View style={{flexDirection:'column'}}>
    <Text style={{color:'white',fontFamily:Fonts.Regular,fontSize:11}}>Owner Name</Text>
    <Text style={{color:'white',fontFamily:Fonts.Regular,fontSize:16,paddingVertical:4}}>Neel Arthur</Text>
    </View>
    

    <View style={{flexDirection:'row',justifyContent:'space-between',padding:10}}>
    <View style={{flexDirection:'column'}}>
    <Text style={{color:'white',fontFamily:Fonts.Regular,fontSize:11}}>Valid Till</Text>
    <Text style={{color:'white',fontFamily:Fonts.Regular,fontSize:16,paddingVertical:4}}>03 / 2022</Text>
    </View>
</View>
    </View> 
                        </View>

                        <View style={{
                            width: '92%',
                            backgroundColor: Colors.light_gray,
                            borderRadius: 8,
   
                            height: height * 0.1,
                            //    justifyContent:'center',
                            //    alignItems:'center',
                            alignSelf: 'center',
                            marginVertical: 20

                        }}>
                            <Text style={{fontFamily: Fonts.Regular, fontSize: 16, color: Colors.dark_gray,paddingVertical:10,paddingHorizontal:20 }}>CVV Code</Text>
                            
                        </View>

                        <TouchableOpacity
                            // onPress={() => this.Login()}
                            onPress={() => {

                                this.props.navigation.navigate('AddNewCard');
                            }}
                            activeOpacity={0.8}
                            style={{
                                width: '70%', borderRadius: 40,marginVertical:6,
                                justifyContent: 'center', alignItems: 'center', alignSelf: 'center',
                                backgroundColor: '#e1f3e7', height: height * 0.2 / 2.4
                            }}>

                            <Text style={{ fontFamily: Fonts.bold, fontSize: 18, color: Colors.primary }}>+ Add New Card</Text>

                        </TouchableOpacity> */}

                        <TouchableOpacity
                            // onPress={() => this.Login()}
                            onPress={() => {

                               this.Pay()
                            }}
                            activeOpacity={0.8}
                            style={{
                                width: '80%', borderRadius: 40, elevation: 1,marginVertical:18,
                                justifyContent: 'center', alignItems: 'center', alignSelf: 'center',
                                backgroundColor: Colors.acent, height: height * 0.2 /2.5
                            }}>

                            <Text style={{ fontFamily: Fonts.bold, fontSize: 18, color: Colors.white }}>Confirm Payment</Text>

                        </TouchableOpacity>


                    </View>
                </ScrollView>
                </View>
            </SafeAreaView>
        )
    }

}



class RadioButton extends Component {
  render() {
    return (
      <TouchableOpacity
        onPress={this.props.onClick}
        activeOpacity={0.8}
        style={[
          {flexDirection: "row", width: width * 0.42},
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
        <Text style={[styles.label, {color: Colors.black}]}>
          {this.props.button.label}
        </Text>
      </TouchableOpacity>
    );
  }
}


const styles = StyleSheet.create({
  MainContainer: {
    justifyContent: "center",
    flex: 1,
    backgroundColor: Colors.white,
    paddingTop: Platform.OS === "ios" ? 0 : 0
  },

  primarycontainer: {
    flex: 1,
    flexDirection: "column",
    paddingTop: 10,
    justifyContent: "flex-start",
    alignItems: "center",
    zIndex:100,
  },

  imgbck: {
    width: width * 1,
    height: height * 1,
    justifyContent: "center",
    alignItems: "center"
  },
  labela: {
    fontSize: 14,
    paddingTop: 10,
    paddingLeft: 5,
    color: "#fff"
  },
  textInputView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    width: width * 0.8
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 12,
    paddingHorizontal: 6,
    marginVertical: 5,
    color: "#000",
    backgroundColor: "#fff",
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5
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
