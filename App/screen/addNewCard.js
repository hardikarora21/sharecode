
import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Platform,
    TouchableOpacity,
    StatusBar,
    TextInput,
    Dimensions,
    ScrollView,
    SafeAreaView,
    KeyboardAvoidingView,
    ImageBackground
} from 'react-native';

import { StackActions, NavigationActions } from "react-navigation";
import Toast from 'react-native-simple-toast';
import Colors from '../common/Colors'
import Header from '../component/Header'
import Fonts from '../common/Fonts';
const { width, height } = Dimensions.get('window')
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'
export default class AddNew extends Component {
    static navigationOptions = ({ navigation }) => ({
        header: null,
    });

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            visible: true,
          
            cardno: '',
            cvc: '',
            expire: '',
            name: '',
            inputBorderColor: Colors.medium_gray,
            inputBorderColor2: Colors.medium_gray,
            inputBorderColor3: Colors.medium_gray,
           

        };
    }


  
  
    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }}>
                <StatusBar hidden />
                <KeyboardAwareScrollView>
                   
                    <Header
                    Back={() => {
                        this.props.navigation.goBack();
                    }}
                    pageTitle={'Add New Card'}
                    iconName={require('../images/home_05.png')}
                    Notification={() => {
                        this.props.navigation.navigate('Notification')
                    }}
                    Cart={() => {
                        this.props.navigation.navigate('Cart')
                    }}
                />
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        style={{ flex: 1 }}>

                      


                        <View style={{
                            flex: 1, elevation: 0, backgroundColor: Colors.acent,

                        }}>

                            <View style={{
                                flex: 1, backgroundColor: 'white',
                              paddingHorizontal: 30
                            }}>

                                <Text style={{
                                    fontSize:18,
                                    marginVertical:20,
                                    fontFamily:Fonts.SemiBold,
                                    color:Colors.primary
                                }}>
                                    Please add below details
                                </Text>

                              
                                <View style={{
                                    flexDirection: 'row', alignItems: 'center', width: '100%',
                                    borderBottomWidth: 1, borderColor: this.state.inputBorderColor
                                }}>
                                   
                                   
           
                                    <TextInput
                                        placeholder="CARD NUMBER"
                                        selectionColor={Colors.primary}
                                        placeholderTextColor={Colors.medium_gray}
                                        style={[styles.textInput, {
                                            textAlignVertical: this.props.multiline ? "top" : "center",


                                        }]}
                                        autoCapitalize='none'
                                        keyboardType={"default"}
                                        onFocus={() => this.setState({ inputBorderColor: Colors.primary })}
                                        onBlur={() =>
                                            this.setState({ inputBorderColor: Colors.medium_gray })
                                        }
                                        onChangeText={cardno => this.setState({ cardno })}
                                        returnKeyType={"next"}
                                        onSubmitEditing={(event) => {
                                            this.refs.expiry.focus();
                                        }}

                                    />
                                </View>


                                <View style={{ height: 15 }}></View>

                                <View style={{
                                    flexDirection: 'row', borderBottomWidth: 1,
                                    alignItems: 'center', borderColor: this.state.inputBorderColor2
                                }} >

                                 
                                    <TextInput
                                        placeholder="EXPIRY"
                                        selectionColor={Colors.primary}
                                        placeholderTextColor={Colors.medium_gray}
                                        style={[styles.textInput, {
                                            textAlignVertical: this.props.multiline ? "top" : "center",


                                        }]}
                                        autoCapitalize='none'
                                        // keyboardType={""}
                                        secureTextEntry={this.state.visible}
                                        onFocus={() => this.setState({ inputBorderColor2: Colors.primary })}
                                        onBlur={() =>
                                            this.setState({ inputBorderColor2: Colors.medium_gray })
                                        }
                                        ref='expiry'
                                        onChangeText={expiry => this.setState({ expiry })}
                                        returnKeyType={"next"}
                                        onSubmitEditing={(event) => {
                                            this.refs.cvc.focus();
                                        }}

                                    />

                                  

                                </View>

                                <View style={{ height: 15 }}></View>

                                <View style={{
                                    flexDirection: 'row', borderBottomWidth: 1,
                                    alignItems: 'center', borderColor: this.state.inputBorderColor3,
                                }} >


                                    <TextInput
                                        placeholder="CVC/CCC"
                                        selectionColor={Colors.primary}
                                        placeholderTextColor={Colors.medium_gray}
                                        style={[styles.textInput, {
                                            textAlignVertical: this.props.multiline ? "top" : "center",


                                        }]}
                                        autoCapitalize='none'
                                        // keyboardType={""}
                                        secureTextEntry={this.state.visible}
                                        onFocus={() => this.setState({ inputBorderColor3: Colors.primary })}
                                        onBlur={() =>
                                            this.setState({ inputBorderColor3: Colors.medium_gray })
                                        }
                                        ref='cvc'
                                        onChangeText={expire => this.setState({ expire })}
                                        returnKeyType={"next"}
                                        onSubmitEditing={(event) => {
                                            this.refs.name.focus();
                                        }}

                                    />


                                </View>


                                <View style={{ height: 15 }}></View>
                        
                                <View style={{
                                    flexDirection: 'row', alignItems: 'center',
                                    borderBottomWidth: 1, borderColor: this.state.inputBorderColor3
                                }}>
                                   
                                    <TextInput
                                        placeholder="NAME"
                                        selectionColor={Colors.primary}
                                        placeholderTextColor={Colors.medium_gray}
                                        style={[styles.textInput, {
                                            textAlignVertical: this.props.multiline ? "top" : "center",


                                        }]}
                                        autoCapitalize='none'
                                        keyboardType={"default"}
                                        onFocus={() => this.setState({ inputBorderColor3: Colors.primary })}
                                        onBlur={() =>
                                            this.setState({ inputBorderColor3: Colors.medium_gray })
                                        }
                                        ref='name'
                                        onChangeText={name => this.setState({ name })}
                                        returnKeyType={"next"}
                                        onSubmitEditing={(event) => {
                                            
                                        }}

                                    />
                                </View>
                               
                                <View style={{ height: 40 }}></View>

                                <TouchableOpacity
                                    // onPress={() => this.Login()}
                                    onPress={() => {
                                       
                                        this.props.navigation.navigate('Payment');
                                    }}
                                    activeOpacity={0.8}
                                    style={{

                                        paddingVertical: 20,
                                        width: '80%', borderRadius: 40, elevation: 1,
                                        justifyContent: 'center', alignItems: 'center',
                                        alignSelf: 'center',
                                        backgroundColor: Colors.acent, height: '10%'
                                    }}>

                                    <Text style={{ fontFamily: Fonts.bold, fontSize: 18, color: Colors.white }}>Submit</Text>

                                </TouchableOpacity>



                                <View style={{ height: 50 }}></View>

                            </View>


                        </View>

                    </ScrollView>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        );
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
    }
});