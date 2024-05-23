import React, { useState, useEffect, useContext } from 'react';
import { getAccountBalance } from '../../services/api';
import LineChart from '../../components/LineChart';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { GlobalTradeDataContext } from '../../contexts/GlobalTradeDataContext'; 

const Dashboard = () => {
  const { recentBalance, setRecentBalance } = useContext(GlobalTradeDataContext);
  const [balanceData, setBalanceData] = useState([]);
  const [error, setError] = useState(null);

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
          setRecentBalance(formattedBalanceData[formattedBalanceData.length - 1].y);
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

  return (
    <Container maxWidth={false} sx={{ width: '100%', padding: 0 }}>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ width: '100%', textAlign: 'center', marginTop: 2 }}>
          <Typography variant="h2" gutterBottom>
            Net Liquidity {recentBalance !== null && `: $${Math.round(recentBalance).toLocaleString()}`}
          </Typography>
        </Box>
        {balanceData.length > 0 ? (
          <LineChart data={balanceData} />
        ) : (
          <Typography>Loading...</Typography>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
