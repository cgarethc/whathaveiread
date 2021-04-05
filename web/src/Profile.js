import React from 'react';
import {
  useParams
} from "react-router-dom";

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';


export default function Profile(props) {
  let { userId } = useParams();
  

  const [loading, setLoading] = React.useState(false);
  const [users, setUsers] = React.useState();

  React.useEffect(async () => {
    if (!users && !loading) {
      setLoading(true);
      const ref = props.db.collection('userstats').doc('profiles');
      const doc = await ref.get();
      const data = doc.data();      
      setUsers(data);
      console.log(JSON.stringify(data));
      setLoading(false);
    }
  });

  return (
    <Box>
      {loading && <CircularProgress />}
      {!loading && userId && users && (
        <Typography>{users[userId].name}</Typography>
      )}
    </Box>
  );
}