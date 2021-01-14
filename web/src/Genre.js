import React from 'react';
import {
  useParams
} from "react-router-dom";
import _, { isInteger } from 'lodash';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

function selectColor(number) {
  const hue = number * 137.508; // use golden angle approximation
  return `hsl(${hue},50%,75%)`;
}

export default function Genre(props) {
  let { userId } = useParams();

  const [loading, setLoading] = React.useState(false);
  const [genreStats, setGenreStats] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const [years, setYears] = React.useState([]);

  React.useEffect(async () => {
    if (genreStats.length == 0 && !loading) {
      setLoading(true);

      const ref = props.db.collection('userstats').doc(userId);
      const doc = await ref.get();
      const data = doc.data();

      setTotal(Object.keys(data.genre).length);

      const genreChartData = [];

      const years = new Set();
      _.forOwn(data.genre, function (genreBooks, genreName) {
        const dataItem = { name: genreName };
        let counter = 0;
        _.forOwn(genreBooks.byReadYear, function (yearBooks, year) {
          dataItem[year] = yearBooks.count;
          if (year !== 'undefined') {
            years.add(year);
            counter+=yearBooks.count;
          }
        });
        dataItem.total = counter;
        genreChartData.push(dataItem);
      });

      setYears(years);

      setGenreStats(_(genreChartData).sortBy('total').reverse().slice(0, 20).value());

      setLoading(false);

    }
  });

  const bars = Array.from(years).sort().map(
    year => <Bar key={year} dataKey={year} fill={selectColor(year)} stackId="a" />
  );

  return (
    <Box>
      <BarChart width={1000} height={250} data={genreStats}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        {bars}
      </BarChart>
    </Box>
  );
}