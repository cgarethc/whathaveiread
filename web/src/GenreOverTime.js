import React from 'react';
import {
  useParams
} from "react-router-dom";

import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';

import {
  AreaChart, Area, XAxis, YAxis, Tooltip, Legend
} from 'recharts';

import { isValidGenre } from './DataUtilities';

function selectColor(number) {
  const hue = number * 137.508; // use golden angle approximation
  return `hsl(${hue},50%,75%)`;
}

export default function GenreOverTime(props) {
  let { userId } = useParams();

  const [loading, setLoading] = React.useState(false);
  const [genreStats, setGenreStats] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const [genres, setGenres] = React.useState([]);

  React.useEffect(async () => {
    if (genreStats.length == 0 && !loading) {

      // I need a data item for each *year* and an Area in the chart for each *genre*

      setLoading(true);

      const ref = props.db.collection('userstats').doc(`${userId}-stats`);
      const doc = await ref.get();
      const data = doc.data();

      setTotal(Object.keys(data.genre).length);

      const genreChartData = [];

      const genres = new Set();

      _.forOwn(data.genre, function (genreBooks, genreName) {
        if (isValidGenre(genreName)) {
          const genreSummary = { genreName, count: 0 };
          genres.add(genreSummary);
          _.forOwn(genreBooks.byReadYear, function (yearStats, year) {
            if (year !== 'undefined') {
              // see if we already have a data item for that year
              let dataItemForYear = _.find(genreChartData, { year });
              if (!dataItemForYear) {
                dataItemForYear = { year };
                genreChartData.push(dataItemForYear);
              }

              if (!dataItemForYear[genreName]) {
                dataItemForYear[genreName] = 0;
              }
              dataItemForYear[genreName] += yearStats.count;
              genreSummary.count += yearStats.count;
            }
          });
        }
      });

      setGenres(genres);

      setGenreStats(_.sortBy(genreChartData, 'year'));

      setLoading(false);

    }
  });

  const genresToShow = _(Array.from(genres)).sortBy('count').reverse().slice(0, 10).value();
  const areas = genresToShow.map(
    (genreSummary, index) => {
      const { genreName, count } = genreSummary;
      return (
        <Area key={genreName} type="monotone" dataKey={genreName}
          stackId="1" stroke={selectColor(index)} fill={selectColor(index)}>
        </Area>);
    }
  );

  return (
    <Box>
      {loading && <CircularProgress />}
      {!loading && (
        <AreaChart
          width={1000}
          height={400}
          data={genreStats}
          margin={{
            top: 10, right: 30, left: 0, bottom: 0,
          }}
        >
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          {areas}
          <Legend verticalAlign="bottom" height={36} />
        </AreaChart>
      )}
    </Box>
  );
}