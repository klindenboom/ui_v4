import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const TradeDetailDialog = ({ open, handleClose, tradeGroup }) => {
    return (
        <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
            <DialogTitle>Trade Detail</DialogTitle>
            <DialogContent dividers>
                <Box sx={{ width: '900px', height: '600px' }}>
                    {tradeGroup ? (
                        <>
                            <Typography variant="h6">{tradeGroup.name}</Typography>
                            <Typography variant="body1">Underlying: {tradeGroup.underlying}</Typography>
                            <Typography variant="body1">Category: {tradeGroup.category}</Typography>
                            <Typography variant="body1">Type: {tradeGroup.type}</Typography>
                            <Typography variant="body1">Total P/L: {tradeGroup.totalPL}</Typography>
                            <Typography variant="body1">Number of Trades: {tradeGroup.tradeHistory.length}</Typography>
                            {/* Add more trade group details here */}
                        </>
                    ) : (
                        <Typography variant="body1">No trade group data available</Typography>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default TradeDetailDialog;
