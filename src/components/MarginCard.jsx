import React from 'react';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';

const MarginCard = ({ group, recentBalance, cumulativeBuyingPower }) => {
  const buyingPowerPercentage = ((group['buying-power'] / recentBalance) * 100).toFixed(1);
  const deployedBuyingPowerPercentage = ((group['buying-power'] / cumulativeBuyingPower) * 100).toFixed(1);

  const formatAsCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="div" sx={{ color: '#029688', fontSize: '1.75rem' }}>
            {group.description}
          </Typography>
          <Typography variant="h6" component="div">
            {group.calculationType}
          </Typography>
        </Box>
        <Divider sx={{ mt: 0, mb: '12px', borderColor: '#029688' }} />
        <Box sx={{ paddingLeft: '6px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2">
              Margin Requirement:
            </Typography>
            <Typography variant="body2" sx={{ textAlign: 'right' }}>
              {formatAsCurrency(group['margin-requirement'])}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="textSecondary">
              Percent of Net Liq:
            </Typography>
            <Typography variant="body2" sx={{ textAlign: 'right' }}>
              {buyingPowerPercentage}%
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2">
              Percent of deployed Buying Power:
            </Typography>
            <Typography variant="body2" sx={{ textAlign: 'right' }}>
              {deployedBuyingPowerPercentage}%
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2">
              Open Positions:
            </Typography>
            <Typography variant="body2" sx={{ textAlign: 'right' }}>
              {group['position-entries'] ? group['position-entries'].length : 1}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MarginCard;
