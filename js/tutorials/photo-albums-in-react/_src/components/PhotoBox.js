import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Modal } from 'semantic-ui-react';

import Photo from './Photo';

export default function PhotoBox({ match }) {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return <Redirect to={`/albums/${match.params.albumId}`} />;
  }

  return (
    <Modal basic onClose={() => setIsOpen(false)} open={isOpen}>
      <Modal.Content image>
        <Photo photo={{ id: match.params.photoId }} />
      </Modal.Content>
    </Modal>
  );
}
