

import React from 'react';
import {
    Text,
    View,
    SafeAreaView,
    FlatList,
    Dimensions,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView, Platform,Modal
} from 'react-native';
import Colors from '../common/Colors';
import Header from '../component/Header';
import Fonts from '../common/Fonts';
import Line from '../common/Line';
import { Dropdown } from '../component/dropdown';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;


import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import API from '../common/Api';
import Loader from '../common/Loader';
import timeout from '../common/timeout';
import Toast from 'react-native-simple-toast';
import { NavigationEvents } from 'react-navigation';

export default class ViewDetails extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
           cart:[],
            sizeDropdown:[],
            qty: 1,
            mqty: this.props.navigation.state.params.item.price[0].mqty,
            dropqty:'',
            enableScrollViewScroll: true,
            Dropdown: false,
            price:0,
            discount:0,
            oprice:0,
            cartCount : 0,subscriptionModal:false
        }

    }
    componentDidMount() {
        AsyncStorage.getItem('cart').then(cart=> {
            console.log(cart);
            
            if(cart){
                this.setState({cart: JSON.parse(cart)}, ()=> {
                    this.state.cart.filter((data, index)=> {
                        if(data.pid == this.props.navigation.state.params.item.id && data.size == this.props.navigation.state.params.item.price[0].title){
                           
                            this.setState({qty: data.qty})
                           
                            
                            this.setState({refresh: !this.state.refresh})
                        } else {
                            
                        }
                        
                    }) 
                })
            }
        })
        this.setState({ dropqty: this.props.navigation.state.params.item.price[0].title , oprice: this.props.navigation.state.params.item.price[0].oprice, qty: this.props.navigation.state.params.item.qty, sizeDropdown: this.props.navigation.state.params.item.price, discount: this.props.navigation.state.params.item.price[0].discount, price: this.props.navigation.state.params.item.price[0].value }, ()=> {
            
        })
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


    onEnableScroll = (value) => {
        this.setState({
            enableScrollViewScroll: value,
        });
    };
    increment=()=>{
        if(this.state.qty == this.state.mqty){
            Toast.show("Maximum quantity reached",Toast.SHORT);
        }else{
        this.setState({
            qty: this.state.qty + 1
        }, ()=> {
            this.state.cart.filter((data, i)=> {
                if(data.pid == this.props.navigation.state.params.item.id && data.size == this.state.dropqty){
                 data.qty =  data.qty + 1;
                 data.price = this.state.price;
                 data.oprice = this.state.oprice;
                 data.totalprice = this.state.price * data.qty;
                 console.log(this.state.cart);
                 AsyncStorage.setItem ('cart', JSON.stringify (this.state.cart));
                }
            })
        });
    }
      };
      
      decrement=()=>{
          if(this.state.qty == 1){
              return false;
          }else{
              return this.setState({
                qty: this.state.qty - 1
            }, ()=> {
                this.state.cart.filter((data, i)=> {
                    if(data.pid == this.props.navigation.state.params.item.id && data.size == this.state.dropqty){
                     data.qty =  data.qty - 1;
                     data.price = this.state.price;
                     data.oprice = this.state.oprice;
                     data.totalprice = this.state.price * data.qty;
                     console.log(this.state.cart);
                     AsyncStorage.setItem ('cart', JSON.stringify (this.state.cart));
                    }
                })
            });
          }
       
      };



      addCart = () => {
        let cartArray = [];
        AsyncStorage.getItem('cart').then(cart=> {
          console.log(cart);
          
          if(cart){
            cartArray = JSON.parse(cart);
            var obj = {
                id: cartArray[cartArray.length - 1].id + 1,
                pid : this.props.navigation.state.params.item.id,
                size: this.state.dropqty,
                price: this.state.price,
                totalprice: this.state.price * this.state.qty,
                oprice: this.state.oprice,
                name: this.props.navigation.state.params.item.name,
                qty: this.state.qty,
                mqty: this.state.mqty,
                img: this.props.navigation.state.params.item.img,
                priceArray: this.props.navigation.state.params.item.price,
             
            }
            cartArray.push(obj);
            console.log(cartArray);
      
            AsyncStorage.setItem('cart', JSON.stringify(cartArray));
          } else {
            var obj = {
                id: 1,
                pid : this.props.navigation.state.params.item.id,
                size: this.state.dropqty,
                price: this.state.price,
                totalprice: this.state.price * this.state.qty,
                oprice: this.state.oprice,
                name: this.props.navigation.state.params.item.name,
                qty: this.state.qty,
                mqty: this.state.mqty,
                img: this.props.navigation.state.params.item.img,
                priceArray: this.props.navigation.state.params.item.price,
      
            }
            cartArray.push(obj);
            console.log(cartArray);
            
            AsyncStorage.setItem('cart', JSON.stringify(cartArray));
          }
         this.setState({add : true}, ()=> {
           AsyncStorage.getItem('cart').then(cart=> {
             this.setState({cartCount: JSON.parse(cart).length, cart: JSON.parse(cart)})
             this.setState({refresh: !this.state.refresh})
           })
         })
        });
       
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
                    pageTitle={"Product's details"}
                    iconName={require('../images/home_05.png')}
                    cartCount={this.state.cartCount}
                    Notification={() => {
                        this.props.navigation.navigate('Notification')
                    }}
                    Cart={() => {
                        this.props.navigation.navigate('Cart')
                    }}
                  
                />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    onMomentumScrollEnd={() => {
                        this.onEnableScroll(true);
                    }}
                    scrollEnabled={this.state.enableScrollViewScroll}
                    style={{ flex: 1, backgroundColor: Colors.white }}>

                    <View style={{
                        alignSelf: 'center',
                        marginVertical: 20,
                        height: height * 0.4 / 1.2,
                        borderRadius: 10,
                        width: '90%',
                        borderWidth: 1,
                        borderColor: Colors.light_gray,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: Colors.white
                    }}>
                        <Image
                            resizeMode="contain"
                            style={{
                                alignSelf: 'center',
                                height: '100%',
                                borderRadius: 10,
                                width: '100%'

                            }}
                            // source={this.props.navigation.state.params.item.image}
                            source={{uri: this.props.navigation.state.params.item.img}}
                        />

{this.state.discount ? 
                                        <View
                                            resizeMode="contain"
                                            style={{
                                                position: 'absolute',
                                                right: 5,
                                                top: 5,
                                                height: 40, width: 40,
                                                alignItems:'center',
                                                justifyContent:'center',
                                                borderRadius:20,
                                                backgroundColor: Colors.black
                                            }}
                                           
                                        >
                                            <Text style={{fontSize:10, color: Colors.white, textAlign:'center', fontFamily: Fonts.SemiBold}}>
                                        {this.state.discount}% {'\n'}off
                                            </Text>
                                            </View>
                                            : null }
                    </View>


                    <View
                        style={{ paddingHorizontal: 20, flexDirection: 'column' }}>

                        <Text
                            style={{ fontSize: 16, fontFamily: Fonts.SemiBold }}>

                            {this.props.navigation.state.params.item.name}</Text>

                        {/* <Text
                            style={{ fontFamily: Fonts.Regular, color: Colors.primary, paddingVertical: 5 }}>{this.props.navigation.state.params.item.rs}</Text> */}


                    </View>

                    <Line
                        style={{
                            height: 2,
                            width: '100%',
                            marginVertical: 25,
                            backgroundColor: Colors.light_gray
                        }}
                    />


              
                        <View
                        style={{
                            flexDirection: 'row',
                                flex:1,
                             
                           paddingHorizontal:10,
                            justifyContent: 'space-around'
                        }}>
                        <View style={{ flex: 1, paddingHorizontal:10,  zIndex:9999, }}>
                            <Text style={{
                                fontFamily: Fonts.Regular,
                                fontSize: 14,
                               
                            }}>Select Qty</Text>


                            <View
                                style={{
                                    marginVertical: 10,
                                    justifyContent: 'center',
                                    alignItems: 'flex-start',


                                }}>



                                <View
                                   
                                    Style={{
                                       
                                      
                                        backgroundColor: Colors.light_gray,
                                        alignSelf: 'flex-start',


                                    }}>
                                    <TouchableOpacity style={{
                                        flexDirection: 'row',
                                     
                                        padding: 10,
                                        backgroundColor: Colors.light_gray,
                                        justifyContent: 'flex-start',
                                        alignItems: 'center'
                                    }} onPress={()=> {
                                        this.setState({Dropdown: !this.state.Dropdown})
                                    }}>
                                        <Text style={{
                                            fontSize: 14,
                                            fontFamily: Fonts.Regular,
                                           
                                            
                                        }}
                                   >{this.state.dropqty}</Text>
                                        <View style={styles.accessory}>
                                            <View style={styles.triangleContainer}>
                                                <View style={[styles.triangle]} />
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    {/*  */}
                                </View>

                                 {this.state.Dropdown ?
                                    <View
                                        style={{

                                            minHeight: 5,
                                            width: '100%',
                                            zIndex:9999,
                                            // position: 'absolute',
                                            // top: 30,
                                            backgroundColor:'red' 
                                        }}
                                    >
                                        <View
                                            style={{

                                                borderWidth: 0.8,
                                                borderColor: Colors.light_gray,
                                                paddingVertical: 10,
                                                flex: 1,
                                                zIndex:999,
                                                backgroundColor: 'white',
                                                elevation: 2,
                                                shadowColor: Colors.medium_gray,
                                shadowOffset:{height:0, width:2},
                                shadowRadius:20,
                                shadowOpacity: 0.5,
                                            }}>

                                            <FlatList
                                                onTouchStart={() => {
                                                    this.onEnableScroll(false);
                                                }}
                                                onMomentumScrollEnd={() => {
                                                    this.onEnableScroll(true);
                                                }}
                                                contentContainerStyle={{
                                                    flexGrow: 1,
                                                }}
                                                extraData={this.state.refresh}
                                                listKey={(item, index) => index.toString()}
                                                data={this.state.sizeDropdown}
                                                renderItem={({ item, index }) => (
                                                    <View style={{ flex: 1, margin: 6, }}>
                                                        <TouchableOpacity
                                                        // style={{backgroundColor:'red'}}
                                                            onPress={() => {
                                                                this.onEnableScroll(true);
                                                                this.setState({ dropqty: item.title, price: item.value, oprice: item.oprice, discount: item.discount, Dropdown: false }, ()=> {
                                                                    this.state.cart.filter((data, i)=> {
                                                                        if(data.pid == this.props.navigation.state.params.item.id && data.size == this.state.dropqty){
                                                                         this.setState({qty: data.qty}) 
                                                                         console.log(this.state.cart);
                                                                        } else {
                                                                            this.setState({qty: 1}) 
                                                                        }
                                                                    })
                                                                })
                                                            }}>
                                                            <Text style={{
                                                                textAlign: 'center',
                                                                fontFamily: item.title == this.state.dropqty ? Fonts.SemiBold : Fonts.Regular,
                                                                color: item.title == this.state.dropqty ? Colors.primary : Colors.black,
                                                                fontSize: 14
                                                            }}>{item.title}</Text>
                                                        </TouchableOpacity>


                                                    </View>
                                                )}

                                                keyExtractor={(item, index) => index.key}
                                            />



                                        </View>
                                    </View>
                                    : null} 

                            </View>



                        </View>

                        <View style={{ flex: 1,  paddingRight:10, }}>
                            <Text style={{
                               
                                fontFamily: Fonts.Regular,
                                fontSize: 14,
                                paddingHorizontal: 5
                            }}>Select Packets</Text>

                            <View style={{
                              
                                justifyContent: 'flex-start',
                                flexDirection: 'row',
                              
                                marginVertical: 10,
                              
                                
                            }}>

                                <TouchableOpacity
                                   onPress={()=>{
                                       
                                       this.decrement()
                                   }}
                                    style={{
                                        height: 30,
                                        width: 30,

                                        
                                        justifyContent: 'center',
                                        alignItems: 'center',

                                    }}>
                                    <Text
                                        style={{
                                            alignSelf:'center',textAlign:'center',
                                            fontFamily: Fonts.Light,
                                            marginTop:-8,
                                            fontSize: Platform.OS == 'ios' ? 28 : 28
                                        }}>-</Text>
                                </TouchableOpacity>

                                <View
                                    style={{
                                        paddingHorizontal:5,
                                       marginHorizontal:10,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: Colors.light_gray

                                    }}>
                                    <Text
                                        style={{
                                            alignSelf:'center',
                                            fontFamily: Fonts.Regular,
                                            fontSize: 16
                                        }}>{this.state.qty}</Text>
                                </View>

                                <TouchableOpacity
                                 onPress={()=>{
                                    this.increment()
                                }}
                                    style={{
                                        height: 30,
                                        width: 30,
                                        
                                        justifyContent: 'center',
                                        alignItems: 'center',

                                    }}>
                                    <Text
                                        style={{
                                            textAlign:'center',
                                            alignSelf:'center',
                                            fontFamily: Fonts.Light,
                                            fontSize: 20
                                        }}>+</Text>
                                </TouchableOpacity>
                            </View>

                           

                        </View>
<View style={{flex:1}}>
    
                        <Text style={{
                               
                               fontFamily: Fonts.SemiBold,
                               fontSize: 12,
                               color:Colors.red,
                               textDecorationLine:'line-through',
                               textAlign:'center',
                               paddingHorizontal: 5
                           }}> 
                            Rs. {(this.state.oprice) * (this.state.qty)}</Text>
<Text
                            style={{ fontSize: 14,
                             fontFamily:Fonts.SemiBold,
                             color:Colors.primary,
                             textAlign:'center',paddingVertical:5 }}>

                            Rs. {parseInt(this.state.price) * parseInt(this.state.qty)}</Text>

                            <Text
                            style={{ 
                             fontSize: 10,
                             fontFamily:Fonts.Light,
                             color:Colors.dark_gray,
                             textAlign:'center',
                             paddingVertical:0 
                             }}>

                           (Payable Amount)</Text>
</View>
                    </View>
                    <Line style={{ height: this.state.Dropdown ? 150 : 20 }} />
                    <View
                        style={{ paddingHorizontal: 20, marginBottom:20, flexDirection: 'column' }}>
                    <Text style={{ fontFamily: Fonts.Light, fontSize: 16 }}>{this.props.navigation.state.params.item.desc}</Text>
</View>

                    <TouchableOpacity
                        // onPress={() => this.Login()}
                        onPress={() => {

                            if(this.state.cart.some(data=> data.pid == this.props.navigation.state.params.item.id && data.size == this.state.dropqty)){
                                
                            } else {
                                this.addCart()
                            }
                        }}
                        activeOpacity={0.8}
                        style={{
                            zIndex:0,
                            width: '70%', borderRadius: 40, elevation: 1,
                            justifyContent: 'center', alignItems: 'center', alignSelf: 'center',
                            backgroundColor: this.state.cart.some(data=> data.pid == this.props.navigation.state.params.item.id && data.size == this.state.dropqty) ? Colors.medium_gray : Colors.acent, 
                             height: height * 0.2 / 2.8
                        }}>
{this.state.cart.some(data=> data.pid == this.props.navigation.state.params.item.id && data.size == this.state.dropqty) ? 
 <Text style={{ fontFamily: Fonts.SemiBold, fontSize: 18, color: Colors.white }}>ADDED</Text>
:
                        <Text style={{ fontFamily: Fonts.bold, fontSize: 18, color: Colors.white }}>Add to cart</Text>
    }
                    </TouchableOpacity>
                    <Line style={{ height: 40 }} />
                    <TouchableOpacity
                        // onPress={() => this.Login()}
                        onPress={() => {
                            this.setState({subscriptionModal:true})
                        
                        }}
                        activeOpacity={0.8}
                        style={{
                            zIndex:0,
                            width: '70%', borderRadius: 40, elevation: 1,
                            justifyContent: 'center', alignItems: 'center', alignSelf: 'center',
                            backgroundColor: Colors.primary, 
                             height: height * 0.2 / 2.8,marginBottom:50
                        }}>
 <Text style={{ fontFamily: Fonts.SemiBold, fontSize: 18, color: Colors.white }}>SUBSCRIBE</Text>

                    </TouchableOpacity>
                </ScrollView>
                <Modal
                animationType={"slide"}
                visible={this.state.subscriptionModal}
                onRequestClose={()=>this.setState({subscriptionModal:false})
            }
                transparent >
                    <ScrollView  
                    showsVerticalScrollIndicator={false}
                    >
                <TouchableOpacity
            onPress={() => this.setState({subscriptionModal: false})}
            style={{backgroundColor: 'black', height:250, opacity: 0.5,zIndex:1}}
          />
          <View 
          style={{height:Dimensions.get("window").height/1.25,alignItems:"center",paddingHorizontal:10,backgroundColor:"white",zIndex:2,marginTop:-25,borderTopLeftRadius:18,borderTopRightRadius:18}}
          >
              <View style={{height:4,width:100,backgroundColor:Colors.medium_gray,borderRadius:360,marginVertical:25}} />
            <TouchableOpacity style={{height:100,backgroundColor:"#fbfbfb",width:Dimensions.get("window").width/1.25,borderRadius:8}} >

            </TouchableOpacity>
            <TouchableOpacity
                        // onPress={() => this.Login()}
                        onPress={() => {

                        
                        }}
                        activeOpacity={0.8}
                        style={{
                            zIndex:0,
                            width: '70%', borderRadius: 40, elevation: 1,
                            justifyContent: 'center', alignItems: 'center', alignSelf: 'center',
                            backgroundColor: Colors.primary, 
                             height: height * 0.2 / 2.8,marginVertical:25
                        }}>
 <Text style={{ fontFamily: Fonts.SemiBold, fontSize: 18, color: Colors.white }}>SUBSCRIBE</Text>

                    </TouchableOpacity>
              </View></ScrollView>
                </Modal>
            </SafeAreaView>
        )
    }

}
const styles = StyleSheet.create({
    accessory: {
        width: 26,
        height: 26,
        justifyContent: 'center',
        alignItems: 'center',
    },

    triangle: {
        backgroundColor: Colors.primary,
        width: 10,
        height: 10,
        transform: [{
            translateY: -4,
        }, {
            rotate: '45deg',
        }],
    },

    triangleContainer: {
        width: 14,
        height: 8,
        overflow: 'hidden',
        alignItems: 'center',

        backgroundColor: 'transparent', /* XXX: Required */
    },
})