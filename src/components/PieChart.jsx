import React from 'react';
import ReactApexChart from 'react-apexcharts';
import Box from '@mui/material/Box';

const PieChart = ({ labels, data, title }) => {
  const chartOptions = {
    chart: {
      type: 'pie',
      width: '100%',
      height: '100%',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 200 // Set the animation duration to 300ms
      }
    },
    labels: labels,
    colors: ['#009688', '#00897b', '#80cbc4', '#00695c', '#b6e0b3', '#6cc067', '#64ba5f'], // Reduced color palette
    legend: {
      labels: {
        colors: '#FFFFFF', // Set legend labels color to white
        useSeriesColors: false
      },
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '16px', // Increase font size
      markers: {
        width: 12, // Increase marker width
        height: 12 // Increase marker height
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
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        const label = opts.w.globals.labels[opts.seriesIndex];
        return `${label}: ${val.toFixed(1)}%`;
      },
      style: {
        fontSize: '14px',
        colors: ['#FFFFFF']
      },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 1,
        opacity: 0.45
      }
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return `${val}%`;
        }
      }
    }
  };

  const chartSeries = data.map(Number); // Ensure data is in numeric format

  return (
    <Box sx={{ width: '100%', height: '100%', textAlign: 'center' }}>
      <ReactApexChart options={chartOptions} series={chartSeries} type="pie"  width="100%"
        height="100%" />
    </Box>
  );
};

export default PieChart;
