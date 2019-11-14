import { API } from 'aws-amplify';
import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Icon } from 'semantic-ui-react';

import { deleteAlbum } from '../graphql/mutations';
import useAuth from '../useAuth';

export default function DeleteAlbum({ album }) {
  const { owner } = useAuth();
  const [isDeleted, setIsDeleted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!owner) {
    return null;
  }

  const handleClick = async () => {
    setIsDeleting(true);

    try {
      await API.graphql({
        authMode: owner ? 'AMAZON_COGNITO_USER_POOLS' : 'AWS_IAM',
        query: deleteAlbum,
        variables: {
          input: {
            expectedVersion: album.version,
            id: album.id
          }
        }
      });
    } catch (payload) {
      throw new Error(payload.errors[0].message);
    }

    setIsDeleted(true);
  };

  if (isDeleted) {
    return <Redirect to="/" />;
  }

  return (
    <Button
      floated="right"
      icon
      labelPosition="left"
      loading={isDeleting}
      negative
      onClick={handleClick}
    >
      <Icon name="trash" />
      Delete
    </Button>
  );
}
