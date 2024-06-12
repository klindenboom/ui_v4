import React, { useState, useEffect, useContext } from 'react';
import { getAccountBalance, getAccountMargin } from '../../services/api';
import LineChart from '../../components/LineChart';
import BubbleChart from '../../components/BubbleChart';
import BarChart from '../../components/BarChart';
import TreeMapChart from '../../components/TreeMapChart';
import PieChart from '../../components/PieChart';
import LineChartMargin from '../../components/LineChartMargin';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Switch from '@mui/material/Switch';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import { green, red } from '@mui/material/colors';
import { GlobalTradeDataContext } from '../../contexts/GlobalTradeDataContext';

const Dashboard = () => {
  const { recentBalance, setRecentBalance, tradeGroups, tradesWithoutGroupId, loading } = useContext(GlobalTradeDataContext);
  const { accountSettings } = useContext(GlobalTradeDataContext);
  const [balanceData, setBalanceData] = useState([]);
  const [error, setError] = useState(null);
  const [balanceChange, setBalanceChange] = useState(null);
  const [balanceChangePercent, setBalanceChangePercent] = useState(null);
  const [cumulativeBuyingPower, setCumulativeBuyingPower] = useState(0);
  const [buyingPowerChange, setBuyingPowerChange] = useState(null);
  const [buyingPowerChangePercent, setBuyingPowerChangePercent] = useState(null);
  const [view, setView] = useState('line');
  const [isTreeMap, setIsTreeMap] = useState(true);
  const [marginData, setMarginData] = useState([]);
  const [marginPercentData, setMarginPercentData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const balanceResponse = await getAccountBalance();

        const formattedBalanceData = balanceResponse.map(entry => ({
          x: new Date(entry.date).getTime(),
          y: entry.balance
        }));

        setBalanceData(formattedBalanceData);
        if (formattedBalanceData.length > 0) {
          const latestBalance = formattedBalanceData[formattedBalanceData.length - 1].y;
          const previousBalance = formattedBalanceData.length > 1 ? formattedBalanceData[formattedBalanceData.length - 2].y : null;

          setRecentBalance(latestBalance);
          if (previousBalance !== null) {
            const change = latestBalance - previousBalance;
            const percentChange = (change / previousBalance) * 100;
            setBalanceChange(change);
            setBalanceChangePercent(percentChange);
          }
        }

        const marginResponse = await getAccountMargin();
        const cbp = marginResponse[0].marginData.groups.reduce((sum, group) => sum + parseFloat(group['buying-power']), 0);
        setCumulativeBuyingPower(cbp);
        const groups = marginResponse[0].marginData.groups.map(group => ({
          ...group,
          netLiqPercentage: (parseFloat(group['buying-power']) / recentBalance) * 100,
          deployedPercentage: (parseFloat(group['buying-power']) / cbp) * 100,
        }));
        setMarginData(groups);

        if (groups.length > 1) {
          const latestBuyingPower = groups.reduce((sum, group) => sum + parseFloat(group['buying-power']), 0);
          const previousBuyingPower = groups.slice(0, -1).reduce((sum, group) => sum + parseFloat(group['buying-power']), 0);

          const change = latestBuyingPower - previousBuyingPower;
          const percentChange = (change / previousBuyingPower) * 100;
          setBuyingPowerChange(change);
          setBuyingPowerChangePercent(percentChange);
        }

        const marginPercent = formattedBalanceData.map((entry, index) => {
          const margin = marginResponse[index] && marginResponse[index].marginData && marginResponse[index].marginData['maintenance-requirement']
            ? parseFloat(marginResponse[index].marginData['maintenance-requirement'])
            : 0;
          return {
            x: entry.x,
            y: (margin / entry.y) * 100
          };
        });

        setMarginPercentData(marginPercent);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, [setRecentBalance]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  const renderBalanceChange = () => {
    if (balanceChange !== null && balanceChangePercent !== null) {
      const isPositive = balanceChange > 0;
      const color = isPositive ? green[500] : red[500];
      const ArrowIcon = isPositive ? ArrowUpward : ArrowDownward;

      return (
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <Typography variant="h4" gutterBottom>${Math.round(recentBalance).toLocaleString()}</Typography>
          <span style={{ color }}><ArrowIcon style={{ color, verticalAlign: 'middle' }} /> {isPositive ? ' +' : ' '}${Math.abs(balanceChange).toLocaleString()} ({Math.abs(balanceChangePercent).toFixed(2)}%)</span>
        </Box>
      );
    } else {
      return (
        <span style={{ color: 'white' }}>
          {recentBalance !== null && `$${Math.round(recentBalance).toLocaleString()}`}
        </span>
      );
    }
  };

  const renderBuyingPowerChange = () => {
    if (cumulativeBuyingPower !== null && recentBalance !== null && buyingPowerChangePercent !== null) {
      const buyingPowerPercent = (cumulativeBuyingPower / recentBalance) * 100;
      const isPositive = buyingPowerChange > 0;
      const color = isPositive ? red[500] : green[500];
      const ArrowIcon = isPositive ? ArrowUpward : ArrowDownward;

      return (
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <Typography variant="h4" gutterBottom>{buyingPowerPercent.toFixed(2)}%</Typography>
          <span style={{ color }}><ArrowIcon style={{ color, verticalAlign: 'middle' }} /> {isPositive ? ' +' : ' '}${Math.abs(buyingPowerChange).toLocaleString()} ({Math.abs(buyingPowerChangePercent).toFixed(2)}%)</span>
        </Box>
      );
    } else {
      return (
        <span style={{ color: 'white' }}>
          {cumulativeBuyingPower !== null && `${((cumulativeBuyingPower / recentBalance) * 100).toFixed(2)}%`}
        </span>
      );
    }
  };

  const handleViewChange = (event, newView) => {
    setView(newView);
  };

  const handleSwitchChange = (event) => {
    setIsTreeMap(event.target.checked);
  };

  const generateTradeGroupData = (tradeGroups) => {
    debugger;
    const categoryCounts = tradeGroups.reduce((acc, group) => {
      if (group.category in acc) {
        acc[group.category]++;
      } else {
        acc[group.category] = 1;
      }
      return acc;
    }, {});

    return Object.keys(categoryCounts).map(category => ({
      key: category,
      value: categoryCounts[category]
    }));
  };

  const tradeGroupData = generateTradeGroupData(tradeGroups);

  const sortedMarginData = [...marginData].sort((a, b) => parseFloat(b['buying-power']) - parseFloat(a['buying-power']));
  const treeMapLabels = sortedMarginData.map(group => group.description);
  const treeMapData = sortedMarginData.map(group => group.deployedPercentage.toFixed(1));
 if (loading) {
  return <h2>Loading...</h2>;
 }
  return (
    <Container maxWidth={false} sx={{ width: '100%', height: "100%", padding: 0 }}>
      <ToggleButtonGroup
        value={view}
        exclusive
        onChange={handleViewChange}
        aria-label="view toggle"
        sx={{ marginBottom: 2 }}
      >
        <ToggleButton value="line" aria-label="line chart">
          Net Liquidity
        </ToggleButton>
        <ToggleButton value="margin" aria-label="line chart">
          Buying Power Percent
        </ToggleButton>
        <ToggleButton value="pie" aria-label="pie chart">
          Buying Power Distribution
        </ToggleButton>
        <ToggleButton value="bubble" aria-label="bubble chart">
          Trade Performance
        </ToggleButton>
        <ToggleButton value="strat" aria-label="bar chart">
          Strategy Diversification
        </ToggleButton>
      </ToggleButtonGroup>
      <Box sx={{ width: '100%', height: '50vh', minHeight: '50vh', overflow: 'hidden', position: 'relative' }}>
        <Box sx={{ height: '100%', overflow: 'hidden' }}>
          {view === 'line' && balanceData.length > 0 ? (
            <LineChart data={balanceData} title="Account Net Liquididty" />
          ) : view === 'margin' && marginPercentData.length > 0 ? (
            <LineChartMargin data={marginPercentData} title="Buying Power % of Net Liq" />
          ) : view === 'bubble' ? (
            <BubbleChart data={generateSampleData()} title="Performance Metrics" />
          ) : view === 'pie' ? (
            <>
              <Box sx={{ position: 'absolute', top: '-5px', right: '50px', zIndex: 1, display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" color="white">Pie</Typography>
                <Switch
                  checked={isTreeMap}
                  onChange={handleSwitchChange}
                  name="chartTypeSwitch"
                  inputProps={{ 'aria-label': 'chart type switch' }}
                />
                <Typography variant="body2" color="white">TreeMap</Typography>
              </Box>
              {isTreeMap ? (
                <TreeMapChart labels={treeMapLabels} data={treeMapData} title="Buying Power Distribution" />
              ) : (
                <PieChart labels={treeMapLabels} data={treeMapData} title="Buying Power Distribution" />
              )}
            </>
          ) : view === 'strat' ? (
            <BarChart data={tradeGroupData} title="Strategy Diversification" />
          ) : (
            <Typography>Loading...</Typography>
          )}
        </Box>
      </Box>
      <Grid container sx={{ marginTop: 3 }} spacing={1}>
        <Grid item xs={12} lg={3} sm={6}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '200px',
              minWidth: '300px',
              padding: 2,
              border: '1px solid #ccc',
              borderRadius: '8px'
            }}
          >
            <Typography variant="h4" gutterBottom>
              Net Liquidity
            </Typography>
            <Typography variant="h4" gutterBottom>{renderBalanceChange()}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} lg={3} sm={6}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '200px',
              minWidth: '300px',
              padding: 2,
              border: '1px solid #ccc',
              borderRadius: '8px'
            }}
          >
            <Typography variant="h4" gutterBottom>
              Realized P/L YTD
            </Typography>
            <Typography variant="h4" gutterBottom>
              {`$${(recentBalance - accountSettings.startingAccountValue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </Typography>
            <Typography variant="h4" gutterBottom color={green[500]}>
              <ArrowUpward style={{ verticalAlign: 'middle' }} />{`${((accountSettings.startingAccountValue / recentBalance) * 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} lg={3} sm={6}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '200px',
              minWidth: '300px',
              padding: 2,
              border: '1px solid #ccc',
              borderRadius: '8px'
            }}
          >
            <Typography variant="h4" gutterBottom>
              Buying Power
            </Typography>
            <Typography variant="h4" gutterBottom>{renderBuyingPowerChange()}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} lg={3} sm={6}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '200px',
              minWidth: '300px',
              padding: 2,
              border: '1px solid #ccc',
              borderRadius: '8px'
            }}
          >
            <Typography variant="h4" gutterBottom>
              Open Trades: {tradeGroupData.length}
            </Typography>
            <Typography variant="h4" gutterBottom color={red[500]}>
              Unassigned Transactions: {tradesWithoutGroupId.length}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

