import React, { Component } from 'react';
import { View } from 'react-native';
import { NativeRouter, Route } from 'react-router-native';
import Stack from 'react-router-native-stack';
import Home from './Home';
import Message from './Message';
import Messages from './Messages';
import styles from './styles';

export default class App extends Component {
  render() {
    return (
      <NativeRouter>
        <View style={styles.container}>
          <Stack>
            <Route exact path="/" component={Home} />
            <Route exact path="/messages" component={Messages} />
            <Route path="/messages/:messageId" component={Message} />
          </Stack>
        </View>
      </NativeRouter>
    );
  }
}
