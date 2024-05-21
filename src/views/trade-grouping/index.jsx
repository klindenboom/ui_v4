// src/views/trade-grouping/index.jsx

import React, { useEffect, useState } from 'react';
import { getTradeGroups, getTradesWithoutGroupId, createTradeGroup, deleteTradeGroup, assignTradeToGroup, removeTradeFromGroup, updateTradeGroup } from '../../services/api';
import Box from '@mui/material/Box'; 
import Card from '@mui/material/Card'; 
import Grid from '@mui/material/Grid'; 
import CardContent from '@mui/material/CardContent'; 
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import DragDropContext from '../../components/DragDropContext';
import DraggableTradeCard from '../../components/DraggableTradeCard';
import DroppableTradeGroupCard from '../../components/DroppableTradeGroupCard';

const TradeGrouping = () => {
  const [tradeGroups, setTradeGroups] = useState([]);
  const [trades, setTrades] = useState([]);

  const fetchTradeGroupsAndTrades = () => {
    getTradeGroups().then(setTradeGroups);
    getTradesWithoutGroupId().then(setTrades);
  };

  useEffect(() => {
    // Fetch trade groups and trades on component mount
    fetchTradeGroupsAndTrades();
  }, []);

  const handleCreateTradeGroup = (tradeGroup) => {
    createTradeGroup(tradeGroup).then(newGroup => {
      setTradeGroups([...tradeGroups, newGroup]);
    });
  };

  const handleDeleteTradeGroup = (groupId) => {
    deleteTradeGroup(groupId).then(() => {
      setTradeGroups(tradeGroups.filter(group => group._id !== groupId));
    });
  };

  const handleAssignTradeToGroup = (groupId, tradeId) => {
    assignTradeToGroup(groupId, tradeId).then(() => {
        fetchTradeGroupsAndTrades();
      });
  };

  const handleRemoveTradeFromGroup = (groupId, tradeId) => {
    removeTradeFromGroup(groupId, tradeId).then(() => {
        fetchTradeGroupsAndTrades();
    });
  };

  const handleUpdateTradeGroup = (tradeGroup) => {
    updateTradeGroup(tradeGroup).then(updatedGroup => {
      setTradeGroups(tradeGroups.map(group => group._id === updatedGroup._id ? updatedGroup : group));
    });
  };

  return (
    <DragDropContext>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h4" gutterBottom>Trade Grouping</Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Typography variant="h5">Trades</Typography>
            {trades.map(trade => (
              <DraggableTradeCard key={trade._id} trade={trade} />
            ))}
          </Grid>
          <Grid item xs={8}>
            <Typography variant="h5">Trade Groups</Typography>
            {tradeGroups.map(group => (
              <DroppableTradeGroupCard
                key={group._id}
                group={group}
                handleAssignTradeToGroup={handleAssignTradeToGroup}
                handleDeleteTradeGroup={handleDeleteTradeGroup}
                handleUpdateTradeGroup={handleUpdateTradeGroup}
              />
            ))}
          </Grid>
        </Grid>
      </Box>
    </DragDropContext>
  );
};

export default TradeGrouping;
