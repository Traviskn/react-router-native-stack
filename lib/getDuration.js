import { FADE_VERTICAL } from './animationTypes';

export default function getTiming(animationType, transitionType) {
  switch (animationType) {
    case FADE_VERTICAL:
      if (transitionType === 'PUSH') {
        return 230;
      }
      return 350;
    default:
      return 500;
  }
}
