import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { ParallaxImage } from 'react-native-snap-carousel';
import styles from '../slider/SliderEntry.style';

export default class SliderEntry extends Component {

    static propTypes = {
        data: PropTypes.object.isRequired,
        parallax: PropTypes.bool,
        parallaxProps: PropTypes.object,
        click:PropTypes.object,
    };

    get image () {
        const { data: { img }, parallax, parallaxProps} = this.props;

        return parallax ? (
            <ParallaxImage
              resizeMode={'contain'}
              source={{ uri: img }}
              containerStyle={styles.imageContainer}
              style={styles.image}
              parallaxFactor={0.35}
              showSpinner={true}
              spinnerColor={'red'}
              {...parallaxProps}
            />
        ) : (
            <Image
              source={{ uri: img }}
              resizeMode={"contain"}
              style={styles.image}
            />
        );
    }

    render () {
        const { data: { title, desc, id },click, navigation } = this.props;

        const uppercaseTitle = title ? (
            <Text
              style={styles.title}
              numberOfLines={2}
            >
                { title.toUpperCase() }
            </Text>
        ) : false;
        
        return (
            <TouchableOpacity
              activeOpacity={1}
              style={styles.slideInnerContainer}
              onPress={() => navigation.navigate('Offers', {id: id})}
              >
                <View style={styles.shadow} />
                <View style={styles.imageContainer}>
                    { this.image }
                    <View style={styles.radiusMask} />
                </View>
                {uppercaseTitle || desc ?
                <View style={styles.textContainer}>
                    { uppercaseTitle }
                    <Text
                      style={styles.subtitle}
                      numberOfLines={2}
                    >
                        { desc }
                    </Text>
                </View>
                : null }
            </TouchableOpacity>
        );
    }
}
