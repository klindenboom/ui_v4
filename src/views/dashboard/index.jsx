import React, { useState, useEffect, useContext } from 'react';
import { getAccountBalance, getAccountMargin } from '../../services/api';
import LineChart from '../../components/LineChart';
import AccountHealth from '../../components/AccountHealth';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
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
        const groups = marginResponse[0].marginData.groups;
        const totalBuyingPower = groups.reduce((sum, group) => sum + parseFloat(group['buying-power']), 0);
        setCumulativeBuyingPower(totalBuyingPower);

        if (groups.length > 1) {
          const latestBuyingPower = totalBuyingPower;
          const previousBuyingPower = groups.slice(0, -1).reduce((sum, group) => sum + parseFloat(group['buying-power']), 0);

          const change = latestBuyingPower - previousBuyingPower;
          const percentChange = (change / previousBuyingPower) * 100;
          setBuyingPowerChange(change);
          setBuyingPowerChangePercent(percentChange);
        }
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

  return (
    <Container maxWidth={false} sx={{ width: '100%', padding: 0 }}>
      <Box sx={{ width: '100%', height: '50vh', overflow: 'hidden' }}>
        <Box sx={{ height: 'calc(100% - 48px)', overflow: 'hidden' }}>
          {balanceData.length > 0 ? (
            <LineChart data={balanceData} />
          ) : (
            <Typography>Loading...</Typography>
          )}
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 0, height: '25vh' }}>
        <Box sx={{ width: '48%', height: '100%' }}>
          <Box sx={{ border: '1px solid #ccc', padding: 2 }}>
            <Typography variant="h5">Account Health</Typography>
            {/* Your account health content goes here */}
          </Box>
          <Divider />
          <Box sx={{ width: '100%', textAlign: 'left', marginTop: 2 }}>
            <Typography variant="h4" gutterBottom>
              Net Liquidity {renderBalanceChange()}
            </Typography>
            <Typography variant="h4" gutterBottom>
              Buying Power {renderBuyingPowerChange()}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ width: '48%', height: '100%' }}>
          <Box sx={{ border: '1px solid #ccc', padding: 2, height: '100%' }}>
            <Typography variant="h5">Heat Map Chart</Typography>
            {/* Your heat map chart content goes here */}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;
