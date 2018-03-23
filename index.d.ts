declare module "react-router-native-stack" {
    import * as H from 'history';
    import { ViewStyle, Animated } from 'react-native';

    export type AnimationType = 'slide-horizontal' | 'slide-vertical' | 'fade-vertical' | 'cube';

    export type HeaderProperties = {
      animatedValue: Animated.Value,
      animation: Animated.CompositeAnimation,
      isPanning: boolean,
      animationType: AnimationType,
      title: ?string
      backTitle: ?string
    }

    type RenderHeader = (props: HeaderProperties) => React.ReactNode
  
    export type StackProperties = {
      location?: H.Location;
      history?: H.History;
      renderHeader?: boolean | RenderHeader;
      animationType?: AnimationType;
      gestureEnabled?: boolean;
      stackViewStyle?: ViewStyle;
      replaceTransitionType?: 'POP' | 'PUSH';
    }
  
    export default class extends React.Component<StackProperties> {}
  }
  