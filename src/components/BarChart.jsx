import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

const BarChart = ({ data, title }) => {
  const theme = useTheme();
  
  const [options, setOptions] = useState({
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
        },
        axisBorder: {
          ...prevState.xaxis.axisBorder,
          color: divider,
        },
        axisTicks: {
          ...prevState.xaxis.axisTicks,
          color: divider,
        }
      },
      title: {
        ...prevState.title,
        style: {
          ...prevState.title.style,
          color: primary
        }
      },
      yaxis: {
        ...prevState.yaxis,
        labels: {
          ...prevState.yaxis.labels,
          style: {
            colors: primary
          }
        },
        axisBorder: {
          ...prevState.yaxis.axisBorder,
          color: divider,
        },
        axisTicks: {
          ...prevState.yaxis.axisTicks,
          color: divider,
        }
      },
      grid: {
        borderColor: divider
      },
      tooltip: {
        theme: theme.palette.mode
      },
      legend: {
        labels: {
          colors: primary
        }
      }
    }));
  }, [theme]);

  const series = [
    {
      name: 'Occurrences',
      data: data.map(item => item.value),
    },
  ];

  return (
    <Box sx={{ width: '100%', height: '100%', textAlign: 'center' }}>
      <ReactApexChart options={options} series={series} type="bar" width="100%" height="100%" />
    </Box>
  );
};

export default BarChart;
