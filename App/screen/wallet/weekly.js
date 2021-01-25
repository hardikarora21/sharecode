import React from 'react';
import {
  Text,
  View,
  SafeAreaView,
  FlatList,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native';
import Colors from '../../common/Colors';
import Header from '../../component/Header';
import Fonts from '../../common/Fonts';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const initialLayout = { width: Dimensions.get('window').width };

import { StackActions, NavigationActions } from "react-navigation";
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import API from '../../common/Api';
import Loader from '../../common/Loader';
import timeout from '../../common/timeout';
import Toast from 'react-native-simple-toast';

export default class Weekly extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      DataSource: [],
      wallet: 0,
      search: '',
      refresh: false,
    }

  }



  componentDidMount(){
    this.weekAPI()
}

weekAPI = () => {

    this.setState({loading: true});
    AsyncStorage.getItem('id').then(id =>{
    AsyncStorage.getItem('token').then(token =>{
    
      var Request = {
       security:0,
       token: JSON.parse(token),
       id: id,
       type:2

      
      };
      console.log(API.wallet_data);
      console.log(JSON.stringify(Request));
      NetInfo.fetch().then(state => {
        if (state.isConnected) {
          timeout(
            15000,
            fetch(API.wallet_data, {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
              },
              body: JSON.stringify(Request)
            })
              .then(res => res.json())
              .then(res => {
                console.log("today RESPONCE:::  ", res);
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
             
                  // Toast.show(res.message,Toast.SHORT,);
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
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
         <FlatList
ListFooterComponent={() => <View style={{ height: height * 0.1 }} />}
showsVerticalScrollIndicator={false}
style={{ backgroundColor: 'white', paddingHorizontal: 10 }}
extraData={this.state.refresh}
listKey={(item, index) => index.toString()}
data={this.state.DataSource}
renderItem={({ item, index }) => (
    <View style={{ flex: 1, margin: 10 }}>
      
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
                    fontSize: 18, padding: 2,
                }}>{item.msg}</Text>
                <Text style={{
                    fontFamily: Fonts.Regular,
                    color: Colors.dark_gray,
                    fontSize: 14, padding: 2,
                }}>{item.time}</Text>
            </View>
            <Text style={{
                fontFamily: Fonts.Regular,
                fontSize: 16, padding: 2,
            }}>{item.price}</Text>

        </View>
    </View>
)}

keyExtractor={(item, index) => index.key}
/>  


      </SafeAreaView>
    )
  }

}


