import React, { Component } from 'react';
import { node, object, number, bool, string } from 'prop-types';
import { Animated, PanResponder, View } from 'react-native';
import findFirstMatch from './findFirstMatch';
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

export default class StackTransitioner extends Component {
  static propTypes = {
    children: node,
    history: object.isRequired,
    location: object.isRequired,
    width: number.isRequired,
    height: number.isRequired,
    animationType: string.isRequired,
    gestureEnabled: bool,
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

    if (nextProps.location.key === location.key) {
      return;
    }

    const [children, previousChildren] = this.getChildren(nextProps.location, location);
    const routeAnimationType =
      history.action === PUSH ? children.props.animationType : previousChildren.props.animationType;

    this.setState({
      previousLocation: location,
      routeAnimationType,
      children,
      previousChildren,
    });

    if (
      this.isPanning ||
      nextProps.animationType === NONE ||
      (history.action === POP && history.index < this.startingIndex)
    ) {
      return;
    }

    if (history.action === PUSH || history.action === POP) {
      this.setState(
        {
          transition: history.action,
        },
        () => {
          // TODO: base slide direction on `I18nManager.isRTL`
          const dimension = this.getDimension();

          this.animation = Animated.timing(this.animatedValue, {
            duration: getDuration(routeAnimationType || nextProps.animationType, history.action),
            toValue: history.action === PUSH ? -dimension : dimension,
            easing: getEasing(routeAnimationType || nextProps.animationType),
            useNativeDriver: true,
          }).start(({ finished }) => {
            if (finished) {
              this.setState({
                previousLocation: {},
                transition: null,
              });

              if (history.action === POP) {
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
    this.animation.stop();
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
    const { animationType, width, height } = this.props;
    const { routeAnimationType, transition } = this.state;
    const { animatedValue, isPanning } = this;
    const transitionType = isPanning ? POP : transition;

    return [
      styles.stackView,
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
    const { location } = this.props;
    const { children, previousChildren, previousLocation, transition } = this.state;

    let routes = [];
    if (transition === PUSH) {
      routes.push(
        <Animated.View key={previousLocation.key} style={this.getRouteStyle(0)}>
          {previousChildren}
        </Animated.View>
      );
      routes.push(
        <Animated.View key={location.key} style={this.getRouteStyle(1)}>
          {children}
        </Animated.View>
      );
    } else if (transition === POP || this.isPanning) {
      routes.push(
        <Animated.View key={location.key} style={this.getRouteStyle(0)}>
          {children}
        </Animated.View>
      );
      routes.push(
        <Animated.View key={previousLocation.key} style={this.getRouteStyle(1)}>
          {previousChildren}
        </Animated.View>
      );
    } else {
      routes.push(
        <Animated.View key={location.key} style={styles.stackView}>
          {children}
        </Animated.View>
      );
    }

    return (
      <View style={styles.stackView} {...this.panResponder.panHandlers}>
        <View style={styles.transitionContainer}>
          {routes.map(route => route)}
        </View>
      </View>
    );
  }
}
