import React, { useState, useContext, useEffect } from 'react';
import { useForm, FormProvider } from "react-hook-form";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { GlobalTradeDataContext } from 'contexts/GlobalTradeDataContext';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

const NewTradeGroupForm = ({ open, handleClose, availableTags = [], handleAddTag, createTradeGroup }) => {
    const methods = useForm();
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState('');
    const theme = useTheme();
    const { accountSettings, setAccountSettingsState } = useContext(GlobalTradeDataContext);
    const [selectedTrades, setSelectedTrades] = useState([]);

    const resetForm = () => {
        methods.reset();
        setTags([]);
        setNewTag('');
        setSelectedTrades([]);
    };

    useEffect(() => {
        if (!open) {
            resetForm();
        }
    }, [open]);

    const onSubmit = async (data) => {
        await createTradeGroup({
            name: data.name,
            underlying: data.underlying,
            type: data.type,
            category: data.category,
            tags,
            comments: data.comments,
            tradeIds: selectedTrades,
        });
        handleClose();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        methods.setValue(name, value);
    };

    const handleAddNewTag = async () => {
        if (newTag && !availableTags.includes(newTag) && !accountSettings?.tags.includes(newTag)) {
            const updatedTags = [...(accountSettings?.tags || []), newTag];
            setAccountSettingsState(prevSettings => ({
                ...prevSettings,
                tags: updatedTags
            }));
            handleAddTag(newTag); // Call the existing handleAddTag function
        }
        setNewTag('');
    };

    const handleTagChange = (event) => {
        setTags(event.target.value);
    };

    const handleTagDelete = (tagToDelete) => {
        setTags((prevTags) => prevTags.filter((tag) => tag !== tagToDelete));
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Create a New Open Trade Group</DialogTitle>
            <Divider sx={{ borderColor: theme.palette.success.main }} />
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                    <DialogContent>
                        <Box display="flex" flexDirection="column" gap={2} minWidth="500px">
                            <TextField label="Name" {...methods.register("name")} required />
                            <TextField label="Underlying Symbol" {...methods.register("underlying")} required />
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Strategy</InputLabel>
                                <Select
                                    name="type"
                                    value={methods.watch("type")}
                                    onChange={handleChange}
                                    label="Strategy"
                                >
                                    {accountSettings?.strategies?.map((strategy, index) => (
                                        <MenuItem key={index} value={strategy.value}>
                                            {strategy.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Category</InputLabel>
                                <Select
                                    name="category"
                                    value={methods.watch("category")}
                                    onChange={handleChange}
                                    label="Category"
                                >
                                    {accountSettings?.categories?.map((category, index) => (
                                        <MenuItem key={index} value={category.value}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Assign Trades</InputLabel>
                                <Select
                                    multiple
                                    value={selectedTrades}
                                    onChange={(e) => setSelectedTrades(e.target.value)}
                                    renderValue={(selected) => selected.join(', ')}
                                >
                                    {accountSettings?.trades?.map((trade) => (
                                        <MenuItem key={trade._id} value={trade._id}>
                                            {trade.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField label="Comments" {...methods.register("comments")} multiline rows={4} />
                            <Box display="flex" alignItems="center" gap={1}>
                                <TextField
                                    label="New Tag"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddNewTag();
                                        }
                                    }}
                                    fullWidth
                                />
                                <Button onClick={handleAddNewTag} variant="contained" color="primary" sx={{ minWidth: '125px' }}>
                                    Add Tag
                                </Button>
                            </Box>
                            <FormControl fullWidth>
                                <InputLabel>Tags</InputLabel>
                                <Select
                                    multiple
                                    value={tags}
                                    onChange={handleTagChange}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                            {selected.map((value) => (
                                                <Chip
                                                    key={value}
                                                    label={value}
                                                    onDelete={() => handleTagDelete(value)}
                                                    sx={{
                                                        backgroundColor: theme.palette.success.dark,
                                                        color: 'white'
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    )}
                                >
                                    {availableTags.concat(accountSettings?.tags || []).map((tag) => (
                                        <MenuItem key={tag} value={tag}>
                                            {tag}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit" variant="contained" color="primary">Create</Button>
                    </DialogActions>
                </form>
            </FormProvider>
        </Dialog>
    );
};

export default NewTradeGroupForm;
