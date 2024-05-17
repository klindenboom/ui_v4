import { lazy } from 'react';

// project imports
import AuthGuard from 'utils/route-guard/AuthGuard';
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// sample page routing
const TradeGrouping = Loadable(lazy(() => import('views/trade-grouping')));
const Dashboard = Loadable(lazy(() => import('views/dashboard/index.jsx')));
const PlanBuilder = Loadable(lazy(() => import('views/plan-builder/index.jsx')));

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
            path: '/trade-grouping',
            element: <TradeGrouping />
        },
        {
            path: '/plan-builder',
            element: <PlanBuilder />
        }
    ]
};

export default MainRoutes;
