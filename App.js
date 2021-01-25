import 'react-native-gesture-handler';

import React, {Component} from 'react';
import {
  Dimensions,
  YellowBox,
  View,
  Image,
  Text,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
YellowBox.ignoreWarnings([
  'Warning: isMounted(...) is deprecated',
  'Warning: Encountered two children with the same key',
  'Warning: Each child is an array',
  'Class RCTCxxModule',
]);

import {createAppContainer} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {createStackNavigator} from 'react-navigation-stack';

import Sidebar from './App/component/Sidebar';
import Splash from './App/screen/splash';
import Login from './App/screen/login';
import ForgetPassword from './App/screen/forgetpass';
import Verification from './App/screen/verification';
import Registration from './App/screen/registration';
import Home from './App/screen/home';
import ViewCategory from './App/screen/viewCategory';
import Notification from './App/screen/notification';
import Wallet from './App/screen/wallet';

import Profile from './App/screen/profile';
import MyLocation from './App/screen/myLocation';

import Offers from './App/screen/Offers/offers';
import ProductDetails from './App/screen/Offers/productdetails';

import Refer from './App/screen/reffer_earn';
import ContactUs from './App/screen/contact_us';
import AboutUs from './App/screen/about_us';

import Order from './App/screen/order';
import OrderID from './App/screen/orderid';

import ReturnProduct from './App/screen/return_product';
import TermsCondition from './App/screen/terms_condition';

import Cart from './App/screen/cart';
import Map from './App/screen/map';
import Address from './App/screen/address';

import Faq from './App/screen/faq';

import Listproduct from './App/screen/Listproduct';
import Viewproduct from './App/screen/viewproduct';

import Search from './App/screen/search';

import AddNewCard from './App/screen/addNewCard';

import Test from './App/screen/test';
import Payment from './App/screen/payment';
import Maintenance from './App/screen/maintenance';
import TodayDealProduct from './App/screen/TodayDealsProduct';
import Success from './App/screen/Success';
import Failure from './App/screen/Failure';
import AddAddress from './App/screen/addAddress';
import Slot from './App/screen/slot';
import EditOrder from './App/screen/editOrder';
import EOrderSearch from './App/screen/eOrderSearch';

export const CityBasket = createDrawerNavigator(
  {
    Home: {screen: Home},
    Notification: {screen: Notification},
  },
  {
    initialRouteName: 'Home',
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle',
    drawerPosition: 'left',
    drawerWidth: width * 1,

    contentOptions: {
      activeTintColor: '#e60000',
      activeBackgroundColor: 'purple',
      style: {
        marginVertical: 0,
      },
      labelStyle: {
        backgroundColor: 'transparent',
      },
    },
    contentComponent: (props, tintColor) => <Sidebar {...props} />,
  },
);

const Application = createStackNavigator(
  {
    // Test:{screen:Test},
    Splash: {screen: Splash},
    Home: {screen: CityBasket},

    Login: {screen: Login},
    Registration: {screen: Registration},
    ForgetPassword: {screen: ForgetPassword},
    Verification: {screen: Verification},
    Notification: {screen: Notification},
    Profile: {screen: Profile},
    MyLocation: {screen: MyLocation},
    Cart: {screen: Cart},
    Address: {screen: Address},
    ViewCategory: {screen: ViewCategory},
    Offers: {screen: Offers},
    Map: {screen: Map},
    ProductDetails: {screen: ProductDetails},
    Wallet: {screen: Wallet},
    Refer: {screen: Refer},
    ContactUs: {screen: ContactUs},
    AboutUs: {screen: AboutUs},
    Order: {screen: Order},
    OrderID: {screen: OrderID},
    ReturnProduct: {screen: ReturnProduct},
    TermsCondition: {screen: TermsCondition},
    Faq: {screen: Faq},
    Listproduct: {screen: Listproduct},
    Search: {screen: Search},
    Payment: {screen: Payment},
    AddNewCard: {screen: AddNewCard},
    Viewproduct: {screen: Viewproduct},
    Maintenance: {screen: Maintenance},
    TodayDealsProduct: {screen: TodayDealProduct},
    Success: {screen: Success},
    Failure: {screen: Failure},
    AddAddress: {screen: AddAddress},
    Slot: {screen: Slot},
    EditOrder: {screen: EditOrder},
    EOrderSearch: {screen: EOrderSearch},
  },
  {headerMode: 'none'},
);

const AppNavigator = createAppContainer(Application);

export default class App extends React.Component {
  componentDidMount() {
    SplashScreen.hide();
  }
  render() {
    return (
      <View style={{flex: 1}}>
        <AppNavigator navigation={this.props.navigation} />
      </View>
    );
  }
}
