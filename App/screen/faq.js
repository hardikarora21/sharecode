
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
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import API from '../common/Api';
import Loader from '../common/Loader';
import timeout from '../common/timeout';
import Toast from 'react-native-simple-toast';
import { NavigationEvents } from 'react-navigation';

export default class Faq extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            DataSource: [],
            cartCount : 0,
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
    this.Faqs();
}
    Faqs() {
        this.setState({loading: true});
        AsyncStorage.getItem('id').then(id =>{
        AsyncStorage.getItem('token').then(token =>{
        
          var Request = {
           security:1,
           token: JSON.parse(token),
          
         
          
          };
          console.log(API.faqs);
          console.log(JSON.stringify(Request));
          NetInfo.fetch().then(state => {
            if (state.isConnected) {
              timeout(
                15000,
                fetch(API.faqs, {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify(Request)
                })
                  .then(res => res.json())
                  .then(res => {
                    console.log("Faq RESPONCE:::  ", res);
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



    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }}>
              <NavigationEvents onDidFocus={()=> {
                      this.countFunction()
                    }} />
                <Loader loading={this.state.loading} />
                <Header
                    Back={() => {
                        this.props.navigation.goBack();
                    }}
                    pageTitle={'FAQs'}
                    iconName={require('../images/home_05.png')}
                    Notification={() => {
                        this.props.navigation.navigate('Notification')
                    }}
                    cartCount={this.state.cartCount}
                    Cart={() => {
                        this.props.navigation.navigate('Cart')
                    }}
                                        />
                <View style={{ flex: 1, backgroundColor: Colors.white }}>

                    <FlatList
                        ListFooterComponent={() => <View style={{ height: height * 0.1 }} />}
                        showsVerticalScrollIndicator={false}
                        style={{ backgroundColor: 'white' }}
                        extraData={this.state.refresh}
                        listKey={(item, index) => index.toString()}
                        data={this.state.DataSource}
                        renderItem={({ item, index }) => (
                            <View style={{ flex: 1, margin: 0 }}>

                                <View
                                    style={{
                                        flex: 1,
                                        paddingVertical: 28,
                                        borderBottomWidth: this.state.DataSource.length - 1 == index ? 0 :2,
                                        borderBottomColor: Colors.light_gray
                                    }}>

                                    <Text
                                       
                                        style={{
                                            fontFamily: Fonts.SemiBold,
                                            fontSize: 16,
                                            paddingHorizontal: 25
                                        }}>
                                        {index+1}. {item.que}</Text>

                                    <Text
                                       
                                        style={{
                                            fontFamily: Fonts.bold,
                                             color:Colors.medium_gray,
                                            fontSize: 14,
                                            textAlign: 'left',
                                            paddingTop:10,
                                            paddingHorizontal: 25,
                                            paddingVertical: 6
                                        }}>
                                        {item.ans}</Text>


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
