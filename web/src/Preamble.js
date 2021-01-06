import React from 'react';
import {
  useParams
} from "react-router-dom";

import Typography from '@material-ui/core/Typography';

export default function Preamble(props) {
  let { userId } = useParams();
  return(
    <Typography>
      Goodreads stats for user {userId}
    </Typography>
  );
}