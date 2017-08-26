import React from 'react';
import { Text, View } from 'react-native';
import { Link } from 'react-router-native';
import styles from './styles';

export default function Home() {
  return (
    <View style={styles.screen}>
      <Text>Home Screen</Text>

      <Link to="/messages">
        <Text style={styles.linkText}>View Messages</Text>
      </Link>
      <Link to="/nomatch">
        <Text style={styles.linkText}>Go To Non-Matching Route</Text>
      </Link>
    </View>
  );
}
