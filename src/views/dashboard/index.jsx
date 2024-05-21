// src/views/dashboard/index.jsx

import React, { useState, useEffect } from 'react';
import { getAccountBalance, getAccountMargin } from '../../services/api';
import LineChart from '../../components/LineChart';
import MarginCard from '../../components/MarginCard';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

const Dashboard = () => {
  const [balanceData, setBalanceData] = useState([]);
  const [marginData, setMarginData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const balanceResponse = await getAccountBalance();
        const marginResponse = await getAccountMargin();

        const formattedBalanceData = balanceResponse.map(entry => ({
          x: new Date(entry.date).getTime(), // Convert date to timestamp
          y: entry.balance
        }));

        setBalanceData(formattedBalanceData);
        setMarginData(marginResponse[0].marginData.groups);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Container>
      <Typography variant="h6" gutterBottom>
        Net Liquididty
      </Typography>
      {balanceData.length > 0 ? (
        <LineChart data={balanceData} />
      ) : (
        <Typography>Loading...</Typography>
      )}
      <Typography variant="h6" gutterBottom>
        Account Margin
      </Typography>
      {marginData.length > 0 ? (
        <Grid container spacing={3}>
          {marginData.map((group, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <MarginCard group={group} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography>Loading...</Typography>
      )}
    </Container>
  );
};

export default Dashboard;
