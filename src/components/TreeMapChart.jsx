import React from 'react';
import ReactApexChart from 'react-apexcharts';
import Box from '@mui/material/Box';

const TreeMapChart = ({ labels, data, title }) => {
  const colors = ['#009688', '#00897b', '#80cbc4', '#00695c', '#edf7ed', '#b6e0b3', '#6cc067', '#64ba5f']; // Reduced color palette

  const chartOptions = {
    chart: {
      type: 'treemap',
      width: '100%',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 200 // Set the animation duration to 300ms
      }
    },
    title: {
      text: title,
      align: 'center',
      style: {
        fontSize: '20px',
        color: '#FFFFFF' // Set title color to white
      }
    },
    legend: {
      show: false // Treemap does not usually have legends
    },
    tooltip: {
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        const label = w.config.series[0].data[dataPointIndex].x;
        const value = series[seriesIndex][dataPointIndex];
        const color = colors[1];
        return `<div style="padding: 10px; color: ${color};">
                  <strong>${label}</strong>: ${value}%
                </div>`;
      }
    },
    colors: colors, // Reduced color palette
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        return `${val}: ${opts.value.toFixed(1)}%`;
      },
      style: {
        fontSize: '14px',
        colors: ['#FFFFFF'], // Set data label colors to white
      }
    }
  };

  const chartSeries = labels.map((label, index) => ({
    x: label,
    y: parseFloat(data[index])
  })); // Ensure data is in the correct format for treemap

  return (
    <Box sx={{ width: '100%', height: '60vh', textAlign: 'center' }}>
      <ReactApexChart options={chartOptions} series={[{ data: chartSeries }]} type="treemap" />
    </Box>
  );
};

export default TreeMapChart;
