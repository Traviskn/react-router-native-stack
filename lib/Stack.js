import React, { Component } from 'react';
import { Platform, View } from 'react-native';
import { node, object, bool, string, func } from 'prop-types';
import { withRouter } from 'react-router-native';
import StackTransitioner from './StackTransitioner';
import { SLIDE_HORIZONTAL, FADE } from './animationTypes';
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
  };

  static defaultProps = {
    animationType: FADE,
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
        />
      </View>
    );
  }
}

export default withRouter(Stack);
