import React, { Component } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { NativeRouter, Route } from 'react-router-native';
import Stack from 'react-router-native-stack';

function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>I am a lovely default header</Text>
    </View>
  );
}

function PizzaHeader() {
  return (
    <View style={[styles.header, styles.pizzaHeader]}>
      <Text style={styles.headerText}>I am a PIZZA header</Text>
    </View>
  );
}

function Home({ history }) {
  return (
    <View style={styles.screen}>
      <Text>Home Page</Text>

      <Button title="Pizza Page" onPress={() => history.push('/page/pizza')} />

      <Button title="Taco Page" onPress={() => history.push('/page/taco')} />

      <Button title="Hamburger Page" onPress={() => history.push('/page/hamburger')} />

      <Button title="Fullscreen Page" onPress={() => history.push('/fullscreen')} />
    </View>
  );
}

function Page({ match, history }) {
  return (
    <View style={styles.screen}>
      <Text>You're on a {match.params.name} Page!</Text>

      <Button title="Go Back" color="red" onPress={() => history.goBack()} />

      <Button title="Pizza Page" onPress={() => history.push('/page/pizza')} />

      <Button title="Taco Page" onPress={() => history.push('/page/taco')} />

      <Button title="Hamburger Page" onPress={() => history.push('/page/hamburger')} />

      <Button title="Fullscreen Page" onPress={() => history.push('/fullscreen')} />
    </View>
  );
}

function FullScreen({ history }) {
  return (
    <View style={styles.screen}>
      <Text>I am a FullScreen</Text>
      <Button title="Go Back" color="red" onPress={() => history.goBack()} />
    </View>
  );
}

export default class App extends Component {
  render() {
    return (
      <NativeRouter>
        <Stack>
          <Route exact path="/" component={Home} headerComponent={Header} />
          <Route exact path="/fullscreen" component={FullScreen} />
          <Route exact path="/page/pizza" component={Page} headerComponent={PizzaHeader} />
          <Route path="/page/:name" component={Page} headerComponent={Header} />
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
  header: {
    flex: -1,
    height: 80,
    paddingTop: 40,
    backgroundColor: 'blue',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: 'white',
  },
  pizzaHeader: {
    backgroundColor: 'green',
  },
});
