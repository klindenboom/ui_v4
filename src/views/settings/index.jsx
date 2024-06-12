import React, { useContext, useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Snackbar from '@mui/material/Snackbar';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import './rc-slider-custom.css';

// project imports
import JWTContext from 'contexts/JWTContext';
import { GlobalTradeDataContext } from 'contexts/GlobalTradeDataContext';
import { getAccountSettings, setAccountSettings } from '../../services/api';

const Settings = () => {
    const { user } = useContext(JWTContext);
    const { accountSettings, setAccountSettingsState, originalSettings } = useContext(GlobalTradeDataContext);
    const [buyingPower, setBuyingPower] = useState(accountSettings?.buyingPowerTarget || 50);
    const [startingAccountValue, setStartingAccountValue] = useState(accountSettings?.startingAccountValue || '');
    const [monthlyGoal, setMonthlyGoal] = useState(accountSettings?.monthlyGoal || '');
    const [ytdContributions, setYtdContributions] = useState(accountSettings?.ytdContributions || '');
    const [categories, setCategories] = useState(accountSettings?.categories || []);
    const [strategies, setStrategies] = useState(accountSettings?.strategies || []);
    const [tags, setTags] = useState(accountSettings?.tags || []);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newStrategyName, setNewStrategyName] = useState('');
    const [newTag, setNewTag] = useState('');
    const [maxSPExposure, setMaxSPExposure] = useState(accountSettings?.buyingPowerSP500Target || 50);
    const [minSPExposure, setMinSPExposure] = useState(accountSettings?.buyingPowerSP500Target || 0);
    const [strangleProfitTarget, setStrangleProfitTarget] = useState(accountSettings?.strangleProfitTarget || 50);
    const [strangleStopLoss, setStrangleStopLoss] = useState(accountSettings?.strangleStopLoss || 50);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [changesMade, setChangesMade] = useState(false);

    useEffect(() => {
        const fetchAccountSettings = async () => {
            if (user) {
                const settings = await getAccountSettings(user.id);
                const accountSettings = settings[0];
                setAccountSettingsState(accountSettings);
                setBuyingPower(accountSettings.buyingPowerTarget || 50);
                setStartingAccountValue(accountSettings.startingAccountValue || '');
                setMonthlyGoal(accountSettings.monthlyGoal || '');
                setYtdContributions(accountSettings.ytdContributions || '');
                setCategories(accountSettings.categories || []);
                setStrategies(accountSettings.strategies || []);
                setTags(accountSettings.tags || []);
                setMaxSPExposure(accountSettings.buyingPowerSP500Target || 50);
                setMinSPExposure(accountSettings.buyingPowerSP500Target || 0);
                setStrangleProfitTarget(accountSettings.strangleProfitTarget || 50);
                setStrangleStopLoss(accountSettings.strangleStopLoss || 50);
            }
        };

        fetchAccountSettings();
    }, [user]);

    const handleSliderChange = (value, setState) => {
        setState(value);
        setChangesMade(true);
    };

    const handleAddCategory = () => {
        if (!newCategoryName) {
            setSnackbarMessage('Category name is required');
            setSnackbarOpen(true);
            return;
        }
        const updatedCategories = [...categories, { name: newCategoryName }];
        setCategories(updatedCategories);
        setNewCategoryName('');
        setChangesMade(true);
    };

    const handleAddStrategy = () => {
        if (!newStrategyName) {
            setSnackbarMessage('Strategy name is required');
            setSnackbarOpen(true);
            return;
        }
        const updatedStrategies = [...strategies, { name: newStrategyName }];
        setStrategies(updatedStrategies);
        setNewStrategyName('');
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
            monthlyGoal,
            ytdContributions,
            buyingPowerTarget: buyingPower,
            buyingPowerSP500Target: maxSPExposure,
            strangleProfitTarget,
            strangleStopLoss,
            categories,
            strategies,
            tags
        };
        await setAccountSettings(updatedSettings);
        setSnackbarMessage('Settings saved');
        setSnackbarOpen(true);
        setChangesMade(false);
    };

    const handleUndo = () => {
        setAccountSettingsState(originalSettings);
        setBuyingPower(originalSettings.buyingPowerTarget || 50);
        setStartingAccountValue(originalSettings.startingAccountValue || '');
        setMonthlyGoal(originalSettings.monthlyGoal || '');
        setYtdContributions(originalSettings.ytdContributions || '');
        setCategories(originalSettings.categories || []);
        setStrategies(originalSettings.strategies || []);
        setTags(originalSettings.tags || []);
        setMaxSPExposure(originalSettings.buyingPowerSP500Target || 50);
        setMinSPExposure(originalSettings.buyingPowerSP500Target || 0);
        setStrangleProfitTarget(originalSettings.strangleProfitTarget || 50);
        setStrangleStopLoss(originalSettings.strangleStopLoss || 50);
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
                    <TextField
                        label="Monthly Goal (%)"
                        value={monthlyGoal}
                        onChange={(e) => {
                            const value = e.target.value.replace(/[^\d]/g, '');
                            setMonthlyGoal(value ? value : '');
                            setChangesMade(true);
                        }}
                        variant="outlined"
                        fullWidth
                        sx={{ mr: 2 }}
                    />
                    <TextField
                        label="YTD Contributions/Withdrawals"
                        value={ytdContributions}
                        onChange={(e) => {
                            setYtdContributions(e.target.value);
                            setChangesMade(true);
                        }}
                        variant="outlined"
                        fullWidth
                    />
                </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 4 }}>
                {/* Left Column with Sliders */}
                <Box sx={{ display: 'flex', flexDirection: 'column', flex: '1 1 30%', mr: 4, border: '1px solid #ddd', padding: 2 }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        Buying Power Usage
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Slider
                            value={buyingPower}
                            onChange={(value) => handleSliderChange(value, setBuyingPower)}
                            min={1}
                            max={100}
                            step={1}
                            marks
                            tipFormatter={(value) => `${value}%`}
                            trackStyle={{ backgroundColor: '#1976d2' }}
                            handleStyle={{ borderColor: '#1976d2' }}
                            railStyle={{ backgroundColor: '#90caf9' }}
                            sx={{ flex: 1 }}
                        />
                        <TextField
                            label="Buying Power (%)"
                            value={`${buyingPower}%`}
                            variant="outlined"
                            InputProps={{
                                readOnly: true,
                            }}
                            sx={{ width: 80 }}
                        />
                    </Box>

                    <Typography variant="h6" sx={{ mb: 1 }}>
                        Max S&P Exposure
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Slider
                            value={maxSPExposure}
                            onChange={(value) => handleSliderChange(value, setMaxSPExposure)}
                            min={0}
                            max={100}
                            step={1}
                            marks
                            tipFormatter={(value) => `${value}%`}
                            trackStyle={{ backgroundColor: '#1976d2' }}
                            handleStyle={{ borderColor: '#1976d2' }}
                            railStyle={{ backgroundColor: '#90caf9' }}
                            sx={{ flex: 1 }}
                        />
                        <TextField
                            label="Max S&P (%)"
                            value={`${maxSPExposure}%`}
                            variant="outlined"
                            InputProps={{
                                readOnly: true,
                            }}
                            sx={{ width: 80 }}
                        />
                    </Box>

                    <Typography variant="h6" sx={{ mb: 1 }}>
                        Min S&P Exposure
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Slider
                            value={minSPExposure}
                            onChange={(value) => handleSliderChange(value, setMinSPExposure)}
                            min={0}
                            max={100}
                            step={1}
                            marks
                            tipFormatter={(value) => `${value}%`}
                            trackStyle={{ backgroundColor: '#1976d2' }}
                            handleStyle={{ borderColor: '#1976d2' }}
                            railStyle={{ backgroundColor: '#90caf9' }}
                            sx={{ flex: 1 }}
                        />
                        <TextField
                            label="Min S&P (%)"
                            value={`${minSPExposure}%`}
                            variant="outlined"
                            InputProps={{
                                readOnly: true,
                            }}
                            sx={{ width: 80 }}
                        />
                    </Box>

                    <Typography variant="h6" sx={{ mb: 1 }}>
                        Strangle Profit Target
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Slider
                            value={strangleProfitTarget}
                            onChange={(value) => handleSliderChange(value, setStrangleProfitTarget)}
                            min={0}
                            max={100}
                            step={1}
                            marks
                            tipFormatter={(value) => `${value}%`}
                            trackStyle={{ backgroundColor: '#1976d2' }}
                            handleStyle={{ borderColor: '#1976d2' }}
                            railStyle={{ backgroundColor: '#90caf9' }}
                            sx={{ flex: 1 }}
                        />
                        <TextField
                            label="Profit Target (%)"
                            value={`${strangleProfitTarget}%`}
                            variant="outlined"
                            InputProps={{
                                readOnly: true,
                            }}
                            sx={{ width: 80 }}
                        />
                    </Box>

                    <Typography variant="h6" sx={{ mb: 1 }}>
                        Strangle Stop Loss
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Slider
                            value={strangleStopLoss}
                            onChange={(value) => handleSliderChange(value, setStrangleStopLoss)}
                            min={0}
                            max={100}
                            step={1}
                            marks
                            tipFormatter={(value) => `${value}%`}
                            trackStyle={{ backgroundColor: '#1976d2' }}
                            handleStyle={{ borderColor: '#1976d2' }}
                            railStyle={{ backgroundColor: '#90caf9' }}
                            sx={{ flex: 1 }}
                        />
                        <TextField
                            label="Stop Loss (%)"
                            value={`${strangleStopLoss}%`}
                            variant="outlined"
                            InputProps={{
                                readOnly: true,
                            }}
                            sx={{ width: 80 }}
                        />
                    </Box>
                </Box>

                {/* Right Column with Categories, Strategies, and Tags */}
                <Box sx={{ display: 'flex', flexDirection: 'column', flex: '1 1 70%', border: '1px solid #ddd', padding: 2 }}>
                    <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>
                        Categories
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 4 }}>
                        <TextField
                            label="Category Name"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
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

                    <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>
                        Strategies
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 4 }}>
                        <TextField
                            label="Strategy Name"
                            value={newStrategyName}
                            onChange={(e) => setNewStrategyName(e.target.value)}
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
            </Box>

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
