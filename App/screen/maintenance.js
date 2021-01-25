import React, {Component} from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  AsyncStorage,
  Dimensions,
  BackHandler,
  ScrollView,
  NetInfo,
  SafeAreaView
} from "react-native";
import Colors from "../common/Colors";

var width = Dimensions.get("window").width;

export default class Maintenance extends Component {
  static navigationOptions = ({navigation}) => ({
    header: null
  });

  constructor(props) {
    super(props);
    this.state = {
     
    };
  }

  componentDidMount() {


  }

  render() {
    const {navigate} = this.props.navigation;
    return (
      <SafeAreaView style={{flex:1, backgroundColor:Colors.colorPrimary, }}>

      <View style={styles.container}>
     
        <View style={{flex: 1, flexDirection: "column", alignItems: "center"}}>
          <View
            style={{flex: 1, alignItems: "center", justifyContent: "center"}}
          >
            <Image
              style={{width: width * 0.55, height: width * 0.5}}
              source={require("../images/maintenance.png")}
            />
          </View>
          <View style={{flex: 1, alignItems: "center", marginHorizontal: 20}}>
            <Text
              style={{fontSize: 20, fontWeight:"bold", color: Colors.colorAccent}}
            >
              Application
            </Text>

            <Text
              style={{fontSize: 20, fontWeight:"bold", color: Colors.colorAccent}}
            >
              Under Maintenance
            </Text>
            <Text
              style={{
                fontSize: 16,
                textAlign: "center",

                color: Colors.dark_gray,
                paddingVertical: 30
              }}
            >
              Sorry for the inconvenience but we are performing some maintenance
              at the moment. If you need to you can always Contact Us.
            </Text>
          </View>
        </View>
      
      </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  container: {
    flex: 1,

    backgroundColor: Colors.white
  },
});
