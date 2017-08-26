import React from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import styles from './styles';

export default function Message({ match, history }) {
  return (
    <View style={styles.screen}>
      <TouchableHighlight onPress={history.goBack}>
        <Text style={styles.backText}>Go Back</Text>
      </TouchableHighlight>

      <Text>
        {match.params.messageId}
      </Text>
    </View>
  );
}
