import React, { Component } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput,FlatList, Image, Dimensions, TouchableOpacity } from 'react-native';
import MapView from 'react-native-maps';
import Colors from '../common/Colors'
import Header from '../component/Header'
import Fonts from '../common/Fonts';
const { width: width, height: height } = Dimensions.get('window');

import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import API from '../common/Api';
import Loader from '../common/Loader';
import timeout from '../common/timeout';
import Toast from 'react-native-simple-toast';
import { NavigationEvents } from 'react-navigation';


export default class Category extends Component {
    constructor(props){
        super(props)
        this.state={
            loading: false,
            ListCard:[],
            subCategory:[],
            initial:[],
            count:0,
            cartCount : 0,
        }
        this.arrayholder = [];
    }


    componentDidMount(){
        this.subCategory()
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

    subCategory() {
        this.setState({loading: true});
        AsyncStorage.getItem('id').then(id =>{
        AsyncStorage.getItem('token').then(token =>{
        
          var Request = {
           security:0,
           token: JSON.parse(token),
           id: id,
           cat_id: this.props.navigation.state.params.item.id
          
          };
          console.log(API.sub_category);
          console.log(JSON.stringify(Request));
          NetInfo.fetch().then(state => {
            if (state.isConnected) {
              timeout(
                15000,
                fetch(API.sub_category, {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify(Request)
                })
                  .then(res => res.json())
                  .then(res => {
                    console.log("Sub Category RESPONCE:::  ", res);
                    if (res.status == "success") {
                       
                     
       
                       this.setState({ loading: false, subCategory: res.data, initial: res.data, count: res.count },)
       
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


    searchFilterFunction = text => {
      if(!text || text ==''){
        this.setState({
          subCategory: this.state.initial,
         
        });
      } else {
      this.setState({
        value: text,
        subCategory: this.state.initial
      }, ()=> {
        const newData = this.state.subCategory.filter(item => {
          const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
        this.setState({
          subCategory: newData,
         
        });
      });
    
      
    }
    };

    render() {
        return (
            <SafeAreaView style={styles.container}>
              <View style={{flex:1, backgroundColor: Colors.white}}>
                <Loader loading={this.state.loading} />
                <NavigationEvents onDidFocus={()=> {
                      this.countFunction()
                    }} />
                <Header
                    Back={() => {
                        this.props.navigation.goBack();
                    }}
                    pageTitle={'Shop by category'}
                    iconName={require('../images/home_05.png')}
                    Notification={() => {
                        this.props.navigation.navigate('Notification')
                    }}
                    cartCount={this.state.cartCount}
                    Cart={() => {
                        this.props.navigation.navigate('Cart')
                    }}
                />
                <View style={{
                    height: height * 0.06 + 3, width: '84%',
                    marginVertical: 20,
                    shadowColor: Colors.medium_gray,
                                shadowOffset:{height:0, width:2},
                                shadowRadius:20,
                                shadowOpacity: 0.5,
                    paddingHorizontal: 12,
                    backgroundColor: Colors.white,
                    elevation: 2, borderRadius: 15,
                    flexDirection: 'row',
                    alignSelf: 'center',
                    justifyContent: 'space-between',
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

                {/* this.props.navigation.state.params.item.rs */}

                <View style={{
                    flexDirection: 'row',
                  
                    alignItems: 'center',
                    width: '88%',
                    alignSelf:'center',
                    paddingHorizontal: 0,
                    paddingVertical:10
                }}>

                    <View style={{
                        flexDirection: 'row',
                      
                        alignItems:'center',
                       flex: 0.60,
                       paddingRight:30,
                    }}>

                        <Image
                            resizeMode="contain"
                            style={{
                                marginLeft:0,
                                paddingHorizontal:10,
                                width: 45,
                                height: 45,
                            }}
                            source={this.props.navigation.state.params.item.image}
                        />

                        <Text
                        style={{fontFamily:Fonts.Regular,
                            
                        fontSize:16,paddingHorizontal:10}}>{this.props.navigation.state.params.item.name}</Text>

                    </View>
<View style={{
    flex: 0.40,
}}>
  <Text
                    style={{paddingHorizontal:20,textAlign:'right',fontFamily:Fonts.SemiBold,
                    fontSize:14}}>{this.state.count} items</Text>

</View>
                  
                </View>

                <View style={{
                    height:height*0.45,
                    width:'90%',
                    marginVertical:10,
                    backgroundColor:Colors.viewBox,
                    alignSelf:'center'
                }}>

<FlatList
                           
                            style={{ backgroundColor: Colors.light_gray, flex: 1,
                             paddingVertical: 20 }}
                            extraData={this.state.refresh}
                            listKey={(item, index) => index.toString()}
                            data={this.state.subCategory}
                            renderItem={({ item, index }) => (
                                <View style={{ flex: 1, margin: 6,}}>
<TouchableOpacity style={{
    width:'100%',paddingHorizontal:20,
    flexDirection:'row',justifyContent:'space-between', alignItems:'center' 
}} onPress={()=> {this.props.navigation.navigate('Listproduct', {sub_id: item.id, cat_id: this.props.navigation.state.params.item.id })}}> 
  <Text
  style={{
      color:index==0 ? Colors.primary:null,
      fontSize:16,
      flex:1,
      fontFamily:Fonts.Regular
  }}>{item.name}</Text>
                            <Image
                                                // resizeMode="contain"
                                                style={{
                                                    borderRadius: 8,
                                                    alignSelf: 'center',
                                                    marginLeft: 5,
                                                    width: 10,
                                                    height: 15,
                                                    tintColor:index==0 ? Colors.primary:null
                                                }}
                                                source={require('../images/home_73.png')}
                                            />

</TouchableOpacity>
                          
                                </View>
                                      )}

                                      keyExtractor={(item, index) => index.key}
                                  />

                </View>

                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary
    },
    map: {
        flex: 1,
    }
});