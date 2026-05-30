import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFandom, joinFandom, leaveFandom } from '../store/fandomSlice';
import { fetchRooms } from '../store/chatSlice';
import { fetchPosts, createPost } from '../store/postSlice';
import { Container, Typography, Box, Paper, Button, CircularProgress, Grid, Divider, List, ListItem, ListItemText, ListItemIcon, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SendIcon from '@mui/icons-material/Send';
import PostCard from '../components/PostCard';
import EmojiPicker from '../components/EmojiPicker';
import api from '../services/api';

const FandomPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { currentFandom: fandom, loading } = useSelector(state => state.fandoms);
  const { isAuthenticated } = useSelector(state => state.auth);
  const { rooms } = useSelector(state => state.chat);
  const { list: posts, loading: postsLoading } = useSelector(state => state.posts);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState(null);
  
  const [chatDialogOpen, setChatDialogOpen] = useState(false);
  const [newChatName, setNewChatName] = useState('');

  useEffect(() => {
    dispatch(fetchFandom(slug));
    dispatch(fetchRooms(slug));
    dispatch(fetchPosts(slug));
  }, [dispatch, slug]);

  if (loading || !fandom) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress color="primary" /></Box>;

  const handleJoinToggle = () => {
    if (fandom.is_member) {
      dispatch(leaveFandom(slug));
    } else {
      dispatch(joinFandom(slug));
    }
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    
    const formData = new FormData();
    formData.append('fandom', fandom.id);
    formData.append('content', newPostContent);
    formData.append('title', newPostTitle || 'Новий пост');
    if (newPostImage) {
      formData.append('image', newPostImage);
    }
    
    dispatch(createPost(formData)).then(() => {
      setNewPostTitle('');
      setNewPostContent('');
      setNewPostImage(null);
    });
  };

  const handleCreateChat = async () => {
    if (!newChatName.trim()) return;
    try {
      await api.post('chats/rooms/', {
        fandom: fandom.id,
        name: newChatName,
        room_type: 'topic'
      });
      setChatDialogOpen(false);
      setNewChatName('');
      dispatch(fetchRooms(slug));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ position: 'relative', height: '300px', borderRadius: '16px', overflow: 'hidden', mb: 4 }}>
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `url(${fandom.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(3px)', zIndex: 1 }} />
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to top, #121212, transparent)', zIndex: 2 }} />
        <Box sx={{ position: 'relative', zIndex: 3, p: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.8)', fontSize: { xs: '2rem', md: '3rem' } }}>
            {fandom.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PeopleAltIcon sx={{ mr: 1, color: '#FFD700' }} />
              <Typography variant="h6">{fandom.members_count} учасників</Typography>
            </Box>
            {isAuthenticated && (
              <Button 
                variant={fandom.is_member ? "outlined" : "contained"} 
                color="primary"
                onClick={handleJoinToggle}
                sx={{ borderRadius: 8, px: 4 }}
              >
                {fandom.is_member ? 'Залишити фандом' : 'Приєднатися'}
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper className="glass-card" sx={{ p: 4, mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 2, color: '#FFD700', borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 1 }}>
              Про фандом
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
              {fandom.description}
            </Typography>
          </Paper>

          {/* Стіна постів */}
          <Typography variant="h5" sx={{ mb: 2, color: '#FFD700' }}>
            Стіна новин та обговорень
          </Typography>
          
          {fandom.is_member && isAuthenticated && (
            <Paper className="glass-card" sx={{ p: 3, mb: 4 }}>
              <form onSubmit={handleCreatePost}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Тема поста (необов'язково)"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Напишіть щось цікаве для спільноти..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                {newPostImage && (
                  <Typography variant="body2" sx={{ mb: 2, color: '#FFD700' }}>
                    Прикріплено фото: {newPostImage.name}
                  </Typography>
                )}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, gap: 2 }}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: { xs: 'space-between', sm: 'flex-start' } }}>
                    <Button variant="outlined" component="label" size="small">
                      Додати фото
                      <input type="file" hidden accept="image/*" onChange={(e) => setNewPostImage(e.target.files[0])} />
                    </Button>
                    <EmojiPicker onSelect={(emoji) => setNewPostContent(prev => prev + emoji)} />
                  </Box>
                  <Button type="submit" variant="contained" color="primary" endIcon={<SendIcon />} disabled={!newPostContent.trim()}>
                    Опублікувати
                  </Button>
                </Box>
              </form>
            </Paper>
          )}

          {postsLoading ? (
            <CircularProgress color="primary" sx={{ display: 'block', mx: 'auto' }} />
          ) : (
            posts.length > 0 ? (
              posts.map(post => <PostCard key={post.id} post={post} />)
            ) : (
              <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                Поки що немає постів. {fandom.is_member && 'Будьте першим, хто напише щось!'}
              </Typography>
            )
          )}
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper className="glass-card" sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#FFD700' }}>
              Чати фандому
            </Typography>
            <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
            
            {fandom.is_member ? (
              <>
                <List>
                  {rooms.map((room) => (
                    <ListItem 
                      key={room.id} 
                      button 
                      component={Link} 
                      to={`/chat/${room.id}`}
                      sx={{ borderRadius: 2, mb: 1, '&:hover': { bgcolor: 'rgba(255,107,0,0.1)' } }}
                    >
                      <ListItemIcon><ChatIcon sx={{ color: '#FF6B00' }} /></ListItemIcon>
                      <ListItemText primary={room.name} />
                    </ListItem>
                  ))}
                  {rooms.length === 0 && <Typography color="text.secondary">Поки немає чатів</Typography>}
                </List>
                <Button 
                  fullWidth 
                  variant="outlined" 
                  color="primary" 
                  sx={{ mt: 2 }}
                  onClick={() => setChatDialogOpen(true)}
                >
                  Створити чат
                </Button>
              </>
            ) : (
              <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
                Приєднайтеся до фандому, щоб отримати доступ до чатів.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={chatDialogOpen} onClose={() => setChatDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#1E1E1E', color: '#FFD700' }}>Створити новий тематичний чат</DialogTitle>
        <DialogContent sx={{ bgcolor: '#1E1E1E', pt: 2 }}>
          <TextField
            fullWidth
            size="small"
            label="Назва чату"
            value={newChatName}
            onChange={(e) => setNewChatName(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#1E1E1E' }}>
          <Button onClick={() => setChatDialogOpen(false)} color="inherit">Скасувати</Button>
          <Button onClick={handleCreateChat} variant="contained" color="primary" disabled={!newChatName.trim()}>Створити</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FandomPage;
