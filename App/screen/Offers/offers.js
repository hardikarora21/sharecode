
import React from 'react';
import {
    Text,
    View,
    SafeAreaView,
    FlatList,
    Dimensions,
    Image
} from 'react-native';
import Colors from '../../common/Colors';
import Header from '../../component/Header';
import Fonts from '../../common/Fonts';
import { TouchableOpacity } from 'react-native-gesture-handler';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;


import { StackActions, NavigationActions, NavigationEvents } from "react-navigation";
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import API from '../../common/Api';
import Loader from '../../common/Loader';
import timeout from '../../common/timeout';
import Toast from 'react-native-simple-toast';

export default class Offers extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            DataSource: [],
            cartCount:0
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
        this.offerAPI()
    }

    offerAPI = () => {
        let sid = null;
        if(this.props.navigation.state.params){
            sid = this.props.navigation.state.params.id
        }

        this.setState({loading: true});
        AsyncStorage.getItem('id').then(id =>{
        AsyncStorage.getItem('token').then(token =>{
        
          var Request = {
           security:0,
           token: JSON.parse(token),
           id: id,
           sid: sid

          
          };
          console.log(API.offers);
          console.log(JSON.stringify(Request));
          NetInfo.fetch().then(state => {
            if (state.isConnected) {
              timeout(
                15000,
                fetch(API.offers, {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify(Request)
                })
                  .then(res => res.json())
                  .then(res => {
                    console.log("notificaton RESPONCE:::  ", res);
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
                    pageTitle={'Offers'}
                    iconName={require('../../images/home_05.png')}
                    cartCount={this.state.cartCount}
                    Notification={() => {
                        this.props.navigation.navigate('Notification')
                    }}
                    Cart={() => {
                        this.props.navigation.navigate('Cart')
                    }}
                    
                />
                <View style={{ flex: 1, backgroundColor: Colors.white }}>

                    <FlatList
                        ListFooterComponent={() => <View style={{ height: height * 0.1 }} />}
                        showsVerticalScrollIndicator={false}
                        style={{ backgroundColor: 'white', paddingVertical: 10 }}
                        extraData={this.state.refresh}
                        listKey={(item, index) => index.toString()}
                        data={this.state.DataSource}
                        renderItem={({ item, index }) => (
                            <View style={{ flex: 1, margin: 0 }}>

                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.navigation.navigate('ProductDetails',{item:item})
                                    }}
                                    activeOpacity={0.6}
                                    style={{
                                        flex: 1,
                                        paddingVertical: 10,
                                        paddingHorizontal: 10,
                                        flexDirection: 'row'
                                    }}>

                                    <View style={{
                                        borderWidth: 1,
                                        borderRadius: 8,
                                        borderColor: Colors.light_gray,
                                    }}>
                                        <Image
                                            resizeMode="cover"
                                            style={{
                                                backgroundColor: Colors.white,
                                                borderRadius: 8,

                                                height: height * 0.13,
                                                width: height * 0.13,
                                            }}
                                            source={{uri: item.img}}
                                        />
                                        <View
                                            resizeMode="contain"
                                            style={{
                                                position: 'absolute',
                                                right: -6,
                                                top: -6,
                                                height: 30,
                                                width: 30,
                                                alignItems:'center',
                                                justifyContent:'center',
                                                borderRadius:15,
                                                backgroundColor: Colors.black
                                            }}
                                           
                                        >
                                            <Text style={{fontSize:8, color: Colors.white, textAlign:'center', fontFamily: Fonts.Regular}}>
                                        {item.percentage}% {'\n'}off
                                            </Text>
                                            </View>
                                    </View>


                                    <View style={{
                                        flex: 1,
                                        marginLeft: 15,
                                        // backgroundColor:'red',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        borderBottomWidth: this.state.DataSource.length - 1 == index ? 0 : 1.5,
                                        borderBottomColor: Colors.light_gray
                                    }}>
                                        <View style={{ flexDirection: 'column' }}>
                                            <Text style={{ fontFamily: Fonts.Regular, fontSize: 18 }}>{item.name}</Text>

                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{
                                                    color: Colors.primary,
                                                    fontFamily: Fonts.Regular,
                                                    fontSize: 12
                                                }}>Rs. {item.price}/{item.size}</Text>
                                                <Text style={{
                                                    textDecorationLine: 'line-through',
                                                    fontFamily: Fonts.SemiBold,
                                                    textAlign: 'left',
                                                    color: Colors.red,
                                                    fontSize: 12,
                                                    paddingHorizontal: 8
                                                }}>Rs. {item.oprice}</Text>
                                            </View>


                                            <Text style={{ fontFamily: Fonts.Regular, fontSize: 14, paddingVertical: 4 }}>{item.msg}</Text>
                                        </View>
                                        <Image
                                            resizeMode="contain"
                                            style={{
                                                borderRadius: 15,
                                                alignSelf: 'flex-end',
                                                height: 15,
                                                width: 15,
                                                bottom: 10,
                                                tintColor: Colors.dark_gray
                                            }}
                                            source={require('../../images/home_73.png')}
                                        />
                                    </View>


                                </TouchableOpacity>

                            </View>
                        )}

                        keyExtractor={(item, index) => index.key}
                    />
                </View>
            </SafeAreaView>
        )
    }

}
