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
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import NewTradeGroupForm from '../../components/NewTradeGroupForm'; // Adjust path as necessary
import TradeFormControls from '../../components/TradeFormControls'; // Import TradeFormControls
import TradeDetailDialog from '../../components/TradeDetailDialog'; // Import the new TradeDetailDialog component

import { getTradeGroups, updateTradeGroup } from '../../services/api'; // Assuming there's an API function to get and update trade groups

const OpenTrades = () => {
    const [tradeGroups, setTradeGroups] = useState([]);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [editedGroup, setEditedGroup] = useState(null);
    const [hasChanges, setHasChanges] = useState(false); // Track changes
    const [showClosed, setShowClosed] = useState(false); // Track whether to show closed trades
    const [detailOpen, setDetailOpen] = useState(false); // State to manage the Trade Detail Dialog
    const [selectedTradeGroup, setSelectedTradeGroup] = useState(null); // State to store selected trade group data

    const fetchData = async () => {
        try {
            const tradeGroupsResponse = await getTradeGroups(); // Fetch trade groups
            setTradeGroups(tradeGroupsResponse); // Adjust based on the actual response structure
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
            await updateTradeGroup(updatedGroup); // Update the trade group
            setTradeGroups(tradeGroups.map(g => g._id === group._id ? updatedGroup : g)); // Update state
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (group) => {
        setEditedGroup(group);
        setHasChanges(false); // Reset change tracking
    };

    const handleSave = async (group) => {
        try {
            await updateTradeGroup(group); // Update the trade group
            setTradeGroups(tradeGroups.map(g => g._id === group._id ? group : g)); // Update state
            setEditedGroup(null);
            setHasChanges(false); // Reset change tracking
        } catch (err) {
            console.error(err);
        }
    };

    const handleUndo = () => {
        setEditedGroup(null);
        setHasChanges(false); // Reset change tracking
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedGroup(prevState => ({ ...prevState, [name]: value }));
        setHasChanges(true); // Set change tracking
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        fetchData();
        setOpen(false);
    };

    const toggleShowClosed = () => {
        setShowClosed(prev => !prev);
    };

    const handleDetailOpen = (group) => {
        setSelectedTradeGroup(group);
        setDetailOpen(true);
    };

    const handleDetailClose = () => {
        setDetailOpen(false);
        setSelectedTradeGroup(null);
    };

    return (
        <Container maxWidth={false} sx={{ width: '100%', padding: 0 }}>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Button variant="contained" color="secondary" onClick={toggleShowClosed}>
                        {showClosed ? 'Show Open Trades' : 'Show Closed Trades'}
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleOpen}>
                        Add New Trade Group
                    </Button>
                </Box>
                {tradeGroups.length > 0 ? (
                    <Grid container spacing={3}>
                        {tradeGroups.filter(group => group.isClosed === showClosed).map((group, index) => (
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
                                            <Box sx={{ mt: 2 }}>
                                                <TradeFormControls 
                                                    strategyValue={editedGroup && editedGroup._id === group._id ? editedGroup.type : group.type} 
                                                    categoryValue={editedGroup && editedGroup._id === group._id ? editedGroup.category : group.category} 
                                                    onChange={handleChange}
                                                    handleEdit={() => handleEdit(group)} // Pass handleEdit
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
                                                    disabled={!hasChanges} // Disable button if no changes
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
            <NewTradeGroupForm open={open} handleClose={handleClose} />
            <TradeDetailDialog open={detailOpen} handleClose={handleDetailClose} tradeGroup={selectedTradeGroup} />
        </Container>
    );
};

export default OpenTrades;
