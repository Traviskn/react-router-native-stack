import React, { Component } from 'react';
import { node, object, number, bool, string, oneOf } from 'prop-types';
import { Animated, PanResponder, View, ViewPropTypes } from 'react-native';
import findFirstMatch from './findFirstMatch';
import getTransforms from './getTransforms';
import getEasing from './getEasing';
import getDuration from './getDuration';
import getDimension from './getDimension';
import { PUSH, POP, REPLACE } from './transitionTypes';
import { NONE } from './animationTypes';
import styles from './styles';

const ANIMATION_DURATION = 500;
const POSITION_THRESHOLD = 1 / 2;
const RESPOND_THRESHOLD = 1;
const GESTURE_RESPONSE_DISTANCE_HORIZONTAL = 40;

export default class StackTransitioner extends Component {
  static propTypes = {
    children: node,
    history: object.isRequired,
    location: object.isRequired,
    width: number.isRequired,
    height: number.isRequired,
    animationType: string.isRequired,
    gestureEnabled: bool,
    stackViewStyle: ViewPropTypes.style,
    replaceTransitionType: oneOf([PUSH, POP])
  };

  state = {
    previousLocation: {},
    transition: null,
    routeAnimationType: null,
    children: findFirstMatch(this.props.children, this.props.location),
    previousChildren: null,
  };

  startingIndex = this.props.history.index;

  animation = null;

  animatedValue = new Animated.Value(0);

  isPanning = false;

  isHorizontal = animationType =>
    animationType.indexOf('horizontal') > -1 || animationType === 'cube';

  panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (event, gesture) => {
      return (
        !this.state.transition &&
        this.isHorizontal(this.state.routeAnimationType || this.props.animationType) &&
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
      this.animatedValue.setValue(moveX);
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
    this.animation = Animated.timing(this.animatedValue, {
      toValue: 0,
      duration,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        this.props.history.push(this.state.previousLocation.pathname);
        this.afterPan();
      }
    });
  };

  finishNavigation = duration => {
    Animated.timing(this.animatedValue, {
      toValue: this.getDimension(),
      duration,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        this.afterPan();
      }
    });
  };

  afterPan = () => {
    this.isPanning = false;

    this.setState({
      previousLocation: {},
      transition: null,
    });

    if (this.props.history.action === POP) {
      this.setState({
        routeAnimationType: this.state.children.props.animationType,
      });
    }

    this.animatedValue = new Animated.Value(0);
    this.animation = null;
  };

  componentWillReceiveProps(nextProps) {
    const { history } = nextProps;
    const { location } = this.props;

    if (nextProps.location.key === location.key || !!this.state.transition) {
      return;
    }

    let action = history.action

    if (action === REPLACE && this.props.replaceTransitionType) {
        action = this.props.replaceTransitionType
    }

    const [children, previousChildren] = this.getChildren(nextProps.location, location);
    const routeAnimationType =
      action === PUSH ? (children && children.props.animationType) : (previousChildren &&  previousChildren.props.animationType)

    this.setState({
      previousLocation: location,
      routeAnimationType,
      children,
      previousChildren,
    });

    if (
      this.isPanning ||
      (routeAnimationType === NONE || (nextProps.animationType === NONE && !routeAnimationType)) ||
      (action === POP && history.index < this.startingIndex) ||
      (children && previousChildren && children.key === previousChildren.key)
    ) {
      return;
    }

    if (action === PUSH || action === POP) {
      this.setState(
        {
          transition: action,
        },
        () => {
          // TODO: base slide direction on `I18nManager.isRTL`
          const dimension = this.getDimension();

          this.animation = Animated.timing(this.animatedValue, {
            duration: getDuration(routeAnimationType || nextProps.animationType, action),
            toValue: action === PUSH ? -dimension : dimension,
            easing: getEasing(routeAnimationType || nextProps.animationType),
            useNativeDriver: true,
          }).start(({ finished }) => {
            if (finished) {
              this.setState({
                previousLocation: {},
                transition: null,
              });

              if (action === POP) {
                this.setState({
                  routeAnimationType: children.props.animationType,
                });
              }

              this.animatedValue = new Animated.Value(0);
              this.animation = null;
            }
          });
        }
      );
    }
  }

  componentWillUnmount() {
    this.animation && this.animation.stop();
  }

  getChildren = (currentLocation, previousLocation) => {
    const { children } = this.props;

    const currentChild = findFirstMatch(children, currentLocation);

    if (!previousLocation) {
      return [currentChild];
    }

    const previousChild = findFirstMatch(children, previousLocation);

    return [currentChild, previousChild];
  };

  getDimension = () => {
    return getDimension(
      this.state.routeAnimationType || this.props.animationType,
      this.props.width,
      this.props.height
    );
  };

  getRouteStyle = index => {
    const { animationType, width, height, stackViewStyle } = this.props;
    const { routeAnimationType, transition } = this.state;
    const { animatedValue, isPanning } = this;
    const transitionType = isPanning ? POP : transition;

    return [
      styles.stackView,
      stackViewStyle,
      getTransforms(
        width,
        height,
        animatedValue,
        routeAnimationType || animationType,
        transitionType,
        index
      ),
    ];
  };

  render() {
    const { location, stackViewStyle } = this.props;
    const { children, previousChildren, previousLocation, transition } = this.state;

    let routes = [];
    if (transition === PUSH) {
      previousChildren && routes.push(
        <Animated.View key={previousChildren.key} style={this.getRouteStyle(0)}>
          {previousChildren}
        </Animated.View>
      );
      children && routes.push(
        <Animated.View key={children.key} style={this.getRouteStyle(1)}>
          {children}
        </Animated.View>
      );
    } else if (transition === POP || this.isPanning) {
      children && routes.push(
        <Animated.View key={children.key} style={this.getRouteStyle(0)}>
          {children}
        </Animated.View>
      );
      previousChildren && routes.push(
        <Animated.View key={previousChildren.key} style={this.getRouteStyle(1)}>
          {previousChildren}
        </Animated.View>
      );
    } else {
      children && routes.push(
        <Animated.View key={children.key} style={[styles.stackView, stackViewStyle]}>
          {children}
        </Animated.View>
      );
    }

    return (
      <View style={[styles.stackView, stackViewStyle]} {...this.panResponder.panHandlers}>
        <View style={styles.transitionContainer}>
          {routes.map(route => route)}
        </View>
      </View>
    );
  }
}
