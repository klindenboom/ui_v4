import React from 'react';
import ReactApexChart from 'react-apexcharts';
import Box from '@mui/material/Box';
import { border, maxHeight } from '@mui/system';

const BubbleChart = ({ data, title }) => {
  const chartOptions = {
    chart: {
      type: 'bubble',
      height: '100%',
      width: '100%',
      maxHeight: '100%',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 200 // Set the animation duration to 300ms
      },
      background: 'transparent'
    },
    title: {
      text: title,
      align: 'center',
      style: {
        fontSize: '20px',
        color: '#FFFFFF' // Set title color to white
      }
    },
    xaxis: {
      type: 'numeric',
      title: {
        text: 'Days in Trade',
        style: {
          color: '#FFFFFF' // Set axis title color to white
        }
      },
      labels: {
        style: {
          colors: '#FFFFFF' // Set axis labels color to white
        },
        formatter: (value) => Math.round(value) // Round the values to ensure whole numbers
      },
      axisBorder: {
        show: true,
        color: '#FFFFFF' // Set axis border color to white
      },
      axisTicks: {
        show: true,
        color: '#FFFFFF', // Set axis ticks color to white
        interval: 1 // Ensures the ticks are shown for every tickAmount interval
      },
      tickAmount: Math.floor((Math.max(...data.map(item => item.timeInTrade)) - Math.min(...data.map(item => item.timeInTrade))) / 5), // Calculate tick amount for every 5 units
      min: 0, // Ensures x-axis starts from 0
      tickInterval: 5 // Ensures a tick every 5 units
    },
    yaxis: {
      title: {
        text: 'Return on Buying Power (%)',
        style: {
          color: '#FFFFFF' // Set axis title color to white
        }
      },
      labels: {
        style: {
          colors: '#FFFFFF' // Set axis labels color to white
        }
      },
      axisBorder: {
        show: true,
        color: '#FFFFFF' // Set axis border color to white
      },
      axisTicks: {
        show: true,
        color: '#FFFFFF' // Set axis ticks color to white
      }
    },
    tooltip: {
      theme: 'dark', // Dark theme
      border: {
        color: '#ffffff', // Border color
        width: 1 // Border width
      },
      x: {
        show: true,
        formatter: (val) => `Time in Trade: ${val} days`
      },
      y: {
        show: true,
        formatter: (val) => `Return on Cap: ${val} %`
      },
      z: {
        show: true,
        formatter: (val) => `Total P/L: ${val}`
      }
    },
    plotOptions: {
      bubble: {
        minBubbleRadius: 12,
        maxBubbleRadius: 140
      }
    },
    legend: {
      labels: {
        colors: '#FFFFFF', // Set legend labels color to white
        useSeriesColors: false
      }
    },
    annotations: {
      yaxis: [
        {
          y: 0,
          borderColor: 'green',
          strokeDashArray: 0, // Solid line
          strokeWidth: 5, // Thicker line
          label: {
            borderColor: 'greem',
            style: {
              color: '#fff',
              background: 'green',
              width:4,
            },
            text: '0'
          }
        }
      ]
    },
    colors: ['#FF4560', '#775DD0', '#00E396', '#FEB019'] // Define colors for each metric
  };
  const keys = ['Stragles', '112 Bear Traps', 'Credit Spreads', 'Naked Puts'];
  const chartSeries = [
    {
      name: keys[0],
      data: data.filter(item => item.key.includes(keys[0])).map(item => ({
        x: item.timeInTrade,
        y: item.returnOnCap,
        z: Math.abs(item.totalPL)
      }))
    },
    {
      name: keys[1],
      data: data.filter(item => item.key.includes(keys[1])).map(item => ({
        x: item.timeInTrade,
        y: item.returnOnCap,
        z: Math.abs(item.totalPL)
      }))
    },
    {
      name: keys[2],
      data: data.filter(item => item.key.includes(keys[2])).map(item => ({
        x: item.timeInTrade,
        y: item.returnOnCap,
        z: Math.abs(item.totalPL)
      }))
    },
    {
      name: keys[3],
      data: data.filter(item => item.key.includes(keys[3])).map(item => ({
        x: item.timeInTrade,
        y: item.returnOnCap,
        z: Math.abs(item.totalPL)
      }))
    }
  ];

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactApexChart 
        options={chartOptions} 
        series={chartSeries} 
        type="bubble"
        width="100%"
        height="100%"
      />
    </div>
  );
};

export default BubbleChart;
