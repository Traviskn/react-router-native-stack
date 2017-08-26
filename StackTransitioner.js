import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, Easing, PanResponder, View } from 'react-native';
import Header from './Header';
import styles from './styles';

const ANIMATION_DURATION = 500;
const POSITION_THRESHOLD = 1 / 2;
const RESPOND_THRESHOLD = 1;
const GESTURE_RESPONSE_DISTANCE_HORIZONTAL = 40;
// const GESTURE_RESPONSE_DISTANCE_VERTICAL = 135;

export default class StackTransitioner extends Component {
  static propTypes = {
    children: PropTypes.node,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    width: PropTypes.number.isRequired,
  };

  state = {
    previousChildren: null,
    transition: null,
  };

  startingIndex = null;

  animation = new Animated.Value(0);

  isPanning = false;

  panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (event, gesture) => {
      return (
        this.props.history.index > this.startingIndex &&
        this.props.history.canGo(-1) &&
        event.nativeEvent.pageX < GESTURE_RESPONSE_DISTANCE_HORIZONTAL &&
        gesture.dx > RESPOND_THRESHOLD
      );
    },

    onPanResponderGrant: (event, { moveX }) => {
      this.isPanning = true;
      this.props.history.goBack();
    },

    // No idea why this Animated.event isn't working...
    // onPanResponderMove: Animated.event([null, { moveX: this.animation }]),
    onPanResponderMove: (event, { moveX }) => {
      this.animation.setValue(moveX);
    },

    onPanResponderRelease: (event, { dx, vx }) => {
      const defaultVelocity = this.props.width / ANIMATION_DURATION;
      const velocity = Math.max(Math.abs(vx), defaultVelocity);
      const resetDuration = dx / velocity;
      const goBackDuration = (this.props.width - dx) / velocity;

      // first check velocity to decide whether to cancel or not
      if (vx < -0.5) {
        this.cancelNavigation(resetDuration);
        return;
      } else if (vx > 0.5) {
        this.finishNavigation(goBackDuration);
        return;
      }

      // next use position to decide whether to cancel or not
      if (dx / this.props.width < POSITION_THRESHOLD) {
        this.cancelNavigation(resetDuration);
      } else {
        this.finishNavigation(goBackDuration);
      }
    },
  });

  cancelNavigation = duration => {
    this.props.history.goForward();

    Animated.timing(this.animation, {
      toValue: 0,
      duration,
      useNativeDriver: true,
    }).start(this.afterPan);
  };

  finishNavigation = duration => {
    Animated.timing(this.animation, {
      toValue: this.props.width,
      duration,
      useNativeDriver: true,
    }).start(this.afterPan);
  };

  afterPan = () => {
    this.isPanning = false;
    this.setState({
      previousChildren: null,
      transition: null,
    });
    this.animation = new Animated.Value(0);
  };

  componentWillMount() {
    this.startingIndex = this.props.history.index;
  }

  componentWillReceiveProps(nextProps) {
    // New route comes in after a swipe gesture begins. Save the children so we
    // can render both routes during the transition.
    // Don't trigger the timing animation if user is swiping, let the gesture
    // control the animation.
    if (this.isPanning) {
      if (this.state.previousChildren === null) {
        this.setState({ previousChildren: this.props.children });
      }
      return;
    }
    // NOTE: We can't assume that the next location matches any routes in the switch
    // This means that users will need to wrap the stack in a route component
    // that stops matching if they need to navigate to a route not contained in
    // the stack.

    // TODO: Consider a master/detail view with a stack on the left, and a detail
    // screen on the right.  You want both the stack and the detail to match at the
    // same time, but you don't necessarily always want the stack to transition.
    // For example if you are drilling down through categories, you want the
    // stack to slide transition as you select categories, but then once you
    // select items you only want the detail to update and not for the stack
    // to slide.
    // It seems we may need some prop or url param to tell the stack to not
    // transition
    const { history } = nextProps;
    const { location, children, width } = this.props;

    if (
      nextProps.location.key !== location.key &&
      (history.action === 'PUSH' || history.action === 'POP')
    ) {
      if (history.action === 'POP' && history.index < this.startingIndex) {
        return;
      }

      this.setState(
        {
          previousChildren: children,
          transition: history.action,
        },
        () => {
          // TODO: add more animation options and make animation configurable
          // - default based on platform (slide ios, fade android)
          // - base slide direction on `I18nManager.isRTL`
          // - fade in from bottom/top
          // - fade out to bottom/top
          // - slide in from bottom/top
          // - slide out to bottom/top
          // - cube transition
          Animated.timing(this.animation, {
            duration: ANIMATION_DURATION,
            toValue: history.action === 'PUSH' ? -width : width,
            easing: Easing.bezier(0.2833, 0.99, 0.31833, 0.99),
            useNativeDriver: true,
          }).start(() => {
            this.setState({
              previousChildren: null,
              transition: null,
            });

            this.animation = new Animated.Value(0);
          });
        }
      );
    }
  }

  renderHeader() {
    // TODO: Add more header configuration options
    // - title
    // - right/left button
    // - Allow rendering a custom header
    return (
      <Header
        goBack={this.props.history.goBack}
        showBack={this.props.history.index > this.startingIndex && this.props.history.canGo(-1)}
        animation={this.animation}
        animationMax={this.props.width}
        animationMin={-this.props.width}
        transition={this.state.transition}
        isPanning={this.isPanning}
      />
    );
  }

  render() {
    const { children, width } = this.props;
    const { previousChildren, transition } = this.state;
    const { stackView } = styles;
    const transform = { transform: [{ translateX: this.animation }] };
    const offscreen = { left: width, right: -width };

    let routes = [];
    if (transition === 'PUSH') {
      routes.push(
        <Animated.View style={stackView}>
          {previousChildren}
        </Animated.View>
      );
      routes.push(
        <Animated.View style={[stackView, offscreen, transform]}>
          {children}
        </Animated.View>
      );
    } else if (transition === 'POP' || this.isPanning) {
      routes.push(
        <Animated.View style={stackView}>
          {children}
        </Animated.View>
      );
      routes.push(
        <Animated.View style={[stackView, transform]}>
          {previousChildren}
        </Animated.View>
      );
    } else {
      return (
        <View style={stackView} {...this.panResponder.panHandlers}>
          {children}
          {this.renderHeader()}
        </View>
      );
    }

    return (
      <View style={stackView} {...this.panResponder.panHandlers}>
        <View style={styles.transitionContainer}>
          {routes[0]}
          {routes[1]}
        </View>
        {this.renderHeader()}
      </View>
    );
  }
}
