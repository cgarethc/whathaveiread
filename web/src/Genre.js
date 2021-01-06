import React from 'react';
import {
  useParams
} from "react-router-dom";

import Typography from '@material-ui/core/Typography';

export default function Genre(props) {
  let { userId } = useParams();

  const [loading, setLoading] = React.useState(false);
  const [stats, setStats] = React.useState();

  React.useEffect(async () => {
    if (!stats && !loading) {
      setLoading(true);
      const ref = props.db.collection('userstats').doc(userId);
      const doc = await ref.get();
      setStats(doc);
      console.log('stats is', doc.data());
      setLoading(false);

    }
  });

  return (
    <Typography>
      ---
    </Typography>
  );
}