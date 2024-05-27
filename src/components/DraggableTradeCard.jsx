import React from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const DraggableTradeCard = ({ trade, tradeGroups, handleAssignTradeToGroup }) => {
  const greenColor = '#009688';

  const totalPrice = trade.uiData.legs
    ? trade.uiData.legs.reduce((acc, leg) => {
        const legTotal = leg.fills.reduce((legAcc, fill) => {
          const fillPrice = parseFloat(fill.price);
          const fillCount = parseInt(fill.fillCount, 10);
          const fillValue = fillPrice * fillCount;
          return leg.action === 'sellToOpen' ? legAcc + fillValue : legAcc - fillValue;
        }, 0);
        return acc + legTotal;
      }, 0).toFixed(2)
    : 'N/A';

  const tradeDate = trade.uiData.timestamp ? new Date(trade.uiData.timestamp).toLocaleString() : 'N/A';

  const handleGroupChange = (event) => {
    handleAssignTradeToGroup(event.target.value, trade._id);
  };

  return (
    <Card
      sx={{
        backgroundColor: 'background.paper',
        margin: '4px 0',
        padding: 0,
        boxShadow: 3,
        borderRadius: 2,
        transition: 'background-color 0.3s ease',
        '&:hover': {
          backgroundColor: 'action.hover',
        },
      }}
      variant="outlined"
    >
      <CardContent sx={{ padding: '4px !important' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 0 }}>
          <Typography
            sx={{ fontSize: 16, fontWeight: 'bold', color: greenColor, flex: 1, textAlign: 'left' }}
          >
            {trade.uiData.underlyingSymbol}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ flex: 1, textAlign: 'left' }}>
            {tradeDate}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ flex: 1, textAlign: 'left' }}>
            {trade.uiData.totalCount}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ flex: 1, textAlign: 'left' }}>
            ${totalPrice}
          </Typography>
          <Select
            value={trade.uiData.groupId || ''}
            onChange={handleGroupChange}
            displayEmpty
            sx={{ flex: 1, textAlign: 'left', minWidth: 80 }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {tradeGroups.map((group) => (
              <MenuItem key={group._id} value={group._id}>
                {group.name}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DraggableTradeCard;
