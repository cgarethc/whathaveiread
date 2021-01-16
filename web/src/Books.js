import React from 'react';
import {
  useParams
} from "react-router-dom";
import _, { isInteger } from 'lodash';

import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 1000,
    height: 450,
  },
  titleBar: {
    background:
      'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
      'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
}));

export default function Books(props) {
  let { userId } = useParams();

  const [loading, setLoading] = React.useState(false);
  const [books, setBooks] = React.useState([]);

  React.useEffect(async () => {
    if (books.length == 0 && !loading) {
      setLoading(true);

      const ref = props.db.collection('userstats').doc(`${userId}-books`);
      const doc = await ref.get();
      const data = doc.data();

      setBooks(data.books);

      setLoading(false);

    }
  });

  const classes = useStyles();

  return (
    <Container>
      <Box>
        {loading && <CircularProgress />}
        {!loading && (
          <>
            <Typography variant="h5" component="h1" gutterBottom>{books.length} books included</Typography>
            <GridList cellHeight={60} className={classes.gridList} cols={18}>
              {books.map((book, index) => (
                <Tooltip key={`tip-${index}`} title={`${book.book.bookTitle} by ${book.book.bookAuthor}`} aria-label="book title">
                  <GridListTile key={`tile-${index}`} cols={1}>
                    <img key={`bookimg-${index}`} src={book.book.bookCover} alt={book.book.bookTitle} />
                  </GridListTile>
                </Tooltip>
              ))}
            </GridList></>)
        }
      </Box>
    </Container>
  );
}