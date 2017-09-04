import { PUSH, POP } from './transitionTypes';
import { SLIDE_HORIZONTAL, SLIDE_VERTICAL, FADE_VERTICAL, CUBE } from './animationTypes';

export default function getTransforms(
  width,
  height,
  animation,
  animationType,
  transitionType,
  screenIndex
) {
  if (animationType === SLIDE_HORIZONTAL) {
    const baseStyle = {
      elevation: 1,
      transform: [{ translateX: animation }],
    };

    if (transitionType === PUSH && screenIndex === 1) {
      return {
        left: width,
        right: -width,
        ...baseStyle,
      };
    } else if (transitionType === POP && screenIndex === 1) {
      return baseStyle;
    }

    return null;
  }

  if (animationType === SLIDE_VERTICAL) {
    const baseStyle = {
      elevation: 1,
      transform: [{ translateY: animation }],
    };
    if (transitionType === PUSH && screenIndex === 1) {
      return {
        top: height,
        bottom: -height,
        ...baseStyle,
      };
    } else if (transitionType === POP && screenIndex === 1) {
      return baseStyle;
    }

    return null;
  }

  if (animationType === FADE_VERTICAL) {
    const baseStyle = {
      transform: [
        {
          translateY: animation.interpolate({
            inputRange: [-height, 0, height],
            outputRange: [-(height / 2), 0, height / 2],
          }),
        },
      ],
      opacity: animation.interpolate({
        inputRange: [-height, 0, height],
        outputRange: [0, 1, 0],
      }),
    };
    if (transitionType === PUSH && screenIndex === 1) {
      return {
        top: height,
        bottom: -height,
        ...baseStyle,
      };
    } else if (transitionType === POP && screenIndex === 1) {
      return baseStyle;
    }

    return null;
  }

  if (animationType === CUBE) {
    const extraStyling = {};
    let screenPosition = 0;
    if (transitionType === PUSH && screenIndex === 1) {
      screenPosition = -width;
      extraStyling.elevation = 1;
    } else if (transitionType === POP && screenIndex === 0) {
      screenPosition = width;
      extraStyling.elevation = 1;
    }

    const translateX = animation.interpolate({
      inputRange: [screenPosition - width, screenPosition, screenPosition + width],
      outputRange: [-width / 2, 0, width / 2],
    });

    const rotateY = animation.interpolate({
      inputRange: [screenPosition - width, screenPosition, screenPosition + width],
      outputRange: ['-60deg', '0deg', '60deg'],
    });

    const translateXAfterRotate = animation.interpolate({
      inputRange: [
        screenPosition - width,
        screenPosition - width + 0.1,
        screenPosition,
        screenPosition + width - 0.1,
        screenPosition + width,
      ],
      outputRange: [-width, -width / 2.38, 0, width / 2.38, width],
    });

    return {
      transform: [
        { perspective: width },
        { translateX },
        { rotateY },
        { translateX: translateXAfterRotate },
      ],
      ...extraStyling,
    };
  }

  return null;
}
