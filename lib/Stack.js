import React, { Component } from 'react';
import { Platform, View, ViewPropTypes } from 'react-native';
import { node, object, bool, string, func, oneOf } from 'prop-types';
import { withRouter } from 'react-router-native';
import StackTransitioner from './StackTransitioner';
import { PUSH, POP } from './transitionTypes';
import { SLIDE_HORIZONTAL, FADE_VERTICAL } from './animationTypes';
import styles from './styles';

class Stack extends Component {
  static propTypes = {
    children: node,
    history: object,
    location: object,
    renderHeader: func,
    renderTitle: func,
    renderLeftSegment: func,
    renderRightSegment: func,
    animationType: string,
    gestureEnabled: bool,
    stackViewStyle: ViewPropTypes.style,
    replaceTransitionType: oneOf([PUSH, POP])
  };

  static defaultProps = {
    animationType: Platform.OS === 'ios' ? SLIDE_HORIZONTAL : FADE_VERTICAL,
    gestureEnabled: true,
  };

  state = {
    width: 0,
    height: 0,
  };

  onLayout = event => {
    const { height, width } = event.nativeEvent.layout;
    this.setState({ height, width });
  };

  render() {
    return (
      <View style={styles.stackContainer} onLayout={this.onLayout}>
        <StackTransitioner {...this.props} {...this.state}/>
      </View>
    );
  }
}

export default withRouter(Stack);
