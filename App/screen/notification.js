
import React from 'react';
import {
     Text,
    View,
    SafeAreaView,
    FlatList,
    Dimensions,
    RefreshControl
} from 'react-native';
import Colors from '../common/Colors';
import Header from '../component/Header';
import Fonts from '../common/Fonts';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;


import { StackActions, NavigationActions, NavigationEvents } from "react-navigation";
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import API from '../common/Api';
import Loader from '../common/Loader';
import timeout from '../common/timeout';
import Toast from 'react-native-simple-toast';


export default class Notification extends React.Component{
    constructor(props){
        super(props)
        this.state={
            loading: false,
            DataSource:[],
            cartCount : 0,
            message:''
        }

    }

    componentDidMount(){
        this.notificationAPI()
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

    pullDown = () => {
      this.notificationAPI();
  };
 
  
    _refreshControl() {
      return (
        <RefreshControl
          colors={['#00913d', '#00913d', '#00913d']}
          refreshing={this.state.loading}
          onRefresh={() => this.pullDown()}
          tintColor={Colors.primary}
        />
      );
    }

    notificationAPI = () => {

        this.setState({loading: true});
        AsyncStorage.getItem('id').then(id =>{
        AsyncStorage.getItem('token').then(token =>{
        
          var Request = {
           security:0,
           token: JSON.parse(token),
           id: id

          
          };
          console.log(API.notification);
          console.log(JSON.stringify(Request));
          NetInfo.fetch().then(state => {
            if (state.isConnected) {
              timeout(
                15000,
                fetch(API.notification, {
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
    render(){
        return(
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }}>
              <NavigationEvents onDidFocus={()=> {
                this.notificationAPI();
                this.countFunction()
              }} />
                  <Header
                        OpenDrawer={() => {
                            this.props.navigation.openDrawer();
                        }}
                        pageTitle={'Notification'}
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

                    {this.state.DataSource.length < 1 ? 
        <View style={{flex:1, alignItems:'center', justifyContent:'center', backgroundColor: Colors.white}}>
            <Text style={{fontSize:16, color: Colors.medium_gray, textAlign:'center'}}>{this.state.message}</Text>
        </View>
                    :
              <View style={{flex:1, backgroundColor: 'white'}}>
            
              <FlatList
                           ListFooterComponent={() => <View style={{height:height*0.1}}/>}
                            showsVerticalScrollIndicator={false}
                            style={{ backgroundColor: 'white'}}
                           
                            extraData={this.state.refresh}
                            listKey={(item, index) => index.toString()}
                            data={this.state.DataSource}
                            renderItem={({ item, index }) => (
                                <View style={{ flex: 1, margin: 0}}>

                                    <View
                                        style={{
                                          flex:1,
                                          paddingVertical:28,
                                          borderBottomWidth:this.state.DataSource.length-1 == index ?0 :1.5,
                                          borderBottomColor:Colors.light_gray
                                        }}>

<Text
                                   
                                      style={{fontFamily:Fonts.SemiBold,
                                        fontSize:16,
                                        paddingHorizontal:25 }}>
                                        {item.title}</Text>   

                                    <Text
                                     
                                      style={{fontFamily:Fonts.Regular,
                                        fontSize:14,
                                        paddingHorizontal:25 }}>
                                        {item.desc}</Text>   

                                        <Text
                                     
                                      style={{fontFamily:Fonts.Light,
                                        // color:Colors.acent,
                                        fontSize:14,
                                        textAlign:'right',
                                        paddingHorizontal:25 ,
                                        paddingVertical:6}}>
                                        {item.time}</Text>       
                                    

                                    </View>


                                  
                                </View>
                            )}

                            keyExtractor={(item, index) => index.key}
                        />
              </View>
    }
            </SafeAreaView>
    )
}

}
