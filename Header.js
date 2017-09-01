import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, Image, TouchableOpacity, View } from 'react-native';
import styles from './styles';
import icon from './assets/back-icon.png';

export default class Header extends Component {
  static propTypes = {
    goBack: PropTypes.func,
    showBack: PropTypes.bool,
    animation: PropTypes.instanceOf(Animated.Value),
    animationMax: PropTypes.number,
    animationMin: PropTypes.number,
    transition: PropTypes.string,
    isPanning: PropTypes.bool,
    history: PropTypes.object,
    location: PropTypes.object,
    match: PropTypes.object,
    renderTitle: PropTypes.func,
    renderLeftSegment: PropTypes.func,
    renderRightSegment: PropTypes.func,
  };

  state = {
    previousShowBack: false,
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      previousShowBack: this.props.showBack,
    });
  }

  renderTitle() {
    if (typeof this.props.renderTitle === 'function') {
      return this.props.renderTitle(this.props);
    }
    return null;
  }

  renderLeftSegment(showBack) {
    if (typeof this.props.renderLeftSegment === 'function') {
      return this.props.renderLeftSegment({ ...this.props, showBack });
    }
    return showBack
      ? <TouchableOpacity onPress={this.props.goBack}>
          <Image
            source={icon}
            style={{
              height: 21,
              width: 13,
            }}
          />
        </TouchableOpacity>
      : null;
  }

  renderRightSegment() {
    if (typeof this.props.renderRightSegment === 'function') {
      return this.props.renderLeftSegment(this.props);
    }
    return null;
  }

  renderInnerHeader = showBack => [
    <View key="left" style={styles.left}>
      {this.renderLeftSegment(showBack)}
    </View>,

    <View key="title" style={styles.title}>
      {this.renderTitle()}
    </View>,

    <View key="right" style={styles.right}>
      {this.renderRightSegment()}
    </View>,
  ];

  render() {
    const { animation, animationMax, animationMin, showBack, isPanning, transition } = this.props;

    const headers = [];

    if (transition || isPanning) {
      const thisHeader = (
        <Animated.View
          style={[
            styles.header,
            styles.animatingHeader,
            {
              opacity: animation.interpolate({
                inputRange: [animationMin, 0, animationMax],
                outputRange: [1, 0, 1],
              }),
            },
          ]}>
          {this.renderInnerHeader(showBack)}
        </Animated.View>
      );

      const previousHeader = (
        <Animated.View
          style={[
            styles.header,
            styles.animatingHeader,
            {
              opacity: animation.interpolate({
                inputRange: [animationMin, 0, animationMax],
                outputRange: [0, 1, 0],
              }),
            },
          ]}>
          {this.renderInnerHeader(this.state.previousShowBack)}
        </Animated.View>
      );

      if (transition === 'PUSH') {
        headers.push(previousHeader);
        headers.push(thisHeader);
      } else {
        // POP and panning cases
        headers.push(thisHeader);
        headers.push(previousHeader);
      }

      return (
        <View style={styles.header}>
          {headers[0]}
          {headers[1]}
        </View>
      );
    }

    return (
      <View style={styles.header}>
        {this.renderInnerHeader(showBack)}
      </View>
    );
  }
}
