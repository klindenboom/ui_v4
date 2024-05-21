// src/components/DraggableTradeCard.jsx

import React from 'react';
import { useDrag } from 'react-dnd';
import Card from '@mui/material/Card'; 
import CardContent from '@mui/material/CardContent'; 
import Typography from '@mui/material/Typography';

const DraggableTradeCard = ({ trade }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'TRADE',
    item: { trade },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <Card
      ref={drag}
      sx={{
        marginBottom: 2,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
      }}
    >
      <CardContent>
        <Typography variant="h6">Trade ID: {trade.id}</Typography>
        <Typography variant="body2">Underlying: {trade.uiData.underlyingSymbol}</Typography>
        <Typography variant="body2">Type: {trade.uiData.underlyingType}</Typography>
        <Typography variant="body2">Price: {trade.uiData.price}</Typography>
        <Typography variant="body2">Quantity: {trade.uiData.totalCount}</Typography>
        <Typography variant="body2">Order Type: {trade.uiData.orderType}</Typography>
        <Typography variant="body2">Status: {trade.brokerageData.status}</Typography>
        <Typography variant="body2">Time: {new Date(trade.uiData.timestamp).toLocaleString()}</Typography>
      </CardContent>
    </Card>
  );
};

export default DraggableTradeCard;
