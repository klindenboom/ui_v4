import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import NotificationList from './NotificationList';
import { ThemeMode } from 'config';

// assets
import { IconBell } from '@tabler/icons-react';

// notification status options
const status = [
    {
        value: 'all',
        label: 'All Notification'
    },
    {
        value: 'new',
        label: 'New'
    },
    {
        value: 'dismissed',
        label: 'Dismissed'
    }
];

// ==============================|| NOTIFICATION ||============================== //

const NotificationSection = () => {
    const theme = useTheme();
    const downMD = useMediaQuery(theme.breakpoints.down('md'));

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('all');
    const [selectedDate, setSelectedDate] = useState(null);
    const [alerts, setAlerts] = useState([
        { id: 1, type: 'profit', date: dayjs().add(1, 'day'), message: 'Monthly Target Profit Achieved' },
        { id: 2, type: 'trade', date: dayjs(), name: 'Trade GC Strangle 24', message: 'has achieved 50% profit target.' },
        { id: 3, type: 'adjustment', date: dayjs().subtract(1, 'day'), name: 'Trade 112 Bear Trade', message: 'has an ideal put debit spread adjustment.' },
        { id: 4, type: 'new-trade', date: dayjs().subtract(2, 'day'), message: 'Open New Trades' },
        { id: 5, type: 'warningBuyingPower', date: dayjs().subtract(3, 'day'), message: 'High Buying Power' },
        { id: 6, type: 'warning', date: dayjs().subtract(4, 'day'), name: 'Trade 112 Bear Trap 45', message: 'stop loss hit.' }
    ]);

    /**
     * anchorRef is used on different components and specifying one type leads to other components throwing an error
     * */
    const anchorRef = useRef(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }
        prevOpen.current = open;
    }, [open]);

    const handleChange = (event) => {
        setValue(event?.target.value);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date ? dayjs(date) : null);
    };

    const handleDismiss = (id) => {
        setAlerts((prevAlerts) => prevAlerts.filter(alert => alert.id !== id));
    };

    const filteredAlerts = alerts.filter(alert => {
        const isFilterMatch = value === 'all' || alert.type === value;
        const isDateMatch = !selectedDate || alert.date.isSame(selectedDate, 'day');
        return isFilterMatch && isDateMatch;
    });

    const countByType = alerts.reduce((acc, alert) => {
        acc[alert.type] = (acc[alert.type] || 0) + 1;
        return acc;
    }, {});

    return (
        <>
            <Box sx={{ ml: 2 }}>
                <Avatar
                    variant="rounded"
                    sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.mediumAvatar,
                        transition: 'all .2s ease-in-out',
                        bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'secondary.light',
                        color: theme.palette.mode === ThemeMode.DARK ? 'warning.dark' : 'secondary.dark',
                        '&[aria-controls="menu-list-grow"],&:hover': {
                            bgcolor: theme.palette.mode === ThemeMode.DARK ? 'warning.dark' : 'secondary.dark',
                            color: theme.palette.mode === ThemeMode.DARK ? 'grey.800' : 'secondary.light'
                        }
                    }}
                    ref={anchorRef}
                    aria-controls={open ? 'menu-list-grow' : undefined}
                    aria-haspopup="true"
                    onClick={handleToggle}
                    color="inherit"
                >
                    <IconBell stroke={1.5} size="20px" />
                </Avatar>
            </Box>

            <Popper
                placement={downMD ? 'bottom' : 'bottom-end'}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                modifiers={[
                    {
                        name: 'offset',
                        options: {
                            offset: [downMD ? 5 : 0, 20]
                        }
                    }
                ]}
            >
                {({ TransitionProps }) => (
                    <ClickAwayListener onClickAway={handleClose}>
                        <Transitions position={downMD ? 'top' : 'top-right'} in={open} {...TransitionProps}>
                            <Paper>
                                {open && (
                                    <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                                        <Grid container direction="column" spacing={2}>
                                            <Grid item xs={12}>
                                                <Grid container alignItems="center" justifyContent="space-between" sx={{ pt: 2, px: 2 }}>
                                                    <Grid item>
                                                        <Stack direction="row" spacing={2}>
                                                            <Typography variant="subtitle1">All Notifications</Typography>
                                                            <Chip label={`All (${alerts.length})`} onClick={() => setValue('all')} />
                                                        </Stack>
                                                    </Grid>
                                                    <Grid item>
                                                        <Typography component={Link} to="#" variant="subtitle2" color="primary">
                                                            Dismiss All
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <PerfectScrollbar
                                                    style={{ height: '100%', maxHeight: 'calc(100vh - 205px)', overflowX: 'hidden' }}
                                                >
                                                    <Grid container direction="column" spacing={2}>
                                                        <Grid item xs={12}>
                                                            <Box sx={{ px: 2, pt: 0.25 }}>
                                                                <Stack direction="row" spacing={2} alignItems="center">
                                                                    <TextField
                                                                        id="outlined-select-status"
                                                                        select
                                                                        fullWidth
                                                                        value={value}
                                                                        onChange={handleChange}
                                                                        SelectProps={{
                                                                            native: true
                                                                        }}
                                                                    >
                                                                        {status.map((option) => (
                                                                            <option key={option.value} value={option.value}>
                                                                                {option.label}
                                                                            </option>
                                                                        ))}
                                                                        {Object.keys(countByType).map((type) => (
                                                                            <option key={type} value={type}>
                                                                                {`${type.charAt(0).toUpperCase() + type.slice(1)} (${countByType[type]})`}
                                                                            </option>
                                                                        ))}
                                                                    </TextField>
                                                                    <DatePicker
                                                                        selected={selectedDate ? selectedDate.toDate() : null}
                                                                        onChange={handleDateChange}
                                                                        isClearable
                                                                        customInput={<TextField label="Select Date" fullWidth />}
                                                                    />
                                                                </Stack>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item xs={12} p={0}>
                                                            <Divider sx={{ my: 0 }} />
                                                        </Grid>
                                                    </Grid>
                                                    <Box sx={{ minHeight: 200 }}>
                                                        {filteredAlerts.length > 0 ? (
                                                            <NotificationList alerts={filteredAlerts} onDismiss={handleDismiss} />
                                                        ) : (
                                                            <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                                                                No Notifications to Show
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </PerfectScrollbar>
                                            </Grid>
                                        </Grid>
                                    </MainCard>
                                )}
                            </Paper>
                        </Transitions>
                    </ClickAwayListener>
                )}
            </Popper>
        </>
    );
};

export default NotificationSection;
