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
  List,
  ListItem,
} from 'native-base';
import { Link } from 'react-router-native';

const messages = ['Hello', 'Lunch', 'Meeting'];

export default function Messages({ history }) {
  return (
    <Container>
      <Header>
        <Left>
          <Button transparent onPress={history.goBack}>
            <Icon name="arrow-back" />
          </Button>
        </Left>

        <Body>
          <Title>Messages</Title>
        </Body>

        <Right />
      </Header>

      <Content>
        <List
          dataArray={messages}
          renderRow={message => (
            <Link
              key={message}
              to={`/messages/${message}`}
              component={({ onPress }) => (
                <ListItem icon onPress={onPress}>
                  <Body>
                    <Text>{message}</Text>
                  </Body>
                  <Right>
                    <Icon name="arrow-forward" />
                  </Right>
                </ListItem>
              )}
            />
          )}
        />
      </Content>
    </Container>
  );
}
