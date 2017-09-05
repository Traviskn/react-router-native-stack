import React, { Component } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import one from './assets/1.jpg';
import two from './assets/2.jpg';
import three from './assets/3.jpg';
import four from './assets/4.jpg';
import five from './assets/5.jpg';
import six from './assets/6.jpg';

export default class Picture extends Component {
  render() {
    const { height, width } = Dimensions.get('window');

    const imageIndex = parseInt(this.props.match.params.id || 1, 10);

    let image = one;
    if (imageIndex === 2) {
      image = two;
    } else if (imageIndex === 3) {
      image = three;
    } else if (imageIndex === 4) {
      image = four;
    } else if (imageIndex === 5) {
      image = five;
    } else if (imageIndex === 6) {
      image = six;
    }

    return (
      <View style={StyleSheet.absoluteFill}>
        <Image source={image} style={{ height, width }} />

        {imageIndex < 6 && (
          <TouchableOpacity
            style={{ position: 'absolute', top: 20, right: 10, backgroundColor: 'transparent' }}
            onPress={() => this.props.history.push(`/${imageIndex + 1}`)}>
            <Text style={{ fontWeight: 'bold', color: 'white' }}>Next ></Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}
