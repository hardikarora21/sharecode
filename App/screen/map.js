import React, { Component } from 'react';
import { StyleSheet,Text, View,TextInput,Image,Dimensions,TouchableOpacity} from 'react-native';
import MapView, { Marker, ProviderPropType } from 'react-native-maps';
import Colors from '../common/Colors'
import Header from '../component/Header'
import Fonts from '../common/Fonts';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Geolocation from '@react-native-community/geolocation';
import { NavigationEvents } from 'react-navigation';

const { width: width, height: height } = Dimensions.get('window');
import AsyncStorage from '@react-native-community/async-storage';



const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;

function log(eventName, e) {
  console.log(eventName, e.nativeEvent);
}

const GOOGLE_PLACES_API_KEY = 'AIzaSyD_U1JHjLgJ6JJlL79FSOSi9HAim6Fl9W8'
 class Map extends Component {


  constructor(props) {
    super(props);

    this.state = {
      cartCount : 0,
      a: {
        latitude: LATITUDE + SPACE,
        longitude: LONGITUDE + SPACE,
      },
      b: {
        latitude: LATITUDE - SPACE,
        longitude: LONGITUDE - SPACE,
      },
    };
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


  componentDidMount() {
    Geolocation.getCurrentPosition(
      position => {
        const initialPosition = JSON.stringify(position);
        this.setState({initialPosition});
        console.log(initialPosition);
        
      },
      error => console.log('Error', JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
    
  }


  
  render() {
    return (
      <View style={styles.container}>
        
<NavigationEvents onDidFocus={()=> {
                      this.countFunction()
                    }} />
          <Header
                    Back={() => {
                        this.props.navigation.goBack();
                    }}
                    pageTitle={'Delivery Address'}
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
                            height: height * 0.06 + 3, width: '80%',
                            marginVertical: 20,
                            paddingHorizontal: 6,
                            backgroundColor: Colors.white,
                            elevation: 1, borderRadius: 15,
                            flexDirection: 'row',
                            alignSelf:'center',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                          <Image
                                    resizeMode="contain"

                                    style={{
                                        width: '10%',
                                        height: '50%',
                                    }}
                                    source={require('../images/location.png')}
                                />
                                               <GooglePlacesAutocomplete
        placeholder='Type here'
        minLength={2} // minimum length of text to search
        autoFocus={false}
        fetchDetails={true}
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          console.log(data);
          console.log(details);
        }}
        onFail={error => console.log(error)}
        query={{
          // available options: https://developers.google.com/places/web-service/autocomplete
          key: GOOGLE_PLACES_API_KEY,
          language: 'en', // language of the results
          // types: '(cities)', // default: 'geocode'
        }}
        styles={{
          textInputContainer: {
            backgroundColor: 'rgba(0,0,0,0)',
            borderTopWidth: 0,
            borderBottomWidth: 0,
          },
          textInput: {
            marginLeft: 0,
            marginRight: 0,
           
            color: '#5d5d5d',
            fontSize: 16,
          },
          predefinedPlacesDescription: {
            color: '#1faadb',
          },
        }}
        currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
        currentLocationLabel='Current location'
        nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
   
      />

                         
                           

                        </View>
    
                        <MapView
          provider={this.props.provider}
          style={styles.map}
          initialRegion={{
            latitude: LATITUDE,
            longitude: LONGITUDE,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
        >
          <Marker
            coordinate={this.state.a}
            image={require('../images/PIN.png')}
            onSelect={e => log('onSelect', e)}
            onDrag={e => log('onDrag', e)}
            onDragStart={e => log('onDragStart', e)}
            onDragEnd={e => log('onDragEnd', e)}
            onPress={e => log('onPress', e)}
            draggable
          >
           
          </Marker>
          
        </MapView>

          <TouchableOpacity
                            // onPress={() => this.Login()}
                            onPress={() => {

                                this.props.navigation.navigate('Address', {
                                cart: this.props.navigation.state.params.cart, 
                                finalPrice : this.props.navigation.state.params.finalPrice,
                                totalQty : this.props.navigation.state.params.totalQty,
                                total : this.props.navigation.state.params.total,
                                totalSave : this.props.navigation.state.params.totalSave,
                                lat:'37.78825',
                                lon:'-122.4324'
                                });
                            }}
                            activeOpacity={0.8}
                            style={{
                              marginVertical:15,
                                width: '75%', borderRadius: 40, elevation: 1,
                                justifyContent: 'center', alignItems: 'center', alignSelf: 'center',
                                backgroundColor: Colors.acent, height: height * 0.2 / 2.8
                            }}>

                            <Text style={{ fontFamily: Fonts.SemiBold, fontSize: 18, color: Colors.white }}>Save this location</Text>

                        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
 flex: 1,
  },
  map: {
    flex: 1,
  }
});

Map.propTypes = {
  provider: ProviderPropType,
};

export default Map;