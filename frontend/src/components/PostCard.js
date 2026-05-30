import React, { useState } from 'react';
import { Paper, Typography, Box, Avatar, IconButton, Divider, TextField, Button } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SendIcon from '@mui/icons-material/Send';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useDispatch, useSelector } from 'react-redux';
import { toggleLike, fetchComments, createComment } from '../store/postSlice';
import EmojiPicker from './EmojiPicker';
import ImageModal from './ImageModal';

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commentImage, setCommentImage] = useState(null);
  const [commentImagePreview, setCommentImagePreview] = useState(null);
  const [openImage, setOpenImage] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCommentImage(file);
      setCommentImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCancelImage = () => {
    setCommentImage(null);
    setCommentImagePreview(null);
  };

  const handleLike = () => {
    if (isAuthenticated) {
      dispatch(toggleLike(post.id));
    }
  };

  const handleToggleComments = () => {
    if (!showComments && !post.comments_list) {
      dispatch(fetchComments(post.id));
    }
    setShowComments(!showComments);
  };

  const handleCreateComment = (e) => {
    e.preventDefault();
    if (!newComment.trim() && !commentImage) return;
    
    const formData = new FormData();
    formData.append('text', newComment);
    if (commentImage) {
      formData.append('image', commentImage);
    }
    
    dispatch(createComment({ postId: post.id, formData })).then(() => {
      setNewComment('');
      setCommentImage(null);
      setCommentImagePreview(null);
    });
  };

  return (
    <Paper className="glass-card" sx={{ p: 3, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar src={post.author?.avatar} sx={{ width: 40, height: 40, mr: 2, bgcolor: '#FF6B00' }}>
          {post.author?.name?.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#FFD700' }}>
            {post.author?.name || 'Анонім'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {new Date(post.created_at).toLocaleString('uk-UA')}
          </Typography>
        </Box>
      </Box>

      {post.title && (
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
          {post.title}
        </Typography>
      )}

      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>
        {post.content}
      </Typography>

      {post.image && (
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
          <Box 
            component="img" 
            src={post.image} 
            alt="Post image" 
            sx={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '12px', cursor: 'pointer' }} 
            onClick={() => setOpenImage(post.image)}
          />
        </Box>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, pt: 1, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
          <IconButton onClick={handleLike} color={post.is_liked ? "primary" : "default"}>
            {post.is_liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          <Typography variant="body2">{post.likes_count}</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleToggleComments} color={showComments ? "primary" : "default"}>
            <ChatBubbleOutlineIcon />
          </IconButton>
          <Typography variant="body2">{post.comments_count}</Typography>
        </Box>
      </Box>

      {/* Comments Section */}
      {showComments && (
        <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
          {post.comments_list && post.comments_list.map((comment) => (
            <Box key={comment.id} sx={{ display: 'flex', mb: 2 }}>
              <Avatar src={comment.author?.avatar} sx={{ width: 30, height: 30, mr: 1, mt: 0.5, bgcolor: '#555' }}>
                {comment.author?.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ bgcolor: 'rgba(0,0,0,0.2)', p: 1.5, borderRadius: '0 12px 12px 12px', flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="subtitle2" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                    {comment.author?.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {new Date(comment.created_at).toLocaleString('uk-UA')}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mb: comment.image ? 1 : 0 }}>
                  {comment.text}
                </Typography>
                {comment.image && (
                  <Box sx={{ mt: 1, display: 'flex' }}>
                    <Box 
                      component="img" 
                      src={comment.image} 
                      alt="Comment attachment" 
                      sx={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', objectFit: 'contain', cursor: 'pointer' }} 
                      onClick={() => setOpenImage(comment.image)}
                    />
                  </Box>
                )}
              </Box>
            </Box>
          ))}
          
          {isAuthenticated && (
            <Box sx={{ mt: 2 }}>
              {commentImagePreview && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, position: 'relative', width: 'fit-content' }}>
                  <img src={commentImagePreview} alt="Preview" style={{ height: 60, borderRadius: 8 }} />
                  <Button size="small" onClick={handleCancelImage} sx={{ minWidth: 'unset', p: 0, ml: 1, color: 'error.main' }}>Видалити</Button>
                </Box>
              )}
              <Box component="form" onSubmit={handleCreateComment} sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  placeholder="Напишіть коментар..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  sx={{ mr: 1 }}
                />
                <IconButton component="label" sx={{ color: 'text.secondary', mr: 0.5 }}>
                  <PhotoCamera />
                  <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                </IconButton>
                <Box sx={{ mr: 1 }}>
                  <EmojiPicker onSelect={(emoji) => setNewComment(prev => prev + emoji)} />
                </Box>
                <IconButton type="submit" color="primary" disabled={!newComment.trim() && !commentImage}>
                  <SendIcon />
                </IconButton>
              </Box>
            </Box>
          )}
        </Box>
      )}
      <ImageModal 
        isOpen={!!openImage} 
        imageUrl={openImage} 
        onClose={() => setOpenImage(null)} 
      />
    </Paper>
  );
};

export default PostCard;
