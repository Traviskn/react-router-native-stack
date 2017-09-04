import React, { Component } from 'react';
import { NativeRouter, Route } from 'react-router-native';
import Stack from 'react-router-native-stack';
import { Container } from 'native-base';
import Home from './Home';
import Message from './Message';
import Messages from './Messages';

export default class App extends Component {
  render() {
    return (
      <NativeRouter>
        <Stack>
          <Route exact path="/" component={Home} />
          <Route exact path="/messages" component={Messages} />
          <Route path="/messages/:messageId" component={Message} />
        </Stack>
      </NativeRouter>
    );
  }
}
