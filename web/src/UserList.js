import React from 'react';

import _ from 'lodash';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function UserList(props) {


  const [loading, setLoading] = React.useState(false);
  const [users, setUsers] = React.useState([]);

  React.useEffect(async () => {
    if (users.length == 0 && !loading) {
      setLoading(true);
      const ref = props.db.collection('userstats').doc('profiles');
      const doc = await ref.get();
      const data = doc.data();      
      setUsers(data);
      setLoading(false);
    }
  });

  const userElements = [];
  _.forOwn(users, (user, userId) => {
    userElements.push(<Typography key={userId}><a href={`/user/${userId}`}>{user.name}</a></Typography>);
  });  

  return (
    <Box>
      {loading && <CircularProgress />}
      {!loading && (
        userElements
      )}
    </Box>
  );
}