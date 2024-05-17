// This is example of menu item without group for horizontal layout. There will be no children.

// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconBrandChrome } from '@tabler/icons-react';

// ==============================|| MENU ITEMS - SAMPLE PAGE ||============================== //

const icons = {
    IconBrandChrome
};
const planBuilder = {
    id: 'plan-builder',
    title: <FormattedMessage id="Plan Builder" />,
    icon: icons.IconBrandChrome,
    type: 'group',
    url: '/plan-builder'
};

export default planBuilder;
