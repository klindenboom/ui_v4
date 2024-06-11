import React, { useState, useEffect, useContext } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import SearchIcon from '@mui/icons-material/Search';
import NewTradeGroupForm from '../../components/NewTradeGroupForm';
import TradeDetailDialog from '../../components/TradeDetailDialog';
import { getTradeGroups, updateTradeGroup, createTradeGroup } from '../../services/api';
import { GlobalTradeDataContext } from 'contexts/GlobalTradeDataContext';
import DraggableTradeCard from '../../components/DraggableTradeCard';
import { calculateTotalPrice } from '../../utils/mappers';

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

const calculateOldestTradeDate = (tradeHistory) => {
  const oldestTrade = tradeHistory.reduce((oldest, trade) => {
    const tradeDate = new Date(trade.uiData.timestamp);
    return tradeDate < oldest ? tradeDate : oldest;
  }, new Date());

  return oldestTrade.toLocaleDateString();
};

const calculateMostRecentTradeDate = (tradeHistory) => {
  const mostRecentTrade = tradeHistory.reduce((mostRecent, trade) => {
    const tradeDate = new Date(trade.uiData.timestamp);
    return tradeDate > mostRecent ? tradeDate : mostRecent;
  }, new Date(0));

  return mostRecentTrade.toLocaleDateString();
};

const formatAsCurrency = (value) => {
  const formattedValue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
  return value < 0 ? `(${formattedValue.replace('-', '')})` : formattedValue;
};

const getPLColor = (value) => {
  return value < 0 ? 'red' : '#029688';
};

