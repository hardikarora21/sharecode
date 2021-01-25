
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
    TextInput, Platform
} from 'react-native';
import Colors from '../common/Colors';
import Header from '../component/Header';
import Fonts from '../common/Fonts';
import { Dropdown } from '../component/dropdown'
import Line from '../common/Line';


import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import API from '../common/Api';
import Loader from '../common/Loader';
import timeout from '../common/timeout';
import Toast from 'react-native-simple-toast';
import { NavigationEvents } from 'react-navigation';


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
var DataSource = [
    {
        image: require('../images/temp/oil.png'),
        name: 'Tomatoes',
        rs: 'Price : Rs. 100/1kg',
        qty: 0,
    },
    {
        image: require('../images/temp/lotion.png'),
        name: 'Tomatoes',
        rs: 'Price : Rs. 100/1kg',
        qty: 0,
    },
    {
        image: require('../images/temp/Biriyani_bohvze.jpeg'),
        name: 'Tomatoes',
        rs: 'Price : Rs. 100/1kg',
        qty: 0,
    },
    {
        image: require('../images/temp/Biriyani_bohvze.jpeg'),
        name: 'Tomatoes',
        rs: 'Price : Rs. 100/1kg',
        qty: 0,
    }, 
    {
        image: require('../images/temp/Biriyani_bohvze.jpeg'),
        name: 'Tomatoes',
        rs: 'Price : Rs. 100/1kg',
        qty: 0,
    },
    


];
let todaysdeal = []
export default class TodayDealProduct extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            ProductList:[],
            todaysdeal:[],
            cart:[],
            cartCount : 0,
            initial:[],
            refresh: false,
            Qty: [
                {
                    value: '250 grms',
                    id: '1'
                },
                {
                    value: '500 grms',
                    id: '2'
                },
                {
                    value: '1 kg',
                    id: '3'
                },
                {
                    value: '2 kg',
                    id: '4'
                },
            ],

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
        this.todaysDealAPI();
        AsyncStorage.getItem('cart').then(cart=> {
            console.log(cart);
            
            if(cart){
                this.setState({cart: JSON.parse(cart)})
            }
        })
    }

    todaysDealAPI = () => {

        this.setState({loading: true});
        AsyncStorage.getItem('id').then(id =>{
        AsyncStorage.getItem('token').then(token =>{
        
          var Request = {
           security:0,
           token: JSON.parse(token),
           id: id

          
          };
          console.log(API.todays_deal);
          console.log(JSON.stringify(Request));
          NetInfo.fetch().then(state => {
            if (state.isConnected) {
              timeout(
                15000,
                fetch(API.todays_deal, {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify(Request)
                })
                  .then(res => res.json())
                  .then(res => {
                    console.log("todaysdeal RESPONCE:::  ", res);
                    if (res.status == "success") {
                   
                        this.setState({ loading: false, initial: res.data, todaysdeal: res.data }, ()=> {
                            if(this.state.cart.length > 0){
                                for(let i = 0 ; i< this.state.todaysdeal.length; i++){
                                      
                                        
                                        this.state.cart.filter((data, index)=> {
                                            if(data.pid == this.state.todaysdeal[i].pid && data.size == this.state.todaysdeal[i].size){
                                               
                                                this.state.todaysdeal[i].qty = data.qty;
                                               
                                                
                                                this.setState({refresh: !this.state.refresh})
                                            } else {
                                                
                                            }
                                            
                                        })  
                                }
                            }
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
                        this.ourProductsAPI()
                      Toast.show(res.message,Toast.SHORT,);
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

      updateQty = (item, index) => {
          
          return(
            <View style={{
                // width: '100%',
               
                flexDirection: 'row',
                
                marginVertical: 6,

            }}>

<Text
                        style={{
                            fontFamily: Fonts.Regular,
                            color: Colors.dark_gray,
                            fontSize: 16
                        }}>Qty: </Text>

                <TouchableOpacity
                    onPress={() => {
                        

                        if (item.qty == 1) {
                            return false;
                        } else {
                            item.qty = item.qty - 1
                            this.setState({ refresh: !this.state.refresh })

                            console.log('Data', this.state.todaysdeal);
                            this.state.cart.filter((data, i)=> {
                                if(data.pid == item.pid && data.size == item.size){
                                 data.qty =  data.qty - 1;
                                 data.totalprice = data.price * data.qty;
                                 console.log(this.state.cart);
                                 AsyncStorage.setItem ('cart', JSON.stringify (this.state.cart));
                                }
                            })
                               
                                
                          
                        }
                    }}
                    style={{
                        height: 25,
                        width: 25,
                       
                        justifyContent: 'center',
                        alignItems: 'center',

                    }}>
                    <Text
                        style={{
                            alignSelf: 'center',
                            fontFamily: Fonts.SemiBold,
                            fontSize: Platform.OS == 'ios' ? 20 : 25
                        }}>-</Text>
                </TouchableOpacity>

                <View
                    style={{
                        height:20,
                        width:40,
                        alignSelf: 'center',
                        marginHorizontal:10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: Colors.light_gray

                    }}>
                    <Text
                        style={{
                            alignSelf: 'center',
                            fontFamily: Fonts.Regular,
                            fontSize: 16
                        }}>{item.qty}</Text>
                </View>

                <TouchableOpacity
                    onPress={() => {
                        console.log("L", item);
                        if(item.qty == item.mqty){
                            Toast.show("Maximum quantity reached",Toast.SHORT);
                        } else {
                        item.qty = item.qty + 1;
                        this.setState({ refresh: !this.state.refresh })
                        console.log('Data', item.qty);
                        this.state.cart.filter((data, i)=> {
                            if(data.pid == item.pid && data.size == item.size){
                             data.qty =  data.qty + 1;
                             data.totalprice = data.price * data.qty;
                             console.log(this.state.cart);
                             AsyncStorage.setItem ('cart', JSON.stringify (this.state.cart));
                            }
                        })
                    }
                    }}
                    style={{
                        height: 25,
                        width:25,
                        alignSelf: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',

                    }}>
                    <Text
                        style={{
                            alignSelf: 'center',
                            fontFamily: Fonts.SemiBold,
                            fontSize: Platform.OS == 'ios' ? 20 : 25
                        }}>+</Text>
                </TouchableOpacity>

            </View>
          )
      }

      addCart = (item, index) => {
        let cartArray = [];
        AsyncStorage.getItem('cart').then(cart=> {
          console.log(cart);
          
          if(cart){
            cartArray = JSON.parse(cart);
            var obj = {
              id: cartArray[cartArray.length - 1].id + 1,
              pid : item.pid,
              size: item.size,
              price: item.price,
              totalprice: item.price * item.qty,
              oprice: item.oprice,
              name: item.name,
              qty: item.qty,
              mqty: item.mqty,
              img: item.img,
              priceArray: null
             
            }
            cartArray.push(obj);
            console.log(cartArray);
      
            AsyncStorage.setItem('cart', JSON.stringify(cartArray));
          } else {
            var obj = {
                id: 1,
                pid : item.pid,
                size: item.size,
                price: item.price,
                totalprice: item.price * item.qty,
                oprice: item.oprice,
                name: item.name,
                qty: item.qty,
                mqty: item.mqty,
                img: item.img,
                priceArray: null
      
            }
            cartArray.push(obj);
            console.log(cartArray);
            
            AsyncStorage.setItem('cart', JSON.stringify(cartArray));
          }
         this.setState({add : true}, ()=> {
           AsyncStorage.getItem('cart').then(cart=> {
             this.setState({cartCount: JSON.parse(cart).length, cart: JSON.parse(cart)})
           })
         })
        });
       
      }

      searchFilterFunction = text => {
        if(!text || text ==''){
           this.setState({
               todaysdeal: this.state.initial
           })
        } else {
          
        this.setState({
          value: text,
          todaysdeal: this.state.initial
        }, ()=> {
          const newData = this.state.todaysdeal.filter(item => {
            const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
          this.setState({
            todaysdeal: newData
        })
        });
      
        
      }
      };


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
                    pageTitle={"Todays's deal"}
                    iconName={require('../images/home_05.png')}
                    Notification={() => {
                        this.props.navigation.navigate('Notification')
                    }}
                    cartCount={this.state.cartCount}
                    Cart={() => {
                        this.props.navigation.navigate('Cart')
                    }}

                />

<ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: Colors.white }}>
             
                <View showsVerticalScrollIndicator={false} style={{ flax: 1 }}>
                <Line style={{  marginVertical: 10 }}></Line>
                <TouchableOpacity
                                onPress={()=>{
                                    this.props.navigation.navigate('Search')
                                   
                                }}
                                style={{ height: height * 0.06 + 3, width: '80%',
                                marginVertical: 20,
                                alignSelf:'center',
                                shadowColor: Colors.medium_gray,
                                shadowOffset:{height:0, width:2},
                                shadowRadius:20,
                                shadowOpacity: 0.5,
                                paddingHorizontal: 6,
                                backgroundColor: Colors.white,
                                elevation: 2, borderRadius: 15,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center' }}>
                               
                            <View
                              
                                style={{
                                    paddingHorizontal: 10,
                                  alignItems:'flex-start',
                                  justifyContent:'center',
                                    height: '100%', width: '90%'
                                }}
                               
                               
                               
                              
                               
                                    
                                >
                                  <Text style={{fontSize:14, color: Colors.medium_gray, }}>Type here</Text>
                            </View>
                            <View style={{height: 30, width:30, alignItems:'center', justifyContent:'center'}}>
                            <Image
                                    resizeMode="contain"

                                    style={{
                                        width: '60%',
                                        height: '60%',
                                    }}
                                    source={require('../images/home_18.png')}
                                />
                                </View>
                            </TouchableOpacity>
                    <FlatList
                        // ListFooterComponent={() => <View style={{ height: height * 0.1 }} />}
                        key={this.state.todaysdeal.length}
                        showsVerticalScrollIndicator={false}
                        data={this.state.todaysdeal}
                        style={{ backgroundColor: 'white', marginTop:10 }}
                        extraData={this.state}
                        listKey={(item, index) => index.toString()}
                      
                        renderItem={({ item, index }) => (
                            <View style={{ flex: 1, margin: 6 }}>

                                <View
                                    style={{
                                        flex: 1,
                                        paddingVertical: 15,
                                        width: '100%',
                                        alignSelf: 'center', paddingHorizontal: 10,
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        flexDirection: 'row',
                                        backgroundColor: Colors.white,
                                        borderBottomWidth:2,borderBottomColor:Colors.light_gray
                                    }}>
                                    <View style={{
                                        flex:1,
                                        flexDirection: 'row'
                                    }}>
                                        <TouchableOpacity onPress={()=> this.props.navigation.navigate('ProductDetails', {item: item})}>

                                            <View style={{
                                                height: height * 0.2/1.8,
                                                backgroundColor: Colors.white,
                                                width: width * 0.2,
                                               
                                                borderColor: Colors.light_gray,
                                                borderWidth:1
                                               
                                            }}>
                                                <Image
                                                    resizeMode="contain"
                                                    style={{
                                                       
                                                        width: '100%',
                                                        height: '100%',
                                                        
                                                    }}
                                                    source={{uri: item.img}} />
                                            </View>
</TouchableOpacity>
<TouchableOpacity onPress={()=> this.props.navigation.navigate('ProductDetails', {item: item})}>

                                        <View style={{
                                            flexDirection: 'column',
                                           // alignItems: 'center',
                                           paddingHorizontal:10
                                        }}>
                                         
                                            <Text
                                               
                                                style={{
                                                    flex:1,
                                                    fontFamily: Fonts.Regular,
                                                    fontSize: 16,
                                                }}>
                                                {item.name}</Text>
                                                <Text
                                                   
                                                    style={{
                                                        fontFamily: Fonts.Regular,
                                                        color: Colors.dark_gray,

                                                        fontSize: 16
                                                    }}>

                                                Price: Rs. {item.price}/{item.size}</Text>

                                                <Text
                                                style={{
                                                    textDecorationLine: 'line-through',
                                                    fontFamily: Fonts.SemiBold,
                                                    textAlign: 'left',
                                                    flex:1, 
                                                    color: Colors.red,
                                                    fontSize: 10,
                                                    paddingHorizontal: 2
                                                }}>Rs {item.oprice}</Text>
                                    {this.updateQty(item, index)}
                                        
                                               </View>
</TouchableOpacity>
                                    </View>
                                    
                                    <View style={{ 
                                            height:'90%',
                                            alignItems:'flex-end',
                                            flex:0.4,
                                           
                                            flexDirection: 'column',justifyContent:'space-between' }}>
                                        <TouchableOpacity onPress={()=> this.props.navigation.navigate('ProductDetails', {item: item})}>

                                        <Image
                                                // resizeMode="contain"
                                                style={{
                                                    borderRadius: 8,
                                                    alignSelf: 'flex-end',
                                                    width: 10,
                                                    height: 15,
                                                }}
                                                source={require('../images/home_73.png')}
                                            />
                                        </TouchableOpacity>
                                            <TouchableOpacity
                                            onPress={()=>{
                                                if(this.state.cart.some(data=> data.pid == item.pid && data.size == item.size)){

                                                } else {
                                                    this.addCart(item, index)
                                                }
                                               
                                            }}
                                            activeOpacity={ this.state.cart.some(data=> data.pid == item.pid && data.size == item.size) ? 1 : 0.2}
                                            style={{
                                                backgroundColor: this.state.cart.some(data=> data.pid == item.pid && data.size == item.size) ? Colors.medium_gray :Colors.primary,
                                                paddingVertical:5,
                                                paddingHorizontal:15,
                                                justifyContent:'center',
                                                alignItems:'center',
                                                borderRadius: 20,
                                            }}>
                                               <Text style={{
                                                   fontFamily:Fonts.Regular,
                                                   color:Colors.white,
                                                   fontSize:12
                                               }}>{'+ Cart'}</Text>
                                            </TouchableOpacity> 
                                    </View>





                                </View>

                            </View>
                        )}

                        keyExtractor={(item, index) => index.key}
                    />

                <Line style={{ height: 40 }} />

                </View>
                </ScrollView>
            </SafeAreaView>
        )
    }

}
