import React, { useState, useEffect } from 'react';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Box from '@mui/material/Box';

import { getTradeGroups } from '../../services/api'; // Assuming there's an API function to get trade groups

const OpenTrades = () => {
    const [tradeGroups, setTradeGroups] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tradeGroupsResponse = await getTradeGroups(); // Fetch trade groups
                setTradeGroups(tradeGroupsResponse); // Adjust based on the actual response structure
            } catch (err) {
                setError(err.message);
            }
        };

        fetchData();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Container maxWidth={false} sx={{ width: '100%', padding: 0 }}>
            <Box sx={{ width: '100%' }}>
                <Typography variant="h6" gutterBottom>
                    Open Trades
                </Typography>
                {tradeGroups.length > 0 ? (
                    <Grid container spacing={3}>
                        {tradeGroups.map((group, index) => (
                            <Grid item xs={12} md={6} lg={4} key={index}>
                                <Card>
                                    <CardHeader title={group.name} subheader={`Category: ${group.category}`} />
                                    <CardContent>
                                        <Typography variant="body2">
                                            <strong>Underlying:</strong> {group.underlying}
                                        </Typography>
                                        <Box sx={{ marginTop: 1 }}>
                                            <Typography variant="body2" color="textSecondary">
                                                Open Date: {new Date(group.openDate).toLocaleDateString()}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                Delta: {group.delta}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                Theta: {group.theta}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                Vega: {group.vega}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                Number of Trades: {group.tradeHistory.length}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Typography>Loading...</Typography>
                )}
            </Box>
        </Container>
    );
};

export default OpenTrades;
