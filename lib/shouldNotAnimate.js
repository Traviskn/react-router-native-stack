import { PUSH, POP } from './transitionTypes';
import { NONE } from './animationTypes';

export default function shouldNotAnimate(
  isPanning,
  animationType,
  history,
  startingIndex,
  children,
  previousChildren
) {
  return (
    isPanning ||
    animationType === NONE ||
    (history.action !== POP && history.action !== PUSH) ||
    (history.action === POP && history.index < startingIndex) ||
    (previousChildren && children.key === previousChildren.key)
  );
}
