import React, { Component } from 'react';
import { View} from 'react-native';
import colors from '../common/Colors';
import Fonts from '../common/Fonts'


const Line = props =>{
    return(
        <View style={{...props.style}}>
         {props.children}
        </View>
    );
}
export default Line;