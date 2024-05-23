// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconLayoutDashboard, IconScale, IconTrendingUp, IconClipboardList, IconBoxMultiple2 } from '@tabler/icons-react';

// ==============================|| MENU ITEMS - SAMPLE PAGE ||============================== //

const icons = {
    IconLayoutDashboard,
    IconScale,
    IconTrendingUp,
    IconClipboardList,
    IconBoxMultiple2
};

const Dashboard = {
    id: 'dashboard',
    title: <FormattedMessage id="Dashboard" />,
    icon: icons.IconLayoutDashboard,
    type: 'item',
    url: '/dashboard'
};

const AccountMargin = {
    id: 'account-margin',
    title: <FormattedMessage id="Account Margin" />,
    icon: icons.IconScale,
    type: 'item',
    url: '/account-margin'
};

const OpenTrades = {
    id: 'open-trades',
    title: <FormattedMessage id="Open Trades" />,
    icon: icons.IconTrendingUp,
    type: 'item',
    url: '/open-trades'
};

const TradeGrouping = {
    id: 'trade-grouping',
    title: <FormattedMessage id="Trade Grouping" />,
    icon: icons.IconBoxMultiple2,
    type: 'item',
    url: '/trade-grouping'
};

const PlanBuilder = {
    id: 'plan-builder',
    title: <FormattedMessage id="Plan Builder" />,
    icon: icons.IconClipboardList,
    type: 'item',
    url: '/plan-builder'
};

const menuItems = {
    id: 'menu',
    title: 'Menu',
    type: 'group',
    children: [
        Dashboard,
        AccountMargin,
        OpenTrades,
        TradeGrouping,
        PlanBuilder
    ]
};

export default menuItems;
