import React, { Component } from 'react';
import { bool, node, object, string } from 'prop-types';
import { Animated, Image, Text, TouchableOpacity, View } from 'react-native';
import { PUSH, POP } from './transitionTypes';
import backIcon from './assets/back-icon.png';
import styles from './styles';

export default class Header extends Component {
  static propTypes = {
    animation: object,
    animationType: string,
    transition: string,
    history: object,
    location: object,
    title: string,
    backTitle: string,
    showBack: bool,
    rightComponent: node,
  };

  state = {
    transition: null,
    nextTitle: null,
    nextBackTitle: null,
    nextRightComponent: null,
  };

  componentWillReceiveProps(nextProps) {
    // nextTransition (determines if animation is occurring or not)
    //   -> nextTitle, nextRightComponent, nextShowBack, nextBackTitle
    // Back Icon animates opacity
    // backTitle animates x pos and opacity
    // title animates x pos and opacity
    // right component animates opacity
  }

  // TODO: Only animate header for horizontal animation types
  render() {
    const { backTitle, history, location, rightComponent, showBack, title } = this.props;
    const { transition, nextTitle, nextBackTitle, nextRightComponent } = this.state;

    let titles = [];
    let backTitles = [];
    let rightComponents = [];

    if (transition === PUSH) {
      // TODO
    } else if (transition === POP) {
      // TODO
    } else {
      titles.push(
        <Text key={`${location.key}${title}`} style={styles.titleText}>
          {title}
        </Text>
      );
      backTitles.push(
        <Text key={`${location.key}${backTitle}`} style={styles.backText}>
          {backTitle}
        </Text>
      );
      rightComponent && rightComponents.push(React.createElement(rightComponent, { key: `${location.key}` }));
    }

    return (
      <View style={styles.header}>
        <View style={styles.left}>
          {showBack && (
            <TouchableOpacity onPress={history.goBack}>
              <View style={styles.backWrapper}>
                <Image source={backIcon} style={styles.backIcon} />

                {backTitles.map(bt => bt)}
              </View>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.title}>
          {titles.map(t => t)}
        </View>

        <View style={styles.right}>
          {rightComponents.map(rc => rc)}
        </View>
      </View>
    );
  }
}
