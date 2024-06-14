import React from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import { calculateTotalPrice } from '../utils/mappers';

const DraggableTradeCard = ({ trade, tradeGroups, handleAssignTradeToGroup, tradeStrings }) => {
  const greenColor = '#009688';
  const chipBgColor = 'rgba(0, 150, 136, 1)';

  const totalPrice = calculateTotalPrice(trade);

  const tradeDate = trade.uiData.timestamp ? new Date(trade.uiData.timestamp).toLocaleString() : 'N/A';

  const price = parseFloat(trade.uiData.price).toFixed(3);
  const tradeStringHeader = `${trade.uiData.totalCount} @ ${price} = ${parseFloat(trade.uiData.totalCount * price).toFixed(2)}`;

  const handleGroupChange = (event) => {
    handleAssignTradeToGroup(event.target.value, trade._id);
  };

  return (
    <Card
      sx={{
        width: '100%',
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
      <CardContent sx={{ padding: '4px !important', width:'100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', padding: 0 }}>
          <Typography
            sx={{ fontSize: 16, fontWeight: 'bold', color: greenColor, width: 75, textAlign: 'left' }}
          >
            {trade.uiData.underlyingSymbol}   
          </Typography>
          <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
          <Typography
            sx={{ fontSize: 14, fontWeight: 'bold', color: 'white', width: 100, textAlign: 'left' }}
          >
            {trade.uiData.timestamp} 
          </Typography>
          <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

          <Typography
            sx={{ fontSize: 14, fontWeight: 'bold', color: 'white', width: 200, textAlign: 'left' }}
          >
            {tradeStringHeader}
          </Typography>
          <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

          <Box sx={{ flex: 1, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 1 }}>
            {tradeStrings.map((legStrings, legIndex) => (
              <Box key={legIndex} sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {legStrings.map((tradeString, index) => (
                  <Chip
                    label={tradeString}
                    key={`${legIndex}-${index}`}
                    sx={{ backgroundColor: chipBgColor, marginBottom: '4px' }}
                  />
                ))}
              </Box>
            ))}
          </Box>
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
        {/* <Typography
            sx={{ fontSize: 14, fontWeight: 'bold', color: 'white', width: 50, textAlign: 'left' }}
          >
            {trade._id}
          </Typography> */}
      </CardContent>
    </Card>
  );
};

export default DraggableTradeCard;
