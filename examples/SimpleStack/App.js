import React, { Component } from 'react';
import { NativeRouter, Route } from 'react-router-native';
import Stack from 'react-router-native-stack';
import Home from './Home';
import Message from './Message';
import Messages from './Messages';

export default class App extends Component {
  render() {
    return (
      <NativeRouter>
        <Stack>
          <Route exact path="/" component={Home} title="Home" />
          <Route exact path="/messages" component={Messages} title="Messages" />
          <Route path="/messages/:messageId" component={Message} title="Message" />
        </Stack>
      </NativeRouter>
    );
  }
}
