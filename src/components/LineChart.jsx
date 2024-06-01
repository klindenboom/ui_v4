import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';

const LineChart = ({ data }) => {
  const theme = useTheme();
  const [options, setOptions] = useState({
    chart: {
      type: 'line',
      zoom: {
        enabled: false
      },
      width: '100%',  // Ensure the chart takes up 100% width
      height: '100%'  // Ensure the chart takes up 100% height
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      // curve: 'smooth'
    },
    markers: {
      size: 5,
    },
    xaxis: {
      type: 'datetime',
      labels: {
        format: 'dd MMM', // Format to show day and month
      }
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          return `$${Math.round(value).toLocaleString()}`; // Format to show values in dollars to the nearest dollar and include commas
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
    }
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
          }
        }
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
    <div style={{ width: '100%', height: '100%' }}>
      <ReactApexChart
        options={options}
        series={[{ name: 'Account Balance', data }]}
        type="line"
        width="100%" // Ensure the chart component takes up 100% width
        height="100%" // Ensure the chart component takes up 100% height
      />
    </div>
  );
};

export default LineChart;