import { FADE_VERTICAL } from './animationTypes';

export default function getTiming(animationType, transitionType) {
  switch (animationType) {
    case FADE_VERTICAL:
      if (transitionType === 'PUSH') {
        return 350;
      }
      return 230;
    default:
      return 500;
  }
}