function generateSampleData() {
  const keys = ['Stragles', '112 Bear Traps', 'Credit Spreads', 'Naked Puts'];
  const data = [];

  for (let i = 0; i < keys.length; i++) {
    for (let j = 0; j < 11; j++) {
      data.push({
        key: `${keys[i]} - ${j + 1}`,
        winRate: Math.floor(Math.random() * 100),
        totalPL: Math.floor((Math.random() * 6000) - 3000),
        timeInTrade: generateTimeInTrade(),
        returnOnCap: generateReturnOnCap()
      });
    }
  }

  return data;
}

function generateTimeInTrade() {
  const ranges = [
    { min: 16, max: 70, weight: 0.6 },
    { min: 70, max: 100, weight: 0.3 },
    { min: 1, max: 16, weight: 0.1 }
  ];

  return generateWeightedRandom(ranges);
}

function generateReturnOnCap() {
  const ranges = [
    { min: -9, max: -5, weight: 0.05 },
    { min: -5, max: -3, weight: 0.1 },
    { min: -3, max: 3, weight: 0.7 },
    { min: 3, max: 5, weight: 0.1 },
    { min: 5, max: 18, weight: 0.05 }
  ];

  return generateWeightedRandom(ranges);
}

function generateWeightedRandom(ranges) {
  const totalWeight = ranges.reduce((sum, range) => sum + range.weight, 0);
  const random = Math.random() * totalWeight;
  let weightSum = 0;

  for (const range of ranges) {
    weightSum += range.weight;
    if (random <= weightSum) {
      return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    }
  }
}

export default Dashboard;
