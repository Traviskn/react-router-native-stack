import React, { Component } from 'react';
import { node, object, number, bool, string } from 'prop-types';
import { Animated, PanResponder, View } from 'react-native';
import getTransforms from './getTransforms';
import getEasing from './getEasing';
import getDuration from './getDuration';
import getDimension from './getDimension';
import { PUSH, POP } from './transitionTypes';
import { NONE } from './animationTypes';
import styles from './styles';

const ANIMATION_DURATION = 500;
const POSITION_THRESHOLD = 1 / 2;
const RESPOND_THRESHOLD = 1;
const GESTURE_RESPONSE_DISTANCE_HORIZONTAL = 40;
// const GESTURE_RESPONSE_DISTANCE_VERTICAL = 135;

export default class StackTransitioner extends Component {
  static propTypes = {
    children: node,
    history: object.isRequired,
    location: object.isRequired,
    width: number.isRequired,
    height: number.isRequired,
    animationType: string.isRequired,
    animate: bool,
    gestureEnabled: bool,
  };

  state = {
    previousChildren: null,
    transition: null,
  };

  startingIndex = null;

  animation = new Animated.Value(0);

  isPanning = false;

  isHorizontal = animationType =>
    animationType.indexOf('horizontal') > -1 || animationType === 'cube';

  panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (event, gesture) => {
      return (
        this.isHorizontal(this.props.animationType) &&
        this.props.gestureEnabled &&
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

    onPanResponderMove: (event, { moveX }) => {
      this.animation.setValue(moveX);
    },

    onPanResponderRelease: (event, { dx, vx }) => {
      const defaultVelocity = this.getDimension() / ANIMATION_DURATION;
      const velocity = Math.max(Math.abs(vx), defaultVelocity);
      const resetDuration = dx / velocity;
      const goBackDuration = (this.getDimension() - dx) / velocity;

      // first check velocity to decide whether to cancel or not
      if (vx < -0.5) {
        this.cancelNavigation(resetDuration);
        return;
      } else if (vx > 0.5) {
        this.finishNavigation(goBackDuration);
        return;
      }

      // next use position to decide whether to cancel or not
      if (dx / this.getDimension() < POSITION_THRESHOLD) {
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
      toValue: this.getDimension(),
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
    if (nextProps.animate === false || nextProps.animationType === NONE) {
      return;
    }
    // New route comes in after a swipe gesture begins. Save the children so we
    // can render both routes during the transition.
    // Don't trigger the timing animation if the user is swiping, let the gesture
    // control the animation.
    if (this.isPanning) {
      if (this.state.previousChildren === null) {
        this.setState({ previousChildren: this.props.children });
      }
      return;
    }

    const { history } = nextProps;
    const { location, children } = this.props;

    if (
      nextProps.location.key !== location.key &&
      (history.action === PUSH || history.action === POP)
    ) {
      if (history.action === POP && history.index < this.startingIndex) {
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
          const dimension = this.getDimension();

          Animated.timing(this.animation, {
            duration: getDuration(this.props.animationType, history.action),
            toValue: history.action === PUSH ? -dimension : dimension,
            easing: getEasing(this.props.animationType),
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

  getDimension = () => {
    return getDimension(this.props.animationType, this.props.width, this.props.height);
  };

  getRouteStyle = index => {
    const { animationType, width, height } = this.props;
    const { transition } = this.state;
    const { animation, isPanning } = this;
    const transitionType = isPanning ? POP : transition;

    return [
      styles.stackView,
      getTransforms(width, height, animation, animationType, transitionType, index),
    ];
  };

  render() {
    const { children } = this.props;
    const { previousChildren, transition } = this.state;

    let routes = [];
    if (transition === PUSH) {
      routes.push(
        <Animated.View style={this.getRouteStyle(0)}>
          {previousChildren}
        </Animated.View>
      );
      routes.push(
        <Animated.View style={this.getRouteStyle(1)}>
          {children}
        </Animated.View>
      );
    } else if (transition === POP || this.isPanning) {
      routes.push(
        <Animated.View style={this.getRouteStyle(0)}>
          {children}
        </Animated.View>
      );
      routes.push(
        <Animated.View style={this.getRouteStyle(1)}>
          {previousChildren}
        </Animated.View>
      );
    } else {
      return (
        <View style={styles.stackView} {...this.panResponder.panHandlers}>
          {children}
        </View>
      );
    }

    return (
      <View style={styles.stackView} {...this.panResponder.panHandlers}>
        <View style={styles.transitionContainer}>
          {routes[0]}
          {routes[1]}
        </View>
      </View>
    );
  }
}
