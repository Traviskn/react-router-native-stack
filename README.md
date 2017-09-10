# react-router-native-stack

A Stack component for React Router v4 on React Native.

## Disclaimer

This library is in an alpha state.  I am still experimenting with the
transitions and animations, and the API will likely evolve and change.  I'd
love for you to try it out and give feedback so that we can get to a production
ready state!

## Motivation

React Router v4 supports react native, but doesn't include any animated transitions
out of the box.  I created this component to support card stack style screen transitions.

Here's a basic demo:

![SimpleStack Example Screen Capture](https://raw.githubusercontent.com/traviskn/react-router-native-stack/master/media/simple-stack-ios.gif)

You can run the above demo on Expo with this link: https://exp.host/@traviskn/simplestack

## Installation

Install `react-router-native` and this package:

`npm install react-router-native react-router-native-stack --save`

## Usage

Here's a simple working example of using the stack.

```javascript
import React, { Component } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { NativeRouter, Route } from 'react-router-native';
import Stack from 'react-router-native-stack';

function Home({ history }) {
  return (
    <View style={styles.screen}>
      <Text>Home Page</Text>

      <Button title="Pizza Page" onPress={() => history.push('/page/pizza')} />

      <Button title="Taco Page" onPress={() => history.push('/page/taco')} />

      <Button title="Hamburger Page" onPress={() => history.push('/page/hamburger')} />
    </View>
  );
}

function Page({ history, match }) {
  return (
    <View style={styles.screen}>
      <Text>You are on a {match.params.name} Page!</Text>

      <Button title="Go Back" color="red" onPress={() => history.goBack()} />

      <Button title="Pizza Page" onPress={() => history.push('/page/pizza')} />

      <Button title="Taco Page" onPress={() => history.push('/page/taco')} />

      <Button title="Hamburger Page" onPress={() => history.push('/page/hamburger')} />
    </View>
  );
}

export default class App extends Component {
  render() {
    return (
      <NativeRouter>
        <Stack>
          <Route exact path="/" component={Home} />
          <Route path="/page/:name" component={Page} />
        </Stack>
      </NativeRouter>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
```

This is what the above code looks like running on iOS:

![Usage Example Screen Capture](https://raw.githubusercontent.com/traviskn/react-router-native-stack/master/media/usage-ios.gif)

The stack component uses a [Switch](https://reacttraining.com/react-router/native/api/Switch)
internally to match the current route. It listens for `'PUSH'` and `'POP'` actions
on history to determine whether to transition forward or backwards. It manages a
PanResponder to allow swiping back through the route stack. It keeps track of the
history index when it mounts so that it knows to stop allowing the swipe back transition
when you reach the beginning index.

## Animation Options

In the examples so far you have seen the default iOS transition animation,
`'slide-horizontal'`. In addition to that the stack also supports `'slide-vertical'`,
`'fade-vertical'`, and `'cube'`.

if you add an `animationType="slide-vertical"` prop to the stack in the previous
example, this is the result:

![Slide Vertical Usage Example Screen Capture](https://raw.githubusercontent.com/traviskn/react-router-native-stack/master/media/slide-vertical-ios.gif)

`'fade-vertical'` is the default for Android, and looks like this:

![Fade Vertical Usage Example Screen Capture](https://raw.githubusercontent.com/traviskn/react-router-native-stack/master/media/fade-vertical-android.gif)

And finally, here's a demo of `animationType="cube"`:

![Cube Example Screen Capture](https://raw.githubusercontent.com/traviskn/react-router-native-stack/master/media/cube-ios.gif)

There is also an animation type of `'none'` if you need to disable animations.

## Customizing Animation Type Per-Route

If you need, you can configure the animation type on a per-route basis by adding
an `animationType` prop to a specific route.  As an example, consider that we took
our previous example and had a separate route for each page:

```javascript
import React, { Component } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { NativeRouter, Route } from 'react-router-native';
import Stack from 'react-router-native-stack';

function Home({ history }) {
  return (
    <View style={styles.screen}>
      <Text>Home Page</Text>

      <Button title="Pizza Page" onPress={() => history.push('/page/pizza')} />

      <Button title="Taco Page" onPress={() => history.push('/page/taco')} />

      <Button title="Hamburger Page" onPress={() => history.push('/page/hamburger')} />
    </View>
  );
}

function Page({ history, match }) {
  return (
    <View style={styles.screen}>
      <Text>You are on a {match.url.replace('/page/', '')} Page!</Text>

      <Button title="Go Back" color="red" onPress={() => history.goBack()} />

      <Button title="Pizza Page" onPress={() => history.push('/page/pizza')} />

      <Button title="Taco Page" onPress={() => history.push('/page/taco')} />

      <Button title="Hamburger Page" onPress={() => history.push('/page/hamburger')} />
    </View>
  );
}

export default class App extends Component {
  render() {
    return (
      <NativeRouter>
        <Stack>
          <Route exact path="/" component={Home} />
          <Route path="/page/pizza" component={Page} />
          <Route path="/page/taco" animationType="slide-vertical" component={Page} />
          <Route path="/page/hamburger" component={Page} />
        </Stack>
      </NativeRouter>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
```

With this updated code we have configured the taco page to use a `slide-vertical`
animation, but all the other pages will use the default `slide-horizontal` animation.
The taco page will control the animation type when it pushes onto the stack, and
when it pops off of the stack. Here's how it looks:

![Per-Route Animation Type Example](https://raw.githubusercontent.com/traviskn/react-router-native-stack/master/media/per-route-animation-type-ios.gif)


## Known Limitations

Currently the stack has no built-in support for floating headers, but that feature
is a work in progress! I hope to get something working soon.

Many stack navigators keep all screens in the stack mounted when you push new
screens onto the stack.  This library is different, in that it unmounts the previous
route's screen when a new one is pushed on.  If you have state that needs to be
maintained even after a screen unmounts, you will need to store that state in a
parent component that contains the stack or possibly use another state management
solution such as AsyncStorage, Redux, or MobX.

A common use case for a cube transition is to swipe forward to the next route,
but currently it only supports swiping back to the previous route.  An API to
enable swiping forward to a new route is something I hope to work on soon.

The cube animation doesn't work quite as well on Android as it does on iOS.  I
hope to be able to adjust the animation configuration a bit to make it look more
consistent.

I have made several assumptions about the history route stack while using this library.
I assume in particular that history never mutates, and that you always navigate
forward by pushing and backward by popping routes.  It could be that in cases where
you need to deep link or redirect to a specific location in the app that you haven't
built up the expected route stack, and this component won't allow swiping back
when you need it to.

As I research more use cases I hope to be able to create a more flexible API to
support them.

## Acknowledgements

I drew a lot of inspiration from other libraries and code samples.

Obviously this library wouldn't exist without the fantastic [React Router](https://reacttraining.com/react-router)!

[React Navigation](https://reactnavigation.org/) has become one of the leading
navigation solutions for react native, I have used it in many personal and work
projects and I referenced it as a guide for implementing many of the transition
animations in this library.

For the cube animation I used [this example](https://github.com/underscopeio/cube-transition-example)
by @underscopeio as a reference.

Many thanks to the authors and maintainers of these open source libraries!

## More

You may be asking, "What about tab and drawer navigation?".  As it turns out,
there are already many great open source components to enable drawer and tab
navigation, and you can already use React Router to drive the state of those
components.  I hope to add more examples to this repository soon demonstrating
this. For now know that the Stack is just one of several components that you can
combine with React Router to enable just about any navigation pattern you need!

Check out the `examples/` folder in this repository for more usage examples.

