
import React from 'react';
import {
    Text,
    View,
    SafeAreaView,
    FlatList,
    Dimensions,
    Image,
    TouchableOpacity,
    ScrollView,
    Alert
} from 'react-native';
import Colors from '../common/Colors';
import Header from '../component/Header';
import Fonts from '../common/Fonts';
import { Dropdown } from '../component/dropdown'
import Line from '../common/Line';
import Dash from 'react-native-dash';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
var DataSource = [
    {
        image: require('../images/temp/oil.png'),
        name: 'Tomatoes',
        subtitle:'250 gms (1 qty)',
        rs: 'Rs 300',
        
    },
    {
        image: require('../images/temp/lotion.png'),
        name: 'Tomatoes',
        rs: 'Rs 300',
        subtitle:'250 gms (1 qty)',
       
    },
    {
        image: require('../images/temp/Biriyani_bohvze.jpeg'),
        name: 'Tomatoes',
        rs: 'Rs 300',
        subtitle:'250 gms (1 qty)',
    },
  

];


import { StackActions, NavigationActions, NavigationEvents } from "react-navigation";
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import API from '../common/Api';
import Loader from '../common/Loader';
import timeout from '../common/timeout';
import Toast from 'react-native-simple-toast';
import moment from 'moment';

export default class OrderID extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            orders:[],
            cartCount : 0,
            Data: [
                {
                    id: 1,
                    name: "Delivery on 12th april,7am to 6pm",
                    left: 'Ordered',
                    dd: '25',
                    mm: 'March',
                    centar: 'Order ID',
                    status: 'Total payble amount',
                    items: '4 items'
                },
              

            ]
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
        AsyncStorage.removeItem('ecart')
        this.orderAPI()
    }

    cancel = () => {
 this.setState({loading: true});
        AsyncStorage.getItem('id').then(id =>{
        AsyncStorage.getItem('token').then(token =>{
        
          var Request = {
           security:0,
           token: JSON.parse(token),
           id: id,
           oid: this.props.navigation.state.params.item.id
          
          };
          console.log(API.order_update);
          console.log(JSON.stringify(Request));
          NetInfo.fetch().then(state => {
            if (state.isConnected) {
              timeout(
                15000,
                fetch(API.order_update, {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify(Request)
                })
                  .then(res => res.json())
                  .then(res => {
                    console.log("orders update RESPONCE:::  ", res);
                    if (res.status == "success") {
                   
                     
       
                       this.setState({ loading: false, },()=>{
                           this.props.navigation.goBack()
                        Toast.show(res.message,Toast.SHORT,);
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


    orderAPI = () => {

        this.setState({loading: true});
        AsyncStorage.getItem('id').then(id =>{
        AsyncStorage.getItem('token').then(token =>{
        
          var Request = {
           security:0,
           token: JSON.parse(token),
           id: id,
            oid: this.props.navigation.state.params.item.id
          
          };
          console.log(API.order_details);
          console.log(JSON.stringify(Request));
          NetInfo.fetch().then(state => {
            if (state.isConnected) {
              timeout(
                15000,
                fetch(API.order_details, {
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
                   
                     
       
                       this.setState({ loading: false, orders: res.data[0] },()=>{

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


    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }}>
                <NavigationEvents onDidFocus={()=> {
                      this.countFunction()
                    }} />
                <Header
                    Back={() => {
                        this.props.navigation.goBack();
                    }}
                    pageTitle={'Order Id #'+ this.props.navigation.state.params.item.id}
                    iconName={require('../images/home_05.png')}
                    Notification={() => {
                        this.props.navigation.navigate('Notification')
                    }}
                    cartCount={this.state.cartCount}
                    Cart={() => {
                        this.props.navigation.navigate('Cart')
                    }}

                />

                <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: Colors.white}}>

                    <View showsVerticalScrollIndicator={false} style={{ flex: 1 }}>


                                <View
                                    style={{
                                        flex: 1,
                                        paddingVertical: 10,
                                       
                                    }}>



                                    <Text
                                        numberOfLines={4}
                                        style={{
                                            fontFamily: Fonts.Regular,
                                            fontSize: 16,
                                            paddingVertical: 8,
                                            paddingHorizontal: 25
                                        }}>
                                        {this.state.orders.msg}</Text>
                                       
                                    <View style={{
                                        alignSelf: 'center',
                                        marginVertical: 8,
                                        width: '90%',
                                        paddingVertical: 10,
                                        backgroundColor: Colors.viewBox,
                                        flexDirection: 'row'
                                    }}>

                                        <View style={{
                                            flexDirection: 'column',
                                            paddingHorizontal: 10,
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>

                                            <Text
                                                style={{
                                                    fontSize: 14,
                                                    fontFamily: Fonts.Regular,
                                                    textAlign: 'center'
                                                }}>Ordered on</Text>

                                            <Text style={{
                                                fontFamily: Fonts.bold,
                                                fontSize: 20, color: Colors.primary
                                            }}>{moment(this.state.order_date).format('DD')}</Text>

                                            <Text style={{
                                                fontFamily: Fonts.SemiBold,
                                                fontSize: 14, color: Colors.primary
                                            }}>{moment(this.state.order_date).format('MMMM')}</Text>
                                        </View>

                                        <Line style={{
                                            height: '100%', width: 1,
                                            marginHorizontal: 6,
                                            backgroundColor: Colors.medium_gray
                                        }}></Line>

<View style={{
     flexDirection:'row',
     paddingHorizontal:10,
     width:'74%',
    // 
     justifyContent:'space-between',
     alignItems:'center'
}}>

    <View style={{
        flexDirection:'column'
    }}>
        
<Text style={{
    fontFamily:Fonts.Regular,
    fontSize:14,
  
    width:'100%'
}}>
     Order ID: #{this.state.orders.id}
</Text>
<View style={{flexDirection:'row',justifyContent:'space-between'}}>

<Text
numberOfLines={1}
style={{
 
    fontSize:14,
    fontFamily:Fonts.Light,
    width:width*1/2.8
    
}}>
  Rs. {this.state.orders.total}
</Text>

    <Text
    
    style={{fontSize:16,color:Colors.primary,
        paddingHorizontal:8,
    fontFamily:Fonts.Regular}}>
    {this.state.orders.pcount} items
</Text>

</View>
<Text
numberOfLines={1}
style={{
  
    fontSize:16,
    color: this.state.orders.scolor,
    fontFamily:Fonts.SemiBold,
    
    
}}>
     {this.state.orders.sname}
</Text>
    </View>


   
    </View>


                                    </View>
                               
                                </View>

            
<View style={{
    flexDirection:'row',
    paddingHorizontal:16,
    paddingVertical:10,
    width:'100%',
    alignSelf:'center'
}}>
      <Image
                                    resizeMode="contain"

                                    style={{
                                        
                                        width:20,
                                        height:20,
                                    }}
                                    source={require('../images/location.png')}
                                />
<View style={{flexDirection:'column',paddingHorizontal:6}}>
<Text
style={{
    fontFamily:Fonts.SemiBold,
    fontSize:14
}}>Delivery Address:</Text>
<Text

 style={{fontSize:14,
   
    color:Colors.dark_gray,
 fontFamily:Fonts.Regular}}>{this.state.orders.address}</Text>

</View>

</View>

                        <FlatList
                            // ListFooterComponent={() => <View style={{ height: height * 0.1 }} />}
                            showsVerticalScrollIndicator={false}
                            style={{ backgroundColor: 'white', marginTop: 10 }}
                            extraData={this.state.refresh}
                            listKey={(item, index) => index.toString()}
                            data={this.state.orders.data}
                            renderItem={({ item, index }) => (
                                <View style={{ flex: 1, margin: 6 }}>

                                    <View
                                        style={{
                                            flex: 1,
                                            paddingVertical: 15,
                                            width: '96%',
                                            alignSelf: 'center', paddingHorizontal: 10,
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            flexDirection: 'row',
                                            backgroundColor: Colors.viewBox
                                        }}>
                                        <View style={{
                                            flexDirection: 'row'
                                        }}>
                                            
                                                <View style={{
                                                    height: height * 0.2 / 2,
                                                    backgroundColor: Colors.white,
                                                    width: width * 0.2,
                                                    borderRadius: 10,
                                                }}>
                                                    {item.img ?
                                                    <Image
                                                        resizeMode="cover"
                                                        style={{
                                                           
                                                            width: '100%',
                                                            height: '100%',

                                                            borderRadius: 10,
                                                        }}
                                                        source={{uri: item.img}} />
                                                        : null}

                                                </View> 
                                            <View style={{
                                                flex:1,
                                                flexDirection: 'column',
                                                // alignItems: 'center',
                                                paddingHorizontal: 8
                                            }}>
                                              
                                                    <Text
                                                       
                                                        style={{
                                                            fontFamily: Fonts.Regular,
                                                            fontSize: 16,
                                                            textAlign:'left',
                                                            paddingHorizontal: 0
                                                        }}>
                                                        {item.pname}
                                                    </Text>

                                                 <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                                                        <Text
                                                       
                                                        style={{
                                                            fontFamily: Fonts.Light,
                                                            fontSize: 14,
                                                            // paddingHorizontal: 10
                                                        }}>
                                                        {item.size} ({item.qty}) qty </Text>
                                                        <Text
                                                        
                                                        style={{
                                                            fontFamily: Fonts.SemiBold,
                                                            color: Colors.primary,
                                                           
                                                            fontSize: 16
                                                        }}>

                                                        Rs. {item.subtotal}</Text>
                                                  </View>

                                            </View>

                                        </View>
                                      
                                          
                                                   
                                              
 </View>

                                </View>
                            )}

                            keyExtractor={(item, index) => index.key}
                        />

                        <Dash
                            dashColor={Colors.medium_gray}
                            style={{ width: '100%', marginVertical: 10, height: 1 }} />


                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            width: '100%',
                            paddingHorizontal: 20
                        }}>

                            <View style={{ flexDirection: 'column' }}>
                                <Line style={{ marginVertical: 3 }}></Line>
                                <Text style={{
                                    fontFamily: Fonts.Regular,
                                    fontSize: 14,
                                    color: Colors.dark_gray
                                }}>Sub total</Text>

                                <Line style={{ marginVertical: 3 }}></Line>

                                <Text style={{
                                    fontFamily: Fonts.Regular,
                                    fontSize: 14,
                                    // color:Colors.dark_gray
                                }}>You saved</Text>

                                <Line style={{ marginVertical: 3 }}></Line>

                                {/* <Text style={{
                                    fontFamily: Fonts.Regular,
                                    fontSize: 14,
                                    color: Colors.dark_gray
                                }}>GST</Text> */}

                                <Line style={{ marginVertical: 3 }}></Line>
                                <Text style={{
                                    fontFamily: Fonts.Regular,
                                    fontSize: 14,
                                    color: Colors.dark_gray
                                }}>Delivery Charge</Text>
                            </View>

                            <View style={{ flexDirection: 'column' }}>
                                <Text style={{
                                    fontFamily: Fonts.Regular,
                                    fontSize: 14,
                                    // color:Colors.dark_gray
                                }}>Rs {this.state.orders.total}</Text>
                                <Line style={{ marginVertical: 3 }}></Line>
                                {/* <Text style={{
                                    fontFamily: Fonts.Regular,
                                    fontSize: 14,
                                    // color:Colors.dark_gray
                                }}>- Rs 80.00</Text>
                                <Line style={{ marginVertical: 3 }}></Line> */}
                                <View
                                    style={{
                                        // height:'10%',
                                        // width:'100%',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                    <Text style={{
                                        fontFamily: Fonts.Regular,
                                        fontSize: 14,

                                        // color:Colors.dark_gray
                                    }}>Rs. {this.state.orders.totalsave}</Text>
                                </View>
                                <Line style={{ marginVertical: 3 }}></Line>
                                <View
                                    style={{
                                        backgroundColor: Colors.white,
                                        elevation: 2,
                                        height: 25,
                                        width: '100%',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                    <Text style={{
                                        fontFamily: Fonts.Regular,
                                        fontSize: 14,

                                        // color:Colors.dark_gray
                                    }}>Rs. {this.state.orders.del_charge}</Text>
                                </View>


                            </View>

                        </View>

                        <View
                            style={{
                                marginVertical: 20,
                                height: height * 0.10,
                                paddingHorizontal: 20,
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexDirection: 'row',
                                backgroundColor: Colors.viewBox
                            }}>

                            <Text
                                style={{
                                    fontSize: 14,
                                    fontFamily: Fonts.SemiBold,

                                }}>Total Payable Amount</Text>

                            <Text style={{
                                fontFamily: Fonts.SemiBold,
                                fontSize: 20,
                                color: Colors.primary
                            }}>Rs {this.state.orders.finaltotal}</Text>

                        </View>
                        {this.state.orders.status == 1 || this.state.orders.status == 2 ? 
                        <TouchableOpacity
                            // onPress={() => this.Login()}
                            onPress={() => {
                                
                                Alert.alert(
                                    "Are sure want to cancel?",
                                    "",
                                    [
                                      {
                                        text: "Cancel",
                                        onPress: () => console.log("Cancel Pressed"),
                                        style: "cancel"
                                      },
                                      { text: "OK", onPress: () => this.cancel() }
                                    ],
                                    { cancelable: false }
                                  );
                               
                                    
                            }}
                            activeOpacity={0.8}
                            style={{
                                width: '80%', borderRadius: 40, elevation: 1,
                                marginBottom:20,
                                justifyContent: 'center', alignItems: 'center', alignSelf: 'center',
                                backgroundColor: Colors.acent, height: height * 0.2 / 2.5
                            }}>

                            <Text style={{ fontFamily: Fonts.bold, fontSize: 18, color: Colors.white }}>Cancel</Text>

                        </TouchableOpacity>
                   : null }
                             {/* <TouchableOpacity
                            // onPress={() => this.Login()}
                            onPress={() => {
                                
                               AsyncStorage.setItem('ecart', JSON.stringify(this.state.orders.data));
                               AsyncStorage.getItem('ecart').then(cart=>{
                                   console.log(cart);
                                   this.props.navigation.navigate('EditOrder', {oid: this.props.navigation.state.params.item.id, order: this.state.orders.data})

                               })
                                    
                            }}
                            activeOpacity={0.8}
                            style={{
                                width: '80%', borderRadius: 40, elevation: 1,
                                marginBottom:20,
                                justifyContent: 'center', alignItems: 'center', alignSelf: 'center',
                                backgroundColor: Colors.acent, height: height * 0.2 / 2.5
                            }}>

                            <Text style={{ fontFamily: Fonts.bold, fontSize: 18, color: Colors.white }}>MODIFY</Text>

                        </TouchableOpacity> */}

                        <Line style={{ height: 40 }} />

                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }

}
