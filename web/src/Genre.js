import React from 'react';
import {
  useParams
} from "react-router-dom";
import _ from 'lodash';

import Box from '@material-ui/core/Box';

import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

export default function Genre(props) {
  let { userId } = useParams();

  const [loading, setLoading] = React.useState(false);
  const [genreStats, setGenreStats] = React.useState([]);

  React.useEffect(async () => {
    if (genreStats.length == 0 && !loading) {
      setLoading(true);
      
      const ref = props.db.collection('userstats').doc(userId);
      const doc = await ref.get();
      const data = doc.data();
      
      const genreChartData = [];
      _.forOwn(data.genre, function (genreBooks, genreName) {        
        genreChartData.push({ name: genreName, value: genreBooks.count });
      });

      setGenreStats(_(genreChartData).sortBy('value').reverse().slice(0,12).value());

      setLoading(false);

    }
  });

  return (
    <Box>
      <BarChart width={1000} height={250} data={genreStats}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </Box>
  );
}