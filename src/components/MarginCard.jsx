// src/components/MarginCard.jsx

import React from 'react';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';

const MarginCard = ({ group }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5">{group.description}</Typography>
        <Typography variant="body2">
          Margin Calculation Type: {group['margin-calculation-type']}
        </Typography>
        <Typography variant="body2">
          Margin Requirement: {group['margin-requirement']} ({group['margin-requirement-effect']})
        </Typography>
        <Typography variant="body2">
          Buying Power: {group['buying-power']} ({group['buying-power-effect']})
        </Typography>
        <Typography variant="body2">
          Number of Position Entries: {group['position-entries'] && group['position-entries'].length}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MarginCard;
