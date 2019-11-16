import { API } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Dimmer, Header, List, Loader, Segment } from 'semantic-ui-react';

import { listAlbums } from '../graphql/queries';
import useAuth from '../useAuth';

export default function AlbumList() {
  const { owner } = useAuth();
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    API.graphql({
      authMode: owner ? 'AMAZON_COGNITO_USER_POOLS' : 'AWS_IAM',
      query: listAlbums
    })
      .then(payload => {
        setAlbums(payload.data.listAlbums.items);
        setIsLoading(false);
      })
      .catch(payload => {
        throw new Error(payload.errors[0].message);
      });
  }, [owner]);

  return (
    <Segment.Group>
      <Dimmer active={isLoading} inverted>
        <Loader />
      </Dimmer>

      <Segment>
        <Header>Photo Albums</Header>

        {!isLoading && (
          <List data-test="album-list" divided relaxed>
            {albums.length ? (
              albums.map(album => (
                <List.Item key={album.id}>
                  <NavLink to={`/albums/${album.id}`}>{album.name}</NavLink>
                </List.Item>
              ))
            ) : (
              <List.Item>No albums</List.Item>
            )}
          </List>
        )}
      </Segment>
    </Segment.Group>
  );
}
