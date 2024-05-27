import React, { useEffect, useState } from 'react';
import {
  getTradeGroups,
  getTradesWithoutGroupId,
  createTradeGroup,
  deleteTradeGroup,
  assignTradeToGroup,
  removeTradeFromGroup,
  updateTradeGroup
} from '../../services/api';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';
import DraggableTradeCard from '../../components/DraggableTradeCard';
import NewTradeGroupForm from '../../components/NewTradeGroupForm';
import TradeDetailDialog from '../../components/TradeDetailDialog';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import Chip from '@mui/material/Chip';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

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
  const [availableTags, setAvailableTags] = useState([]);
  const [tagFilter, setTagFilter] = useState([]);

  const greenColor = '#009688';

  const fetchTradeGroupsAndTrades = async () => {
    const [tradeGroups, trades] = await Promise.all([
      getTradeGroups(),
      getTradesWithoutGroupId()
    ]);
    setTradeGroups(tradeGroups);
    setTrades(trades);
    setAvailableTags([...new Set(tradeGroups.flatMap(group => group.tags || []))]); // Set available tags
    setFilteredTrades(filterTrades(trades, underlyingSymbolFilter, underlyingTypeFilter, dateFilter, tagFilter));
  };

  useEffect(() => {
    fetchTradeGroupsAndTrades();
  }, []);

  useEffect(() => {
    setFilteredTrades(filterTrades(trades, underlyingSymbolFilter, underlyingTypeFilter, dateFilter, tagFilter));
  }, [underlyingSymbolFilter, underlyingTypeFilter, dateFilter, tagFilter, trades]);

  const handleCreateTradeGroup = async (tradeGroup) => {
    const newGroup = await createTradeGroup(tradeGroup);
    setTradeGroups(prevGroups => [...prevGroups, newGroup]);
    setOpen(false);
    await fetchTradeGroupsAndTrades(); // Ensure the state updates with new data
  };

  const handleDeleteTradeGroup = async (groupId) => {
    await deleteTradeGroup(groupId);
    setTradeGroups(tradeGroups.filter(group => group._id !== groupId));
  };

  const handleAssignTradeToGroup = async (groupId, tradeId) => {
    await assignTradeToGroup(groupId, tradeId);
    await fetchTradeGroupsAndTrades();
  };

  const handleRemoveTradeFromGroup = async (groupId, tradeId) => {
    await removeTradeFromGroup(groupId, tradeId);
    await fetchTradeGroupsAndTrades();
  };

  const handleUpdateTradeGroup = async (tradeGroup) => {
    const updatedGroup = await updateTradeGroup(tradeGroup);
    setTradeGroups(tradeGroups.map(group => group._id === updatedGroup._id ? updatedGroup : group));
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
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

  const filterTrades = (trades, symbolFilter, typeFilter, dateFilter, tagFilter) => {
    let filtered = trades;

    if (symbolFilter) {
      filtered = filtered.filter(trade => trade.uiData.underlyingSymbol === symbolFilter);
    }

    if (typeFilter) {
      filtered = filtered.filter(trade => trade.uiData.underlyingType === typeFilter);
    }

    if (dateFilter) {
      filtered = filtered.filter(trade => new Date(trade.uiData.timestamp).toLocaleDateString() === new Date(dateFilter).toLocaleDateString());
    }

    if (tagFilter.length > 0) {
      filtered = filtered.filter(trade => trade.tags && tagFilter.every(tag => trade.tags.includes(tag)));
    }

    return filtered;
  };

  const handleTagChange = (event) => {
    setTagFilter(event.target.value);
  };

  const handleAddTag = (newTag) => {
    setAvailableTags((prevTags) => [...prevTags, newTag]);
  };

  const uniqueUnderlyingSymbols = [...new Set(trades.map(trade => trade.uiData.underlyingSymbol))].sort();
  const uniqueUnderlyingTypes = [...new Set(trades.map(trade => trade.uiData.underlyingType))];

  return (
    <Box sx={{ flexGrow: 1, padding: 0 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1, width: '100%', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Select
            sx={{ width: '200px' }}
            value={underlyingSymbolFilter}
            onChange={(e) => setUnderlyingSymbolFilter(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">
              <em>All Symbols</em>
            </MenuItem>
            {uniqueUnderlyingSymbols.map((symbol) => (
              <MenuItem key={symbol} value={symbol}>
                {symbol}
              </MenuItem>
            ))}
          </Select>
          <Select
            sx={{ width: '200px' }}
            value={underlyingTypeFilter}
            onChange={(e) => setUnderlyingTypeFilter(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">
              <em>All Types</em>
            </MenuItem>
            {uniqueUnderlyingTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <DatePicker
            selected={dateFilter}
            onChange={(date) => setDateFilter(date)}
            isClearable
            customInput={<TextField label="Select Date" fullWidth />}
          />
          <Tooltip title="Add New Trade Group">
            <IconButton
              color="primary"
              onClick={handleOpen}
              sx={{
                color: greenColor,
                width: '48px',
                height: '48px',
              }}
            >
              <AddIcon sx={{ fontSize: '32px' }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      {/* <FormControl sx={{ width: 300, marginBottom: 2 }}>
        <InputLabel>Tags</InputLabel>
        <Select
          multiple
          value={tagFilter}
          onChange={handleTagChange}
          input={<OutlinedInput label="Tags" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.length > 0 ? selected.map((value) => (
                <Chip key={value} label={value} />
              )) : <Chip label="All Tags" />}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {availableTags.map((tag) => (
            <MenuItem key={tag} value={tag}>
              {tag}
            </MenuItem>
          ))}
        </Select>
      </FormControl> */}
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid white' }}>
            <Typography variant="subtitle1" color={greenColor} sx={{ flex: 1, textAlign: 'left' }}>Symbol</Typography>
            <Typography variant="subtitle1" color={greenColor} sx={{ flex: 1, textAlign: 'left' }}>Date</Typography>
            <Typography variant="subtitle1" color={greenColor} sx={{ flex: 1, textAlign: 'left' }}>Count</Typography>
            <Typography variant="subtitle1" color={greenColor} sx={{ flex: 1, textAlign: 'left' }}>Total Price</Typography>
            <Typography variant="subtitle1" color={greenColor} sx={{ flex: 1, textAlign: 'left' }}>Group</Typography>
          </Box>
          {filteredTrades.map((trade) => (
            <DraggableTradeCard
              key={trade._id}
              trade={trade}
              tradeGroups={tradeGroups}
              handleAssignTradeToGroup={handleAssignTradeToGroup}
              handleDetailOpen={handleDetailOpen}
              handleEditTrade={handleEditTrade}
              handleDeleteTrade={handleDeleteTrade}
              sx={{ width: '100%', marginBottom: 1 }}
            />
          ))}
        </Grid>
      </Grid>
      <NewTradeGroupForm
        open={open}
        handleClose={handleClose}
        availableTags={availableTags}
        handleAddTag={handleAddTag}
        createTradeGroup={handleCreateTradeGroup} // Pass the handleCreateTradeGroup to the form
      />
      <TradeDetailDialog
        open={detailOpen}
        handleClose={handleDetailClose}
        tradeGroup={selectedTradeGroup}
      />
    </Box>
  );
};

export default TradeGrouping;
