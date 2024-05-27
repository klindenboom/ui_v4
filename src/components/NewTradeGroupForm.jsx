import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from "react-hook-form";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import TradeFormControls from '../components/TradeFormControls'; // Adjust path as necessary
import useTradeOperations from '../hooks/useTradeOperations'; // Adjust path as necessary
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

const NewTradeGroupForm = ({ open, handleClose, availableTags = [], handleAddTag, createTradeGroup }) => {
    const methods = useForm();
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState('');

    const theme = useTheme();

    const resetForm = () => {
        methods.reset();
        setTags([]);
        setNewTag('');
    };

    useEffect(() => {
        if (!open) {
            resetForm();
        }
    }, [open]);

    const onSubmit = async (data) => {
        await createTradeGroup({ name: data.name, underlying: data.underlying, type: data.type, category: data.category, tags });
        handleClose();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        methods.setValue(name, value);
    };

    const handleAddNewTag = () => {
        if (newTag && !availableTags.includes(newTag)) {
            handleAddTag(newTag);
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
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                    <DialogContent>
                        <Box display="flex" flexDirection="column" gap={2} minWidth="500px">
                            <TextField label="Name" {...methods.register("name")} required />
                            <TextField label="Underlying Symbol" {...methods.register("underlying")} required />
                            <TradeFormControls 
                                strategyValue={methods.watch("type")} 
                                categoryValue={methods.watch("category")} 
                                onChange={handleChange} 
                            />
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
                            <Button onClick={handleAddNewTag} variant="contained" color="primary">
                                Add Tag
                            </Button>
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
                                    {availableTags.map((tag) => (
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
