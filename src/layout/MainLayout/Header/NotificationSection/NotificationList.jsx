import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import { AttachMoney, Celebration, Lightbulb, Traffic, Add } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';

const ListItemWrapper = ({ children }) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                p: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                cursor: 'pointer',
                '&:hover': {
                    bgcolor: theme.palette.mode === 'dark' ? 'dark.main' : 'primary.light'
                }
            }}
        >
            {children}
        </Box>
    );
};

ListItemWrapper.propTypes = {
    children: PropTypes.node
};

const NotificationList = ({ alerts, onDismiss }) => {
    const getActionButton = (type, id) => {
        switch (type) {
            case 'trade':
            case 'warning':
                return <Button variant="contained" component={Link} to={`/trades/${id}`} size="small">View Trade</Button>;
            case 'warningBuyingPower':
                return <Button variant="contained" component={Link} to={`/trades/${id}`} size="small">View BP Breakdown</Button>;
            case 'adjustment':
                return <Button variant="contained" component={Link} to={`/trades/${id}`} size="small">View Trade</Button>;
            case 'new-trade':
                return <Button variant="contained" component={Link} to={`/trades/${id}`} size="small">Add Trade</Button>;
            default:
                return null;
        }
    };

    return (
        <List sx={{ width: '100%', py: 0 }}>
            {alerts.map(alert => (
                <ListItemWrapper key={alert.id}>
                    <ListItem alignItems="center" disablePadding>
                        <ListItemAvatar>
                            <Avatar
                                sx={{
                                    color: alert.type === 'profit' ? 'success.dark' :
                                        alert.type === 'trade' ? 'primary.dark' :
                                        alert.type === 'adjustment' ? 'warning.dark' :
                                        alert.type === 'new-trade' ? 'success.dark' :
                                        'error.dark',
                                    bgcolor: alert.type === 'profit' ? 'success.light' :
                                        alert.type === 'trade' ? 'primary.light' :
                                        alert.type === 'adjustment' ? 'warning.light' :
                                        alert.type === 'new-trade' ? 'success.light' :
                                        'error.light'
                                }}
                            >
                                {alert.type === 'profit' && <AttachMoney />}
                                {alert.type === 'trade' && <Celebration />}
                                {alert.type === 'adjustment' && <Lightbulb />}
                                {alert.type === 'new-trade' && <Add />}
                                {alert.type === 'warning' && <Traffic />}
                                {alert.type === 'warningBuyingPower' && <Traffic />}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                <>
                                    {alert.name && (
                                        <Typography variant="subtitle1" sx={{ color: 'green' }}>
                                            <Link to={`/trades/${alert.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                {alert.name}
                                            </Link>
                                        </Typography>
                                    )}
                                    {alert.message && (
                                        <Typography variant="body2" sx={{ color: alert.name ? 'inherit' : 'green' }}>
                                            {alert.message}
                                        </Typography>
                                    )}
                                </>
                            }
                            secondary={
                                <Typography variant="caption">{alert.date.toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })}</Typography>
                            }
                        />
                        <ListItemSecondaryAction>
                            <Tooltip title="Dismiss">
                                <IconButton edge="end" aria-label="delete" onClick={() => onDismiss(alert.id)}>
                                    <CloseIcon />
                                </IconButton>
                            </Tooltip>
                        </ListItemSecondaryAction>
                    </ListItem>
                    <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center" sx={{ mt: 1, px: 2 }}>
                        <Stack direction="row" spacing={1}>
                            {alert.type === 'profit' && <Chip label="Success" color="success" size="small" />}
                            {alert.type === 'trade' && <Chip label="Milestone" color="primary" size="small" />}
                            {alert.type === 'adjustment' && <Chip label="Adjustment Needed" color="warning" size="small" />}
                            {alert.type === 'new-trade' && <Chip label="New Opportunity" color="success" size="small" />}
                            {alert.type === 'warning' && <Chip label="Warning" color="error" size="small" />}
                            {alert.type === 'warningBuyingPower' && <Chip label="Warning" color="error" size="small" />}
                        </Stack>
                        {getActionButton(alert.type, alert.id)}
                    </Stack>
                </ListItemWrapper>
            ))}
        </List>
    );
};

NotificationList.propTypes = {
    alerts: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        type: PropTypes.string.isRequired,
        date: PropTypes.instanceOf(Date).isRequired,
        name: PropTypes.string,
        message: PropTypes.string
    })).isRequired,
    onDismiss: PropTypes.func.isRequired
};

export default NotificationList;
