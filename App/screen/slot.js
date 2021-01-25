
import React from 'react';
import {
    Text,
    View,
    SafeAreaView,
    FlatList,
    Dimensions,
    TouchableOpacity,
    StyleSheet,
    ScrollView
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
import moment from 'moment';
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default class Slot extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            DataSource: [],
            cartCount : 0,
            timeid:'',
            date: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
            minimumDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
            isDateTimePickerVisible: false,
            starttime:'',
            endtime:'',
            message:''
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
        this.slotAPI()
    }

    slotAPI = () => {

        this.setState({loading: true});
        AsyncStorage.getItem('id').then(id =>{
        AsyncStorage.getItem('token').then(token =>{
        
          var Request = {
           security:0,
           token: JSON.parse(token),
           id: id,
            del_date: moment(this.state.date).format("DD/MM/YYYY") 
          
          };
          console.log(API.delivery_slot);
          console.log(JSON.stringify(Request));
          NetInfo.fetch().then(state => {
            if (state.isConnected) {
              timeout(
                15000,
                fetch(API.delivery_slot, {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify(Request)
                })
                  .then(res => res.json())
                  .then(res => {
                    console.log("address RESPONCE:::  ", res);
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
                        var format = 'HH:mm:ss'

                        // var time = moment() gives you current time. no format required.
                        var time = moment(),
                          beforeTime = moment(res.del_date_limit, format),
                          afterTime = moment('23:59:00', format);
                                // this.slotAPI()
                                if (time.isBetween(beforeTime, afterTime)) {
                        this.setState({date: new Date(new Date().getTime() + 48 * 60 * 60 * 1000), minimumDate: new Date(new Date().getTime() + 48 * 60 * 60 * 1000)})
                                    console.log('is between')
                                  
                                  } else {
                                  
                                    console.log('is not between')
                                  
                                  }
                    //   Toast.show(res.message,Toast.SHORT,);
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
                    // this.slotAPI();
                    this.countFunction()
                }} />
                <Loader loading={this.state.loading} />
                <Header
                    Back={() => {
                        this.props.navigation.goBack();
                    }}
                    pageTitle={'Delivery date'}
                    iconName={require('../images/home_05.png')}
                    Notification={() => {
                        this.props.navigation.navigate('Notification')
                    }}
                    cartCount={this.state.cartCount}

                    Cart={() => {
                        this.props.navigation.navigate('Cart')
                    }}
                                        />
                                        <ScrollView contentContainerStyle={{flex: 1, backgroundColor: Colors.white}}> 
                <View style={{ flex: 1, backgroundColor: Colors.white }}>
<Text
 style={{fontFamily:Fonts.SemiBold,
 fontSize:16,paddingLeft: 10,paddingTop: 16,}}>
    Select date
</Text>

 
<TouchableOpacity
onPress={()=> {
    this.setState({isDateTimePickerVisible: true})
   }}
                                style={{
                                    margin: 10,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: Colors.light_gray,

                                }}>


                                   <View style={{
                                       flexDirection: 'row',
                                      
                                       padding: 10,
                                     
                                       justifyContent: 'flex-start',
                                       alignItems: 'center'
                                   }} >
                                       <Text style={{
                                           fontSize: 14,
                                           fontFamily: Fonts.Regular,
                                       }}>{moment(this.state.date).format('DD/MM/YYYY')}</Text>
                                       <View style={styles.accessory}>
                                           <View style={styles.triangleContainer}>
                                               <View style={[styles.triangle]} />
                                           </View>
                                       </View>
                                   </View>
                                 


</TouchableOpacity>
<Text
 style={{fontFamily:Fonts.SemiBold,
 fontSize:16,paddingLeft: 10,paddingTop: 16,}}>
    Approx time
</Text>

{this.state.DataSource.length > 0 ?
                    <FlatList
                        ListFooterComponent={() => <View style={{ height: height * 0.1 }} />}
                        showsVerticalScrollIndicator={false}
                        style={{ backgroundColor: 'white', paddingHorizontal:16 }}
                        extraData={this.state.refresh}
                        listKey={(item, index) => index.toString()}
                        data={this.state.DataSource}
                        renderItem={({ item, index }) => (
                            <View style={{ flex: 1, margin: 10 }}>

                                <TouchableOpacity
                                onPress={()=> {
                                    this.setState({timeid: item.id, starttime: item.start_time, endtime: item.end_time})
                                }}
                                    style={{
                                        flex: 1,
                                        padding: 16,
                                        borderRadius:5,
                                        borderWidth:1,
                                        backgroundColor: this.state.timeid == item.id ? Colors.primary : Colors.white,
                                        borderColor: Colors.primary
                                    }}>

                                    <Text
                                        numberOfLines={3}
                                        style={{
                                            fontFamily: Fonts.Light,
                                            fontSize: 16,
                                            color: this.state.timeid == item.id ? Colors.white : Colors.black,
                                            paddingHorizontal: 0
                                        }}>
                                      {moment(item.start_time, "hh:mm:ss").format("hh:mm a")} to {moment(item.end_time, "hh:mm:ss").format("hh:mm a")}</Text>

                                    


                                </TouchableOpacity>

                              

                            </View>
                        )}

                        keyExtractor={(item, index) => index.key}
                    />

                    : 

                    <View style={{flex:1, alignItems:'center', justifyContent:'center', margin:20}}>
                         <Text
                                        numberOfLines={3}
                                        style={{
                                            fontFamily: Fonts.Light,
                                            fontSize: 16,
                                            textAlign:'center',
                                            color: Colors.black,
                                            paddingHorizontal: 0
                                        }}>
                                     {this.state.message}
                                     </Text>

                                   
                        </View>
    }
                      <TouchableOpacity
                            // onPress={() => this.Login()}
                            onPress={() => {
                                
                                
                                // if(this.state.timeid == ""){
                                //     Toast.show("Please select time slot",Toast.SHORT,);
                                // } else {
                                    this.props.navigation.navigate('Payment', {
                                        cart: this.props.navigation.state.params.cart, 
                                        finalPrice : this.props.navigation.state.params.finalPrice,
                                        totalQty : this.props.navigation.state.params.totalQty,
                                        total : this.props.navigation.state.params.total,
                                        totalSave : this.props.navigation.state.params.totalSave,
                                        lat:this.props.navigation.state.params.lat,
                                        lon:this.props.navigation.state.params.lon,
                                        flat: this.props.navigation.state.params.flat,
                                        street: this.props.navigation.state.params.street,
                                        area: this.props.navigation.state.params.area,
                                        pin: this.props.navigation.state.params.pin,
                                        del_charge: this.props.navigation.state.params.del_charge,
                                        date: moment(this.state.date).format('DD/MM/YYYY'),
                                        // timeid: this.state.timeid
                            
                                    });
                                // }
                            }}
                            activeOpacity={0.8}
                            style={{
                                width: '80%', borderRadius: 40, elevation: 1,
                                marginBottom:20,
                                justifyContent: 'center', alignItems: 'center', alignSelf: 'center',
                                backgroundColor: Colors.acent, height: height * 0.2 / 2.5
                            }}>

                            <Text style={{ fontFamily: Fonts.bold, fontSize: 18, color: Colors.white }}>Submit</Text>

                        </TouchableOpacity>
                </View>
                </ScrollView>
                <DateTimePickerModal
        isVisible={this.state.isDateTimePickerVisible}
        onConfirm={(date)=> {
            this.setState({date: date, isDateTimePickerVisible: false}, ()=>  {
                this.slotAPI()
            })
        }}
        onCancel={()=> {
            this.setState({isDateTimePickerVisible: false})
        }}
        minimumDate={this.state.minimumDate}
        mode='date'
      />           
            </SafeAreaView>
        )
    }

}


const styles = StyleSheet.create({

    textInput: {
        paddingHorizontal: 10,
        width: '80%',

        fontSize: 16,
        fontFamily: Fonts.regular,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white,
    },
    label: {

        marginTop: 15,
        color: Colors.primary,
        fontSize: 14,
        paddingVertical: 3,
        fontFamily: Fonts.medium,
    },
    required: {
        marginTop: 15,
        color: 'red',
        fontSize: 14,
        paddingLeft: 3,
        paddingVertical: 3,
        fontFamily: Fonts.medium,
    },
    TextStyle: {
        fontSize: 18,
        color: Colors.primary,
        fontFamily: Fonts.black,
    },
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
    
            backgroundColor: 'transparent', 
        },
    
});