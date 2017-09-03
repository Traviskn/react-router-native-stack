export default function getTransforms(
  width,
  animation,
  animationType,
  transitionType,
  screenIndex
) {
  if (animationType === 'slide-horizontal') {
    const baseStyle = {
      elevation: 1,
      transform: [{ translateX: animation }],
    };

    if (transitionType === 'PUSH' && screenIndex === 1) {
      return {
        left: width,
        right: -width,
        ...baseStyle,
      };
    } else if (transitionType === 'POP' && screenIndex === 1) {
      return baseStyle;
    }

    return null;
  }

  if (animationType === 'cube') {
    const extraStyling = {};
    let screenPosition = 0;
    if (transitionType === 'PUSH' && screenIndex === 1) {
      screenPosition = -width;
      extraStyling.elevation = 1;
    } else if (transitionType === 'POP' && screenIndex === 0) {
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
}
