import React, { Component } from 'react';
import { NativeRouter, Route } from 'react-router-native';
import Stack from 'react-router-native-stack';
import Picture from './Picture';

export default class App extends Component {
  render() {
    return (
      <NativeRouter>
        <Stack animationType="cube">
          <Route exact path="/" component={Picture} />
          <Route path="/:id" component={Picture} />
        </Stack>
      </NativeRouter>
    );
  }
}
