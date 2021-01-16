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

export default function Category(props) {
  let { userId } = useParams();

  const [loading, setLoading] = React.useState(false);
  const [stats, setStats] = React.useState([]);

  React.useEffect(async () => {
    if (stats.length == 0 && !loading) {
      setLoading(true);

      const ref = props.db.collection('userstats').doc(`${userId}-stats`);
      const doc = await ref.get();
      const data = doc.data();

      const chartData = [];


      _.forOwn(data.summary.category, function (yearCategories, year) {
        const dataItem = {
          year,
          fiction: yearCategories.Fiction ? yearCategories.Fiction : 0,
          nonfiction: yearCategories.Nonfiction ? yearCategories.Nonfiction : 0,
          unknown: yearCategories.Unknown ? yearCategories.Unknown : 0,
        };

        dataItem.total = dataItem.fiction + dataItem.nonfiction + dataItem.unknown
        chartData.push(dataItem);
      });



      setStats(_(chartData).sortBy('year').value());

      setLoading(false);

    }
  });

  return (
    <Box>
      {loading && <CircularProgress />}
      {!loading && (
        <BarChart width={1000} height={250} data={stats}>
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Bar key='fiction' dataKey='fiction' fill={selectColor(1)} stackId="a" />
          <Bar key='nonfiction' dataKey='nonfiction' fill={selectColor(2)} stackId="a" />
          <Bar key='unknown' dataKey='unknown' fill={selectColor(3)} stackId="a" >
            <LabelList dataKey="total" position="top" />
          </Bar>
        </BarChart>)
      }
    </Box>
  );
}