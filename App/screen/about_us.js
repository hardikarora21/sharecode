
import React from 'react';
import {
    Text,
    View,
    SafeAreaView,
    StatusBar,
    Dimensions
} from 'react-native';
import Colors from '../common/Colors'
import Header from '../component/Header'
import Fonts from '../common/Fonts';

import HTML from 'react-native-render-html';

import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import API from '../common/Api';
import Loader from '../common/Loader';
import timeout from '../common/timeout';
import Toast from 'react-native-simple-toast';
import { ScrollView } from 'react-native-gesture-handler';
import { NavigationEvents } from 'react-navigation';


export default class AboutUs extends React.Component {

    constructor(props)
    {
  
      super(props);
  
      this.state = {
        cartCount : 0,
      dataSource: "Please wait..."
    }
    }

componentDidMount(){
    this.Terms();
}
    Terms() {
        this.setState({loading: true});
        AsyncStorage.getItem('id').then(id =>{
        AsyncStorage.getItem('token').then(token =>{
        
          var Request = {
           security:1,
           token: JSON.parse(token),
          
         
          
          };
          console.log(API.about);
          console.log(JSON.stringify(Request));
          NetInfo.fetch().then(state => {
            if (state.isConnected) {
              timeout(
                15000,
                fetch(API.about, {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify(Request)
                })
                  .then(res => res.json())
                  .then(res => {
                    console.log("About RESPONCE:::  ", res);
                    if (res.status == "success") {
                       
                     
       
                       this.setState({ loading: false, dataSource: res.content },)
       
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


    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }}>
               <NavigationEvents onDidFocus={()=> {
                      this.countFunction()
                    }} />


                <StatusBar barStyle='default'
                    hidden={false} backgroundColor={Colors.primary} />
                <Header
                    Back={() => {
                        this.props.navigation.goBack();
                    }}
                    pageTitle={'About us'}
                    cartCount={this.state.cartCount}
                    iconName={require('../images/home_05.png')}
                    Notification={() => {
                        this.props.navigation.navigate('Notification')
                    }}
                    Cart={() => {
                        this.props.navigation.navigate('Cart')
                    }}
                    
                />
<ScrollView contentContainerStyle={{flex: 1, backgroundColor: Colors.white}}  showsVerticalScrollIndicator={false}>

                <View style={{
                    flex: 1, backgroundColor: Colors.white, justifyContent: 'center',
                    alignItems: 'center'
                    , paddingHorizontal: 20,
                    paddingVertical: 20
                }}>

<HTML html={this.state.dataSource} imagesMaxWidth={Dimensions.get('window').width} />


                </View>
                </ScrollView>
            </SafeAreaView>
        )
    }

}
