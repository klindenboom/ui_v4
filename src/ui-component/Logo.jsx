// material-ui
import { useTheme } from '@mui/material/styles';

// project imports
import { ThemeMode } from 'config';

// if you want to use image instead of <svg> uncomment following.
import logoDark from 'assets/images/logo2.jpg';
import logoBlack from 'assets/images/logo4.png';
import logoLight from 'assets/images/logo2.jpg';

// ==============================|| LOGO SVG ||============================== //

export const Logo = () => {
    const theme = useTheme();

    return (
        <img src={theme.palette.mode === ThemeMode.DARK ? logoDark : logoLight} alt="MainStreet" width="150" />
    );
};

export const LogoDark = () => {
    const theme = useTheme();

    return (
        <img src={theme.palette.mode === ThemeMode.DARK ? logoBlack : logoLight} alt="MainStreet" width="150" />
    );
};
