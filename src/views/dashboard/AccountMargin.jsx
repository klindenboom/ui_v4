import React, { useState, useEffect, useContext } from 'react';
import { getAccountMargin } from '../../services/api';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import MuiIconButton from '@mui/material/IconButton';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import TreeMapChart from '../../components/TreeMapChart';
import PieChart from '../../components/PieChart';
import { useTheme } from '@mui/material/styles';
import { GlobalTradeDataContext } from '../../contexts/GlobalTradeDataContext';

const AccountMargin = () => {
  const theme = useTheme();
  const { recentBalance } = useContext(GlobalTradeDataContext);
  const [marginData, setMarginData] = useState([]);
  const [error, setError] = useState(null);
  const [cumulativeBuyingPower, setCumulativeBuyingPower] = useState(0);
  const [showCharts, setShowCharts] = useState(false);
  const [chartType, setChartType] = useState('treemap');
  const [sortConfig, setSortConfig] = useState({ key: 'buying-power', direction: 'desc' });

  const greenColor = '#009688';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const marginResponse = await getAccountMargin();
        const groups = marginResponse[0].marginData.groups.map(group => ({
          ...group,
          netLiqPercentage: (parseFloat(group['buying-power']) / recentBalance) * 100,
          deployedPercentage: (parseFloat(group['buying-power']) / cumulativeBuyingPower) * 100,
        }));
        setMarginData(groups);
        setCumulativeBuyingPower(groups.reduce((sum, group) => sum + parseFloat(group['buying-power']), 0));
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, [recentBalance, cumulativeBuyingPower]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  const formatDollar = (amount) => {
    return `$${parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedMarginData = [...marginData].sort((a, b) => {
    if (sortConfig.key) {
      const valueA = parseFloat(a[sortConfig.key]) || a[sortConfig.key];
      const valueB = parseFloat(b[sortConfig.key]) || b[sortConfig.key];
      if (valueA < valueB) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
    }
    return 0;
  });

  const sortedLabels = sortedMarginData.map(group => group.description);
  const sortedDeployedBuyingPowerPercentages = sortedMarginData.map(group => group.deployedPercentage.toFixed(1));

  return (
    <Container maxWidth={false} sx={{ width: '100%', padding: 0 }}>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
          <Typography variant="h4" gutterBottom sx={{ marginRight: 2, color: theme.palette.text.primary }}>
            {recentBalance !== null && `Current Net Liq: `}
            <span style={{ color: greenColor }}>{recentBalance !== null && `$${Math.round(recentBalance).toLocaleString()}`}</span>
            <span style={{ marginLeft: '16px' }}>{cumulativeBuyingPower !== null && `Buying Power: `}</span>
            <span style={{ color: greenColor }}>{cumulativeBuyingPower !== null && `${(cumulativeBuyingPower / recentBalance * 100).toFixed(1)}%`}</span>
          </Typography>
          <Box>
            <FormControlLabel
              control={<Switch checked={showCharts} onChange={() => setShowCharts(!showCharts)} color="primary" />}
              label={showCharts ? 'Show Group List' : 'Show Charts'}
            />
            {showCharts && (
              <FormControlLabel
                control={<Switch checked={chartType === 'pie'} onChange={() => setChartType(chartType === 'treemap' ? 'pie' : 'treemap')} color="primary" />}
                label={chartType === 'pie' ? 'Show Treemap' : 'Show Pie Chart'}
              />
            )}
          </Box>
        </Box>
        {marginData.length > 0 ? (
          showCharts ? (
            <Box sx={{ width: '100%' }}>
              {chartType === 'treemap' ? (
                <TreeMapChart labels={sortedLabels} data={sortedDeployedBuyingPowerPercentages} title="Percent of Deployed Buying Power" />
              ) : (
                <PieChart labels={sortedLabels} data={sortedDeployedBuyingPowerPercentages} title="Percent of Deployed Buying Power" />
              )}
            </Box>
          ) : (
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid white' }}>
                  <Typography variant="subtitle1" color={greenColor} sx={{ flex: 1, textAlign: 'left', cursor: 'pointer' }} onClick={() => handleSort('description')}>
                    Group Name
                    {sortConfig.key === 'description' && (sortConfig.direction === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}
                  </Typography>
                  <Typography variant="subtitle1" color={greenColor} sx={{ flex: 1, textAlign: 'left', cursor: 'pointer' }} onClick={() => handleSort('buying-power')}>
                    Buying Power
                    {sortConfig.key === 'buying-power' && (sortConfig.direction === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}
                  </Typography>
                  <Typography variant="subtitle1" color={greenColor} sx={{ flex: 1, textAlign: 'left', cursor: 'pointer' }} onClick={() => handleSort('netLiqPercentage')}>
                    Net Liq %
                    {sortConfig.key === 'netLiqPercentage' && (sortConfig.direction === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}
                  </Typography>
                  <Typography variant="subtitle1" color={greenColor} sx={{ flex: 1, textAlign: 'left', cursor: 'pointer' }} onClick={() => handleSort('deployedPercentage')}>
                    Deployed %
                    {sortConfig.key === 'deployedPercentage' && (sortConfig.direction === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}
                  </Typography>
                </Box>
                {sortedMarginData.map((group, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '8px 0',
                      borderBottom: '1px solid lightgray',
                      marginBottom: '8px'
                    }}
                  >
                    <Typography sx={{ flex: 1, textAlign: 'left', color: greenColor, fontSize: '16px', fontWeight: 'bold' }}>{group.description}</Typography>
                    <Typography sx={{ flex: 1, textAlign: 'left' }}>{formatDollar(group['buying-power'])}</Typography>
                    <Typography sx={{ flex: 1, textAlign: 'left' }}>{group.netLiqPercentage.toFixed(1)}%</Typography>
                    <Typography sx={{ flex: 1, textAlign: 'left' }}>{group.deployedPercentage.toFixed(1)}%</Typography>
                  </Box>
                ))}
              </Grid>
            </Grid>
          )
        ) : (
          <Typography>Loading...</Typography>
        )}
      </Box>
    </Container>
  );
};

export default AccountMargin;
