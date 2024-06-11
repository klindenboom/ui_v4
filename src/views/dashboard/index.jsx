import React, { useState, useEffect, useContext } from 'react';
import { getAccountBalance, getAccountMargin } from '../../services/api';
import LineChart from '../../components/LineChart';
import BubbleChart from '../../components/BubbleChart';
import BarChart from '../../components/BarChart';
import TreeMapChart from '../../components/TreeMapChart';
import LineChartMargin from '../../components/LineChartMargin'; // Import LineChartMargin
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import { green, red } from '@mui/material/colors';
import { GlobalTradeDataContext } from '../../contexts/GlobalTradeDataContext';

const Dashboard = () => {
  const { recentBalance, setRecentBalance } = useContext(GlobalTradeDataContext);
  const [balanceData, setBalanceData] = useState([]);
  const [error, setError] = useState(null);
  const [balanceChange, setBalanceChange] = useState(null);
  const [balanceChangePercent, setBalanceChangePercent] = useState(null);
  const [cumulativeBuyingPower, setCumulativeBuyingPower] = useState(0);
  const [buyingPowerChange, setBuyingPowerChange] = useState(null);
  const [buyingPowerChangePercent, setBuyingPowerChangePercent] = useState(null);
  const [view, setView] = useState('line'); // State to track current view
  const [marginData, setMarginData] = useState([]); // State for margin data
  const [marginPercentData, setMarginPercentData] = useState([]); // State for margin percentage data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const balanceResponse = await getAccountBalance();

        const formattedBalanceData = balanceResponse.map(entry => ({
          x: new Date(entry.date).getTime(), // Convert date to timestamp
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
        <span style={{ color: 'white', display: 'inline-flex', alignItems: 'center' }}>
          {recentBalance !== null && `$${Math.round(recentBalance).toLocaleString()}`}
          <span style={{ display: 'inline-flex', alignItems: 'center', marginLeft: 8 }}>
            <ArrowIcon style={{ color, verticalAlign: 'middle' }} />
            <span style={{ color: 'white' }}> (</span>
            <span style={{ color }}>{isPositive ? '+' : ''}${Math.abs(balanceChange).toLocaleString()}</span>
            <span style={{ color: 'white' }}>) </span>
            <span style={{ color, marginLeft: 4 }}>{Math.abs(balanceChangePercent).toFixed(2)}%</span>
          </span>
        </span>
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
      const color = isPositive ? red[500] : green[500]; // Inverted colors for buying power
      const ArrowIcon = isPositive ? ArrowUpward : ArrowDownward;

      return (
        <span style={{ color: 'white', display: 'inline-flex', alignItems: 'center' }}>
          {buyingPowerPercent.toFixed(2)}%
          <span style={{ display: 'inline-flex', alignItems: 'center', marginLeft: 8 }}>
            <ArrowIcon style={{ color, verticalAlign: 'middle' }} />
            <span style={{ color: 'white' }}> (</span>
            <span style={{ color }}>{isPositive ? '+' : ''}${Math.abs(buyingPowerChange).toLocaleString()} {Math.abs(buyingPowerChangePercent).toFixed(2)}%</span>
            <span style={{ color: 'white' }}>)</span>
          </span>
        </span>
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

  const generateBarChartData = (data) => {
    const keys = ['Stragles', '112 Bear Traps', 'Credit Spreads', 'Naked Puts'];
    const occurrences = keys.map(key => ({
      key,
      value: data.filter(item => item.key.includes(key)).length,
    }));
    return occurrences;
  };

  const sampleData = generateSampleData();
  const barChartData = generateBarChartData(sampleData);

  // Prepare data for TreeMapChart similar to AccountMargin
  const sortedMarginData = [...marginData].sort((a, b) => parseFloat(b['buying-power']) - parseFloat(a['buying-power']));
  const treeMapLabels = sortedMarginData.map(group => group.description);
  const treeMapData = sortedMarginData.map(group => group.deployedPercentage.toFixed(1));

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
      <Box sx={{ width: '100%', height: '50vh', minHeight: '50vh', overflow: 'hidden' }}>
        <Box sx={{ height: '100%', overflow: 'hidden' }}>
          {view === 'line' && balanceData.length > 0 ? (
            <LineChart data={balanceData} title="Account Net Liquididty" />
          ) : view === 'margin' && marginPercentData.length > 0 ? (
            <LineChartMargin data={marginPercentData} title="Buying Power % of Net Liq" />
          ) : view === 'bubble' ? (
            <BubbleChart data={sampleData} title="Performance Metrics" />
          ) : view === 'pie' && treeMapData.length > 0 ? (
            <TreeMapChart labels={treeMapLabels} data={treeMapData} title="Buying Power Distribution" />
          ) : view === 'strat' ? (
            <BarChart data={barChartData} title="Strategy Diversification" />
          ) : (
            <Typography>Loading...</Typography>
          )}
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', height: '15vh', gap: 2 }}>
        <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Box sx={{ border: '1px solid #ccc', padding: 2, flex: '1 1 auto' }}>
            <Typography variant="h5">Account Health</Typography>
            <Box sx={{ textAlign: 'left', marginTop: 2, flex: '1 1 auto' }}>
              <Typography variant="h4" gutterBottom>
                Net Liquidity {renderBalanceChange()}
              </Typography>
              <Typography variant="h4" gutterBottom>
                Buying Power {renderBuyingPowerChange()}
              </Typography>
            </Box>
          </Box>
          <Divider />
        </Box>
      </Box>
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
        winRate: Math.floor(Math.random() * 100), // Random win rate between 0 and 100
        totalPL: Math.floor((Math.random() * 6000) - 3000), // Random total P/L between -3000 and 3000, skewed towards positive
        timeInTrade: generateTimeInTrade(), // Random time in trade skewed towards higher numbers
        returnOnCap: generateReturnOnCap() // Random return on cap between -9% and +18%, skewed towards positive
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