const OpenTrades = () => {
  const { accountSettings } = useContext(GlobalTradeDataContext);
  const [tradeGroups, setTradeGroups] = useState([]);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editedGroup, setEditedGroup] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [showClosed, setShowClosed] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedTradeGroup, setSelectedTradeGroup] = useState(null);
  const [tagFilter, setTagFilter] = useState([]);
  const [underlyingFilter, setUnderlyingFilter] = useState('AllUnderlyings');

  const fetchData = async () => {
    try {
      const tradeGroupsResponse = await getTradeGroups();
      setTradeGroups(tradeGroupsResponse);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleToggleClose = async (group) => {
    const updatedGroup = { ...group, isClosed: !group.isClosed };
    try {
      await updateTradeGroup(updatedGroup);
      setTradeGroups(tradeGroups.map(g => g._id === group._id ? updatedGroup : g));
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    fetchData();
    setOpen(false);
  };

  const toggleShowClosed = (event) => {
    setShowClosed(event.target.value === 'closed');
  };

  const handleDetailOpen = (group) => {
    setSelectedTradeGroup(group);
    setDetailOpen(true);
  };

  const handleDetailClose = () => {
    setDetailOpen(false);
    setSelectedTradeGroup(null);
  };

  const handleTagChange = (event) => {
    setTagFilter(event.target.value);
  };

  const handleClearTags = () => {
    setTagFilter([]);
  };

  const uniqueUnderlyings = [...new Set(tradeGroups.map(group => group.underlying))].sort();

  const filteredTradeGroups = tradeGroups.filter(group => {
    const matchesTagFilter = tagFilter.length === 0 || (group.tags && group.tags.some(tag => tagFilter.includes(tag)));
    const matchesUnderlyingFilter = !underlyingFilter || underlyingFilter === 'AllUnderlyings' || group.underlying === underlyingFilter;
    return (showClosed ? group.isClosed : !group.isClosed) && matchesTagFilter && matchesUnderlyingFilter;
  });

  return (
    <Container maxWidth={false} sx={{ width: '100%', padding: 0 }}>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl sx={{ width: 200 }}>
              <InputLabel>Show Trades</InputLabel>
              <Select
                value={showClosed ? 'closed' : 'open'}
                onChange={toggleShowClosed}
                input={<OutlinedInput label="Show Trades" />}
              >
                <MenuItem value="open">Open Trades</MenuItem>
                <MenuItem value="closed">Closed Trades</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ width: 200 }}>
              <InputLabel>Filter by Underlying</InputLabel>
              <Select
                value={underlyingFilter}
                onChange={(e) => setUnderlyingFilter(e.target.value)}
                input={<OutlinedInput label="Filter by Underlying" />}
              >
                <MenuItem key={'AllUnderlyings'} value={'AllUnderlyings'}>
                  <em>All Underlyings</em>
                </MenuItem>
                {uniqueUnderlyings.map((underlying) => (
                  <MenuItem key={underlying} value={underlying}>
                    {underlying}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ width: 300 }}>
              <InputLabel>Tags</InputLabel>
              <Select
                multiple
                value={tagFilter}
                onChange={handleTagChange}
                input={<OutlinedInput label="Tags" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.length > 0 ? selected.map((value) => (
                      <Chip
                        key={value}
                        label={value}
                        size="small"
                        onDelete={() => setTagFilter(prev => prev.filter(tag => tag !== value))}
                        sx={{ height: 24 }}
                      />
                    )) : <Chip label="All Tags" size="small" sx={{ height: 24 }} />}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {accountSettings?.tags?.map((tag) => (
                  <MenuItem key={tag} value={tag}>
                    {tag}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {tagFilter.length > 0 && (
              <Tooltip title="Clear All Tags">
                <IconButton
                  color="secondary"
                  onClick={handleClearTags}
                  sx={{
                    color: '#009688',
                    width: '48px',
                    height: '48px',
                  }}
                >
                  <CloseIcon sx={{ fontSize: '32px' }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
          <Tooltip title="Add New Trade Group">
            <IconButton
              color="primary"
              onClick={handleOpen}
              sx={{
                color: '#009688',
                width: '48px',
                height: '48px',
              }}
            >
              <AddIcon sx={{ fontSize: '32px' }} />
            </IconButton>
          </Tooltip>
        </Box>
        {tradeGroups.length > 0 ? (
          <Grid container spacing={2}>
            {filteredTradeGroups.map((group, index) => (
              <Grid item xs={12} md={6} key={index} sx={{ paddingBottom: '16px' }}>
                <Card sx={{ margin: 0 }}>
                  <CardContent sx={{ padding: '8px', '&:last-child': { paddingBottom: '8px' } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {editedGroup && editedGroup._id === group._id ? (
                        <TextField
                          name="name"
                          value={editedGroup.name || group.name}
                          onChange={handleChange}
                          variant="outlined"
                          size="small"
                          sx={{ flexGrow: 1 }}
                        />
                      ) : (
                        <Typography
                          variant="h4"
                          component="div"
                          sx={{
                            color: group.isClosed ? '#8d8b8b' : '#029688',
                            fontSize: '1.5rem'
                          }}
                          onClick={() => handleEdit(group)}
                        >
                          {group.name}
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ paddingLeft: '6px' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">
                          Underlying:
                        </Typography>
                        <Typography variant="body2" sx={{ textAlign: 'right' }}>
                          {group.underlying}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="textSecondary">
                          Open Date:
                        </Typography>
                        <Typography variant="body2" sx={{ textAlign: 'right' }}>
                          {calculateOldestTradeDate(group.tradeHistory)}
                        </Typography>
                      </Box>
                      {group.tradeHistory.length > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="textSecondary">
                            Last Trade Date:
                          </Typography>
                          <Typography variant="body2" sx={{ textAlign: 'right' }}>
                            {calculateMostRecentTradeDate(group.tradeHistory)}
                          </Typography>
                        </Box>
                      )}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="textSecondary">
                          Number of Trades:
                        </Typography>
                        <Typography variant="body2" sx={{ textAlign: 'right' }}>
                          {group.tradeHistory.length}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="textSecondary">
                          Total P/L:
                        </Typography>
                        <Typography variant="body2" sx={{ textAlign: 'right', color: getPLColor(calculateTotalPrice(group)) }}>
                          {formatAsCurrency(calculateTotalPrice(group))}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 2 }}>
                        {group.tags.map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            onDelete={() => handleRemoveTag(group, tag)}
                            size="small"
                            sx={{ backgroundColor: tag === 'Closed' ? '#8d8b8b' : '#029688', color: 'white', height: 24 }}
                          />
                        ))}
                        {group.isClosed && (
                          <Chip
                            label="Closed"
                            size="small"
                            sx={{ backgroundColor: '#8d8b8b', color: 'white', height: 24 }}
                          />
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 1 }}>
                    <Tooltip title="View Details">
                      <IconButton color="inherit" onClick={() => handleDetailOpen(group)}>
                        <SearchIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={group.isClosed ? "Reopen Trade" : "Close Trade"}>
                      <IconButton aria-label="close" onClick={() => handleToggleClose(group)}>
                        {group.isClosed ? <OpenInNewIcon /> : <CloseIcon />}
                      </IconButton>
                    </Tooltip>
                    {editedGroup && editedGroup._id === group._id && (
                      <>
                        <IconButton
                          color="primary"
                          onClick={() => handleSave(editedGroup)}
                          disabled={!hasChanges}
                        >
                          <SaveIcon />
                        </IconButton>
                        <IconButton
                          color="secondary"
                          onClick={handleUndo}
                        >
                          <UndoIcon />
                        </IconButton>
                      </>
                    )}
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography>Loading...</Typography>
        )}
      </Box>
      <NewTradeGroupForm
        open={open}
        handleClose={handleClose}
        availableTags={accountSettings?.tags}
        handleAddTag={(newTag) => setAccountSettingsState((prevSettings) => ({
          ...prevSettings,
          tags: [...prevSettings.tags, newTag]
        }))}
        createTradeGroup={async (group) => {
          await createTradeGroup(group);
          fetchData();
        }}
      />
      <TradeDetailDialog open={detailOpen} handleClose={handleDetailClose} tradeGroup={selectedTradeGroup} />
    </Container>
  );
};

export default OpenTrades;
