import React from 'react';
import {
  useParams
} from "react-router-dom";

import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';

import { BarChart, Bar, XAxis, YAxis, Tooltip, LabelList } from 'recharts';

function selectColor(number) {
  const hue = number * 137.508; // use golden angle approximation
  return `hsl(${hue},50%,75%)`;
}

export default function Genre(props) {
  let { userId } = useParams();

  const [loading, setLoading] = React.useState(false);
  const [genreStats, setGenreStats] = React.useState([]);
  const [years, setYears] = React.useState([]);

  React.useEffect(async () => {
    if (genreStats.length == 0 && !loading) {
      setLoading(true);

      const ref = props.db.collection('userstats').doc(`${userId}-author`);
      const doc = await ref.get();
      const data = doc.data();
      // console.log('AUTHOR', JSON.stringify(data));

      const chartData = [];

      const years = new Set();
      _.forOwn(data, function (authorYears, author) {

        const dataItem = { author, total: authorYears.total };

        _.forOwn(authorYears, function (yearCount, year) {

          let yearKey = year;
          if (year === 'undefined') {
            yearKey = 'Unknown';
          }

          if (yearKey !== 'total') {
            years.add(yearKey);
            dataItem[yearKey] = yearCount;
          }
        });

        chartData.push(dataItem);
      });

      setYears(years);

      setGenreStats(_(chartData).sortBy('total').reverse().slice(0, 20).value());

      setLoading(false);

    }
  });

  const yearsAsArray = Array.from(years).sort();
  const maxYear = yearsAsArray[yearsAsArray.length - 1];

  const bars = Array.from(years).sort().map(
    year => {
      return (<Bar key={year} dataKey={year} fill={selectColor(year)} stackId="a" >
        {year === maxYear && (
          <LabelList dataKey="total" position="top" />
        )}
      </Bar>);
    }
  );

  return (

    <Box>
      {loading && <CircularProgress />}
      {!loading && (
        <BarChart width={1000} height={250} data={genreStats}>
          <XAxis dataKey="author" />
          <YAxis />
          <Tooltip />
          {bars}
        </BarChart>
      )}
    </Box>
  );
}