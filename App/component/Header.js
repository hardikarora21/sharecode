import React, { Component } from 'react';
import {
  Platform,
  Text,
  View,
  Button,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationActions } from 'react-navigation';
import Colors from '../common/Colors';
import Fonts from '../common/Fonts';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class Header extends Component {
  render() {
    return (
      <View style={{ flexDirection: 'column', backgroundColor: Colors.white,elevation:6 }} >
          <StatusBar barStyle='default'
                    hidden={false} backgroundColor={Colors.primary} />
       <SafeAreaView style={{ height: Platform.OS == 'ios' ? 50 : 50,
              paddingTop: Platform.OS == 'ios' ? 0 : 0,backgroundColor:Colors.primary }}>

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
              {this.props.Back ?
              <TouchableOpacity style={{ flex: 0.20}} onPress={this.props.Back}>

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
              :
              <TouchableOpacity style={{ flex: 0.20}} onPress={this.props.OpenDrawer}>

                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal:5
                  }}>

                  <Image
                    resizeMode="contain"
                    style={{ height: 16, width: 22,alignSelf:'flex-start', tintColor: Colors.white }}
                    source={require('../images/home_03.png')}
                  />


                </View>
              </TouchableOpacity>
            }
<View style={{flex: 1,alignSelf:'flex-start',}}>
<Text
              style={{
                paddingLeft:8,
              
                color: Colors.white,
                fontFamily: Fonts.bold,
                fontSize: 17,

              }}
              numberOfLines={1}>
              {this.props.pageTitle}
            </Text>
</View>
           
              </View>


              
              <View
                 style={{
                  flex: 0.20,
                 
                  flexDirection: 'row',
                  paddingHorizontal:10,
                  alignSelf:'center',
                  justifyContent:'space-between',
                  alignItems: 'center',
                }}>
         
              <TouchableOpacity style={{ flex:1,  }} onPress={this.props.Cart}>
                {!this.props.cartCount || this.props.cartCount == 0 ? null :
              <View style={{height:20, minWidth:20, top: -5, right:-10, position: 'absolute',backgroundColor:Colors.white, borderRadius:10}}>
              <Text
              style={{
               
                textAlign:'center',
                color: Colors.black,
                fontFamily: Fonts.SemiBold,
                fontSize: 12,

              }}
              >
             {this.props.cartCount}
            </Text>
                
               </View>
  }
                <View
                  style={{
                    height: 40,
                   
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center', 
                  }}>
                
                    <Image
                      resizeMode="contain"
                      style={{ height: 18, width: 22, tintColor: Colors.white }}
                      source={require('../images/cart.png')}
                    /> 

                </View>
              </TouchableOpacity>
            
              <TouchableOpacity style={{  flex:1,  paddingHorizontal:10, }} onPress={this.props.Notification}>

                <View
                  style={{
                    height: 40,
                    width: 40,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>

                  <Image
                    resizeMode="contain"
                    style={{ height: 22, width: 22, tintColor: Colors.white }}
                    source={require('../images/bell.png')}
                  />


                </View>
              </TouchableOpacity>
            
              </View>



  </View>
        </SafeAreaView>
      </View>
    );
  }
}
