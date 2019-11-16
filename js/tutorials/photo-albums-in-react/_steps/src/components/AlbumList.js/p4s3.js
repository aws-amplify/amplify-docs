import { API } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Button,
  Dimmer,
  Header,
  Icon,
  List,
  Loader,
  Segment
} from 'semantic-ui-react';

import { listAlbums } from '../graphql/queries';
import useAuth from '../useAuth';

export default function AlbumList() {
  const { owner } = useAuth();
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nextToken, setNextToken] = useState();
  const [pageTokens, setPageTokens] = useState([]);
  const pageToken = pageTokens[pageTokens.length - 1];

  useEffect(() => {
    setIsLoading(true);

    API.graphql({
      authMode: owner ? 'AMAZON_COGNITO_USER_POOLS' : 'AWS_IAM',
      query: listAlbums,
      variables: {
        nextToken: pageToken
      }
    })
      .then(payload => {
        setNextToken(payload.data.listAlbums.nextToken);
        setAlbums(payload.data.listAlbums.items);
        setIsLoading(false);
      })
      .catch(payload => {
        throw new Error(payload.errors[0].message);
      });
  }, [owner, pageToken]);

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

      <Segment clearing secondary>
        <Button
          disabled={!pageToken}
          icon
          labelPosition="left"
          onClick={() => setPageTokens(pageTokens.slice(0, -1))}
        >
          Previous <Icon name="left arrow" />
        </Button>

        <Button
          disabled={!nextToken}
          icon
          labelPosition="right"
          floated="right"
          onClick={() => setPageTokens([...pageTokens, nextToken])}
          primary
        >
          Next <Icon name="right arrow" />
        </Button>
      </Segment>
    </Segment.Group>
  );
}
