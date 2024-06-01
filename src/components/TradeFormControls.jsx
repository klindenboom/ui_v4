import React, { useContext } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { GlobalTradeDataContext } from 'contexts/GlobalTradeDataContext';

const TradeFormControls = ({ strategyValue, categoryValue, onChange, handleEdit }) => {
    const { accountSettings } = useContext(GlobalTradeDataContext);

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
                    {accountSettings?.strategies?.map((strategy, index) => (
                        <MenuItem key={index} value={strategy.value}>
                            {strategy.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth margin="dense" sx={{ mb: 1 }}>
                <InputLabel>Category</InputLabel>
                <Select
                    name="category"
                    value={categoryValue || ""}
                    onChange={handleSelectChange}
                >
                    {accountSettings?.categories?.map((category, index) => (
                        <MenuItem key={index} value={category.value}>
                            {category.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </>
    );
};

export default TradeFormControls;
