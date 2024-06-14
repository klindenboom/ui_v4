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
import { parseTradeData } from '../../utils/mappers';
import 'react-datepicker/dist/react-datepicker.css';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import Chip from '@mui/material/Chip';
import Checkbox from '@mui/material/Checkbox';

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
  const [selectedTrades, setSelectedTrades] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

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

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedTrades([]);
    } else {
      setSelectedTrades(filteredTrades.map(trade => trade._id));
    }
    setSelectAll(!selectAll);
  };

  const handleTradeSelect = (tradeId) => {
    setSelectedTrades(prevSelected =>
      prevSelected.includes(tradeId)
        ? prevSelected.filter(id => id !== tradeId)
        : [...prevSelected, tradeId]
    );
  };

  const handleAssignSelectedToGroup = async (groupId) => {
    await Promise.all(selectedTrades.map(tradeId => assignTradeToGroup(groupId, tradeId)));
    await fetchTradeGroupsAndTrades();
    setSelectedTrades([]);
    setSelectAll(false);
  };

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
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox checked={selectAll} onChange={handleSelectAll} />
            <Typography>Select All</Typography>
          </Box>
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
      {(selectAll || selectedTrades.length > 0) && (
        <Box sx={{ marginBottom: 2 }}>
          <Select
            sx={{ width: '200px' }}
            defaultValue=""
            onChange={(e) => handleAssignSelectedToGroup(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">
              <em>Assign Selected to Group</em>
            </MenuItem>
            {tradeGroups.map((group) => (
              <MenuItem key={group._id} value={group._id}>
                {group.name}
              </MenuItem>
            ))}
          </Select>
        </Box>
      )}
      <Grid container spacing={1}>
        <Grid item xs={12} sx={{ width: '100%' }}>
          {filteredTrades.map((trade) => (
            <Box key={trade._id} sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <DraggableTradeCard
                trade={trade}
                tradeGroups={tradeGroups}
                handleAssignTradeToGroup={handleAssignTradeToGroup}
                handleDetailOpen={handleDetailOpen}
                handleEditTrade={handleEditTrade}
                handleDeleteTrade={handleDeleteTrade}
                tradeStrings={parseTradeData(trade)}
                sx={{ flex: 1, marginBottom: 1, width: '100%' }}
              />
              <Checkbox
                checked={selectedTrades.includes(trade._id)}
                onChange={() => handleTradeSelect(trade._id)}
              />
            </Box>
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
