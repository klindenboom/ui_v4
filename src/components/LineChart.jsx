// src/components/LineChart.jsx

import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';

const LineChart = ({ data }) => {
  const theme = useTheme();
  const [options, setOptions] = useState({
    chart: {
      height: 350,
      type: 'line',
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth'
    },
    markers: {
        size: 5,
    },
    xaxis: {
      type: 'datetime',
      categories: []
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
          style: {
            colors: primary
          }
        }
      },
      yaxis: {
        labels: {
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
    <ReactApexChart
      options={options}
      series={[{ name: 'Account Balance', data }]}
      type="line"
      height={350}
    />
  );
};

export default LineChart;
