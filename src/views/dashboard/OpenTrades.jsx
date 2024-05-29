import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SaveIcon from '@mui/icons-material/Save';
import UndoIcon from '@mui/icons-material/Undo';
import SearchIcon from '@mui/icons-material/Search';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import AddIcon from '@mui/icons-material/Add';
import NewTradeGroupForm from '../../components/NewTradeGroupForm';
import TradeFormControls from '../../components/TradeFormControls';
import TradeDetailDialog from '../../components/TradeDetailDialog';
import { getTradeGroups, updateTradeGroup, createTradeGroup } from '../../services/api';

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

const OpenTrades = () => {
  const [tradeGroups, setTradeGroups] = useState([]);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editedGroup, setEditedGroup] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [showClosed, setShowClosed] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedTradeGroup, setSelectedTradeGroup] = useState(null);
  const [availableTags, setAvailableTags] = useState([]);
  const [tagFilter, setTagFilter] = useState([]);
  const [underlyingFilter, setUnderlyingFilter] = useState('AllUnderlyings');

  const fetchData = async () => {
    try {
      const tradeGroupsResponse = await getTradeGroups();
      setTradeGroups(tradeGroupsResponse);
      setAvailableTags([...new Set(tradeGroupsResponse.flatMap(group => group.tags || []))]);
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

  const calculateTotalPL = (group) => {
    return group.tradeHistory.reduce((total, trade) => {
      return total + trade.uiData.legs.reduce((legTotal, leg) => {
        return legTotal + leg.fills.reduce((fillTotal, fill) => {
          return fillTotal + (fill.fillCount * fill.price);
        }, 0);
      }, 0);
    }, 0);
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

  const handleToggleClose = async (group) => {
    const updatedGroup = { ...group, isClosed: !group.isClosed };
    try {
      await updateTradeGroup(updatedGroup);
      setTradeGroups(tradeGroups.map(g => g._id === group._id ? updatedGroup : g));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (group) => {
    setEditedGroup(group);
    setHasChanges(false);
  };

  const handleSave = async (group) => {
    try {
      await updateTradeGroup(group);
      setTradeGroups(tradeGroups.map(g => g._id === group._id ? group : g));
      setEditedGroup(null);
      setHasChanges(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUndo = () => {
    setEditedGroup(null);
    setHasChanges(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedGroup(prevState => ({ ...prevState, [name]: value }));
    setHasChanges(true);
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

  const handleAddTag = (newTag) => {
    setAvailableTags((prevTags) => [...prevTags, newTag]);
  };

  const handleClearTags = () => {
    setTagFilter([]);
  };

  const uniqueUnderlyings = [...new Set(tradeGroups.map(group => group.underlying))].sort();

  const handleRemoveTag = async (group, tagToRemove) => {
    const updatedTags = group.tags.filter(tag => tag !== tagToRemove);
    const updatedGroup = { ...group, tags: updatedTags };
    try {
      await updateTradeGroup(updatedGroup);
      setTradeGroups(tradeGroups.map(g => g._id === group._id ? updatedGroup : g));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTradeGroups = tradeGroups.filter(group => {
    const matchesTagFilter = tagFilter.length === 0 || (group.tags && group.tags.some(tag => tagFilter.includes(tag)));
    const matchesUnderlyingFilter = !underlyingFilter ||  underlyingFilter === 'AllUnderlyings' || group.underlying === underlyingFilter;
    return group.isClosed === showClosed && matchesTagFilter && matchesUnderlyingFilter;
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
                {availableTags.map((tag) => (
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
          <Grid container spacing={3}>
            {filteredTradeGroups.map((group, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card>
                  <CardContent>
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
                            fontSize: '1.75rem'
                          }}
                          onClick={() => handleEdit(group)}
                        >
                          {group.name}
                        </Typography>
                      )}
                      {group.isClosed && (
                        <Chip
                          label="Closed"
                          color="secondary"
                          size="small"
                          sx={{ marginLeft: 1, color: '#4d4d4d' }}
                        />
                      )}
                    </Box>
                    <Divider sx={{ mt: 0, mb: '12px', borderColor: '#029688' }} />
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
                          {new Date(group.openDate).toLocaleDateString()}
                        </Typography>
                      </Box>
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
                        <Typography variant="body2" sx={{ textAlign: 'right', color: getPLColor(calculateTotalPL(group)) }}>
                          {formatAsCurrency(calculateTotalPL(group))}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 2 }}>
                        {group.tags.map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            onDelete={() => handleRemoveTag(group, tag)}
                            size="small"
                            sx={{ backgroundColor: '#029688', color: 'white', height: 24 }}
                          />
                        ))}
                      </Box>
                      <Box sx={{ mt: 2 }}>
                        <TradeFormControls
                          strategyValue={editedGroup && editedGroup._id === group._id ? editedGroup.type : group.type}
                          categoryValue={editedGroup && editedGroup._id === group._id ? editedGroup.category : group.category}
                          onChange={handleChange}
                          handleEdit={() => handleEdit(group)}
                        />
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
        availableTags={availableTags}
        handleAddTag={handleAddTag}
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
