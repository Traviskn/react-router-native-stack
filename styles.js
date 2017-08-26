import { Platform, StyleSheet } from 'react-native';

const HEADER_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;

export default StyleSheet.create({
  stackView: {
    position: 'absolute',
    flexDirection: 'column-reverse',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
  },
  transitionContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    left: 0,
    right: 0,
    height: HEADER_HEIGHT + STATUSBAR_HEIGHT,
    backgroundColor: 'grey',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  animatingHeader: {
    position: 'absolute',
    top: 0,
  },
  left: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    flex: 2,
    alignItems: 'center',
  },
  right: {
    flex: 1,
    alignItems: 'center',
  },
});
