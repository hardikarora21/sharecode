
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
    TextInput,
    Platform
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
export default class Search extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            cartCount : 0,
            ProductList:[],
            cart:[],
            Qty: [],
            initial:[],
            loading: false,
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
        AsyncStorage.getItem('cart').then(cart=> {
            console.log(cart);
            
            if(cart){
                this.setState({cart: JSON.parse(cart)})
            }
        })
       
    }

    searchAPI(text) {
       
        
        // this.setState({loading: true});
        AsyncStorage.getItem('id').then(id =>{
        AsyncStorage.getItem('token').then(token =>{
        
          var Request = {
           security:0,
           token: JSON.parse(token),
           id: id,
          name: text
            
          };
          console.log(API.search);
          console.log(JSON.stringify(Request));
          NetInfo.fetch().then(state => {
            if (state.isConnected) {
              timeout(
                15000,
                fetch(API.search, {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify(Request)
                })
                  .then(res => res.json())
                  .then(res => {
                    console.log("Product RESPONCE:::  ", res);
                    if (res.status == "success") {
                       
                     
       
                       this.setState({ loading: false, ProductList: res.data, initial:res.data }, ()=> {
                        if(this.state.cart.length > 0){
                            for(let i = 0 ; i< this.state.ProductList.length; i++){
                                  
                                    
                                    this.state.cart.filter((data, index)=> {
                                        if(data.pid == this.state.ProductList[i].id && data.size == this.state.ProductList[i].price[0].title){
                                           
                                            this.state.ProductList[i].qty = data.qty;
                                           
                                            
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
                        
                    //   Toast.show(res.message,Toast.SHORT,);
                      this.setState({data: res, loading: false, ProductList:[] });
                     
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


    searchFilterFunction = text => {
        if(!text || text ==''){
          this.setState({
            ProductList: [],
           
          });
        } else {
        // this.setState({
        //   value: text,
        //   ProductList: this.state.initial
        // }, ()=> {
        //   const newData = this.state.ProductList.filter(item => {
        //     const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
        //     const textData = text.toUpperCase();
        //     return itemData.indexOf(textData) > -1;
        //   });
        //   this.setState({
        //     ProductList: newData,
           
        //   });
        // });
      
        if(text.length > 2){
            this.searchAPI(text)
        }
      }
      };


    addCart = (item, index) => {
        let cartArray = [];
        AsyncStorage.getItem('cart').then(cart=> {
          console.log(cart);
          
          if(cart){
            cartArray = JSON.parse(cart);
            var obj = {
              id: cartArray[cartArray.length - 1].id + 1,
              pid : item.id,
                size: item.price[0].title,
                price: item.price[0].value,
                mqty: item.price[0].mqty,
                totalprice: item.price[0].value * item.qty,
                oprice: item.oprice,
                name: item.name,
                qty: item.qty,
                img: item.img,
                priceArray: item.price,
             
            }
            cartArray.push(obj);
            console.log(cartArray);
      
            AsyncStorage.setItem('cart', JSON.stringify(cartArray));
          } else {
            var obj = {
                id: 1,
                pid : item.id,
                size: item.price[0].title,
                price: item.price[0].value,
                totalprice: item.price[0].value * item.qty,
                oprice: item.oprice,
                name: item.name,
                mqty: item.price[0].mqty,
                qty: item.qty,
                img: item.img,
                priceArray: item.price
      
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
                    pageTitle={'Search'}
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
<ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: Colors.white, }}>
             
                <View showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: Colors.white, }}>
                <Line style={{  marginVertical: 10 }}></Line>
                <View style={{
                            height: height * 0.06 + 3, width: '80%',
                            marginVertical: 10,
                            shadowColor: Colors.medium_gray,
                                shadowOffset:{height:0, width:2},
                                shadowRadius:20,
                                shadowOpacity: 0.5,
                            paddingHorizontal: 6,
                            backgroundColor: Colors.white,
                            elevation: 2, borderRadius: 15,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignSelf:'center',
                            alignItems: 'center'
                        }}>
                            <TextInput
                                placeholder="Type here"
                                selectionColor={Colors.primary}
                                placeholderTextColor={Colors.medium_gray}
                                style={{
                                    paddingHorizontal: 10,
                                    color: Colors.black,
                                    height: '100%', width: '90%'
                                }}
                                autoFocus={true}
                                autoCapitalize='none'
                                keyboardType={"default"}
                                onChangeText={text => this.searchFilterFunction(text)} 
                                returnKeyType={"next"}
                                onSubmitEditing={(event) => {

                                }}>
                            </TextInput>
                            <TouchableOpacity
                                style={{ height: 30, width: 30, justifyContent: 'center', alignItems: 'center' }}>
                                <Image
                                    resizeMode="contain"

                                    style={{
                                        width: '60%',
                                        height: '60%',
                                    }}
                                    source={require('../images/home_18.png')}
                                />
                            </TouchableOpacity>

                        </View>
                    <FlatList
                        // ListFooterComponent={() => <View style={{ height: height * 0.1 }} />}
                        showsVerticalScrollIndicator={false}
                        style={{ backgroundColor: 'white', marginTop:10 }}
                        extraData={this.state.refresh}
                        listKey={(item, index) => index.toString()}
                        data={this.state.ProductList}
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
  <TouchableOpacity onPress={()=> this.props.navigation.navigate('Viewproduct', {item: item})}>
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
                                            {item.price ? 
                                         <View
                                         resizeMode="contain"
                                         style={{
                                             position: 'absolute',
                                             right: -6,
                                             top: -6,
                                             height: 30,
                                             minWidth: 30,
                                             alignItems:'center',
                                             justifyContent:'center',
                                             borderRadius:15,
                                             backgroundColor: Colors.black
                                         }}
                                        
                                     >
                                            <Text style={{fontSize:8, color: Colors.white, textAlign:'center', fontFamily: Fonts.SemiBold}}>
                                        {item.price[0].discount}% {'\n'}off
                                            </Text>
                                            </View>
                                            : null }
</TouchableOpacity>

                                        <View style={{
                                            flexDirection: 'column',
                                           // alignItems: 'center',
                                           paddingHorizontal:10
                                        }}>
                                           <TouchableOpacity onPress={()=> this.props.navigation.navigate('Viewproduct', {item: item})}>
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

                                                Price: Rs. {item.price[0].value}/{item.price[0].title}</Text>

                                                <Text
                                                style={{
                                                    textDecorationLine: 'line-through',
                                                    fontFamily: Fonts.SemiBold,
                                                    textAlign: 'left',
                                                    flex:1, 
                                                    color: Colors.red,
                                                    fontSize: 10,
                                                    paddingHorizontal: 2
                                                }}>Rs {item.price[0].oprice}</Text>

</TouchableOpacity>
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
                                                        console.log(item);

                                                        if (item.qty == 1) {
                                                            return false;
                                                        } else {
                                                            this.setState({ refresh: !this.state.refresh })
                                                            item.qty = item.qty - 1
                                                            console.log('Data', this.state.ProductList);
                                                            this.state.cart.filter((data, i)=> {
                                                                if(data.pid == item.id && data.size == item.price[0].title){
                                                                 data.qty =  data.qty - 1;
                                                                 data.totalprice = data.price * data.qty;
                                                                 console.log(this.state.cart);
                                                                 AsyncStorage.setItem ('cart', JSON.stringify (this.state.cart));
                                                                }
                                                            })
                                                        }
                                                    }}
                                                    style={{
                                                        height:25,
                                                        width: 25,
                                                     
                                                        justifyContent: 'center',
                                                        alignItems: 'center',

                                                    }}>
                                                    <Text
                                                        style={{
                                                            alignSelf:'center',
                                                            fontFamily: Fonts.bold,
                                                            fontSize: Platform.OS == 'ios' ? 20 : 25
                                                        }}>-</Text>
                                                </TouchableOpacity>

                                                <View
                                                    style={{
                                                        height:20,
                                                        width:40,
                                                        marginHorizontal:10,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        backgroundColor: Colors.light_gray,
                                                        alignSelf:'center'
                                                    }}>
                                                    <Text
                                                        style={{
                                                            fontFamily: Fonts.Regular,
                                                            fontSize: 16
                                                        }}>{item.qty}</Text>
                                                </View>

                                                <TouchableOpacity
                                                    onPress={() => {
                                                        if(item.qty == item.price[0].mqty){
                                                            Toast.show("Maximum quantity reached",Toast.SHORT);
                                                        } else {
                                                        this.setState({ refresh: !this.state.refresh })
                                                        item.qty = item.qty + 1
                                                        console.log('Data', this.state.ProductList);
                                                        this.state.cart.filter((data, i)=> {
                                                            if(data.pid == item.id && data.size == item.price[0].title){
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
                                                       
                                                        justifyContent: 'center',
                                                        alignItems: 'center',

                                                    }}>
                                                    <Text
                                                        style={{
                                                            alignSelf:'center',
                                                            fontFamily: Fonts.bold,
                                                            fontSize: Platform.OS == 'ios' ? 20 : 25
                                                        }}>+</Text>
                                                </TouchableOpacity>

                                            </View>
                                        
                                               </View>

                                    </View>
                                    
                                        <View style={{ 
                                            height:'90%',
                                            alignItems:'flex-end',
                                            flex:0.4,

                                           
                                            flexDirection: 'column',justifyContent:'space-between' }}>
                                        <TouchableOpacity onPress={()=> this.props.navigation.navigate('Viewproduct', {item: item})}>

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
                                                if(this.state.cart.some(data=> data.pid == item.id && data.size == item.price[0].title)){

                                                } else {
                                                    this.addCart(item, index)
                                                }
                                               
                                            }}
                                            activeOpacity={ this.state.cart.some(data=> data.pid == item.id && data.size == item.price[0].title) ? 1 : 0.2}
                                            style={{
                                                backgroundColor: this.state.cart.some(data=> data.pid == item.id && data.size == item.price[0].title) ? Colors.medium_gray :Colors.primary,
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
