import React from 'react';
import { Dialog, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ImageModal = ({ isOpen, imageUrl, onClose }) => {
  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      maxWidth="xl"
      PaperProps={{
        style: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
          overflow: 'hidden',
          position: 'relative'
        },
      }}
    >
      <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: 'rgba(0,0,0,0.8)', p: 2, borderRadius: 2 }}>
        <IconButton 
          onClick={onClose} 
          sx={{ 
            position: 'absolute', 
            top: 10, 
            right: 10, 
            color: 'white', 
            backgroundColor: 'rgba(0,0,0,0.5)',
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
            zIndex: 10
          }}
        >
          <CloseIcon />
        </IconButton>
        <img 
          src={imageUrl} 
          alt="Full screen view" 
          style={{ maxWidth: '100vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: '8px' }} 
        />
      </Box>
    </Dialog>
  );
};

export default ImageModal;
