import React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const TradeFormControls = ({ strategyValue, categoryValue, onChange, handleEdit }) => {
    const handleSelectChange = (e) => {
        onChange(e);
        if (handleEdit) {
            handleEdit(); // Call handleEdit only if it is provided
        }
    };

    return (
        <>
            <FormControl fullWidth margin="dense" sx={{ mb: 1 }}>
                <InputLabel>Strategy</InputLabel>
                <Select
                    name="type"
                    value={strategyValue || ""}
                    onChange={handleSelectChange}
                >
                    <MenuItem value={"112"}>112</MenuItem>
                    <MenuItem value={"LT112"}>LT112</MenuItem>
                    <MenuItem value={"RatioSpread"}>Ratio Spread</MenuItem>
                    <MenuItem value={"Strangle"}>Strangle</MenuItem>
                    <MenuItem value={"PutSpread"}>Put Spread</MenuItem>
                    <MenuItem value={"CallSpread"}>Call Spread</MenuItem>
                    <MenuItem value={"IronCondor"}>Iron Condor</MenuItem>
                    <MenuItem value={"NakedPut"}>Naked Put</MenuItem>
                    <MenuItem value={"NakedCall"}>Naked Call</MenuItem>
                    <MenuItem value={"Hedge"}>Hedge</MenuItem>
                    <MenuItem value={"Long/Short"}>Long/Short</MenuItem>
                </Select>
            </FormControl>
            <FormControl fullWidth margin="dense" sx={{ mb: 1 }}>
                <InputLabel>Category</InputLabel>
                <Select
                    name="category"
                    value={categoryValue || ""}
                    onChange={handleSelectChange}
                >
                    <MenuItem value={"120DTE6DNP"}>120DTE 6D NP</MenuItem>
                    <MenuItem value={"LT112"}>LT112</MenuItem>
                    <MenuItem value={"Spec"}>Spec</MenuItem>
                    <MenuItem value={"0DTE"}>0DTE</MenuItem>
                    <MenuItem value={"GCStrangle"}>GC Strangle</MenuItem>
                    <MenuItem value={"CLStrangle"}>CL Strangle</MenuItem>
                    <MenuItem value={"HGStrangle"}>HG Strangle</MenuItem>
                    <MenuItem value={"Scalp"}>Scalp</MenuItem>
                </Select>
            </FormControl>
        </>
    );
};

export default TradeFormControls;
