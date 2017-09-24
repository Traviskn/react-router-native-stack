import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import styles from './styles';

export default class Header extends Component {
  static propTypes = {
    animation: PropTypes.object,
    history: PropTypes.object,
    currentTitle: PropTypes.string,
    backTitle: PropTypes.string,
    showBack: PropTypes.bool,
  };

  render() {
    return (
      <View style={styles.header}>
        <View style={styles.left}>
          {this.props.showBack &&
            <TouchableOpacity onPress={this.props.history.goBack}>
              <Text>
                {`< ${this.props.backTitle}`}
              </Text>
            </TouchableOpacity>}
        </View>

        <View style={styles.title}>
          <Text>
            {this.props.currentTitle}
          </Text>
        </View>

        <View style={styles.right}>
          <Text>
            {'RIGHT'}
          </Text>
        </View>
      </View>
    );
  }
}
