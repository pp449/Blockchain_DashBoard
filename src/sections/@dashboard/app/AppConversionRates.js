import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Box, Card, CardHeader, createStyles } from '@mui/material';
// utils
import { fNumber } from '../../../utils/formatNumber';
// components
import { BaseOptionChart } from '../../../components/chart';
import Scrollbar from '../../../components/Scrollbar';

// ----------------------------------------------------------------------

const stdiv = {
  height: "364px",
  overflow: "scroll",
}

AppConversionRates.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartData: PropTypes.array.isRequired,
};

export default function AppConversionRates({ title, subheader, chartData, color, ...other }) {
  const chartLabels = chartData.map((i) => i.symbol);

  const chartSeries = chartData.map((i) => i.price);

  const chartOptions = merge(BaseOptionChart(), {
    tooltip: {
      marker: { show: false },
      y: {
        formatter: (seriesName) => fNumber(seriesName),
        title: {
          formatter: () => '',
        },
      },
    },
    plotOptions: {
      bar: { horizontal: true, barHeight: '28%', borderRadius: 2 },
    },
    xaxis: {
      categories: chartLabels,
    },
    fill: {
      colors: color
    },
    stroke: {
      colors: color
    }
  });

  return (
    <Card {...other}>
      <Scrollbar>
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ mx: 3 }} dir="ltr">
        <div style={stdiv}>
        <ReactApexChart type="bar" series={[{ data: chartSeries }]} options={chartOptions} height={70*chartData.length} />
        </div>
      </Box>
      </Scrollbar>
    </Card>
  );
}
