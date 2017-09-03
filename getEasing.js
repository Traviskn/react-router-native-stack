import { Easing } from 'react-native';

export default function getEasing(animationType) {
  if (animationType === 'slide-horizontal') {
    return Easing.bezier(0.2833, 0.99, 0.31833, 0.99);
  }

  return Easing.inOut(Easing.ease);
}
