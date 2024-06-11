import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';
import Box from '@mui/material/Box';

const LineChartMargin = ({ data, title }) => {
  const theme = useTheme();

  // Extract dates from data
  const dates = data.map(d => new Date(d.x).toISOString().split('T')[0]);

  const [options, setOptions] = useState({
    chart: {
      type: 'line',
      zoom: {
        enabled: false
      },
      width: '100%',
      height: '100%'
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      show: true, // Ensure the line is visible
     // width: 2 // You can adjust the width of the line as needed
    },
    markers: {
      size: 5,
    },
    xaxis: {
      type: 'datetime',
      categories: dates,
      labels: {
        format: 'dd MMM', // Format to show day and month
      },
      tickAmount: dates.length,
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          return `${Math.round(value)}`; // Format to show values as whole numbers
        }
      }
    },
    tooltip: {
      x: {
        formatter: function (value) {
          const date = new Date(value);
          return date.toLocaleString('en-US', {
            timeZone: 'America/New_York',
            month: 'short',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }) + ' EST';
        }
      }
    },
    annotations: {
      yaxis: [
        {
          y: 68,
          borderColor: 'red',
          strokeDashArray: 0, // Solid line
          strokeWidth: 5, // Thicker line
          label: {
            borderColor: 'red',
            style: {
              color: '#fff',
              background: 'red',
            },
            text: 'Target'
          }
        }
      ]
    },
    grid: {
      borderColor: '#FFFFFF'
    },
    colors: ['#FF4560']
  });

  useEffect(() => {
    const { primary } = theme.palette.text;
    const divider = theme.palette.divider;
    const secondary = theme.palette.secondary.main;

    setOptions(prevState => ({
      ...prevState,
      colors: [secondary],
      xaxis: {
        ...prevState.xaxis,
        labels: {
          ...prevState.xaxis.labels,
          style: {
            colors: primary
          },
          formatter: (value, timestamp) => {
            const date = new Date(timestamp);
            // Skip the tick for the start of June
            if (date.getDate() === 1 && date.getMonth() === 5) {
              return '';
            }
            return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(date);
          }
        }
      },
      title: {
        text: title,
        align: 'center',
        style: {
          fontSize: '20px',
          color: '#FFFFFF',
        },
      },
      yaxis: {
        ...prevState.yaxis,
        labels: {
          ...prevState.yaxis.labels,
          style: {
            colors: primary
          }
        }
      },
      grid: {
        borderColor: divider
      },
      tooltip: {
        theme: theme.palette.mode
      }
    }));
  }, [theme]);

  return (
    <Box sx={{ width: '100%', height: '100%', textAlign: 'center' }}>
      <ReactApexChart
        options={options}
        series={[{ name: 'Margin Requirement %', data }]}
        type="line"
        width="100%"
        height="100%"
      />
    </Box>
  );
};

export default LineChartMargin;
