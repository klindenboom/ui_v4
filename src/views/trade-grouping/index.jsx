import React, { useEffect, useState } from 'react';
import { getTradeGroups, getTradesWithoutGroupId, createTradeGroup, deleteTradeGroup, assignTradeToGroup, removeTradeFromGroup, updateTradeGroup } from '../../services/api';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/lab';
import DragDropContext from '../../components/DragDropContext';
import DraggableTradeCard from '../../components/DraggableTradeCard';
import DroppableTradeGroupCard from '../../components/DroppableTradeGroupCard';
import NewTradeGroupForm from '../../components/NewTradeGroupForm';
import TradeDetailDialog from '../../components/TradeDetailDialog';

const TradeGrouping = () => {
  const [tradeGroups, setTradeGroups] = useState([]);
  const [trades, setTrades] = useState([]);
  const [filteredTrades, setFilteredTrades] = useState([]);
  const [open, setOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedTradeGroup, setSelectedTradeGroup] = useState(null);
  const [editedTrade, setEditedTrade] = useState(null);
  const [underlyingSymbolFilter, setUnderlyingSymbolFilter] = useState('');
  const [underlyingTypeFilter, setUnderlyingTypeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState(null);

  const fetchTradeGroupsAndTrades = () => {
    getTradeGroups().then(setTradeGroups);
    getTradesWithoutGroupId().then(trades => {
      setTrades(trades);
      setFilteredTrades(trades);
    });
  };

  useEffect(() => {
    fetchTradeGroupsAndTrades();
  }, []);

  useEffect(() => {
    filterTrades();
  }, [underlyingSymbolFilter, underlyingTypeFilter, dateFilter]);

  const handleCreateTradeGroup = (tradeGroup) => {
    createTradeGroup(tradeGroup).then(newGroup => {
      setTradeGroups([...tradeGroups, newGroup]);
      fetchTradeGroupsAndTrades();
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

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    fetchTradeGroupsAndTrades();
    setOpen(false);
  };

  const handleDetailOpen = (group) => {
    setSelectedTradeGroup(group);
    setDetailOpen(true);
  };

  const handleDetailClose = () => {
    setDetailOpen(false);
    setSelectedTradeGroup(null);
  };

  const handleEditTrade = (trade) => {
    setEditedTrade(trade);
    // Handle trade edit logic here
  };

  const handleDeleteTrade = (tradeId) => {
    // Handle trade delete logic here
  };

  const filterTrades = () => {
    let filtered = trades;

    if (underlyingSymbolFilter) {
      filtered = filtered.filter(trade => trade.uiData.underlyingSymbol === underlyingSymbolFilter);
    }

    if (underlyingTypeFilter) {
      filtered = filtered.filter(trade => trade.uiData.underlyingType === underlyingTypeFilter);
    }

    if (dateFilter) {
      filtered = filtered.filter(trade => new Date(trade.uiData.timestamp).toLocaleDateString() === new Date(dateFilter).toLocaleDateString());
    }

    setFilteredTrades(filtered);
  };

  const uniqueUnderlyingSymbols = [...new Set(trades.map(trade => trade.uiData.underlyingSymbol))];
  const uniqueUnderlyingTypes = [...new Set(trades.map(trade => trade.uiData.underlyingType))];

  return (
    <DragDropContext>
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom>Trade Grouping</Typography>
          <Button variant="contained" color="primary" onClick={handleOpen}>Add New Trade Group</Button>
        </Box> */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Select
            value={underlyingSymbolFilter}
            onChange={(e) => setUnderlyingSymbolFilter(e.target.value)}
            displayEmpty
            fullWidth
          >
            <MenuItem value=""><em>All Symbols</em></MenuItem>
            {uniqueUnderlyingSymbols.map(symbol => (
              <MenuItem key={symbol} value={symbol}>{symbol}</MenuItem>
            ))}
          </Select>
          <Select
            value={underlyingTypeFilter}
            onChange={(e) => setUnderlyingTypeFilter(e.target.value)}
            displayEmpty
            fullWidth
          >
            <MenuItem value=""><em>All Types</em></MenuItem>
            {uniqueUnderlyingTypes.map(type => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
          <DatePicker
            label="Select Date"
            value={dateFilter}
            onChange={(newValue) => setDateFilter(newValue)}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Typography variant="h5">Trades</Typography>
            {filteredTrades.map(trade => (
              <DraggableTradeCard key={trade._id} trade={trade} handleDetailOpen={handleDetailOpen} handleEditTrade={handleEditTrade} handleDeleteTrade={handleDeleteTrade} />
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
                handleDetailOpen={handleDetailOpen}
              />
            ))}
          </Grid>
        </Grid>
      </Box>
      <NewTradeGroupForm open={open} handleClose={handleClose} />
      <TradeDetailDialog open={detailOpen} handleClose={handleDetailClose} tradeGroup={selectedTradeGroup} />
    </DragDropContext>
  );
};

export default TradeGrouping;
