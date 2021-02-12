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

export default function Setting(props) {
  let { userId } = useParams();

  const [loading, setLoading] = React.useState(false);
  const [stats, setStats] = React.useState([]);
  const [years, setYears] = React.useState([]);

  React.useEffect(async () => {
    if (stats.length == 0 && !loading) {
      setLoading(true);

      const ref = props.db.collection('userstats').doc(`${userId}-setting`);
      const doc = await ref.get();
      const data = doc.data();

      const chartData = [];

      const years = new Set();
      _.forOwn(data, function (settingBooks, setting) {

        const dataItem = { setting, total: settingBooks.count };

        _.forOwn(settingBooks.byReadYear, function (yearData, year) {

          let yearKey = year;
          if (year === 'undefined') {
            yearKey = 'Unknown';
          }

          years.add(yearKey);
          dataItem[yearKey] = yearData.count;

        });

        chartData.push(dataItem);
      });

      setYears(years);

      setStats(_(chartData).sortBy('total').reverse().slice(0, 20).value());

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
        <BarChart width={1000} height={250} data={stats}>
          <XAxis dataKey="setting" />
          <YAxis />
          <Tooltip />
          {bars}
        </BarChart>
      )}
    </Box>
  );
}