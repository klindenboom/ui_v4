// This is example of menu item without group for horizontal layout. There will be no children.

// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconLayoutDashboard } from '@tabler/icons-react';

// ==============================|| MENU ITEMS - SAMPLE PAGE ||============================== //

const icons = {
    IconLayoutDashboard
};
const Dashboard = {
    id: 'dashboard',
    title: <FormattedMessage id="Dashboard" />,
    icon: icons.IconLayoutDashboard,
    type: 'group',
    url: '/dashboard'
};

export default Dashboard;
