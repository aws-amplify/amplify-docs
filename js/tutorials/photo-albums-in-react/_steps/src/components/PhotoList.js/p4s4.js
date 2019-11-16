import React from 'react';
import { Card, Header, Segment } from 'semantic-ui-react';

import PhotoDetails from './PhotoDetails';

export default function PhotoList({ album, photos }) {
  if (!photos.length) {
    return (
      <Segment placeholder>
        <Header icon>No photos in this album.</Header>
      </Segment>
    );
  }

  return (
    <Card.Group itemsPerRow={4} doubling>
      {photos.map(photo => (
        <PhotoDetails key={`${photo.id}-${photo.version}`} photo={photo} />
      ))}
    </Card.Group>
  );
}
