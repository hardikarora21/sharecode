import React, { useState } from 'react';
import {
    Animated,
    Image,
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    FlatList,
    Dimensions,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import Colors from '../common/Colors';
import Header from '../component/Header';
import Fonts from '../common/Fonts';
import { Dropdown } from '../component/dropdown'
import { SwipeListView } from 'react-native-swipe-list-view';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;


export default class SwipeValueBasedUi extends React.Component {
    // const [listData, setListData] = useState(
    //     Array(20)
    //         .fill('')
    //         .map((_, i) => ({ key: `${i}`, text: `item #${i}` }))
    // );

     closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };



     onRowDidOpen = rowKey => {
        console.log('This row opened', rowKey);
    };

     onSwipeValueChange = swipeData => {
        const { key, value } = swipeData;
       
    };

     renderItem = data => (
        <View style={{ flex: 1, margin: 6 }}>

                          
        <View
            style={{
                flex: 1,
                paddingVertical: 15,
                width: '96%',
                alignSelf: 'center', paddingHorizontal: 6,
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
                backgroundColor: Colors.viewBox
            }}>
            <View style={{
                flexDirection: 'row'
            }}>
                {data.item.image ?
                    <View style={{
                        height: height * 0.2 / 2,
                        backgroundColor: Colors.white,
                        width: width * 0.2,
                        borderRadius: 10,
                    }}>
                        <Image
                            resizeMode="contain"
                            style={{
                                backgroundColor: Colors.viewBox,
                                width: '100%',
                                height: '100%',

                                borderRadius: 10,
                            }}
                            source={data.item.image} />
                    </View> : null}

                <View style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    paddingHorizontal:2
                }}>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Text
                        numberOfLines={4}
                        style={{
                            fontFamily: Fonts.Regular,
                            fontSize: 16,
                            paddingHorizontal: 8
                        }}>
                        {data.item.name}</Text>
                        
                        <Text
                                style={{
                                    // textDecorationLine: 'line-through',
                                    fontFamily: Fonts.SemiBold,
                                    textAlign: 'left',
                                    color: Colors.red,
                                    paddingHorizontal: 4,
                                    fontSize: 10,
                                }}>{data.item.of}</Text>
                        </View>

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
                            labelExtractor={({ name }) => name}
                            valueExtractor={({ id }) => id}
                            textColor={
                                data.item.value ? Colors.black : Colors.dark_gray
                            }

                            value={data.item.value}
                            onChangeText={data => {
                                console.log('id141020107014', data);
                                // this.setState({ depId }); 
                            }}

                            data={data.item.Data}
                        />
                    </View>

                </View>

            </View>
            <View style={{
                flexDirection: 'row',
                paddingHorizontal: 0,
                alignItems: 'center'
            }}>
                <View style={{ flexDirection: 'column' }}>
                    <View style={{
                        flexDirection: 'row', alignItems: 'center',
                        paddingHorizontal: 25
                    }}>
                        <Text
                            numberOfLines={4}
                            style={{
                                fontFamily: Fonts.Regular,
                                color: Colors.primary,

                                fontSize: 16
                            }}>

                            {data.item.rs}</Text>
                        {data.item.drs ?
                            <Text
                                style={{
                                    textDecorationLine: 'line-through',
                                    fontFamily: Fonts.SemiBold,
                                    textAlign: 'left',
                                    color: Colors.red,
                                    paddingHorizontal: 4,
                                    fontSize: 10,
                                }}>{data.item.drs}</Text> : null}
                    </View>

                    <View style={{
                        // width: '100%',
                        justifyContent: 'space-between',
                        flexDirection: 'row',

                        marginVertical: 10,
                        alignSelf: 'center',

                    }}>

                        <TouchableOpacity
                            onPress={() => {
                                console.log(data.item.Data);

                                if (item.qty == 0) {
                                    return false;
                                } else {
                                    this.setState({ refresh: !this.state.refresh })
                                    DataSource[index].qty = DataSource[index].qty - 1
                                    console.log('Data', DataSource);

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
                            <Text
                                style={{
                                    fontFamily: Fonts.Regular,
                                    fontSize: 16
                                }}>{data.item.qty}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {

                                this.setState({ refresh: !this.state.refresh })
                                DataSource[index].qty = DataSource[index].qty + 1
                                console.log('Data', DataSource);

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
                {data.item.delete ?
                    <TouchableOpacity style={{
                        height: height * 0.2 / 2,
                        backgroundColor: Colors.white,
                        width: width * 0.2,
                        borderRadius: 10,
                    }}>
                        <Image
                            resizeMode="contain"
                            style={{
                                backgroundColor: Colors.viewBox,
                                width: '100%',
                                height: '100%',
                                paddingHorizontal: 0,
                                borderRadius: 10,
                            }}
                            source={data.item.delete} />
                    </TouchableOpacity> : null}
            </View>




        </View>

    </View>

    );

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
                this.closeRow(rowMap, data.item.key)
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
render(){
    return (
        <View style={styles.container}>
            <SwipeListView
                data={DataSource}
                renderItem={this.renderItem}
                renderHiddenItem={this.renderHiddenItem}
               
                rightOpenValue={-80}
                previewRowKey={'0'}
                previewOpenValue={-40}
                previewOpenDelay={3000}
                onRowDidOpen={this.onRowDidOpen}
                onSwipeValueChange={this.onSwipeValueChange}
            />
        </View>
    );
}
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor: 'white',
        flex: 1,
    },
    backTextWhite: {
        color: '#FFF',
    },
    rowFront: {
        margin: 10,
        alignItems: 'center',
        backgroundColor: '#CCC',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        justifyContent: 'center',
        height: 50,
    },
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
});





