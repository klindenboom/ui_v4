import React from 'react';
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

const NewTradeGroupForm = ({ open, handleClose }) => {
    const { createTradeGroup } = useTradeOperations();
    const methods = useForm();

    const onSubmit = async (data) => {
        await createTradeGroup(data.name, data.underlying, data.type, data.category);
        handleClose();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        methods.setValue(name, value);
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
