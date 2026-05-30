import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Paper, MenuItem } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../store/authSlice';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    gender: 'other',
    date_of_birth: ''
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    if (error) dispatch(clearError());
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(register(formData));
    if (register.fulfilled.match(resultAction)) {
      navigate('/');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper className="glass-card" sx={{ p: 4 }}>
        <Typography variant="h4" align="center" sx={{ mb: 4, fontWeight: 700, color: '#FF6B00' }}>
          Реєстрація у Takibi
        </Typography>
        
        {error && (
          <Typography color="error" sx={{ mb: 2, textAlign: 'center', bgcolor: 'rgba(255,0,0,0.1)', p: 1, borderRadius: 1 }}>
            {typeof error === 'string' ? error : 'Помилка реєстрації. Перевірте дані.'}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth label="Ім'я" name="name" value={formData.name} onChange={handleChange} required
            margin="normal" variant="outlined"
            sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#FF6B00' } } }}
          />
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
          <TextField
            select fullWidth label="Стать" name="gender" value={formData.gender} onChange={handleChange} required
            margin="normal"
          >
            <MenuItem value="male">Чоловіча</MenuItem>
            <MenuItem value="female">Жіноча</MenuItem>
            <MenuItem value="other">Інша</MenuItem>
          </TextField>
          <TextField
            fullWidth label="Дата народження" name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange} required
            margin="normal" InputLabelProps={{ shrink: true }}
          />
          
          <Button
            type="submit" fullWidth variant="contained" color="primary" disabled={loading}
            sx={{ mt: 4, mb: 2, py: 1.5, fontSize: '1.1rem' }} className="glow-button"
          >
            {loading ? 'Реєструємо...' : 'Приєднатися'}
          </Button>
          
          <Typography align="center" variant="body2" color="text.secondary">
            Вже маєте акаунт? <Link to="/login" style={{ color: '#FFD700', textDecoration: 'none' }}>Увійти</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
