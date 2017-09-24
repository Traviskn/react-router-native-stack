import { PUSH, POP } from './transitionTypes';
import { NONE } from './animationTypes';

export default function shouldNotAnimate(
  isPanning,
  animationType,
  history,
  locationKey,
  nextLocationKey
) {
  return (
    isPanning ||
    animationType === NONE ||
    locationKey === nextLocationKey ||
    (history.action !== PUSH && history.action !== POP) ||
    (history.action === POP && history.index < this.startingIndex)
  );
}
