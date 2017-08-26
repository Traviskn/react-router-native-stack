import React from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import { Link } from 'react-router-native';
import styles from './styles';

const messages = ['Hello', 'Lunch', 'Meeting'];

export default function Messages({ history }) {
  return (
    <View style={styles.screen}>
      <Text>Messages</Text>

      <TouchableHighlight onPress={history.goBack}>
        <Text style={styles.backText}>Go Back</Text>
      </TouchableHighlight>

      {messages.map(message =>
        <Link key={message} to={`/messages/${message}`}>
          <Text style={styles.linkText}>
            {message}
          </Text>
        </Link>
      )}
    </View>
  );
}
