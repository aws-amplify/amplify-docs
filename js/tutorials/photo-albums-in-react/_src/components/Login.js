import React from 'react';
import {
  Dimmer,
  Form,
  Grid,
  Loader,
  Segment,
  Header,
  Image
} from 'semantic-ui-react';

import useAuth from '../useAuth';

export default function Login() {
  const { Auth, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Dimmer active inverted page>
        <Loader />
      </Dimmer>
    );
  }

  return (
    <Grid
      textAlign="center"
      verticalAlign="middle"
      padded
      style={{
        background: '#f7f7f7',
        height: '100vh'
      }}
    >
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header color="teal" size="large" textAlign="center">
          <Image
            size="big"
            src="https://aws-amplify.github.io/docs/images/Logos/Amplify Logo.svg"
            verticalAlign="bottom"
          />
          Amplify Photo Albums
        </Header>
        <Segment stacked>
          <Form>
            <Form.Button
              content="Sign in with Amazon"
              fluid
              icon="amazon"
              inverted
              onClick={() =>
                Auth.federatedSignIn({ provider: 'LoginWithAmazon' })
              }
              size="large"
              style={{ background: '#ff9900' }}
            />

            <Form.Button
              content="Sign in with Facebook"
              fluid
              icon="facebook"
              inverted
              onClick={() => Auth.federatedSignIn({ provider: 'Facebook' })}
              size="large"
              style={{ background: '#4267b2' }}
            />

            <Form.Button
              content="Sign in with Google"
              fluid
              icon="google"
              inverted
              onClick={() => Auth.federatedSignIn({ provider: 'Google' })}
              size="large"
              style={{ background: '#4285F4' }}
            />
          </Form>
        </Segment>
      </Grid.Column>
    </Grid>
  );
}
