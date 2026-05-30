import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

const FandomCard = ({ fandom }) => {
  return (
    <Card 
      component={Link} 
      to={`/fandom/${fandom.slug}`}
      className="glass-card hover-lift"
      sx={{ 
        textDecoration: 'none', 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={fandom.image_url || 'https://via.placeholder.com/400x200/1e1e1e/ff6b00'}
          alt={fandom.name}
          sx={{ objectFit: 'cover' }}
        />
        <Chip 
          label={fandom.category.toUpperCase()} 
          size="small" 
          sx={{ 
            position: 'absolute', 
            top: 10, 
            right: 10, 
            bgcolor: 'rgba(0,0,0,0.7)',
            color: '#FF6B00',
            fontWeight: 'bold',
            backdropFilter: 'blur(4px)'
          }} 
        />
      </Box>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h5" component="div" className="anime-title" sx={{ mb: 1 }}>
          {fandom.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
          {fandom.description}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
          <PeopleAltIcon sx={{ fontSize: 18, mr: 0.5, color: '#FFD700' }} />
          <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
            {fandom.members_count} УЧАСНИКІВ
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FandomCard;
