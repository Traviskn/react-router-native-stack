import React, { Component } from 'react';
import { View } from 'react-native';
import { node, object, bool, string, func } from 'prop-types';
import { Switch, withRouter } from 'react-router-native';
import StackTransitioner from './StackTransitioner';
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
    animate: bool,
    gestureEnabled: bool,
  };

  static defaultProps = {
    animationType: 'slide-horizontal',
    animate: true,
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
      animate,
      gestureEnabled,
    } = this.props;

    const { height, width } = this.state;

    return (
      <View style={styles.transitionContainer} onLayout={this.onLayout}>
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
          animate={animate}
          gestureEnabled={gestureEnabled}>
          <Switch location={location}>
            {children}
          </Switch>
        </StackTransitioner>
      </View>
    );
  }
}

export default withRouter(Stack);
