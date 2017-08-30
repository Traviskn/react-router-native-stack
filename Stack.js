import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { Switch, withRouter } from 'react-router-native';
import StackTransitioner from './StackTransitioner';
import styles from './styles';

class Stack extends Component {
  static propTypes = {
    children: PropTypes.node,
    history: PropTypes.object,
    location: PropTypes.object,
    match: PropTypes.object,
    renderHeader: PropTypes.func,
    renderTitle: PropTypes.func,
    renderLeftSegment: PropTypes.func,
    renderRightSegment: PropTypes.func,
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
      match,
      renderHeader,
      renderTitle,
      renderLeftSegment,
      renderRightSegment,
    } = this.props;

    const { height, width } = this.state;

    return (
      <View style={styles.transitionContainer} onLayout={this.onLayout}>
        <StackTransitioner
          history={history}
          location={location}
          match={match}
          height={height}
          width={width}
          renderHeader={renderHeader}
          renderTitle={renderTitle}
          renderLeftSegment={renderLeftSegment}
          renderRightSegment={renderRightSegment}>
          <Switch location={location}>
            {children}
          </Switch>
        </StackTransitioner>
      </View>
    );
  }
}

export default withRouter(Stack);
