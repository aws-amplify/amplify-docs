import { API } from 'aws-amplify';
import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import {
  Dimmer,
  Form,
  Header,
  Loader,
  Input,
  Segment
} from 'semantic-ui-react';

import { createAlbum } from '../graphql/mutations';
import useAuth from '../useAuth';

export default function NewAlbum(props) {
  const { owner } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [album, setAlbum] = useState();

  if (!owner) {
    return null;
  }

  const handleSubmit = async event => {
    setIsCreating(true);

    try {
      const payload = await API.graphql({
        authMode: owner ? 'AMAZON_COGNITO_USER_POOLS' : 'AWS_IAM',
        query: createAlbum,
        variables: {
          input: {
            name: event.target.albumName.value
          }
        }
      });

      setAlbum(payload.data.createAlbum);
    } catch (payload) {
      throw new Error(payload.errors[0].message);
    }
  };

  if (album) {
    return <Redirect to={`/albums/${album.id}`} />;
  }

  return (
    <Segment>
      <Dimmer active={isCreating} inverted>
        <Loader />
      </Dimmer>

      <Header as="h3">Add a new album</Header>

      <Form disabled={isCreating} onSubmit={handleSubmit}>
        <Form.Field>
          <Input
            action="Create"
            autoFocus
            icon="plus"
            iconPosition="left"
            name="albumName"
            placeholder="New Album Name"
          />
        </Form.Field>
      </Form>
    </Segment>
  );
}
