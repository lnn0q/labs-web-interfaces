import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Paper } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../store/authSlice';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useSelector((state) => state.auth);

  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    if (error) dispatch(clearError());
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(login(formData));
    if (login.fulfilled.match(resultAction)) {
      navigate(from, { replace: true });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper className="glass-card" sx={{ p: 4 }}>
        <Typography variant="h4" align="center" sx={{ mb: 4, fontWeight: 700, color: '#FF6B00' }}>
          Вхід до Takibi
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2, textAlign: 'center', bgcolor: 'rgba(255,0,0,0.1)', p: 1, borderRadius: 1 }}>
            {typeof error === 'string' ? error : 'Невірний email або пароль'}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required
            margin="normal"
            sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#FF6B00' } } }}
          />
          <TextField
            fullWidth label="Пароль" name="password" type="password" value={formData.password} onChange={handleChange} required
            margin="normal"
            sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#FF6B00' } } }}
          />
          
          <Button
            type="submit" fullWidth variant="contained" color="primary" disabled={loading}
            sx={{ mt: 4, mb: 2, py: 1.5, fontSize: '1.1rem' }} className="glow-button"
          >
            {loading ? 'Входимо...' : 'Увійти'}
          </Button>

          <Typography align="center" variant="body2" color="text.secondary">
            Немає акаунту? <Link to="/register" style={{ color: '#FFD700', textDecoration: 'none' }}>Зареєструватися</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
