// src/components/BarChart.jsx
import React from 'react';
import ReactApexChart from 'react-apexcharts';
import Box from '@mui/material/Box';

const BarChart = ({ data, title }) => {
  const series = [
    {
      name: 'Occurrences',
      data: data.map(item => item.value),
    },
  ];

  const options = {
    chart: {
      type: 'bar',
      height: '100%',
      width: '100%',
      maxHeight: '100%',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 200,
      },
      background: 'transparent'
    },
    title: {
      text: title,
      align: 'center',
      style: {
        fontSize: '20px',
        color: '#FFFFFF',
      },
    },
    xaxis: {
      categories: data.map(item => item.key),
      title: {
        text: 'Strategies',
        style: {
          color: '#FFFFFF',
        },
      },
      labels: {
        style: {
          colors: '#FFFFFF',
        },
      },
      axisBorder: {
        show: true,
        color: '#FFFFFF',
      },
      axisTicks: {
        show: true,
        color: '#FFFFFF',
      },
    },
    yaxis: {
      title: {
        text: 'Occurrences',
        style: {
          color: '#FFFFFF',
        },
      },
      labels: {
        style: {
          colors: '#FFFFFF',
        },
      },
      axisBorder: {
        show: true,
        color: '#FFFFFF',
      },
      axisTicks: {
        show: true,
        color: '#FFFFFF',
      },
    },
    tooltip: {
      theme: 'dark',
      border: {
        color: '#FFFFFF',
        width: 1,
      },
      x: {
        show: true,
        formatter: (val) => `Strategy: ${val}`,
      },
      y: {
        show: true,
        formatter: (val) => `Occurrences: ${val}`,
      },
    },
    grid: {
      borderColor: '#FFFFFF',
    },
    legend: {
      labels: {
        colors: '#FFFFFF',
        useSeriesColors: false,
      },
    },
    colors: ['#FF4560', '#775DD0', '#00E396', '#FEB019'],
  };

  return (
    <Box sx={{ width: '100%', height: '100%', textAlign: 'center' }}>
      <ReactApexChart options={options} series={series} type="bar"  width="100%"
        height="100%" />
    </Box>
  );
};

export default BarChart;
