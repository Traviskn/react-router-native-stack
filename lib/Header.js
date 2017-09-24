import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, Image, Text, TouchableOpacity, View } from 'react-native';
import backIcon from './assets/back-icon.png';
import styles from './styles';

export default class Header extends Component {
  static propTypes = {
    animation: PropTypes.object,
    history: PropTypes.object,
    currentTitle: PropTypes.string,
    backTitle: PropTypes.string,
    showBack: PropTypes.bool,
    currentRightComponent: PropTypes.node,
    backRightComponent: PropTypes.node,
  };

  render() {
    const { showBack, history, backTitle, currentTitle } = this.props;

    return (
      <View style={styles.header}>
        <View style={styles.left}>
          {showBack && (
            <TouchableOpacity onPress={history.goBack}>
              <View style={styles.backWrapper}>
                <Image source={backIcon} style={styles.backIcon} />

                <Text style={styles.backText}>{backTitle}</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.title}>
          <Text style={styles.titleText}>{currentTitle}</Text>
        </View>

        <View style={styles.right}>
          {this.props.currentBackRightComponent && (
            this.props.currentRightComponent
          )}
        </View>
      </View>
    );
  }
}
