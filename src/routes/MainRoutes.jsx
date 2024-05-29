import { lazy } from 'react';

// project imports
import AuthGuard from 'utils/route-guard/AuthGuard';
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// sample page routing
const TradeGrouping = Loadable(lazy(() => import('views/trade-grouping')));
const Dashboard = Loadable(lazy(() => import('views/dashboard/index.jsx')));
const AccountMargin = Loadable(lazy(() => import('views/dashboard/AccountMargin')));
const OpenTrades = Loadable(lazy(() => import('views/dashboard/OpenTrades')));
const Settings = Loadable(lazy(() => import('views/settings/index.jsx')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    ),
    children: [
        {
            path: '/',
            element: <Dashboard />
        },
        {
            path: '/dashboard',
            element: <Dashboard />
        },
        {
            path: '/account-margin',
            element: <AccountMargin />
        },
        {
            path: '/open-trades',
            element: <OpenTrades />
        },
        {
            path: '/trade-grouping',
            element: <TradeGrouping />
        },
        {
            path: '/settings',
            element: <Settings />
        }
    ]
};

export default MainRoutes;
