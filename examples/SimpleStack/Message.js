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
  Card,
  CardItem,
  Text,
} from 'native-base';

export default function Message({ match, history }) {
  return (
    <Container>
      <Header>
        <Left>
          <Button transparent onPress={history.goBack}>
            <Icon name="arrow-back" />
          </Button>
        </Left>

        <Body>
          <Title>Message</Title>
        </Body>

        <Right />
      </Header>

      <Content padder>
        <Card>
          <CardItem>
            <Text>{match.params.messageId}</Text>
          </CardItem>
        </Card>
      </Content>
    </Container>
  );
}
