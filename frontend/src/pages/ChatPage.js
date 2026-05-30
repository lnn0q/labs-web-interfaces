import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, addMessage } from '../store/chatSlice';
import { Container, Paper, Box, Typography, TextField, IconButton, Avatar, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import api from '../services/api';
import EmojiPicker from '../components/EmojiPicker';
import ImageModal from '../components/ImageModal';

const ChatPage = () => {
  const { roomId } = useParams();
  const dispatch = useDispatch();
  const { messages, loading } = useSelector(state => state.chat);
  const { user } = useSelector(state => state.auth);
  const [inputText, setInputText] = useState('');
  const [chatImage, setChatImage] = useState(null);
  const [chatImagePreview, setChatImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [openImage, setOpenImage] = useState(null);
  const [roomInfo, setRoomInfo] = useState(null);
  const ws = useRef(null);
  const messagesEndRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setChatImage(file);
      setChatImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCancelImage = () => {
    setChatImage(null);
    setChatImagePreview(null);
  };

  useEffect(() => {
    dispatch(fetchMessages(roomId));

    api.get(`chats/rooms/${roomId}/`).then(res => {
      setRoomInfo(res.data);
    }).catch(() => {});

    const token = localStorage.getItem('accessToken');
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    ws.current = new WebSocket(`${protocol}//${host}/ws/chat/${roomId}/?token=${token}`);

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'new_message') {
        dispatch(addMessage(data.message));
      }
    };

    return () => {
      if (ws.current) ws.current.close();
    };
  }, [roomId, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if ((inputText.trim() || chatImage) && ws.current.readyState === WebSocket.OPEN) {
      let relativeImagePath = null;
      
      if (chatImage) {
        setUploadingImage(true);
        const formData = new FormData();
        formData.append('image', chatImage);
        try {
          const response = await api.post('chats/upload-image/', formData);
          relativeImagePath = response.data.relative_path;
        } catch (error) {
          console.error("Помилка завантаження фото в чат:", error);
          setUploadingImage(false);
          return;
        }
      }

      ws.current.send(JSON.stringify({ 
        message: inputText,
        image: relativeImagePath
      }));

      setInputText('');
      setChatImage(null);
      setChatImagePreview(null);
      setUploadingImage(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ height: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column' }}>
      <Paper className="glass-card" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Box sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <Typography variant="h6" sx={{ color: '#FFD700' }}>
            {roomInfo ? `Чат ${roomInfo.fandom_name}` : 'Чат'}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {roomInfo ? roomInfo.name : ''}
          </Typography>
        </Box>
        
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {messages.map((msg, index) => {
            const isMe = msg.author.id === user?.id;
            return (
              <Box key={index} sx={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                {!isMe && (
                  <Avatar src={msg.author.avatar} sx={{ width: 32, height: 32, mr: 1, mt: 1, bgcolor: '#FF6B00' }}>
                    {msg.author.name.charAt(0)}
                  </Avatar>
                )}
                <Box sx={{ maxWidth: '70%' }}>
                  {!isMe && <Typography variant="caption" sx={{ color: 'text.secondary', ml: 1 }}>{msg.author.name}</Typography>}
                  <Paper sx={{ 
                    p: 2, 
                    bgcolor: isMe ? '#FF6B00' : '#2A2A2A',
                    color: '#fff',
                    borderRadius: isMe ? '20px 20px 4px 20px' : '20px 20px 20px 4px'
                  }}>
                    {msg.text && <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{msg.text}</Typography>}
                    {msg.image && (
                      <Box sx={{ mt: msg.text ? 1.5 : 0, display: 'flex', justifyContent: 'center' }}>
                        <Box 
                          component="img" 
                          src={msg.image} 
                          alt="Chat attachment" 
                          sx={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', objectFit: 'contain', cursor: 'pointer' }} 
                          onClick={() => setOpenImage(msg.image)}
                        />
                      </Box>
                    )}
                  </Paper>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', textAlign: isMe ? 'right' : 'left', mt: 0.5 }}>
                    {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </Typography>
                </Box>
              </Box>
            );
          })}
          <div ref={messagesEndRef} />
        </Box>

        {chatImagePreview && (
          <Box sx={{ p: 1.5, bgcolor: 'rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: 2, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <img src={chatImagePreview} alt="Preview" style={{ height: 60, borderRadius: 8 }} />
            <Button size="small" onClick={handleCancelImage} color="error" disabled={uploadingImage}>Видалити</Button>
            {uploadingImage && <Typography variant="caption" color="primary">Завантаження...</Typography>}
          </Box>
        )}

        <Box component="form" onSubmit={handleSend} sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Написати повідомлення..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            size="small"
            disabled={uploadingImage}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 8, bgcolor: '#121212' } }}
          />
          <IconButton component="label" disabled={uploadingImage} sx={{ color: 'text.secondary' }}>
            <PhotoCamera />
            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
          </IconButton>
          <EmojiPicker onSelect={(emoji) => setInputText(prev => prev + emoji)} />
          <IconButton type="submit" color="primary" disabled={(!inputText.trim() && !chatImage) || uploadingImage} sx={{ bgcolor: 'rgba(255,107,0,0.1)', '&:hover': { bgcolor: 'rgba(255,107,0,0.2)' } }}>
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
      <ImageModal 
        isOpen={!!openImage} 
        imageUrl={openImage} 
        onClose={() => setOpenImage(null)} 
      />
    </Container>
  );
};

export default ChatPage;
