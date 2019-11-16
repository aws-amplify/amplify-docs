import React from 'react';
import { BrowserRouter, NavLink, Route } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

import Login from './components/Login';
import Navigation from './components/Navigation';
import NewAlbum from './components/NewAlbum';

import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

export default function App(props) {
  return (
    <BrowserRouter>
      <Navigation />

      <Route component={Login} path="/login" />

      <Grid padded>
        <Grid.Column>
          <Route component={NewAlbum} exact path="/" />
          <Route
            path="/albums/:albumId"
            render={() => (
              <div>
                <NavLink to="/">Back to Albums list</NavLink>
              </div>
            )}
          />
        </Grid.Column>
      </Grid>
    </BrowserRouter>
  );
}
