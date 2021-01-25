
import React from 'react';
import {
    Text,
    View,
    SafeAreaView,
    FlatList,
    Dimensions,
    Image,
    TouchableOpacity
} from 'react-native';
import Colors from '../common/Colors';
import Header from '../component/Header';
import Fonts from '../common/Fonts';
import Line from '../common/Line';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

import { StackActions, NavigationActions, NavigationEvents } from "react-navigation";
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import API from '../common/Api';
import Loader from '../common/Loader';
import timeout from '../common/timeout';
import Toast from 'react-native-simple-toast';
import moment from 'moment';

export default class Order extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            orders:[],
            cartCount : 0,
            DataSource: []
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
        this.orderAPI()
    }

    orderAPI = () => {

        this.setState({loading: true});
        AsyncStorage.getItem('id').then(id =>{
        AsyncStorage.getItem('token').then(token =>{
        
          var Request = {
           security:0,
           token: JSON.parse(token),
           id: id

          
          };
          console.log(API.orders);
          console.log(JSON.stringify(Request));
          NetInfo.fetch().then(state => {
            if (state.isConnected) {
              timeout(
                15000,
                fetch(API.orders, {
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
                   
                     
       
                       this.setState({ loading: false, orders: res.data },)
       
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
                <Loader loading={this.state.loading} />
                <NavigationEvents onDidFocus={()=> {
                    this.orderAPI();
                    this.countFunction()
                }} />
                <Header
                    Back={() => {
                        this.props.navigation.goBack();
                    }}
                    pageTitle={'Order history'}
                    iconName={require('../images/home_05.png')}
                    Notification={() => {
                        this.props.navigation.navigate('Notification')
                    }}
                    cartCount={this.state.cartCount}
                    Cart={() => {
                        this.props.navigation.navigate('Cart')
                    }}
                       
                />
                <View style={{ flex: 1, backgroundColor:Colors.white }}>

                    <FlatList
                        ListFooterComponent={() => <View style={{ height: height * 0.1 }} />}
                        showsVerticalScrollIndicator={false}
                        style={{ backgroundColor: 'white' }}
                        extraData={this.state.refresh}
                        listKey={(item, index) => index.toString()}
                        data={this.state.orders}
                        renderItem={({ item, index }) => (
                            <View style={{ flex: 1, margin: 0 }}>

                                <View
                                    style={{
                                        flex: 1,
                                        paddingVertical: 20,
                                        borderBottomWidth: this.state.orders.length - 1 == index ? 0 : 7,
                                        borderBottomColor: Colors.light_gray
                                    }}>



                                    <Text
                                        numberOfLines={4}
                                        style={{
                                            fontFamily: Fonts.Regular,
                                            fontSize: 16,
                                            paddingHorizontal: 25
                                        }}>
                                        {item.msg}</Text>
                                        <TouchableOpacity
                                        onPress={()=>{
                                            this.props.navigation.navigate('OrderID', {item: item})
                                        }}>
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
                                            }}>{moment(item.order_date).format('DD')}</Text>

                                            <Text style={{
                                                fontFamily: Fonts.SemiBold,
                                                fontSize: 14, color: Colors.primary
                                            }}>{moment(item.order_date).format('MMMM')}</Text>
                                             {/* <Text style={{
                                                fontFamily: Fonts.SemiBold,
                                                fontSize: 18, color: Colors.primary
                                            }}>{moment(item.order_date).format('YYYY')}</Text> */}
                                        </View>

                                        <Line style={{
                                            height: '100%', width: 1,
                                            marginHorizontal: 6,
                                            backgroundColor: Colors.medium_gray
                                        }}></Line>



    <View style={{
        flexDirection:'column'
    }}>
        
<Text style={{
    fontFamily:Fonts.Regular,
    fontSize:18,
  color: Colors.dark_gray,
   
}}>
    Orderd ID: #{item.id}
</Text>
<View style={{flexDirection:'row', justifyContent:'space-between'}}>
<Text
numberOfLines={1}
style={{
  
    fontSize:14,
    fontFamily:Fonts.Light,
    width:width*1/2.8
    
}}>
    Rs. {item.total}
</Text>



<View style={{ flexDirection:'row', justifyContent:'flex-end',}}>
    <Text
    
    style={{fontSize:16,color:Colors.primary,
        paddingHorizontal:8,
        textAlign:'center',
    fontFamily:Fonts.Regular}}>
    {item.pcount} items
</Text>

<Image
                                                // resizeMode="contain"
                                                style={{
                                                    borderRadius: 8,
                                                    alignSelf: 'center',

                                                    width: 10,
                                                    height: 15,
                                                }}
                                                source={require('../images/home_73.png')}
                                            />
                                            
</View>

</View>
<Text
numberOfLines={1}
style={{
  
    fontSize:16,
    color: item.scolor,
    fontFamily:Fonts.SemiBold,
    
    
}}>
     {item.sname}
</Text>

    </View>

   
    </View>


                                 
                                    

                                    </TouchableOpacity>
                                </View>

                            </View>
                        )}

                        keyExtractor={(item, index) => index.key}
                    />
                </View>
            </SafeAreaView>
        )
    }

}
