declare module 'react-router-native-stack' {
  import {ReactNode} from 'react';
  import {StyleProp, ViewStyle} from 'react-native';
  import {match} from 'react-router';
  import * as H from 'history';

  interface StackProps<
    Params extends {[K in keyof Params]?: string} = {},
    S = H.LocationState
  > {
    children: ReactNode;
    history: H.History;
    location: H.Location<S>;
    match?: match<Params>;
    renderHeader?: () => Node;
    renderTitle?: () => Node;
    renderLeftSegment?: () => Node;
    renderRightSegment?: () => Node;
    animationType?:
      | 'slide-horizontal'
      | 'slide-vertical'
      | 'fade-vertical'
      | 'cube'
      | 'none';
    gestureEnabled?: boolean;
    stackViewStyle?: StyleProp<ViewStyle>;
    replaceTransitionType?: 'PUSH' | 'POP' | 'REPLACE';
    isAnimating?: (e: boolean) => void;
  }

  export const SLIDE_HORIZONTAL = 'slide-horizontal';
  export const SLIDE_VERTICAL = 'slide-vertical';
  export const FADE_VERTICAL = 'fade-vertical';
  export const FADE_HORIZONTAL = 'fade-horizontal';
  export const CUBE = 'cube';
  export const NONE = 'none';
  export default class Stack extends React.Component<StackProps> {}
}
