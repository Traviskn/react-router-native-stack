import {
  SLIDE_HORIZONTAL,
  SLIDE_VERTICAL,
  FADE_HORIZONTAL,
  FADE_VERTICAL,
  CUBE,
  NONE,
} from './animationTypes';

export default function getDimension(animationType, width, height) {
  switch (animationType) {
    case SLIDE_HORIZONTAL:
    case FADE_HORIZONTAL:
    case CUBE:
      return width;
    case SLIDE_VERTICAL:
    case FADE_VERTICAL:
      return height;
    case NONE:
      return 0;
    default:
      console.error('UNKNOWN ANIMATION TYPE: ', animationType);
      return 0;
  }
}
