
import React from 'react';
import {
    Text,
    View,
    SafeAreaView,
    FlatList,
    Dimensions,
    Animated,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Modal,
    Alert,
    Platform
} from 'react-native';
import Colors from '../common/Colors';
import Header from '../component/Header';
import Fonts from '../common/Fonts';
import { Dropdown } from '../component/dropdown'
import Line from '../common/Line';
import Dash from 'react-native-dash';
import { SwipeListView } from 'react-native-swipe-list-view';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
import {check, request, PERMISSIONS, openSettings, RESULTS} from 'react-native-permissions';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import API from '../common/Api';
import Loader from '../common/Loader';
import timeout from '../common/timeout';
import Toast from 'react-native-simple-toast';
import { NavigationEvents } from 'react-navigation';

let finalPrice = 0;
let totalQty = 0;
let total = 0;
let totalSave = 0;

export default class Cart extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            cart:[],
           refresh:false,
           loading: false,
           del_charge:0,
           charge_limit:0,
           min_checkout:0,
           modalVisible: false,

        }

    }

    componentDidMount(){
      
        this.chargeAPI();
        AsyncStorage.getItem('cart').then(cart=> {
            console.log(cart, this.state.cart);
           
            if(cart){
                this.setState({cart: JSON.parse(cart), cartCount: JSON.parse(cart).length});
                AsyncStorage.getItem('carttooltip').then(tooltip=> {
                    console.log(tooltip);
                    if(tooltip){

                    } else {
                        setTimeout(() => {
                            this.setState({modalVisible: true}, ()=> {
                                AsyncStorage.setItem("carttooltip", "true")
                            })
                        }, 500);
                        
                    }
                })
            }
        })
    }


  

  chargeAPI = () => {

      this.setState({loading: true});
      AsyncStorage.getItem('id').then(id =>{
      AsyncStorage.getItem('token').then(token =>{
      
        var Request = {
         security:1,
         id:1
         

        
        };
        console.log(API.delivery_charges);
        console.log(JSON.stringify(Request));
        NetInfo.fetch().then(state => {
          if (state.isConnected) {
            timeout(
              15000,
              fetch(API.delivery_charges, {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(Request)
              })
                .then(res => res.json())
                .then(res => {
                  console.log("delivery_charges RESPONCE:::  ", res);
                  if (res.status == "success") {
                 
                   
     
                     this.setState({ loading: false, del_charge: res.del_charge, min_checkout_msg: res. min_checkout_msg, min_checkout: res.min_checkout, charge_limit: res.charge_limit },)
     
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
                    this.setState({data: res, loading: false, del_charge: res.del_charge });
                   
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

    remove = (item) => {
        for(let i = 0; i < this.state.cart.length; i++) {
            if(this.state.cart[i].id === item.id) {
                this.state.cart.splice(i, 1);
                this.setState({refresh: !this.state.refresh}, ()=> {
                    if(this.state.cart.length > 0){
                      AsyncStorage.setItem('cart', JSON.stringify(this.state.cart));
                      this.countFunction()
                    
                    } else {
                      AsyncStorage.removeItem('cart');
                      this.countFunction()
                    }
                })
            }
        }
    }

    closeRow = (rowMap, rowKey) => {
        console.log('rowMap',rowMap, rowKey);
        
       this.remove(rowKey)
    };



     onRowDidOpen = rowKey => {
        console.log('This row opened', rowKey);
    };

     onSwipeValueChange = swipeData => {
        const { key, value } = swipeData;
       
    };

     renderItem = (data, index) => {
       
        
        return(
        <View style={{ flex: 1, margin: 6 }}>

                          
        <View
            style={{
                flex: 1,
                paddingVertical: 15,
                width: '96%',
                alignSelf: 'center', 
                paddingHorizontal: 6,
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
                backgroundColor: Colors.viewBox
            }}>
            <View style={{
                flex:1,
                flexDirection: 'row'
            }}>
               
                    <View style={{
                        height: height * 0.2 / 2,
                        backgroundColor: Colors.white,
                        width: width * 0.2,
                        borderRadius: 10,
                    }}>
                         {data.item.img ?
                        <Image
                            resizeMode="cover"
                            style={{
                               
                                width: '100%',
                                height: '100%',

                                borderRadius: 10,
                            }}
                            source={{uri: data.item.img}} />
                            : null}
                    </View> 

                <View style={{
                   flex:1,
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    paddingHorizontal:2
                }}>
                    <View style={{ flexDirection:'row',alignItems:'flex-start'}}>
                    <Text
                        numberOfLines={4}
                        style={{
                            fontFamily: Fonts.Regular,
                            fontSize: 16,
                            paddingHorizontal: 8
                        }}>
                        {data.item.name}</Text>
                        
                        {/* <Text
                                style={{
                                    // textDecorationLine: 'line-through',
                                    fontFamily: Fonts.SemiBold,
                                    textAlign: 'left',
                                    color: Colors.red,
                                    paddingHorizontal: 4,
                                    fontSize: 10,
                                }}>{data.item.of}</Text> */}
                        </View>
{data.item.priceArray ? 
                    <View
                        style={{
                            marginLeft:6,
                            // marginLeft: 10,
                            alignSelf:'flex-start',
                            height: 25,
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                            backgroundColor: Colors.white,
                           }}>

                        <Dropdown
                            containerStyle={{
                                width: height * 0.3 / 2,
                                paddingLeft: 5,
                                paddingBottom: 15,
                            }}
                            fontSize={15}
                            itemTextStyle={{ fontFamily: Fonts.regular, color: Colors.primary }}
                            itemColor={Colors.black}
                            fontFamily={Fonts.regular}
                            selectedItemColor={Colors.black}
                            labelExtractor={({ title }) => title}
                            valueExtractor={({ value }) => value}
                            textColor={
                                data.item.size ? Colors.black : Colors.dark_gray
                            }

                            value={data.item.size}
                            onChangeText={(value, index, data1) => {
                             data.item.size = data1[index].title;
                             data.item.qty= 1;
                             data.item.mqty = data1[index].mqty;
                             data.item.price = data1[index].value;
                             data.item.totalprice = data1[index].value * data.item.qty;
                             console.log(this.state.cart);
                             AsyncStorage.setItem ('cart', JSON.stringify (this.state.cart));
                             this.setState({refresh: !this.state.refresh})
                            }}

                            data={data.item.priceArray}
                        />
                    </View>
: 

<View
style={{
    marginLeft:6,
    // marginLeft: 10,
    alignSelf:'flex-start',
    height: 25,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal:20,
    backgroundColor: Colors.white,
   }}>
       <Text style={{fontFamily: Fonts.Regular, fontSize:15, color: Colors.black}}>
           {data.item.size}
       </Text>
       
       </View>}
                </View>

            </View>
            <View style={{
               
                flexDirection: 'row',
               
                alignItems: 'flex-end'
            }}>
                <View style={{ flexDirection: 'column',   }}>
                  
                        <Text
                            
                            style={{
                                fontFamily: Fonts.Regular,
                                color: Colors.primary,
                                textAlign:'right',
                                fontSize: 16
                            }}>

                           Rs. {(data.item.price * data.item.qty).toFixed(2)} </Text>
                        
                  
                    {data.item.oprice ?
                            <Text
                                style={{
                                    textDecorationLine: 'line-through',
                                    fontFamily: Fonts.SemiBold,
                                    textAlign: 'right',
                                    color: Colors.red,
                                    paddingHorizontal: 4,
                                    fontSize: 10,
                                }}>Rs.{(data.item.oprice * data.item.qty).toFixed(2)}</Text> : null}
                    <View style={{
                        // width: '100%',
                        justifyContent: 'space-between',
                        flexDirection: 'row',

                        marginVertical: 10,
                        alignSelf: 'center',

                    }}>

                        <TouchableOpacity
                            onPress={() => {
                                console.log(data.item.priceArray);

                                if (data.item.qty == 1) {
                                    // return false;
                                    Alert.alert(
                                        "Are you sure want to remove?",
                                        "",
                                        [
                                          {
                                            text: "Cancel",
                                            onPress: () => console.log("Cancel Pressed"),
                                            style: "cancel"
                                          },
                                          { text: "OK", onPress: () => this.remove(data.item)}
                                        ],
                                        { cancelable: false }
                                      );
                                } else {
                                    
                                    this.setState({ refresh: !this.state.refresh })
                                    this.state.cart[data.index].qty = this.state.cart[data.index].qty - 1;
                                    data.item.totalprice = data.item.price * data.item.qty;
                                    console.log(this.state.cart);
                                    AsyncStorage.setItem ('cart', JSON.stringify (this.state.cart));
                                    this.setState({ refresh: !this.state.refresh })

                                }
                            }}
                            style={{
                                height: height * 0.04,
                                width: width * 0.08,
                                justifyContent: 'center',
                                alignItems: 'center',

                            }}>
                            <Text
                                style={{
                                    fontFamily: Fonts.bold,
                                    fontSize: 25
                                }}>-</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                height: height * 0.04,
                                width: width * 0.09,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: Colors.light_gray

                            }}>
                            <Text refresh={new Date()}
                                style={{
                                    fontFamily: Fonts.Regular,
                                    fontSize: 16
                                }}>{data.item.qty}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            onPress={() => {

if(this.state.cart[data.index].qty == this.state.cart[data.index].mqty){
    Toast.show("Maximum quantity reached",Toast.SHORT);
} else {


this.setState({ refresh: !this.state.refresh })
this.state.cart[data.index].qty = this.state.cart[data.index].qty + 1
data.item.totalprice = data.item.price * data.item.qty;
                                    console.log(this.state.cart);
                                    AsyncStorage.setItem ('cart', JSON.stringify (this.state.cart));
                                this.setState({ refresh: !this.state.refresh })
}
                            }}
                            style={{
                                height: height * 0.04,
                                width: width * 0.08,
                                justifyContent: 'center',
                                alignItems: 'center',

                            }}>
                            <Text
                                style={{
                                    fontFamily: Fonts.bold,
                                    fontSize: 25
                                }}>+</Text>
                        </TouchableOpacity>

                    </View>
                </View>
                
            </View>




        </View>

    </View>
        )

                         } ;

     renderHiddenItem = (data, rowMap) => (
        <View style={styles.rowBack}>
          
            {/* <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnLeft]}
                onPress={() => this.closeRow(rowMap, data.item.key)}
            >
                <Text style={styles.backTextWhite}>Close</Text>
            </TouchableOpacity> */}
            <TouchableOpacity
                style={styles.backRightBtn}
               onPress={()=>{
                this.closeRow(rowMap, data.item)
               }}
            >
                <Animated.View
                    style={[
                        styles.trash]}
                >
                    <Image
                        source={require('../images/delete.png')}
                        style={styles.trash}
                    />
                </Animated.View>
            </TouchableOpacity>
        </View>
    );


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

      getPermissions = () => {
          console.log(this.state.min_checkout , finalPrice)
          if(this.state.min_checkout > finalPrice){
            Toast.show(this.state.min_checkout_msg, Toast.SHORT);
          } else {
        async function requestAll() {

            const Location = Platform.select({
                // android: PERMISSIONS.ANDROID.SYSTEM_ALERT_WINDOW,
                android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
                ios: PERMISSIONS.IOS.LOCATION_ALWAYS,
                ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
            });
            const isLocation = await request(Location);
            return {isLocation};
        }
        setTimeout(() => {
            
       
        requestAll().then(statuses => {
            if (statuses.isLocation == "granted") {
                if(Platform.OS == "ios"){
                    this.props.navigation.navigate('Address', 
                    {
                        cart: this.state.cart, 
                        finalPrice : finalPrice,
                        totalQty : totalQty,
                        total : total,
                        totalSave : totalSave,
                        del_charge: this.state.del_charge,
                        
                    }
                    );
                } else {
                RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
                    .then(data => {
                        console.log("err1", data);
                        this.props.navigation.navigate('Address', 
                        {
                            cart: this.state.cart, 
                            finalPrice : finalPrice,
                            totalQty : totalQty,
                            total : total,
                            totalSave : totalSave,
                            del_charge: this.state.del_charge,
                            
                        }
                        );

                    }).catch(err => {
                        console.log("err", err);
                    });
                }
            } else {
                async function requestAll() {

                    const Location = Platform.select({
                        // android: PERMISSIONS.ANDROID.SYSTEM_ALERT_WINDOW,
                        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
                        ios: PERMISSIONS.IOS.LOCATION_ALWAYS,
                        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
                    });
                    const isLocation = await request(Location);
                    return {isLocation};
                }
            }
            console.log("err3", statuses)
        });
    }, 1000);
    }
    }

    Permissions = () => {
        const Location = Platform.select({
            android: PERMISSIONS.ANDROID.SYSTEM_ALERT_WINDOW,
            android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
            ios: PERMISSIONS.IOS.LOCATION_ALWAYS,
            ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
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
                        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
                            .then(data => {
                                console.log(data);
                                this.props.navigation.navigate('Address', 
                                {
                                    cart: this.state.cart, 
                                    finalPrice : finalPrice,
                                    totalQty : totalQty,
                                    total : total,
                                    totalSave : totalSave,
                                    del_charge: this.state.del_charge,
                                    lat:0.00,
                                    lon:0.00
                                }
                                );
                            }).catch(err => {
                                console.log(err);
                            });
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
        finalPrice = 0;
        totalQty = 0;
        total = 0;
        totalSave = 0;
        for(let i=0; i < this.state.cart.length; i++){
            let oprice = 0;
            if(this.state.cart[i].oprice){
                oprice = this.state.cart[i].oprice * this.state.cart[i].qty;
            } else {
                oprice = this.state.cart[i].price * this.state.cart[i].qty;
            }
            total = total + oprice;
            
          finalPrice = finalPrice + this.state.cart[i].totalprice;
          totalQty = totalQty + this.state.cart[i].qty;

        }
        totalSave = total - finalPrice;
        total = total - totalSave;
        if(total <= this.state.charge_limit){
            finalPrice = finalPrice + parseInt(this.state.del_charge);
        }
        
        // total = total + parseInt(this.state.del_charge)

        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }}>
                <Header
                    Back={() => {
                        this.props.navigation.goBack();
                    }}
                    pageTitle={'Cart'}
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
<NavigationEvents onDidFocus={()=> {
                      this.countFunction()
                    }} />
<ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: Colors.white }}>
             {this.state.cart.length == 0 ? 
             
             
             <View style={{flex: 1}} refresh={this.state.refresh}>

             <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
               <Image
                 style={{
                   height: width * 0.8,
                   width: width * 0.8,
                   alignSelf: 'center',
                 
                 }}
                 resizeMode="contain"
                 source={require ('../images/emptycart.jpg')}
               />
               <View
                 style={{
                   alignItems: 'center',
                   justifyContent: 'center',
                   marginTop: 20,
                 }}
               >
     
                 <Text
                   style={{
                     fontSize: 17,
                     color: Colors.primary,
                     fontFamily: Fonts.bold,
                   }}
                 >
                   YOUR CART IS EMPTY!
                 </Text>
                 <Text
                   style={{
                     textAlign: 'center',
                     fontSize: 14,
                     fontFamily: Fonts.light,
                     color: Colors.black,
                     paddingTop: 10,
                     width: width * 0.7,
                   }}
                 >
                   Add something from the below button to make me happy!!!
                 </Text>
     
               </View>
               <TouchableOpacity
                        // onPress={() => this.Login()}
                        onPress={() => {

                            this.props.navigation.navigate('Home');
                        }}
                        activeOpacity={0.8}
                        style={{
                            marginVertical:30,
                            width: '70%', borderRadius: 40, elevation: 1,
                            justifyContent: 'center', alignItems: 'center', alignSelf: 'center',
                            backgroundColor: Colors.acent, height: height * 0.2 / 2.8
                        }}>

                        <Text style={{ fontFamily: Fonts.bold, fontSize: 18, color: Colors.white }}>START SHOPPING</Text>

                    </TouchableOpacity>
             </View>
     
           </View>
             
             :
                <View showsVerticalScrollIndicator={false} style={{ flex: 1 }}>

                <SwipeListView
                data={this.state.cart}
                renderItem={this.renderItem}
                renderHiddenItem={this.renderHiddenItem}
               extraData={this.state.refresh}
                rightOpenValue={-80}
                previewRowKey={'0'}
                previewOpenValue={-40}
                previewOpenDelay={3000}
                onRowDidOpen={this.onRowDidOpen}
                onSwipeValueChange={this.onSwipeValueChange}
            />

<Dash 
dashColor={Colors.medium_gray}
style={{width:'100%',marginVertical:10, height:1}}/>
                     

<View style={{
    flexDirection:'row',
    justifyContent:'space-between',
    width:'100%',
    paddingHorizontal:20
}}>

<View style={{flexDirection:'column'}}>
<Line style={{  marginVertical: 3 }}></Line>
    <Text style={{
        fontFamily:Fonts.Regular,
        fontSize:14,
        color:Colors.dark_gray
    }}>Sub total</Text>

    <Line style={{  marginVertical: 3 }}></Line>
    
    <Text style={{
        fontFamily:Fonts.Regular,
        fontSize:14,
        // color:Colors.dark_gray
    }}>You saved</Text>
    
    {/* <Line style={{  marginVertical: 3 }}></Line>
    
    <Text style={{
        fontFamily:Fonts.Regular,
        fontSize:14,
         color:Colors.dark_gray
    }}>GST</Text>
    */}
    <Line style={{  marginVertical: 3 }}></Line>
    <Text style={{
        fontFamily:Fonts.Regular,
        fontSize:14,
        color:Colors.dark_gray
    }}>Delivery Charge</Text>
</View>

<View style={{flexDirection:'column'}}>
<Text style={{
        fontFamily:Fonts.Regular,
        fontSize:14,
        // color:Colors.dark_gray
}}>Rs {(total).toFixed(2)}</Text>
    <Line style={{  marginVertical: 3 }}></Line>
    <Text style={{
        fontFamily:Fonts.Regular,
        fontSize:14,
        // color:Colors.dark_gray
    }}>- Rs {(totalSave).toFixed(2)}</Text>
   <Line style={{  marginVertical: 3 }}></Line>
    {/* <View
    style={{
        // height:'10%',
        // width:'100%',
        justifyContent:'center',
        alignItems:'center'}}>
    <Text style={{
        fontFamily:Fonts.Regular,
        fontSize:14,
       
        // color:Colors.dark_gray
    }}>Rs. 8.00</Text>
    </View> */}
    <Line style={{  marginVertical: 3 }}></Line>
    <View
    style={{ backgroundColor:Colors.white,
        elevation:2,
        height:25,
        width:'100%',
        justifyContent:'center',
        alignItems:'center'}}>
    <Text style={{
        fontFamily:Fonts.Regular,
        fontSize:14,
       
        // color:Colors.dark_gray
    }}>Rs. {total <= this.state.charge_limit ? this.state.del_charge : 0}</Text>
    </View>
   

</View>

</View>

<View 
 style={{
   marginVertical: 20,
     height:height*0.10,
     paddingHorizontal:20,
     justifyContent:'space-between',
     alignItems:'center',
     flexDirection:'row',
 backgroundColor:Colors.viewBox}}>

<Text
style={{
fontSize:14,
fontFamily:Fonts.SemiBold,

}}>Total Payable Amount</Text>

<Text style={{
    fontFamily:Fonts.SemiBold,
    fontSize:20,
    color:Colors.primary
}}>Rs {(finalPrice).toFixed(2)}</Text>

</View>

<TouchableOpacity
                        // onPress={() => this.Login()}
                        onPress={() => {
                            this.getPermissions()

                           
                        }}
                        activeOpacity={0.8}
                        style={{
                            marginVertical:10,
                            width: '70%', borderRadius: 40, elevation: 1,
                            justifyContent: 'center', alignItems: 'center', alignSelf: 'center',
                            backgroundColor: Colors.acent, height: height * 0.2 / 2.8
                        }}>

                        <Text style={{ fontFamily: Fonts.bold, fontSize: 18, color: Colors.white }}>Check Out</Text>

                    </TouchableOpacity>
                    <Line style={{ height: 40 }} />

                </View>

                }
                </ScrollView>

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
      this.setState({modalVisible: false})
          }}
        >


      <TouchableOpacity style={styles.ModalContainer} onPress={()=> {
          this.setState({modalVisible: false})
      }}>
      <View style={styles.netAlert}>





      <View style={styles.netAlertContent}>
      <View style={{ alignItems:'center', justifyContent:'flex-end', marginTop:50 }}>
   
     
   <Image
             style={{
             
             }}
             resizeMode='contain'
             source={require("../images/swipe.gif")}
             style={{ width: width, height:width *.4,  }}
           />
    
</View>
      <Text style={styles.netAlertTitle}>
        Swipe Left
      </Text>
      <Text style={styles.netAlertDesc}>
        You can remove your product from go to swipe left option and click on delete.
      </Text>
      </View>
 
    
    
      </View>

        </TouchableOpacity>

      </Modal>

            </SafeAreaView>
        )
    }

}

const styles = StyleSheet.create({
  
   

    rowBack: {
        flex: 1, margin: 6 
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
        right:0
    },
    backRightBtnLeft: {
        backgroundColor: 'blue',
        right: 75,
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
    },
    trash: {
        backgroundColor: Colors.viewBox,
        width:50,
        height:50,
        paddingHorizontal: 0,
        borderRadius: 10,
    },
    ModalContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor:'rgba(0,0,0,0.5)'
      },
      netAlert: {
        overflow: "hidden",
       
        width: width ,
        height: height,
     
       
        backgroundColor:'rgba(0,0,0,0.7)'
      },
      netAlertContent: {
        flex: 1,
     
    
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
        color: Colors.white,
        fontFamily: Fonts.light,
        paddingVertical: 5,
        textAlign:'center'
      }
});
