// src/components/DroppableTradeGroupCard.jsx

import React from 'react';
import { useDrop } from 'react-dnd';
import Card from '@mui/material/Card'; 
import Button from '@mui/material/Button'; 
import CardContent from '@mui/material/CardContent'; 
import Typography from '@mui/material/Typography';

const DroppableTradeGroupCard = ({ group, handleAssignTradeToGroup, handleDeleteTradeGroup, handleUpdateTradeGroup }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'TRADE',
    drop: (item) => handleAssignTradeToGroup(group._id, item.trade._id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <Card ref={drop} sx={{ marginBottom: 2, backgroundColor: isOver ? '#f0f0f0' : 'white' }}>
      <CardContent>
        <Typography variant="h6">{group.name}</Typography>
        <Typography variant="body2">Delta: {group.delta}</Typography>
        <Typography variant="body2">Theta: {group.theta}</Typography>
        <Typography variant="body2">Vega: {group.vega}</Typography>
        <Typography variant="body2">Open Date: {new Date(group.openDate).toLocaleDateString()}</Typography>
        <Typography variant="body2">Type: {group.type}</Typography>
        <Typography variant="body2">Category: {group.category}</Typography>
        <Typography variant="body2">Underlying: {group.underlying}</Typography>
        <Typography variant="body2">Trade History: {group.tradeHistory.length} entries</Typography>
        <Typography variant="body2">Closed: {group.isClosed ? 'Yes' : 'No'}</Typography>
        <Button onClick={() => handleDeleteTradeGroup(group._id)}>Delete</Button>
        <Button onClick={() => handleUpdateTradeGroup({ ...group, name: 'Updated Name' })}>Update</Button>
      </CardContent>
    </Card>
  );
};

export default DroppableTradeGroupCard;
