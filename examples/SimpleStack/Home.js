import React from 'react';
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Title,
  Content,
  Button,
  Icon,
  Text,
} from 'native-base';
import { Link } from 'react-router-native';

export default function Home() {
  return (
    <Container>
      <Header>
        <Left />

        <Body>
          <Title>Home</Title>
        </Body>

        <Right />
      </Header>

      <Content padder>
        <Link
          to="/messages"
          component={({ onPress }) => (
            <Button block iconRight onPress={onPress}>
              <Text>View Messages</Text>
              <Icon name="arrow-forward" />
            </Button>
          )}
        />
      </Content>
    </Container>
  );
}
