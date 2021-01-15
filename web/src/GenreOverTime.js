import React from 'react';
import {
  useParams
} from "react-router-dom";
import _, { isInteger } from 'lodash';

import Box from '@material-ui/core/Box';

import {
  AreaChart, Area, XAxis, YAxis, Tooltip, Label} from 'recharts';


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

      const ref = props.db.collection('userstats').doc(userId);
      const doc = await ref.get();
      const data = doc.data();

      console.log(JSON.stringify(data));

      setTotal(Object.keys(data.genre).length);

      const genreChartData = [];

      const genres = new Set();

      _.forOwn(data.genre, function (genreBooks, genreName) {
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

      });

      setGenres(genres);

      setGenreStats(_.sortBy(genreChartData, 'year'));
      console.log(genreChartData);


      setLoading(false);

    }
  });

  const genresToShow = _(Array.from(genres)).sortBy('count').reverse().slice(0, 10).value();  
  const areas = genresToShow.map(
    (genreSummary, index) => {
      const { genreName, count } = genreSummary;
      return (
      <Area key={genreName} type="monotone" dataKey={genreName} 
      stackId="1" stroke='#000000' fill={selectColor(index)}>        
      </Area>);
    }
  );

  return (
    <Box>
      <AreaChart
        width={800}
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
      </AreaChart>
    </Box>
  );
}