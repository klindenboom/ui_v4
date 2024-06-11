import React from 'react';
import ReactApexChart from 'react-apexcharts';
import Box from '@mui/material/Box';

const HeatMapChart = ({ data, title }) => {
  const chartOptions = {
    chart: {
      type: 'heatmap',
      width: '100%',
      height: '100%',
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
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
        colorScale: {
          ranges: [
            {
              from: 0,
              to: 50,
              color: '#00A100'
            },
            {
              from: 51,
              to: 100,
              color: '#128FD9'
            }
          ],
          inverse: false, // Disable inverse color scale
        }
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '14px',
        colors: ['#FFFFFF'], // Set data label colors to white
      },
      formatter: function (val, opts) {
        return val.toFixed(1); // Format value to 1 decimal place
      }
    },
    xaxis: {
      type: 'category',
      categories: ['Metric']
    },
    legend: {
      show: false // Heat map does not usually have legends
    }
  };

  const chartSeries = [
    {
      name: 'Win Rate',
      data: data.map(item => item.winRate)
    },
    {
      name: 'Total P/L',
      data: data.map(item => item.totalPL)
    },
    {
      name: 'Return on Cap',
      data: data.map(item => item.returnOnCap)
    },
    {
      name: 'Time in Trade',
      data: data.map(item => item.timeInTrade)
    }
  ];

  return (
    <Box sx={{ width: '100%', height: '60vh', textAlign: 'center' }}>
      <ReactApexChart options={chartOptions} series={chartSeries} type="heatmap" />
    </Box>
  );
};

export default HeatMapChart;
