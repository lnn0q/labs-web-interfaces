import React, { useState } from 'react';
import { IconButton, Popover, Grid, Button } from '@mui/material';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';

const emojis = [
  '😊', '😂', '🤣', '❤️', '😍', '👍', '🔥', '🎉', 
  '😭', '😱', '🤔', '👀', '✨', '👏', '🙌', '🙏', 
  '😎', '😜', '💩', '💀', '💖', '🌟', '💔', '🥺',
  '🌸', '🐱', '🍕', '🎮', '💡', '🚀', '💯', '👑'
];

const EmojiPicker = ({ onSelect }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEmojiClick = (emoji) => {
    onSelect(emoji);
    handleClose();
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton onClick={handleClick} color="primary" sx={{ color: '#FF6B00' }}>
        <EmojiEmotionsIcon />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        PaperProps={{
          sx: { 
            p: 1, 
            bgcolor: '#1E1E1E', 
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
          }
        }}
      >
        <Grid container spacing={0.5} sx={{ width: 180 }}>
          {emojis.map((emoji, index) => (
            <Grid item xs={3} key={index} style={{ textAlign: 'center' }}>
              <Button 
                onClick={() => handleEmojiClick(emoji)} 
                sx={{ 
                  fontSize: '1.25rem', 
                  minWidth: 'unset', 
                  width: 38, 
                  height: 38, 
                  p: 0,
                  color: '#fff',
                  borderRadius: '8px',
                  '&:hover': { bgcolor: 'rgba(255,107,0,0.15)' } 
                }}
              >
                {emoji}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Popover>
    </>
  );
};

export default EmojiPicker;
