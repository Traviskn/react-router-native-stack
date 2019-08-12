import React, { Component } from 'react';
import { Platform, View, ViewPropTypes } from 'react-native';
import { node, object, bool, string, func, oneOf } from 'prop-types';
import { withRouter } from './routing';
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
    replaceTransitionType: oneOf([PUSH, POP]),
    isAnimating: func,
  };

  static defaultProps = {
    animationType: Platform.OS === 'ios' ? SLIDE_HORIZONTAL : FADE_VERTICAL,
    gestureEnabled: true,
    isAnimating: () => null,
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
    const {
      children,
      history,
      location,
      renderHeader,
      renderTitle,
      renderLeftSegment,
      renderRightSegment,
      animationType,
      gestureEnabled,
      stackViewStyle,
      replaceTransitionType,
      isAnimating,
    } = this.props;

    const { height, width } = this.state;

    return (
      <View style={styles.stackContainer} onLayout={this.onLayout}>
        <StackTransitioner
          history={history}
          location={location}
          height={height}
          width={width}
          renderHeader={renderHeader}
          renderTitle={renderTitle}
          renderLeftSegment={renderLeftSegment}
          renderRightSegment={renderRightSegment}
          animationType={animationType}
          gestureEnabled={gestureEnabled}
          children={children}
          stackViewStyle={stackViewStyle}
          replaceTransitionType={replaceTransitionType}
          isAnimating={isAnimating}
        />
      </View>
    );
  }
}

export default withRouter(Stack);
