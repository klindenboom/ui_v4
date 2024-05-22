// src/components/DroppableTradeGroupCard.jsx

import React from 'react';
import { useDrop } from 'react-dnd';
import Card from '@mui/material/Card'; 
import Button from '@mui/material/Button'; 
import Box from '@mui/material/Box'; 
import CardContent from '@mui/material/CardContent'; 
import Typography from '@mui/material/Typography';

const ItemTypes = {
    TRADE: 'trade',
    TRADE_GROUP: 'tradeGroup',
  };

  const DroppableTradeGroupCard = ({ group, handleAssignTradeToGroup, handleDeleteTradeGroup, handleUpdateTradeGroup }) => {
    const [{ isOver }, drop] = useDrop({
      accept: ItemTypes.TRADE,
      drop: (item) => handleAssignTradeToGroup(group._id, item.id),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    });
  
    return (
      <Card
        ref={drop}
        sx={{
          backgroundColor: isOver ? 'action.hover' : 'background.paper',
          margin: 2,
          padding: 2,
          boxShadow: 3,
          borderRadius: 2,
          transition: 'background-color 0.3s ease',
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
        variant="outlined"
      >
        <CardContent>
          <Typography
            sx={{ fontSize: 20, fontWeight: 'bold', color: 'text.primary' }}
            gutterBottom
          >
            {group.name}
          </Typography>
          <Box sx={{ marginTop: 1 }}>
            <Typography variant="body2" color="textSecondary">
              Open Date: {new Date(group.openDate).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Delta: {group.delta}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Theta: {group.theta}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Vega: {group.vega}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Number of Trades: {group.tradeHistory.length}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  };
  
  export default DroppableTradeGroupCard;