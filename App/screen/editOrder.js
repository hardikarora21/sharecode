
import React from 'react';
import {
    Text,
    View,
    SafeAreaView,
    FlatList,
    Dimensions,
    Animated,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Modal
} from 'react-native';
import Colors from '../common/Colors';
import Header from '../component/Header';
import Fonts from '../common/Fonts';
import { Dropdown } from '../component/dropdown'
import Line from '../common/Line';
import Dash from 'react-native-dash';
import { SwipeListView } from 'react-native-swipe-list-view';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;


import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import API from '../common/Api';
import Loader from '../common/Loader';
import timeout from '../common/timeout';
import Toast from 'react-native-simple-toast';
import { NavigationEvents } from 'react-navigation';

let finalPrice = 0;
let totalQty = 0;
let total = 0;
let totalSave = 0;



export default class EditOrder extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            cart:[],
           refresh:false,
           del_charge:0,
           charge_limit:0,
           modalVisible: false,

        }

    }

    componentDidMount(){
      
        this.chargeAPI();
        AsyncStorage.getItem('ecart').then(cart=> {
            console.log(cart, this.state.cart);
            
            if(cart){
                this.setState({cart: JSON.parse(cart), cartCount: JSON.parse(cart).length});
            
            }
        })
    }


  

  chargeAPI = () => {

      this.setState({loading: true});
      AsyncStorage.getItem('id').then(id =>{
      AsyncStorage.getItem('token').then(token =>{
      
        var Request = {
         security:1,
         token: JSON.parse(token),
         

        
        };
        console.log(API.delivery_charges);
        console.log(JSON.stringify(Request));
        NetInfo.fetch().then(state => {
          if (state.isConnected) {
            timeout(
              15000,
              fetch(API.delivery_charges, {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(Request)
              })
                .then(res => res.json())
                .then(res => {
                  console.log("delivery_charges RESPONCE:::  ", res);
                  if (res.status == "success") {
                 
                   
     
                     this.setState({ loading: false, del_charge: res.del_charge, charge_limit: res.charge_limit },)
     
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
                    this.setState({data: res, loading: false, del_charge: res.del_charge });
                   
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

    remove = (item) => {
        for(let i = 0; i < this.state.cart.length; i++) {
            if(this.state.cart[i].id === item.id) {
                this.state.cart.splice(i, 1);
                this.setState({refresh: !this.state.refresh}, ()=> {
                    if(this.state.cart.length > 0){
                      AsyncStorage.setItem('ecart', JSON.stringify(this.state.cart))
                    } else {
                      AsyncStorage.removeItem('ecart')
                    }
                })
            }
        }
    }

    closeRow = (rowMap, rowKey) => {
        console.log('rowMap',rowMap, rowKey);
        
       this.remove(rowKey)
    };



     onRowDidOpen = rowKey => {
        console.log('This row opened', rowKey);
    };

     onSwipeValueChange = swipeData => {
        const { key, value } = swipeData;
       
    };

     renderItem = (data, index) => {
       
        
        return(
        <View style={{ flex: 1, margin: 6 }}>

                          
        <View
            style={{
                flex: 1,
                paddingVertical: 15,
                width: '96%',
                alignSelf: 'center', 
                paddingHorizontal: 6,
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
                backgroundColor: Colors.viewBox
            }}>
            <View style={{
                flex:1,
                flexDirection: 'row'
            }}>
               
                    <View style={{
                        height: height * 0.2 / 2,
                        backgroundColor: Colors.white,
                        width: width * 0.2,
                        borderRadius: 10,
                    }}>
                         {data.item.img ?
                        <Image
                            resizeMode="cover"
                            style={{
                               
                                width: '100%',
                                height: '100%',

                                borderRadius: 10,
                            }}
                            source={{uri: data.item.img}} />
                            : null}
                    </View> 

                <View style={{
                   flex:1,
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    paddingHorizontal:2
                }}>
                    <View style={{ flexDirection:'row',alignItems:'flex-start'}}>
                    <Text
                        numberOfLines={4}
                        style={{
                            fontFamily: Fonts.Regular,
                            fontSize: 16,
                            paddingHorizontal: 8
                        }}>
                        {data.item.pname}</Text>
                        
                        {/* <Text
                                style={{
                                    // textDecorationLine: 'line-through',
                                    fontFamily: Fonts.SemiBold,
                                    textAlign: 'left',
                                    color: Colors.red,
                                    paddingHorizontal: 4,
                                    fontSize: 10,
                                }}>{data.item.of}</Text> */}
                        </View>
{data.item.priceArray ? 
                    <View
                        style={{
                            marginLeft:6,
                            // marginLeft: 10,
                            alignSelf:'flex-start',
                            height: 25,
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                            backgroundColor: Colors.white,
                           }}>

                        <Dropdown
                            containerStyle={{
                                width: height * 0.3 / 2,
                                paddingLeft: 5,
                                paddingBottom: 15,
                            }}
                            fontSize={15}
                            itemTextStyle={{ fontFamily: Fonts.regular, color: Colors.primary }}
                            itemColor={Colors.black}
                            fontFamily={Fonts.regular}
                            selectedItemColor={Colors.black}
                            labelExtractor={({ title }) => title}
                            valueExtractor={({ value }) => value}
                            textColor={
                                data.item.size ? Colors.black : Colors.dark_gray
                            }

                            value={data.item.size}
                            onChangeText={(value, index, data1) => {
                             data.item.size = data1[index].title;
                             data.item.price = data1[index].value;
                             data.item.subtotal = data1[index].value * data.item.qty;
                             console.log(this.state.cart);
                             AsyncStorage.setItem ('ecart', JSON.stringify (this.state.cart));
                             this.setState({refresh: !this.state.refresh})
                            }}

                            data={data.item.priceArray}
                        />
                    </View>
: 

<View
style={{
    marginLeft:6,
    // marginLeft: 10,
    alignSelf:'flex-start',
    height: 25,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal:20,
    backgroundColor: Colors.white,
   }}>
       <Text style={{fontFamily: Fonts.Regular, fontSize:15, color: Colors.black}}>
           {data.item.size}
       </Text>
       
       </View>}
                </View>

            </View>
            <View style={{
               
                flexDirection: 'row',
               
                alignItems: 'flex-end'
            }}>
                <View style={{ flexDirection: 'column',   }}>
                  
                        <Text
                            
                            style={{
                                fontFamily: Fonts.Regular,
                                color: Colors.primary,
                                textAlign:'right',
                                fontSize: 16
                            }}>

                           Rs. {(data.item.price * data.item.qty).toFixed(2)} </Text>
                        
                  
                    {data.item.oprice ?
                            <Text
                                style={{
                                    textDecorationLine: 'line-through',
                                    fontFamily: Fonts.SemiBold,
                                    textAlign: 'right',
                                    color: Colors.red,
                                    paddingHorizontal: 4,
                                    fontSize: 10,
                                }}>Rs.{(data.item.oprice * data.item.qty).toFixed(2)}</Text> : null}
                    <View style={{
                        // width: '100%',
                        justifyContent: 'space-between',
                        flexDirection: 'row',

                        marginVertical: 10,
                        alignSelf: 'center',

                    }}>

                        <TouchableOpacity
                            onPress={() => {
                                console.log(data.item.priceArray);

                                if (data.item.qty == 1) {
                                    return false;
                                } else {
                                    
                                    this.setState({ refresh: !this.state.refresh })
                                    this.state.cart[data.index].qty = parseInt(this.state.cart[data.index].qty) - 1;
                                    data.item.subtotal = data.item.price * data.item.qty;
                                    console.log(this.state.cart);
                                    AsyncStorage.setItem ('ecart', JSON.stringify (this.state.cart));
                                    this.setState({ refresh: !this.state.refresh })

                                }
                            }}
                            style={{
                                height: height * 0.04,
                                width: width * 0.08,
                                justifyContent: 'center',
                                alignItems: 'center',

                            }}>
                            <Text
                                style={{
                                    fontFamily: Fonts.bold,
                                    fontSize: 25
                                }}>-</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                height: height * 0.04,
                                width: width * 0.09,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: Colors.light_gray

                            }}>
                            <Text refresh={new Date()}
                                style={{
                                    fontFamily: Fonts.Regular,
                                    fontSize: 16
                                }}>{data.item.qty}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            onPress={() => {


this.setState({ refresh: !this.state.refresh })
this.state.cart[data.index].qty = parseInt(this.state.cart[data.index].qty) + 1
data.item.subtotal = data.item.price * data.item.qty;
                                    console.log(this.state.cart);
                                    AsyncStorage.setItem ('ecart', JSON.stringify (this.state.cart));
                                this.setState({ refresh: !this.state.refresh })

                            }}
                            style={{
                                height: height * 0.04,
                                width: width * 0.08,
                                justifyContent: 'center',
                                alignItems: 'center',

                            }}>
                            <Text
                                style={{
                                    fontFamily: Fonts.bold,
                                    fontSize: 25
                                }}>+</Text>
                        </TouchableOpacity>

                    </View>
                </View>
                
            </View>




        </View>

    </View>
        )

                         } ;

     renderHiddenItem = (data, rowMap) => (
        <View style={styles.rowBack}>
          
            {/* <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnLeft]}
                onPress={() => this.closeRow(rowMap, data.item.key)}
            >
                <Text style={styles.backTextWhite}>Close</Text>
            </TouchableOpacity> */}
            <TouchableOpacity
                style={styles.backRightBtn}
               onPress={()=>{
                this.closeRow(rowMap, data.item)
               }}
            >
                <Animated.View
                    style={[
                        styles.trash]}
                >
                    <Image
                        source={require('../images/delete.png')}
                        style={styles.trash}
                    />
                </Animated.View>
            </TouchableOpacity>
        </View>
    );


    countFunction = () => {
        AsyncStorage.getItem('ecart').then(cart=> {
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
        finalPrice = 0;
        totalQty = 0;
        total = 0;
        totalSave = 0;
        for(let i=0; i < this.state.cart.length; i++){
            let oprice = 0;
            if(this.state.cart[i].oprice){
                oprice = parseFloat(this.state.cart[i].oprice) * parseFloat(this.state.cart[i].qty);
            } else {
                oprice = parseFloat(this.state.cart[i].price) * parseFloat(this.state.cart[i].qty);
            }
            
            total = total + oprice;
            
          finalPrice = finalPrice + parseFloat(this.state.cart[i].subtotal);
          totalQty = totalQty + this.state.cart[i].qty;
          console.log(total, oprice, finalPrice);

        }
        totalSave = parseFloat(total) - parseFloat(finalPrice);
        total = total - totalSave;
        if(total <= this.state.charge_limit){
            finalPrice = finalPrice + parseInt(this.state.del_charge);
        }
       
        // total = total + parseInt(this.state.del_charge)

        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }}>
                 <NavigationEvents onDidFocus={()=> {
                           AsyncStorage.getItem('ecart').then(cart=> {
                            console.log(cart, this.state.cart);
                            
                            if(cart){
                                this.setState({cart: JSON.parse(cart), cartCount: JSON.parse(cart).length});
                            
                            }
                        })
                    }} />

<View style={{ flexDirection: 'column', backgroundColor: Colors.primary,elevation:6, height: Platform.OS == 'ios' ? 50 : 50, }} >
        
    

          <View
            style={{
              flex: 1,
              paddingHorizontal:10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'}}>

              <View
                 style={{
                  flex: 0.80,
                  flexDirection: 'row',
              
                  alignItems: 'center',
                }}>
          
              <TouchableOpacity style={{ flex: 0.20}} onPress={() => {
                this.props.navigation.goBack();
            }}>

                <View
                  style={{
                   
                    alignItems: 'center',
                    justifyContent: 'center', flexDirection: 'row',
                  }}>
                
                    <Image
                      resizeMode="cover"
                      style={{ height: 16, width: 22,alignSelf:'flex-start', tintColor: Colors.white }}
                      source={require('../images/left-arrow.png')}
                    />
                  

                </View>
              </TouchableOpacity>
           
<View style={{flex: 1,alignSelf:'flex-start',}}>
<Text
              style={{
                paddingLeft:8,
              
                color: Colors.white,
                fontFamily: Fonts.bold,
                fontSize: 17,

              }}
              numberOfLines={1}>
              {"Modify Order #" + this.props.navigation.state.params.oid}
            </Text>
</View>
           
              </View>


  
              <TouchableOpacity style={{ flex: 0.20}} onPress={() => {
                this.props.navigation.navigate("EOrderSearch");
            }}>

                <View
                  style={{
                   
                    alignItems: 'center',
                    justifyContent: 'center', flexDirection: 'row',
                  }}>
                
                    <Image
                      resizeMode="contain"
                      style={{ height: 16, width: 22,alignSelf:'flex-start', tintColor: Colors.white }}
                      source={require('../images/home_18.png')}
                    />
                  

                </View>
              </TouchableOpacity>


  </View>
       
      </View>


<NavigationEvents onDidFocus={()=> {
                      this.countFunction()
                    }} />
<ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: Colors.white }}>
             {this.state.cart.length == 0 ? 
             
             
             <View style={{flex: 1}} refresh={this.state.refresh}>

             <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
               <Image
                 style={{
                   height: width * 0.8,
                   width: width * 0.8,
                   alignSelf: 'center',
                 
                 }}
                 resizeMode="contain"
                 source={require ('../images/emptycart.jpg')}
               />
               <View
                 style={{
                   alignItems: 'center',
                   justifyContent: 'center',
                   marginTop: 20,
                 }}
               >
     
                 <Text
                   style={{
                     fontSize: 17,
                     color: Colors.primary,
                     fontFamily: Fonts.bold,
                   }}
                 >
                   YOUR CART IS EMPTY!
                 </Text>
                 <Text
                   style={{
                     textAlign: 'center',
                     fontSize: 14,
                     fontFamily: Fonts.light,
                     color: Colors.black,
                     paddingTop: 10,
                     width: width * 0.7,
                   }}
                 >
                   Add something from the below button to make me happy!!!
                 </Text>
     
               </View>
               <TouchableOpacity
                        // onPress={() => this.Login()}
                        onPress={() => {

                            this.props.navigation.navigate('Home');
                        }}
                        activeOpacity={0.8}
                        style={{
                            marginVertical:30,
                            width: '70%', borderRadius: 40, elevation: 1,
                            justifyContent: 'center', alignItems: 'center', alignSelf: 'center',
                            backgroundColor: Colors.acent, height: height * 0.2 / 2.8
                        }}>

                        <Text style={{ fontFamily: Fonts.bold, fontSize: 18, color: Colors.white }}>START SHOPPING</Text>

                    </TouchableOpacity>
             </View>
     
           </View>
             
             :
                <View showsVerticalScrollIndicator={false} style={{ flex: 1 }}>

                <SwipeListView
                data={this.state.cart}
                renderItem={this.renderItem}
                renderHiddenItem={this.renderHiddenItem}
               extraData={this.state.refresh}
                rightOpenValue={-80}
                previewRowKey={'0'}
                previewOpenValue={-40}
                previewOpenDelay={3000}
                onRowDidOpen={this.onRowDidOpen}
                onSwipeValueChange={this.onSwipeValueChange}
            />

<Dash 
dashColor={Colors.medium_gray}
style={{width:'100%',marginVertical:10, height:1}}/>
                     

<View style={{
    flexDirection:'row',
    justifyContent:'space-between',
    width:'100%',
    paddingHorizontal:20
}}>

<View style={{flexDirection:'column'}}>
<Line style={{  marginVertical: 3 }}></Line>
    <Text style={{
        fontFamily:Fonts.Regular,
        fontSize:14,
        color:Colors.dark_gray
    }}>Sub total</Text>

    <Line style={{  marginVertical: 3 }}></Line>
    
    <Text style={{
        fontFamily:Fonts.Regular,
        fontSize:14,
        // color:Colors.dark_gray
    }}>You saved</Text>
    
    {/* <Line style={{  marginVertical: 3 }}></Line>
    
    <Text style={{
        fontFamily:Fonts.Regular,
        fontSize:14,
         color:Colors.dark_gray
    }}>GST</Text>
    */}
    <Line style={{  marginVertical: 3 }}></Line>
    <Text style={{
        fontFamily:Fonts.Regular,
        fontSize:14,
        color:Colors.dark_gray
    }}>Delivery Charge</Text>
</View>

<View style={{flexDirection:'column'}}>
<Text style={{
        fontFamily:Fonts.Regular,
        fontSize:14,
        // color:Colors.dark_gray
}}>Rs {(total).toFixed(2)}</Text>
    <Line style={{  marginVertical: 3 }}></Line>
    <Text style={{
        fontFamily:Fonts.Regular,
        fontSize:14,
        // color:Colors.dark_gray
    }}>- Rs {(totalSave).toFixed(2)}</Text>
   <Line style={{  marginVertical: 3 }}></Line>
    {/* <View
    style={{
        // height:'10%',
        // width:'100%',
        justifyContent:'center',
        alignItems:'center'}}>
    <Text style={{
        fontFamily:Fonts.Regular,
        fontSize:14,
       
        // color:Colors.dark_gray
    }}>Rs. 8.00</Text>
    </View> */}
    <Line style={{  marginVertical: 3 }}></Line>
    <View
    style={{ backgroundColor:Colors.white,
        elevation:2,
        height:25,
        width:'100%',
        justifyContent:'center',
        alignItems:'center'}}>
    <Text style={{
        fontFamily:Fonts.Regular,
        fontSize:14,
       
        // color:Colors.dark_gray
    }}>Rs. {total <= this.state.charge_limit ? this.state.del_charge : 0}</Text>
    </View>
   

</View>

</View>

<View 
 style={{
   marginVertical: 20,
     height:height*0.10,
     paddingHorizontal:20,
     justifyContent:'space-between',
     alignItems:'center',
     flexDirection:'row',
 backgroundColor:Colors.viewBox}}>

<Text
style={{
fontSize:14,
fontFamily:Fonts.SemiBold,

}}>Total Payable Amount</Text>

<Text style={{
    fontFamily:Fonts.SemiBold,
    fontSize:20,
    color:Colors.primary
}}>Rs {(finalPrice).toFixed(2)}</Text>

</View>

<TouchableOpacity
                        // onPress={() => this.Login()}
                        onPress={() => {

                          
                        }}
                        activeOpacity={0.8}
                        style={{
                            marginVertical:10,
                            width: '70%', borderRadius: 40, elevation: 1,
                            justifyContent: 'center', alignItems: 'center', alignSelf: 'center',
                            backgroundColor: Colors.acent, height: height * 0.2 / 2.8
                        }}>

                        <Text style={{ fontFamily: Fonts.bold, fontSize: 18, color: Colors.white }}>Update</Text>

                    </TouchableOpacity>
                    <Line style={{ height: 40 }} />

                </View>

                }
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
      this.setState({modalVisible: false})
          }}
        >


      <TouchableOpacity style={styles.ModalContainer} onPress={()=> {
          this.setState({modalVisible: false})
      }}>
      <View style={styles.netAlert}>





      <View style={styles.netAlertContent}>
      <View style={{ alignItems:'center', justifyContent:'flex-end', marginTop:50 }}>
   
     
   <Image
             style={{
             
             }}
             resizeMode='contain'
             source={require("../images/swipe.gif")}
             style={{ width: width, height:width *.4,  }}
           />
    
</View>
      <Text style={styles.netAlertTitle}>
        Swipe Left
      </Text>
      <Text style={styles.netAlertDesc}>
        You can remove your product from go to swipe left option and click on delete.
      </Text>
      </View>
 
    
    
      </View>

        </TouchableOpacity>

      </Modal>

            </SafeAreaView>
        )
    }

}

const styles = StyleSheet.create({
  
   

    rowBack: {
        flex: 1, margin: 6 
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
        right:0
    },
    backRightBtnLeft: {
        backgroundColor: 'blue',
        right: 75,
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
    },
    trash: {
        backgroundColor: Colors.viewBox,
        width:50,
        height:50,
        paddingHorizontal: 0,
        borderRadius: 10,
    },
    ModalContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor:'rgba(0,0,0,0.5)'
      },
      netAlert: {
        overflow: "hidden",
       
        width: width ,
        height: height,
     
       
        backgroundColor:'rgba(0,0,0,0.7)'
      },
      netAlertContent: {
        flex: 1,
     
    
        //  marginTop:20,
      },
      netAlertTitle: {
        fontSize: 20,
        paddingTop:20,
        color: Colors.primary,
        textAlign:'center',
        fontFamily: Fonts.bold,
      },
      netAlertDesc: {
        fontSize: 16,
        paddingTop:10,
        alignSelf: 'center',
        width: width*.8,
        color: Colors.white,
        fontFamily: Fonts.light,
        paddingVertical: 5,
        textAlign:'center'
      }
});
