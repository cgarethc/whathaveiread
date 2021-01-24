import React from 'react';
import {
  useParams
} from "react-router-dom";

import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';

import {
  AreaChart, Area, XAxis, YAxis, Tooltip, Legend
} from 'recharts';

function selectColor(number) {
  const hue = number * 137.508; // use golden angle approximation
  return `hsl(${hue},50%,75%)`;
}

export default function SettingOverTime(props) {
  let { userId } = useParams();

  const [loading, setLoading] = React.useState(false);
  const [settingStats, setSettingStats] = React.useState([]);
  const [settings, setSettings] = React.useState([]);

  React.useEffect(async () => {
    if (settingStats.length == 0 && !loading) {

      // I need a data item for each *year* and an Area in the chart for each *genre*

      setLoading(true);

      const ref = props.db.collection('userstats').doc(`${userId}-stats`);
      const doc = await ref.get();
      const data = doc.data();      

      const chartData = [];

      const settings = new Set();

      _.forOwn(data.setting, function (settingBooks, settingName) {
        
          const settingSummary = { genreName: settingName, count: 0 };
          settings.add(settingSummary);
          _.forOwn(settingBooks.byReadYear, function (yearStats, year) {
            if (year !== 'undefined') {
              // see if we already have a data item for that year
              let dataItemForYear = _.find(chartData, { year });
              if (!dataItemForYear) {
                dataItemForYear = { year };
                chartData.push(dataItemForYear);
              }

              if (!dataItemForYear[settingName]) {
                dataItemForYear[settingName] = 0;
              }
              dataItemForYear[settingName] += yearStats.count;
              settingSummary.count += yearStats.count;
            }
          });
        
      });

      setSettings(settings);

      setSettingStats(_.sortBy(chartData, 'year'));

      setLoading(false);

    }
  });

  const genresToShow = _(Array.from(settings)).sortBy('count').reverse().slice(0, 10).value();
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
          data={settingStats}
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