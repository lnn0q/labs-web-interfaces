import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Avatar, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, updateProfile } from '../store/authSlice';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { Grid } from '@mui/material';
import api from '../services/api';
import FandomCard from '../components/FandomCard';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [myFandoms, setMyFandoms] = useState([]);
  const [loadingFandoms, setLoadingFandoms] = useState(true);

  useEffect(() => {
    dispatch(fetchProfile());
    api.get('fandoms/mine/')
      .then(res => {
        setMyFandoms(res.data);
        setLoadingFandoms(false);
      })
      .catch(err => {
        console.error('Failed to fetch my fandoms', err);
        setLoadingFandoms(false);
      });
  }, [dispatch]);

  const handleEditClick = () => {
    setEditData({
      name: user.name || '',
      gender: user.gender || '',
      date_of_birth: user.date_of_birth || '',
      bio: user.bio || ''
    });
    setAvatarFile(null);
    setAvatarPreview(user.avatar || null);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append('name', editData.name);
    if (editData.gender) formData.append('gender', editData.gender);
    if (editData.date_of_birth) formData.append('date_of_birth', editData.date_of_birth);
    if (editData.bio) formData.append('bio', editData.bio);
    if (avatarFile) formData.append('avatar', avatarFile);
    
    dispatch(updateProfile(formData)).then(() => {
      setOpen(false);
    });
  };

  if (loading || !user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  const genderMap = {
    'male': 'Чоловіча',
    'female': 'Жіноча',
    'other': 'Інша'
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper className="glass-card" sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4, borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar src={user.avatar} sx={{ width: 80, height: 80, mr: 3, bgcolor: '#FF6B00' }}>
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{user.name}</Typography>
          </Box>
          <Button variant="outlined" color="primary" startIcon={<EditIcon />} onClick={handleEditClick}>
            Редагувати
          </Button>
        </Box>

        <Typography variant="h6" sx={{ mb: 2, color: '#FFD700' }}>Особисті дані</Typography>
        
        <TableContainer>
          <Table sx={{ '& .MuiTableCell-root': { borderColor: 'rgba(255,255,255,0.05)', py: 2 } }}>
            <TableBody>
              <TableRow hover>
                <TableCell component="th" scope="row" sx={{ color: 'text.secondary', width: '30%' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{user.email}</TableCell>
              </TableRow>
              <TableRow hover>
                <TableCell component="th" scope="row" sx={{ color: 'text.secondary' }}>Стать</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{genderMap[user.gender] || '-'}</TableCell>
              </TableRow>
              <TableRow hover>
                <TableCell component="th" scope="row" sx={{ color: 'text.secondary' }}>Дата народження</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{user.date_of_birth || '-'}</TableCell>
              </TableRow>
              <TableRow hover>
                <TableCell component="th" scope="row" sx={{ color: 'text.secondary' }}>Про себе</TableCell>
                <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'pre-wrap' }}>{user.bio || 'Не вказано'}</TableCell>
              </TableRow>
              <TableRow hover>
                <TableCell component="th" scope="row" sx={{ color: 'text.secondary' }}>Остання активність</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>
                  {new Date(user.last_seen).toLocaleString('uk-UA')}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Typography variant="h5" sx={{ mt: 5, mb: 3, fontWeight: 'bold' }}>Мої фандоми</Typography>
      {loadingFandoms ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress color="primary" />
        </Box>
      ) : myFandoms.length > 0 ? (
        <Grid container spacing={4}>
          {myFandoms.map(fandom => (
            <Grid item key={fandom.id} xs={12} sm={6} md={4}>
              <FandomCard fandom={fandom} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" color="text.secondary">
          Ви ще не приєдналися до жодного фандому.
        </Typography>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: '#1E1E1E' } }}>
        <DialogTitle sx={{ color: '#FF6B00' }}>Редагувати профіль</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3, mt: 1 }}>
            <Avatar src={avatarPreview} sx={{ width: 100, height: 100, mb: 2, bgcolor: '#FF6B00' }}>
              {editData.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Button variant="outlined" component="label" startIcon={<PhotoCamera />}>
              Завантажити нове фото
              <input type="file" hidden accept="image/*" onChange={handleFileChange} />
            </Button>
          </Box>
          <TextField margin="dense" label="Ім'я" name="name" fullWidth variant="outlined" value={editData.name} onChange={handleChange} sx={{ mb: 2 }} />
          <TextField select margin="dense" label="Стать" name="gender" fullWidth variant="outlined" value={editData.gender} onChange={handleChange} sx={{ mb: 2 }}>
            <MenuItem value=""><em>Не вказано</em></MenuItem>
            <MenuItem value="male">Чоловіча</MenuItem>
            <MenuItem value="female">Жіноча</MenuItem>
            <MenuItem value="other">Інша</MenuItem>
          </TextField>
          <TextField margin="dense" label="Дата народження" name="date_of_birth" type="date" fullWidth variant="outlined" value={editData.date_of_birth} onChange={handleChange} InputLabelProps={{ shrink: true }} sx={{ mb: 2 }} />
          <TextField margin="dense" label="Про себе" name="bio" multiline rows={4} fullWidth variant="outlined" value={editData.bio} onChange={handleChange} />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={handleClose} color="inherit">Скасувати</Button>
          <Button onClick={handleSave} variant="contained" color="primary" startIcon={<SaveIcon />}>Зберегти</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProfilePage;
