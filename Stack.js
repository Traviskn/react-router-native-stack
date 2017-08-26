import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { Switch, withRouter } from 'react-router-native';
import StackTransitioner from './StackTransitioner';
import styles from './styles';

class Stack extends Component {
  static propTypes = {
    children: PropTypes.node,
    location: PropTypes.object,
    history: PropTypes.object,
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
      <View style={styles.transitionContainer} onLayout={this.onLayout}>
        <StackTransitioner
          location={this.props.location}
          history={this.props.history}
          height={this.state.height}
          width={this.state.width}>
          <Switch location={this.props.location}>
            {this.props.children}
          </Switch>
        </StackTransitioner>
      </View>
    );
  }
}

export default withRouter(Stack);
