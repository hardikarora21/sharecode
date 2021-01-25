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
  StyleSheet,
  TouchableWithoutFeedback,
  Platform,
  Modal,
  Image,
} from 'react-native';
import Colors from '../common/Colors';
import Header from '../component/Header';
import Fonts from '../common/Fonts';
import Line from '../common/Line';
import Toast from 'react-native-simple-toast';
import Today from '../screen/wallet/today';
import Weekly from '../screen/wallet/weekly';
import Month from '../screen/wallet/month';
import Yearly from '../screen/wallet/yearly';
import Animated from 'react-native-reanimated';
import {
  TabView,
  TabBar,
  SceneMap,
  NavigationState,
} from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const initialLayout = {width: Dimensions.get('window').width};

import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import API from '../common/Api';
import Loader from '../common/Loader';
import timeout from '../common/timeout';
import RazorpayCheckout from 'react-native-razorpay';
import {
  StackActions,
  NavigationActions,
  NavigationEvents,
} from 'react-navigation';

export default class Wallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      DataSource: [],
      wallet: 0,
      search: '',
      refresh: false,
      price: 0,
      pay_id: '',
      cartCount: 0,
      routes: [
        {key: 'today', title: 'Today'},
        {key: 'weekly', title: 'Weekly'},
        {key: 'month', title: 'Month'},
        {key: 'yearly', title: 'Yearly'},
      ],
      index: 0,
      upiModal: false,
      upi: '',
    };
  }

  componentDidMount() {
    this.WalletAPI();
    this.fetchUPIid();
  }
  _handleIndexChange = index => {
    console.log(index);

    this.setState({
      index,
    });
  };

  countFunction = () => {
    AsyncStorage.getItem('cart').then(cart => {
      console.log(cart);

      if (cart) {
        this.setState({cartCount: JSON.parse(cart).length});
        console.log(this.state.cartCount);
      } else {
        this.setState({cartCount: 0});
      }
    });
  };

  _renderTabBar = props => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: Colors.white,
      }}>
      {props.navigationState.routes.map((route, index) => {
        return (
          <TouchableWithoutFeedback
            key={route.key}
            onPress={() => props.jumpTo(route.key)}>
            {this._renderItem(props)({route, index})}
          </TouchableWithoutFeedback>
        );
      })}
    </View>
  );

  _renderScene = ({route}) => {
    switch (route.key) {
      case 'today':
        return <Today navigation={this.props.navigation} />;
      case 'weekly':
        return <Weekly navigation={this.props.navigation} />;
      case 'month':
        return <Month navigation={this.props.navigation} />;
      case 'yearly':
        return <Yearly navigation={this.props.navigation} />;
      default:
        return null;
    }
  };

  _renderItem = ({navigationState, position}) => ({route, index}) => {
    const inputRange = navigationState.routes.map((x, i) => i);

    const activeOpacity = Animated.interpolate(position, {
      inputRange,
      outputRange: inputRange.map(i => (i === index ? 1 : 0)),
    });
    const inactiveOpacity = Animated.interpolate(position, {
      inputRange,
      outputRange: inputRange.map(i => (i === index ? 0 : 1)),
    });

    return (
      <View style={styles.tab}>
        <Animated.View style={[styles.item, {opacity: inactiveOpacity}]}>
          <Text style={[styles.label, styles.inactive]}>{route.title}</Text>
        </Animated.View>
        <Animated.View
          style={[styles.item, styles.activeItem, {opacity: activeOpacity}]}>
          <Text style={[styles.label, styles.active]}>{route.title}</Text>
        </Animated.View>
      </View>
    );
  };

  WalletAPI = () => {
    this.setState({loading: true});
    AsyncStorage.getItem('id').then(id => {
      AsyncStorage.getItem('token').then(token => {
        var Request = {
          security: 0,
          id: JSON.parse(id),
          token: JSON.parse(token),
        };
        console.log(API.wallet);
        console.log(JSON.stringify(Request));
        NetInfo.fetch().then(state => {
          if (state.isConnected) {
            timeout(
              15000,
              fetch(API.wallet, {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(Request),
              })
                .then(res => res.json())
                .then(res => {
                  console.log('Walet RESPONCE:::  ', res);
                  if (res.status == 'success') {
                    this.setState({
                      loading: false,
                      wallet: res.wallet,
                      name: res.name,
                      profile: res.profile,
                      mobile: res.phone,
                    });

                    AsyncStorage.setItem('name', res.name);
                    AsyncStorage.setItem('profile', res.profile);
                    AsyncStorage.setItem('phone', res.phone);
                    AsyncStorage.setItem('wallet', res.wallet);
                  } else if (res.status == 'failed') {
                    this.setState({loading: false});
                    AsyncStorage.removeItem('id');

                    const resetAction = StackActions.reset({
                      index: 0,
                      actions: [
                        NavigationActions.navigate({routeName: 'Login'}),
                      ],
                    });
                    this.props.navigation.dispatch(resetAction);
                  } else {
                    Toast.show(res.message, Toast.SHORT);
                    this.setState({data: res, loading: false});
                  }
                })
                .catch(e => {
                  this.setState({loading: false});
                  console.log(e);

                  Toast.show('Something went wrong...', Toast.SHORT);
                }),
            ).catch(e => {
              console.log(e);

              this.setState({loading: false});
              Toast.show('Please Check your internet connection', Toast.SHORT);
            });
          } else {
            this.setState({loading: false});

            Toast.show('Please Check your internet connection', Toast.SHORT);
          }
        });
      });
    });
  };

  WalletRechargeAPI = () => {
    this.textInput.clear();
    this.setState({loading: true, call: true});
    AsyncStorage.getItem('id').then(id => {
      AsyncStorage.getItem('token').then(token => {
        var Request = {
          security: 0,
          id: JSON.parse(id),
          token: JSON.parse(token),
          pay_id: this.state.pay_id,
          price: this.state.price,
        };
        console.log(API.wallet_recharge);
        console.log(JSON.stringify(Request));
        NetInfo.fetch().then(state => {
          if (state.isConnected) {
            timeout(
              15000,
              fetch(API.wallet_recharge, {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(Request),
              })
                .then(res => res.json())
                .then(res => {
                  console.log('Walet RESPONCE:::  ', res);
                  if (res.status == 'success') {
                    this.WalletAPI();
                    Toast.show(res.message, Toast.SHORT);
                  } else if (res.status == 'failed') {
                    this.setState({loading: false});
                    AsyncStorage.removeItem('id');

                    const resetAction = StackActions.reset({
                      index: 0,
                      actions: [
                        NavigationActions.navigate({routeName: 'Login'}),
                      ],
                    });
                    this.props.navigation.dispatch(resetAction);
                  } else {
                    Toast.show(res.message, Toast.SHORT);
                    this.setState({data: res, loading: false});
                  }
                })
                .catch(e => {
                  this.setState({loading: false});
                  console.log(e);

                  Toast.show('Something went wrong...', Toast.SHORT);
                }),
            ).catch(e => {
              console.log(e);

              this.setState({loading: false});
              Toast.show('Please Check your internet connection', Toast.SHORT);
            });
          } else {
            this.setState({loading: false});

            Toast.show('Please Check your internet connection', Toast.SHORT);
          }
        });
      });
    });
  };
  fetchUPIid = async () => {
    var id = await AsyncStorage.getItem('id');
    var token = await AsyncStorage.getItem('token');
    var body = {
      security: 1,
      id: JSON.parse(id),
      token: JSON.parse(token),
    };
    fetch('https://www.byfarmerz.com/newadmin/api/get-user-upi-number.php', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      method: 'POST',
    })
      .then(res => {
        r = res.json();
        this.setState({upi: r.upi_number});
        Toast.show('UPI ID Fetched Successfully', Toast.SHORT);
      })
      .catch(e => {
        this.setState({upiModal: false});
        console.log(e);

        Toast.show('Something went wrong', Toast.SHORT);
      });
  };
  addUPIid = async () => {
    var id = await AsyncStorage.getItem('id');
    var token = await AsyncStorage.getItem('token');
    var body = {
      security: 1,
      upi_number: this.state.upi,
      id: id,
      token: JSON.parse(token),
    };
    fetch('https://www.byfarmerz.com/newadmin/api/add-upi-number.php', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      method: 'POST',
    })
      .then(() => {
        Toast.show('UPI ID Added Successfully', Toast.SHORT);
        this.setState({upi: false});
      })
      .catch(e => {
        this.setState({upiModal: false});
        console.log(e);

        Toast.show('Something went wrong...', Toast.SHORT);
      });
  };
  Pay = () => {
    if (this.state.price <= 0) {
      Toast.show('Invalid Price', Toast.SHORT);
    } else {
      AsyncStorage.getItem('payapi_key').then(RPKey => {
        AsyncStorage.getItem('Logo').then(Logo => {
          AsyncStorage.getItem('email').then(email => {
            AsyncStorage.getItem('phone').then(mobile => {
              AsyncStorage.getItem('name').then(name => {
                var options = {
                  description: '',
                  image: Logo,
                  currency: 'INR',
                  key: RPKey,
                  amount: (this.state.price * 100).toFixed(2),
                  external: {
                    wallets: ['paytm'],
                  },
                  name: name,
                  prefill: {
                    email: email,
                    contact: mobile,
                    name: name,
                  },
                  theme: {color: Colors.primary},
                };
                RazorpayCheckout.open(options)
                  .then(data => {
                    // handle success
                    var WER = data;
                    //    this.payment(data.razorpay_payment_id)
                    this.setState({pay_id: data.razorpay_payment_id});
                    console.log(JSON.stringify(WER));
                    console.log(`Success: ${data}`);
                    this.WalletRechargeAPI();
                  })
                  .catch(error => {
                    //handle failure
                    Toast.show(error.description, Toast.SHORT);

                    //  const resetAction = StackActions.reset({
                    //    index: 0,
                    //    actions: [
                    //      NavigationActions.navigate({ routeName: "Failed" })
                    //    ]
                    //  });
                    //  this.props.navigation.dispatch(resetAction);
                    console.log(`Error: ${error.code} | ${error.description}`);
                  });
                // RazorpayCheckout.onExternalWalletSelection(data => {
                //   alert(`External Wallet Selected: ${data.external_wallet} `);
                // });
              });
            });
          });
        });
      });
    }
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.primary}}>
        <View style={{flex: 1, backgroundColor: Colors.white}}>
          <Loader loading={this.state.loading} />
          <NavigationEvents
            onDidFocus={() => {
              this.countFunction();
            }}
          />
          <Header
            Back={() => {
              this.props.navigation.goBack();
            }}
            pageTitle={'Wallet'}
            iconName={require('../images/home_05.png')}
            Notification={() => {
              this.props.navigation.navigate('Notification');
            }}
            cartCount={this.state.cartCount}
            Cart={() => {
              this.props.navigation.navigate('Cart');
            }}
          />

          <View
            style={{
              paddingVertical: 25,
            }}>
            <Text
              style={{
                fontFamily: Fonts.Regular,
                fontSize: 16,
                textAlign: 'center',
              }}>
              Wallet Available Balance
            </Text>
            <Text
              style={{
                color: Colors.primary,
                fontFamily: Fonts.SemiBold,
                fontSize: 14,
                textAlign: 'center',
                marginBottom: 25,
                borderBottomWidth: 1,
                paddingBottom: 20,
                borderBottomColor: '#efefef',
              }}>
              Rs .{this.state.wallet}
            </Text>

            <View
              style={{
                width: '100%',
                paddingHorizontal: 20,
                paddingVertical: 10,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <TextInput
                placeholder="Enter Amount"
                selectionColor={Colors.primary}
                placeholderTextColor={Colors.medium_gray}
                ref={input => {
                  this.textInput = input;
                }}
                style={{
                  backgroundColor: Colors.viewBox,

                  padding: 10,
                  paddingVertical: Platform.OS == 'ios' ? 10 : 5,
                  width: '50%',
                  alignSelf: 'center',
                  paddingHorizontal: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: Colors.black,
                  borderRadius: 5,
                }}
                keyboardType="numeric"
                autoCapitalize="none"
                onChangeText={price => this.setState({price})}
                value={this.state.price}
                returnKeyType={'next'}
                onSubmitEditing={event => {}}
              />

              <TouchableOpacity
                onPress={() => {
                  this.Pay();
                }}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: height * 0.05,
                  borderRadius: 20,
                  backgroundColor: Colors.acent,
                  flexDirection: 'row',
                  paddingHorizontal: 12,
                }}>
                <Icon
                  name={'wallet'}
                  size={15}
                  style={{alignSelf: 'center', marginRight: 10}}
                  color={Colors.primary}
                />
                <Text
                  style={{
                    fontFamily: Fonts.SemiBold,
                    fontSize: 14,
                    color: 'white',
                  }}>
                  Add Balance
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: '100%',
                paddingHorizontal: 20,
                paddingVertical: 10,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <TextInput
                placeholder="Enter Amount"
                selectionColor={Colors.primary}
                placeholderTextColor={Colors.medium_gray}
                ref={input1 => {
                  this.textInput1 = input1;
                }}
                style={{
                  backgroundColor: Colors.viewBox,

                  padding: 10,
                  paddingVertical: Platform.OS == 'ios' ? 10 : 5,
                  width: '50%',
                  alignSelf: 'center',
                  paddingHorizontal: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: Colors.black,
                  borderRadius: 5,
                }}
                keyboardType="numeric"
                autoCapitalize="none"
                onChangeText={priceBank => this.setState({priceBank})}
                value={this.state.priceBank}
                returnKeyType={'next'}
                onSubmitEditing={event => {}}
              />
              <TouchableOpacity
                onPress={() => {
                  this.setState({upiModal: true});
                }}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: height * 0.05,
                  paddingHorizontal: 10,
                  borderRadius: 20,
                  backgroundColor: Colors.acent,
                  flexDirection: 'row',
                }}>
                <Icon
                  name={'bank'}
                  size={15}
                  style={{alignSelf: 'center', marginRight: 10}}
                  color={Colors.primary}
                />
                <Text
                  style={{
                    fontFamily: Fonts.SemiBold,
                    fontSize: 14,
                    color: 'white',
                  }}>
                  Bank Transfer
                </Text>
              </TouchableOpacity>
            </View>
            {this.state.upi ? (
              <TouchableOpacity
                onPress={() => {
                  this.setState({upiModal: true});
                }}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: height * 0.05,
                  paddingHorizontal: 10,
                  borderRadius: 20,
                  backgroundColor: Colors.acent,
                  flexDirection: 'row',
                  marginHorizontal: 10,
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.SemiBold,
                    fontSize: 14,
                    color: 'white',
                  }}>
                  UPI ID : {this.state.upi}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>

          <Line
            style={{
              height: 8,
              width: '100%',
              backgroundColor: Colors.light_gray,
              marginVertical: 0,
            }}></Line>

          <TabView
            style={this.props.style}
            navigationState={this.state}
            renderScene={this._renderScene}
            renderTabBar={this._renderTabBar}
            tabBarPosition="top"
            onIndexChange={this._handleIndexChange}
          />
        </View>
        <Modal
          visible={this.state.upiModal}
          animationType="slide"
          onRequestClose={() => this.setState({upiModal: false})}
          transparent>
          <TouchableOpacity
            onPress={() => this.setState({upiModal: false})}
            style={{backgroundColor: 'black', flex: 1, opacity: 0.5}}
          />
          <View
            style={{
              padding: 15,
              width: Dimensions.get('window').width / 1.15,
              backgroundColor: 'white',
              position: 'absolute',
              alignSelf: 'center',
              alignItems: 'center',
              marginTop: Dimensions.get('window').height / 3,
              borderRadius: 8,
            }}>
            <Image
              source={require('../images/upi.png')}
              style={{height: 100, width: 100, resizeMode: 'contain'}}
            />
            <TextInput
              placeholder="Enter UPI ID"
              selectionColor={Colors.primary}
              placeholderTextColor={Colors.medium_gray}
              ref={input3 => {
                this.textInput3 = input3;
              }}
              style={{
                backgroundColor: Colors.viewBox,

                padding: 10,
                paddingVertical: Platform.OS == 'ios' ? 10 : 5,
                width: '80%',
                alignSelf: 'center',
                paddingHorizontal: 10,
                justifyContent: 'center',
                alignItems: 'center',
                color: Colors.black,
                borderRadius: 5,
              }}
              autoCapitalize="none"
              onChangeText={txt => this.setState({upi: txt})}
              value={this.state.upi}
              returnKeyType={'next'}
              onSubmitEditing={event => {}}
            />
            <TouchableOpacity
              onPress={() => {
                if (this.state.upi != '') {
                  this.addUPIid();
                } else {
                  Toast.show('Please enter UPI ID', Toast.SHORT);
                }
              }}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: height * 0.05,
                paddingHorizontal: 10,
                borderRadius: 8,
                backgroundColor: Colors.acent,
                flexDirection: 'row',
                marginTop: 25,
              }}>
              <Icon
                name={'bank-plus'}
                size={15}
                style={{alignSelf: 'center', marginRight: 10}}
                color={Colors.primary}
              />
              <Text
                style={{
                  fontFamily: Fonts.SemiBold,
                  fontSize: 14,
                  color: 'white',
                }}>
                ADD UPI ID
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0, 0, 0, .2)',
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeItem: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderBottomWidth: 3,
    borderBottomColor: Colors.primary,
  },
  active: {
    color: Colors.primary,
    fontFamily: Fonts.bold,
    fontSize: 14,
  },
  inactive: {
    color: Colors.dark_gray,
    fontFamily: Fonts.medium,
  },
  label: {
    fontSize: 12,
    paddingVertical: 20,
    textAlign: 'center',
  },
});
