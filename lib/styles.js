import { Platform, StyleSheet } from 'react-native';

const HEADER_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;

export default StyleSheet.create({
  stackContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
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
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT + STATUSBAR_HEIGHT,
    paddingTop: STATUSBAR_HEIGHT,
    backgroundColor: '#F7F7F7',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0, 0, 0, .3)',
  },
  animatingHeader: {
    position: 'absolute',
    top: 0,
    elevation: 4,
  },
  left: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'flex-start',
    marginLeft: 10,
  },
  title: {
    flex: 2,
    alignItems: 'center',
  },
  right: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'flex-end',
    marginRight: 10,
  },
});
