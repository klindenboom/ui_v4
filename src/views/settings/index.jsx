import React, { useContext, useEffect, useState } from 'react';
// material-ui
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Snackbar from '@mui/material/Snackbar';
import Divider from '@mui/material/Divider';

// project imports
import JWTContext from 'contexts/JWTContext';
import { GlobalTradeDataContext } from 'contexts/GlobalTradeDataContext'; // Import the context
import { getAccountSettings } from 'services/api'; // Import the API function

// ==============================|| SETTINGS PAGE ||============================== //

const Settings = () => {
    const { user } = useContext(JWTContext);
    const { accountSettings, setAccountSettingsState, originalSettings, saveAccountSettings } = useContext(GlobalTradeDataContext);
    const [buyingPower, setBuyingPower] = useState(accountSettings?.buyingPowerTarget || 50);
    const [startingAccountValue, setStartingAccountValue] = useState(accountSettings?.startingAccountValue || '');
    const [categories, setCategories] = useState(accountSettings?.categories || []);
    const [strategies, setStrategies] = useState(accountSettings?.strategies || []);
    const [tags, setTags] = useState(accountSettings?.tags || []);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryValue, setNewCategoryValue] = useState('');
    const [newStrategyName, setNewStrategyName] = useState('');
    const [newStrategyValue, setNewStrategyValue] = useState('');
    const [newTag, setNewTag] = useState('');
    const [maxSPExposure, setMaxSPExposure] = useState(accountSettings?.buyingPowerSP500Target || 50);
    const [minSPExposure, setMinSPExposure] = useState(accountSettings?.buyingPowerSP500Target || 0);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [changesMade, setChangesMade] = useState(false);

    useEffect(() => {
        const fetchAccountSettings = async () => {
            if (user) {
                const settings = await getAccountSettings(user.id);
                const accountSettings = settings[0]; // Assuming settings is an array with one element
                setAccountSettingsState(accountSettings);
                setBuyingPower(accountSettings.buyingPowerTarget || 50);
                setStartingAccountValue(accountSettings.startingAccountValue || '');
                setCategories(accountSettings.categories || []);
                setStrategies(accountSettings.strategies || []);
                setTags(accountSettings.tags || []);
                setMaxSPExposure(accountSettings.buyingPowerSP500Target || 50);
                setMinSPExposure(accountSettings.buyingPowerSP500Target || 0);
            }
        };

        fetchAccountSettings();
    }, [user]);

    const handleBuyingPowerChange = (event, newValue) => {
        setBuyingPower(100 - newValue);
        setChangesMade(true);
    };

    const handleMaxSPExposureChange = (event, newValue) => {
        setMaxSPExposure(100 - newValue);
        setChangesMade(true);
    };

    const handleMinSPExposureChange = (event, newValue) => {
        setMinSPExposure(100 - newValue);
        setChangesMade(true);
    };

    const handleAddCategory = () => {
        if (!newCategoryName || !newCategoryValue) {
            setSnackbarMessage('Both category name and value are required');
            setSnackbarOpen(true);
            return;
        }
        const updatedCategories = [...categories, { name: newCategoryName, value: newCategoryValue }];
        setCategories(updatedCategories);
        setNewCategoryName('');
        setNewCategoryValue('');
        setChangesMade(true);
    };

    const handleAddStrategy = () => {
        if (!newStrategyName || !newStrategyValue) {
            setSnackbarMessage('Both strategy name and value are required');
            setSnackbarOpen(true);
            return;
        }
        const updatedStrategies = [...strategies, { name: newStrategyName, value: newStrategyValue }];
        setStrategies(updatedStrategies);
        setNewStrategyName('');
        setNewStrategyValue('');
        setChangesMade(true);
    };

    const handleAddTag = () => {
        const updatedTags = [...tags, newTag];
        setTags(updatedTags);
        setNewTag('');
        setChangesMade(true);
    };

    const handleDeleteCategory = (categoryToDelete) => {
        const updatedCategories = categories.filter((category) => category.name !== categoryToDelete);
        setCategories(updatedCategories);
        setChangesMade(true);
    };

    const handleDeleteStrategy = (strategyToDelete) => {
        const updatedStrategies = strategies.filter((strategy) => strategy.name !== strategyToDelete);
        setStrategies(updatedStrategies);
        setChangesMade(true);
    };

    const handleDeleteTag = (tagToDelete) => {
        const updatedTags = tags.filter((tag) => tag !== tagToDelete);
        setTags(updatedTags);
        setChangesMade(true);
    };

    const handleSave = async () => {
        const updatedSettings = {
            ...accountSettings,
            startingAccountValue,
            buyingPowerTarget: buyingPower,
            buyingPowerSP500Target: maxSPExposure,
            categories,
            strategies,
            tags
        };
        await saveAccountSettings(updatedSettings);
        setSnackbarMessage('Settings saved');
        setSnackbarOpen(true);
        setChangesMade(false);
    };

    const handleUndo = () => {
        setAccountSettingsState(originalSettings);
        setBuyingPower(originalSettings.buyingPowerTarget || 50);
        setStartingAccountValue(originalSettings.startingAccountValue || '');
        setCategories(originalSettings.categories || []);
        setStrategies(originalSettings.strategies || []);
        setTags(originalSettings.tags || []);
        setMaxSPExposure(originalSettings.buyingPowerSP500Target || 50);
        setMinSPExposure(originalSettings.buyingPowerSP500Target || 0);
        setChangesMade(false);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Box sx={{ flexGrow: 1, padding: 3 }}>
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                        label="Year Starting Balance"
                        value={startingAccountValue}
                        onChange={(e) => {
                            setStartingAccountValue(e.target.value);
                            setChangesMade(true);
                        }}
                        variant="outlined"
                        fullWidth
                        sx={{ mr: 2 }}
                    />
                </Box>
            </Box>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold', flex: 1 }}>
                    Target Buying Power Usage
                </Typography>
                <Slider
                    value={100 - buyingPower}
                    onChange={handleBuyingPowerChange}
                    aria-labelledby="buying-power-usage-slider"
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => 100 - value}
                    step={1}
                    marks
                    min={1}
                    max={100}
                    sx={{
                        mr: 2,
                        color: 'green',
                        '& .MuiSlider-thumb': {
                            bgcolor: 'primary.main'
                        },
                        '& .MuiSlider-track': {
                            bgcolor: 'primary.main'
                        },
                        '& .MuiSlider-rail': {
                            bgcolor: 'primary.light'
                        },
                        flex: 3
                    }}
                />
                <TextField
                    label="Target Buying Power Usage (%)"
                    value={buyingPower}
                    variant="outlined"
                    InputProps={{
                        readOnly: true,
                    }}
                    sx={{ width: 80, mr: 2, flex: 1 }}
                />
            </Box>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold', flex: 1 }}>
                    Target Max S&P Exposure
                </Typography>
                <Slider
                    value={100 - maxSPExposure}
                    onChange={handleMaxSPExposureChange}
                    aria-labelledby="max-sp-exposure-slider"
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => 100 - value}
                    step={1}
                    marks
                    min={0}
                    max={100}
                    sx={{
                        mr: 2,
                        color: 'green',
                        '& .MuiSlider-thumb': {
                            bgcolor: 'primary.main'
                        },
                        '& .MuiSlider-track': {
                            bgcolor: 'primary.main'
                        },
                        '& .MuiSlider-rail': {
                            bgcolor: 'primary.light'
                        },
                        flex: 3
                    }}
                />
                <TextField
                    label="Target Max S&P Exposure (%)"
                    value={maxSPExposure}
                    variant="outlined"
                    InputProps={{
                        readOnly: true,
                    }}
                    sx={{ width: 80, mr: 2, flex: 1 }}
                />
            </Box>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold', flex: 1 }}>
                    Target Min S&P Exposure
                </Typography>
                <Slider
                    value={100 - minSPExposure}
                    onChange={handleMinSPExposureChange}
                    aria-labelledby="min-sp-exposure-slider"
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => 100 - value}
                    step={1}
                    marks
                    min={0}
                    max={100}
                    sx={{
                        mr: 2,
                        color: 'green',
                        '& .MuiSlider-thumb': {
                            bgcolor: 'primary.main'
                        },
                        '& .MuiSlider-track': {
                            bgcolor: 'primary.main'
                        },
                        '& .MuiSlider-rail': {
                            bgcolor: 'primary.light'
                        },
                        flex: 3
                    }}
                />
                <TextField
                    label="Target Min S&P Exposure (%)"
                    value={minSPExposure}
                    variant="outlined"
                    InputProps={{
                        readOnly: true,
                    }}
                    sx={{ width: 80, mr: 2, flex: 1 }}
                />
            </Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>
                    Categories
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                    <TextField
                        label="Category Name"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        variant="outlined"
                        sx={{ mr: 2, maxWidth: 300 }}
                    />
                    <TextField
                        label="Category Value"
                        value={newCategoryValue}
                        onChange={(e) => setNewCategoryValue(e.target.value)}
                        variant="outlined"
                        sx={{ mr: 2, maxWidth: 300 }}
                    />
                    <Button variant="contained" onClick={handleAddCategory} sx={{ mr: 2, maxWidth: 100 }}>
                        Add
                    </Button>
                    {categories.map((category, index) => (
                        <Chip
                            key={index}
                            label={category.name}
                            onDelete={() => handleDeleteCategory(category.name)}
                            color="primary"
                            sx={{ m: 0.5 }}
                        />
                    ))}
                </Box>
            </Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>
                    Strategies
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                    <TextField
                        label="Strategy Name"
                        value={newStrategyName}
                        onChange={(e) => setNewStrategyName(e.target.value)}
                        variant="outlined"
                        sx={{ mr: 2, maxWidth: 300 }}
                    />
                    <TextField
                        label="Strategy Value"
                        value={newStrategyValue}
                        onChange={(e) => setNewStrategyValue(e.target.value)}
                        variant="outlined"
                        sx={{ mr: 2, maxWidth: 300 }}
                    />
                    <Button variant="contained" onClick={handleAddStrategy} sx={{ mr: 2, maxWidth: 100 }}>
                        Add
                    </Button>
                    {strategies.map((strategy, index) => (
                        <Chip
                            key={index}
                            label={strategy.name}
                            onDelete={() => handleDeleteStrategy(strategy.name)}
                            color="secondary"
                            sx={{ m: 0.5 }}
                        />
                    ))}
                </Box>
            </Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>
                    Tags
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                    <TextField
                        label="New Tag"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        variant="outlined"
                        sx={{ mr: 2, maxWidth: 300 }}
                    />
                    <Button variant="contained" onClick={handleAddTag} sx={{ mr: 2, maxWidth: 100 }}>
                        Add
                    </Button>
                    {tags.map((tag, index) => (
                        <Chip
                            key={index}
                            label={tag}
                            onDelete={() => handleDeleteTag(tag)}
                            color="default"
                            sx={{ m: 0.5 }}
                        />
                    ))}
                </Box>
            </Box>
            <Divider sx={{ my: 4 }} />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                {changesMade && (
                    <Button 
                        variant="outlined" 
                        color="secondary" 
                        onClick={handleUndo}
                        sx={{ mr: 2 }}
                    >
                        Undo
                    </Button>
                )}
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleSave} 
                    disabled={!changesMade}
                >
                    Save
                </Button>
            </Box>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
            />
        </Box>
    );
};

export default Settings;
