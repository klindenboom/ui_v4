import React from 'react';
import { useDrag } from 'react-dnd';
import Card from '@mui/material/Card'; 
import Box from '@mui/material/Box'; 
import CardContent from '@mui/material/CardContent'; 
import Typography from '@mui/material/Typography';

const ItemTypes = {
    TRADE: 'trade',
    TRADE_GROUP: 'tradeGroup',
  };

  const DraggableTradeCard = ({ trade }) => {
    const [{ isDragging }, drag] = useDrag({
      type: ItemTypes.TRADE,
      item: { id: trade._id },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    });
  
    return (
      <Card
        ref={drag}
        sx={{
          backgroundColor: 'background.paper',
          margin: 2,
          padding: 2,
          boxShadow: 3,
          borderRadius: 2,
          transition: 'background-color 0.3s ease',
          '&:hover': {
            backgroundColor: 'action.hover',
          },
          opacity: isDragging ? 0.5 : 1,
        }}
        variant="outlined"
      >
        <CardContent>
          <Typography
            sx={{ fontSize: 18, fontWeight: 'bold', color: 'text.primary' }}
            gutterBottom
          >
            {trade.uiData.underlyingSymbol}
          </Typography>
          <Box sx={{ marginTop: 1 }}>
            <Typography variant="body2" color="textSecondary">
              Order Type: {trade.uiData.orderType}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Price: {trade.uiData.price}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Quantity: {trade.uiData.totalCount}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  };
  
  export default DraggableTradeCard;


