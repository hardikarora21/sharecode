import React from 'react';
import {
    Text,
    View,
    SafeAreaView,
    FlatList,
    Dimensions
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



export default class ReferEarn extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            refer_total:0,
            cartCount : 0,
            DataSource: []
        }

    }


    componentDidMount(){
        this.referAPI()
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

    referAPI = () => {

        this.setState({loading: true});
        AsyncStorage.getItem('id').then(id =>{
        AsyncStorage.getItem('token').then(token =>{
        
          var Request = {
           security:0,
           token: JSON.parse(token),
           id: id

          
          };
          console.log(API.refer_earn);
          console.log(JSON.stringify(Request));
          NetInfo.fetch().then(state => {
            if (state.isConnected) {
              timeout(
                15000,
                fetch(API.refer_earn, {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify(Request)
                })
                  .then(res => res.json())
                  .then(res => {
                    console.log("refer RESPONCE:::  ", res);
                    if (res.status == "success") {
                   
                     
       
                       this.setState({ loading: false, DataSource: res.data, refer_total: res.refer_total},)
       
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
                    pageTitle={'Reffer And Earn'}
                    iconName={require('../images/home_05.png')}
                    Notification={() => {
                        this.props.navigation.navigate('Notification')
                    }}
                    cartCount={this.state.cartCount}
                    Cart={() => {
                        this.props.navigation.navigate('Cart')
                    }}

                   
                />
                <View style={{ flex: 1, backgroundColor: Colors.white}}>
                    <View style={{ paddingVertical: 25 }}>
                        <Text style={{
                            fontFamily: Fonts.Regular,
                            fontSize: 16, textAlign: 'center'
                        }}>You Got reward point of</Text>
                        <Text style={{
                            color: Colors.primary, fontFamily: Fonts.SemiBold,
                            fontSize: 14, textAlign: 'center'
                        }}>Rs. {this.state.refer_total}</Text>

                    </View>
                    <Line style={{ height: 8, width: '100%', backgroundColor: Colors.light_gray, marginVertical: 0 }}></Line>

                    <FlatList
                        ListFooterComponent={() => <View style={{ height: height * 0.1 }} />}
                        showsVerticalScrollIndicator={false}
                        style={{ backgroundColor: 'white', paddingHorizontal: 20 }}
                        extraData={this.state.refresh}
                        listKey={(item, index) => index.toString()}
                        data={this.state.DataSource}
                        renderItem={({ item, index }) => (
                            <View style={{ flex: 1, margin: 10 }}>
                                {index == 0 ?
                                    <Text style={{
                                        fontFamily: Fonts.SemiBold, paddingHorizontal: 0,
                                        paddingVertical: 10,
                                        fontSize: 16, textAlign: 'left'
                                    }}>History of rewrad point</Text> : null}
                                <View
                                    style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingVertical: 8,
                                        paddingHorizontal: 0,
                                        borderBottomWidth: this.state.DataSource.length - 1 == index ? 0 : 1.5,
                                        borderBottomColor: Colors.light_gray
                                    }}>

                                    <View
                                        style={{ flexDirection: 'column' }}>
                                        <Text style={{
                                            fontFamily: Fonts.Regular,
                                            color: Colors.dark_gray,
                                            fontSize: 14, padding: 2,
                                        }}>{item.date}</Text>
                                        <Text style={{
                                            fontFamily: Fonts.Regular,
                                            color: Colors.dark_gray,
                                            fontSize: 14, padding: 2,
                                        }}>{item.msg}</Text>
                                        <Text style={{
                                            fontFamily: Fonts.Regular,
                                            color: Colors.dark_gray,
                                            fontSize: 14, padding: 2,
                                        }}>{item.time}, {item.type}</Text>
                                    </View>
                                    <Text style={{
                                        fontFamily: Fonts.Regular,
                                        fontSize: 16, padding: 2,
                                    }}>+Rs. {item.price}</Text>

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

