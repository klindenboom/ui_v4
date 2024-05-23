import React, { useState, useEffect, useContext } from 'react';
import { getAccountMargin } from '../../services/api';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useTheme } from '@mui/material/styles';
import MarginCard from '../../components/MarginCard';
import TreeMapChart from '../../components/TreeMapChart';
import PieChart from '../../components/PieChart';
import { GlobalTradeDataContext } from '../../contexts/GlobalTradeDataContext'; // Adjust path as necessary

const AccountMargin = () => {
    const theme = useTheme();
    const { recentBalance } = useContext(GlobalTradeDataContext);
    const [marginData, setMarginData] = useState([]);
    const [error, setError] = useState(null);
    const [cumulativeBuyingPower, setCumulativeBuyingPower] = useState(0);
    const [showCharts, setShowCharts] = useState(false);
    const [chartType, setChartType] = useState('treemap'); // State to toggle between treemap and pie chart

    useEffect(() => {
      const fetchData = async () => {
        try {
          const marginResponse = await getAccountMargin();
          const groups = marginResponse[0].marginData.groups;
          setMarginData(groups);
          setCumulativeBuyingPower(groups.reduce((sum, group) => sum + parseFloat(group['buying-power']), 0));
        } catch (err) {
          setError(err.message);
        }
      };
  
      fetchData();
    }, []);
  
    if (error) {
      return <div>Error: {error}</div>;
    }
  
    const labels = marginData.map(group => group.description);
    const buyingPowerPercentages = marginData.map(group => ((parseFloat(group['buying-power']) / recentBalance) * 100).toFixed(1));
    const deployedBuyingPowerPercentages = marginData.map(group => ((parseFloat(group['buying-power']) / cumulativeBuyingPower) * 100).toFixed(1));

    return (
        <Container maxWidth={false} sx={{ width: '100%', padding: 0 }}>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
              <Typography variant="h4" gutterBottom sx={{ marginRight: 2, color: theme.palette.text.primary }}>
                {recentBalance !== null && `Current Net Liq: `}
                <span style={{ color: '#009688' }}>{recentBalance !== null && `$${Math.round(recentBalance).toLocaleString()}`}</span>
                <span style={{ marginLeft: '16px' }}>{cumulativeBuyingPower !== null && `Buying Power: `}</span>
                <span style={{ color: '#009688' }}>{cumulativeBuyingPower !== null && `${(cumulativeBuyingPower / recentBalance * 100).toFixed(1)}%`}</span>
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
                    <>
                      {/* <TreeMapChart labels={labels} data={buyingPowerPercentages} title="Percent of Net Liq" /> */}
                      <TreeMapChart labels={labels} data={deployedBuyingPowerPercentages} title="Percent of Deployed Buying Power" />
                    </>
                  ) : (
                    <>
                      {/* <PieChart labels={labels} data={buyingPowerPercentages} title="Percent of Net Liq" /> */}
                      <PieChart labels={labels} data={deployedBuyingPowerPercentages} title="Percent of Deployed Buying Power" />
                    </>
                  )}
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {marginData.map((group, index) => (
                    <Grid item xs={12} md={6} lg={4} key={index}>
                      <MarginCard group={group} recentBalance={recentBalance} cumulativeBuyingPower={cumulativeBuyingPower} />
                    </Grid>
                  ))}
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
