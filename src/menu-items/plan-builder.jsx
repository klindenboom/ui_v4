// This is example of menu item without group for horizontal layout. There will be no children.

// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconClipboardList } from '@tabler/icons-react';

// ==============================|| MENU ITEMS - SAMPLE PAGE ||============================== //

const icons = {
    IconClipboardList
};
const planBuilder = {
    id: 'plan-builder',
    title: <FormattedMessage id="Plan Builder" />,
    icon: icons.IconClipboardList,
    type: 'group',
    url: '/plan-builder'
};

export default planBuilder;
