import React from 'react';
import {
    Text,
    View,
    SafeAreaView,
    StatusBar,
    Dimensions,
    TextInput,
    Image,
    Animated,
    ScrollView,
    FlatList,
    Modal,
    StyleSheet,
    TouchableOpacity,
    RefreshControl
} from 'react-native';
import Colors from '../common/Colors';
import Fonts from '../common/Fonts';
import Header from '../component/Header';
import Icon from 'react-native-vector-icons/FontAwesome';
import Line from '../common/Line';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import SliderEntry from '../component/slider/SliderEntry';
import styles, { colors } from '../component/slider/index.style';
import { ENTRIES1 } from '../component/slider/entries';
import { StackActions, NavigationActions, NavigationEvents } from "react-navigation";

import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import API from '../common/Api';
import Loader from '../common/Loader';
import timeout from '../common/timeout';
import Toast from 'react-native-simple-toast';


const { width: width, height: height } = Dimensions.get('window');
const SLIDER_1_FIRST_ITEM = 1;
function wp(percentage) {
    const value = (percentage * width) / 100;
    return Math.round(value);
}

const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);
const sliderWidth = width;


export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            slider:[],
            category:[],
            todaysdeal:[],
            productslist:[],
            cartCount:0,
            modalVisible: false,
            slider1ActiveSlide: SLIDER_1_FIRST_ITEM,


        };
    }

    componentDidMount(){
        this.sliderAPI()
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
      this.sliderAPI()
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


    sliderAPI = () => {

        this.setState({loading: true});
        AsyncStorage.getItem('id').then(id =>{
        AsyncStorage.getItem('token').then(token =>{
        
          var Request = {
           security:0,
           token: JSON.parse(token),
           id: id

          
          };
          console.log(API.slider);
          console.log(JSON.stringify(Request));
          NetInfo.fetch().then(state => {
            if (state.isConnected) {
              timeout(
                15000,
                fetch(API.slider, {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify(Request)
                })
                  .then(res => res.json())
                  .then(res => {
                    console.log("Login RESPONCE:::  ", res);
                    if (res.status == "success") {
                        this.categoryAPI();
                     
       
                       this.setState({ loading: false, slider: res.data, msg: res.msg }, () => {
                        AsyncStorage.getItem('popup').then(popup =>{
                          if(popup){
                          
                          } else {
                            this.setState({modalVisible: res.popup});
                            AsyncStorage.setItem('popup', '1')
                          }
                        })
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
                        this.categoryAPI();
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


      categoryAPI = () => {

        this.setState({loading: true});
        AsyncStorage.getItem('id').then(id =>{
        AsyncStorage.getItem('token').then(token =>{
        
          var Request = {
           security:0,
           token: JSON.parse(token),
           id: id

          
          };
          console.log(API.category);
          console.log(JSON.stringify(Request));
          NetInfo.fetch().then(state => {
            if (state.isConnected) {
              timeout(
                15000,
                fetch(API.category, {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify(Request)
                })
                  .then(res => res.json())
                  .then(res => {
                    console.log("category RESPONCE:::  ", res);
                    if (res.status == "success") {
                   
                     this.todaysDealAPI()
       
                       this.setState({ loading: false, category: res.data },)
       
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
                        this.todaysDealAPI()
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
                    console.log("category RESPONCE:::  ", res);
                    if (res.status == "success") {
                   
                        this.ourProductsAPI()
       
                       this.setState({ loading: false, todaysdeal: res.data },)
       
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
                      // Toast.show(res.message,Toast.SHORT,);
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



      ourProductsAPI = () => {

        this.setState({loading: true});
        AsyncStorage.getItem('id').then(id =>{
        AsyncStorage.getItem('token').then(token =>{
        
          var Request = {
           security:0,
           token: JSON.parse(token),
           id: id

          
          };
          console.log(API.products);
          console.log(JSON.stringify(Request));
          NetInfo.fetch().then(state => {
            if (state.isConnected) {
              timeout(
                15000,
                fetch(API.products, {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify(Request)
                })
                  .then(res => res.json())
                  .then(res => {
                    console.log("profucts RESPONCE:::  ", res);
                    if (res.status == "success") {
                   
                     
       
                       this.setState({ loading: false, productslist: res.data },)
       
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


    _renderItemWithParallax({ item, index }) {
        return (
            <SliderEntry
          
                data={item}
                even={(index + 1) % 2 === 0}
               navigation={this.props.navigation}
              
            />
        );
    }
    render() {
        const { slider1ActiveSlide } = this.state;
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }}>
                <StatusBar barStyle='default'
                    hidden={false} backgroundColor={Colors.primary} />
                    <NavigationEvents onDidFocus={()=> {
                      this.countFunction()
                    }} />
                <Header
                    OpenDrawer={() => {
                        this.props.navigation.openDrawer();
                    }}
                    pageTitle={'Home'}
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
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={this._refreshControl()}
                    style={{ flex: 1 }}>
                    <View style={{ flex: 1, backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center' }}>

                        
                           <TouchableOpacity
                                onPress={()=>{
                                    this.props.navigation.navigate('Search')
                                   
                                }}
                                style={{ height: height * 0.06 + 3, width: '90%',
                                marginVertical: 20,
                                // paddingHorizontal: 6,
                                backgroundColor: Colors.white,
                                elevation: 2, borderRadius: 20,
                                flexDirection: 'row',
                                shadowColor: Colors.medium_gray,
                                shadowOffset:{height:0, width:2},
                                shadowRadius:20,
                                shadowOpacity: 0.5,
                                justifyContent: 'space-between',borderWidth:2,borderColor:"#fbfbfb",
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
                                        height: '60%',marginRight:10,tintColor:Colors.primary
                                    }}
                                    source={require('../images/home_18.png')}
                                />
                                </View>
                            </TouchableOpacity>

                        

                        <Carousel
                            ref={c => this._slider1Ref = c}
                            data={this.state.slider}
                            renderItem={this._renderItemWithParallax.bind(this)}
                            sliderWidth={width}
                            itemWidth={width}
                            hasParallaxImages={true}
                            firstItem={SLIDER_1_FIRST_ITEM}
                            inactiveSlideScale={0.94}
                            inactiveSlideOpacity={0.7}
                            // inactiveSlideShift={20}
                            containerCustomStyle={styles.slider}
                            contentContainerCustomStyle={styles.sliderContentContainer}
                            loop={true}
                            loopClonesPerSide={2}
                            autoplay={true}
                            autoplayDelay={500}
                            autoplayInterval={3000}
                            onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index })}
                        />

                        <Pagination
                            dotsLength={this.state.slider.length}
                            activeDotIndex={slider1ActiveSlide}
                            containerStyle={styles.paginationContainer}
                            dotColor={Colors.primary}
                            dotStyle={styles.paginationDot}
                            inactiveDotColor={Colors.dark_gray}
                            inactiveDotOpacity={0.4}
                            inactiveDotScale={0.6}
                            carouselRef={this._slider1Ref}
                            tappableDots={!!this._slider1Ref}
                        />

                        <FlatList
                            ListHeaderComponent={() => <View style={{ height: 50 }} />}
                            showsHorizontalScrollIndicator={false}
                            horizontal
                            style={{ backgroundColor: 'white', flex: 1, paddingVertical: 10,marginTop:50 }}
                            extraData={this.state.refresh}
                            listKey={(item, index) => index.toString()}
                            data={this.state.category}
                            renderItem={({ item, index }) => (
                                <View style={{ flex: 1, margin: 6 }}>

                                    <View
                                        style={{
                                            minHeight: height * 0.1, width: width * 0.2,
                                            backgroundColor: item.color,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderRadius: 6,

                                        }}>
                                        <TouchableOpacity
                                        onPress={()=>{
                                          if(item.count == 0){
                                            this.props.navigation.navigate('Listproduct',{cat_id: item.id})

                                          } else {
                                            this.props.navigation.navigate('ViewCategory',{item: item})
                                          }
                                        }}
                                            style={{
                                                //  backgroundColor:'red',                                          
                                                width: width * 0.3 / 2,
                                                height: height * 0.3 / 4,
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <Image
                                                resizeMode="contain"
                                                style={{

                                                    width: '70%',
                                                    height: '70%',
                                                }}
                                                source={{uri: item.img}}
                                            />
                                        </TouchableOpacity>


                                    </View>
                                    <Text
                                        style={{
                                            width: width * 0.2,
                                            fontFamily: Fonts.Regular,
                                            textAlign: 'center',
                                            fontSize: 12
                                        }}>{item.name}</Text>


                                </View>
                            )}

                            keyExtractor={(item, index) => index.key}
                        />
                        {this.state.todaysdeal.length < 1 ? null : 
                        <View style={{
                            flexDirection: 'row', width: '100%',
                            paddingHorizontal: 10,
                            paddingVertical: 8,
                            justifyContent: 'space-between'
                        }}>

                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ height: '100%', backgroundColor: 'black', width: 4, borderRadius: 10 }} />
                                <Text
                                    style={{ paddingHorizontal: 8, fontSize: Fonts.SemiBold, fontSize: 16 }}>Today's deals</Text>
                            </View>
                            <TouchableOpacity 
                            onPress={()=>{
                                this.props.navigation.navigate('TodayDealsProduct')
                            }}>
                            <Text style={{ fontSize: Fonts.Regular, fontSize: 14 }}>View All</Text>
                            </TouchableOpacity>
                        </View>
    }
                        <FlatList
                            ListFooterComponent={() => <View style={{ height: 50 }} />}
                            ListHeaderComponent={() => <View style={{ height: 50 }} />}
                            showsHorizontalScrollIndicator={false}
                            horizontal
                            style={{ backgroundColor: 'white', flex: 1, paddingVertical: 0 }}
                            extraData={this.state.refresh}
                            listKey={(item, index) => index.toString()}
                            data={this.state.todaysdeal}
                            renderItem={({ item, index }) => (
                                <View style={{ flex: 1, margin: 8 }}>

                                    <View
                                        style={{
                                            height: height * 0.2, width: width * 0.4,

                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderRadius: 8,


                                        }}>
                                        <TouchableOpacity
                                        onPress={()=>{
                                            this.props.navigation.navigate('ProductDetails',{item:item})
                                        }}
                                            activeOpacity={0.8}
                                            style={{
                                                height: '100%',
                                                width: width * 0.4,
                                                borderRadius: 8,
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <Image
                                                resizeMode="contain"
                                                style={{
                                                    borderRadius: 8,
                                                  
                                                    width: '100%',
                                                    height: '100%',
                                                }}
                                                source={{ uri: item.img }}
                                            />
                                    
                                        </TouchableOpacity>
                                        {item.percentage ? 
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
                                        {item.percentage}% {'\n'}off
                                            </Text>
                                            </View>
                                            : null }

                                    </View>


                                    <View style={{ flex:1,  flexDirection: 'column', width: width*.4 }}>
                                        <Text
                                            style={{
                                                fontFamily: Fonts.Regular,
                                                textAlign: 'left',
                                                fontSize: 14,
                                                paddingHorizontal: 2
                                            }}>{item.name}</Text>
                                        <View style={{ flex:1,  flexDirection: 'row', alignItems: 'center', justifyContent:'space-between' }}>
<View style={{flex:1, flexDirection:'column'}}>
                                            <Text
                                                style={{
                                                    fontFamily: Fonts.Regular,
                                                    textAlign: 'left',
                                                    color: Colors.primary,
                                                    fontSize: 12,
                                                    paddingHorizontal: 2
                                                }}>Rs. {item.price}/{item.size}</Text>

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
</View>

                                            <Image
                                                 resizeMode="contain"
                                                style={{
                                                    borderRadius: 8,
                                                    alignSelf: 'flex-end',
                                                    marginLeft: 5,
                                                    width: 10,
                                                    height: 10,
                                                }}
                                                source={require('../images/home_73.png')}
                                            />
                                        </View>


                                    </View>


                                </View>
                            )}

                            keyExtractor={(item, index) => index.key}
                        />


                        <Line style={{ height: 5, width: '100%', backgroundColor: Colors.light_gray, marginVertical: 25 }}></Line>
                     

                        <View style={{
                            flexDirection: 'row', width: '100%',
                            paddingHorizontal: 10,
                            paddingVertical: 8,
                            justifyContent: 'space-between'
                        }}>

                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ height: '100%', backgroundColor: 'black', width: 4, borderRadius: 10 }} />
                                <Text
                                    style={{ paddingHorizontal: 8, fontSize: Fonts.SemiBold, fontSize: 16 }}>Our Products</Text>
                            </View>
                            <TouchableOpacity 
                            style={{ flexDirection: 'row' }}
                            onPress={()=>{

                                this.props.navigation.navigate('Listproduct')
                            }}>
                            <Text style={{ fontSize: Fonts.Regular, fontSize: 14,color:Colors.primary }}>View All</Text>
                            <View style={{ height: 20,marginLeft:10, backgroundColor: Colors.primary, width: 4, borderRadius: 10 ,alignSelf:"center"}} />

                            </TouchableOpacity>
               </View>

                        <FlatList
                            ListFooterComponent={() => <View style={{ height: 50 }} />}
                            ListHeaderComponent={() => <View style={{ height: 50 }} />}
                            showsHorizontalScrollIndicator={false}
                            horizontal
                            style={{ backgroundColor: 'white', flex: 1, paddingVertical: 0 }}
                            extraData={this.state.refresh}
                            listKey={(item, index) => index.toString()}
                            data={this.state.productslist}
                            renderItem={({ item, index }) => (
                                <View style={{ flex: 1, margin: 8, overflow:'visible',borderWidth: 2,borderRadius:10,borderColor:"#efefef"}}>

                                    <View
                                        style={{
                                            height: height * 0.2, width: width * 0.4,

                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderRadius: 8,


                                        }}>
                                        <TouchableOpacity
                                        onPress={()=>{
                                            this.props.navigation.navigate('Viewproduct',{item:item})
                                        }}
                                            activeOpacity={0.8}
                                            style={{
                                                height: '100%',
                                                width: width * 0.4,
                                                borderRadius: 8,
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <Image
                                                resizeMode="cover"
                                                style={{
                                                    borderRadius: 8,
                                                    backgroundColor: Colors.light_gray,
                                                    width: '100%',
                                                    height: '100%',
                                                }}
                                                source={{uri: item.img}}
                                            />
                                                    
                                        </TouchableOpacity>

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
                                    </View>
                                    

                                    <View style={{ flexDirection: 'column', paddingVertical: 10,paddingHorizontal:10, width: width * 0.4 }}>
                                        <Text
                                            style={{
                                                fontFamily: Fonts.Light,
                                                textAlign: 'left',
                                                fontSize: 14,
                                                minHeight:40,
                                                paddingHorizontal: 2
                                            }}    numberOfLines={2}>{item.name}</Text>
                                            <Text
                                                style={{
                                                    fontFamily: Fonts.Regular,
                                                    textAlign: 'left',
                                                    flex:1,
                                                    color: Colors.primary,
                                                    fontSize: 12,
                                                   
                                                    paddingHorizontal: 2
                                                }}
                                             
                                                >Rs. {item.price[0].value}/{item.price[0].title}</Text>


                                        <View style={{ flex:1, flexDirection: 'row', alignItems: 'center', justifyContent:'space-between' }}>
                                        <Text
                                                style={{
                                                    textDecorationLine: 'line-through',
                                                    fontFamily: Fonts.SemiBold,
                                                    textAlign: 'left',
                                                   
                                                    color: Colors.red,
                                                    fontSize: 10,
                                                    paddingHorizontal: 2
                                                }}>Rs {item.price[0].oprice}</Text>
                                            

                                            <Image
                                                resizeMode="contain"
                                                style={{
                                                    borderRadius: 8,
                                                    alignSelf: 'flex-end',

                                                    width: 10,
                                                    height: 10,
                                                }}
                                                source={require('../images/home_73.png')}
                                            />
                                        </View>


                                    </View>


                                </View>
                            )}

                            keyExtractor={(item, index) => index.key}
                        />
<View style={{height:50}}/>
                    </View>
                </ScrollView>

                <Modal
        ref= {"updateModal"}
          style={{
              justifyContent:'center',
              alignItems:'center',


          }}
          visible={this.state.modalVisible}
          position = 'bottom'
          backdrop={true}
          coverScreen={true}
          backdropPressToClose={false}
          backdropOpacity = {0.5}
          transparent={true}
          swipeToClose={false}
          onRequestClose={() => {
      //        alert('Modal Closed');
          }}
        >


      <View style={styles1.ModalContainer}>
      <View style={styles1.netAlert}>





      <View style={styles1.netAlertContent}>
      <View style={{ alignItems:'center', justifyContent:'flex-start', marginTop:10 }}>
   
 
    
</View>
<Text style={styles1.netAlertTitle}>
       Notice
      </Text>
      <Text style={styles1.netAlertDesc}>
        {this.state.msg}
      </Text>
     
    
     

      </View>
      <TouchableOpacity onPress={()=> {this.setState({modalVisible: false})}} style={{padding:10, zIndex:9999, marginHorizontal: width*.08, backgroundColor: Colors.primary, marginVertical:20, borderTopRightRadius:5, borderBottomLeftRadius:5, borderTopLeftRadius:15, borderBottomRightRadius:15}}>
           <Text style={{textAlign:'center', color: Colors.white, fontSize:16, fontFamily: Fonts.bold}}>Okay</Text>
         </TouchableOpacity>
      </View>
    
        </View>

      </Modal>


            </SafeAreaView>
        )
    }

}



const styles1 = StyleSheet.create({
  container: {
    justifyContent: "center",
    flex: 1,
    backgroundColor: Colors.white,
    paddingTop: Platform.OS === "ios" ? 0 : 0
  },
  ModalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:'rgba(0, 0, 0, 0.6)'
  },
  netAlert: {
    overflow: "hidden",
    borderRadius: 10,
    shadowRadius: 10,
    width: width*.85 ,
    minHeight: height *.4,
    borderColor:"#f1f1f1",
    borderWidth:1,
    backgroundColor: Colors.white
  },
  netAlertContent: {
    flex: 1,
    padding: 20

    //  marginTop:20,
  },
  netAlertTitle: {
    fontSize: 20,
    paddingTop:5,
    color: Colors.primary,
    textAlign:'center',
    fontFamily: Fonts.bold,
  },
  netAlertDesc: {
    fontSize: 16,
    padding:10,
    alignSelf: 'center',
    width: width*.8,
    color: Colors.dark_gray,
    fontFamily: Fonts.light,
  
    textAlign:'center'
  }
});
