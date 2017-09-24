export default function isHorizontal(animationType) {
  return animationType.indexOf('horizontal') > -1 || animationType === 'cube';
}
