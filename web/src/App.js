import React from 'react';
import {
  BrowserRouter as Router,
  Route, Switch
} from "react-router-dom";

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/firestore";

import Preamble from './Preamble';
import Genre from './Genre';
import GenreOverTime from './GenreOverTime';

const firebaseConfig = {
  apiKey: "AIzaSyAIOcRc5qxnGuz6RVH8fj8-0KYFXVkKzds",
  authDomain: "what-can-i-borrow.firebaseapp.com",
  databaseURL: "https://what-can-i-borrow.firebaseio.com",
  projectId: "what-can-i-borrow",
  storageBucket: "what-can-i-borrow.appspot.com",
  messagingSenderId: "182690151317",
  appId: "1:182690151317:web:682d74611cf507bcb4949c",
  measurementId: "G-2MDX02MGG1"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
        Gareth Cronin
      {' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function App() {

  return (
    <Router>
      <Switch>
        <Route path={`/user/:userId`}>
          <Container maxWidth="md">
            <Box my={4}>
              <Typography variant="h4" component="h1" gutterBottom>
                What have I read?
            </Typography>
              <Preamble />
              <Typography variant="h5" component="h1" gutterBottom>Genre/shelf</Typography>
              <Genre db={db} />
              <GenreOverTime db={db} />
              <Copyright />
            </Box>
          </Container>
        </Route>
        <Route path='/'>
          <Container maxWidth="md">
            <Typography variant="h3">😱 I don't know who you are 😱</Typography>
            <Typography>The URL needs to have /user/[Goodreads ID] e.g. Gareth is <a href="/user/4622353">/user/4622353</a></Typography>
          </Container>
        </Route>
      </Switch>
    </Router>
  );
}
