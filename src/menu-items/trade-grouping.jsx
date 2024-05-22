// This is example of menu item without group for horizontal layout. There will be no children.

// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconBoxMultiple2 } from '@tabler/icons-react';

// ==============================|| MENU ITEMS - SAMPLE PAGE ||============================== //

const icons = {
    IconBoxMultiple2
};
const tradeGrouping = {
    id: 'trade-grouping',
    title: <FormattedMessage id="Trade Grouping" />,
    icon: icons.IconBoxMultiple2,
    type: 'group',
    url: '/trade-grouping'
};

export default tradeGrouping;
