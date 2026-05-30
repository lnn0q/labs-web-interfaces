import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Grid, TextField, InputAdornment, ToggleButton, ToggleButtonGroup, CircularProgress, Paper, Button, MenuItem, Alert, Collapse } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFandoms } from '../store/fandomSlice';
import FandomCard from '../components/FandomCard';
import api from '../services/api';

const HomePage = () => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.fandoms);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestData, setRequestData] = useState({ name: '', slug: '', description: '', category: 'anime' });
  const [requestImage, setRequestImage] = useState(null);
  const [requestSuccess, setRequestSuccess] = useState('');
  const [requestError, setRequestError] = useState('');

  useEffect(() => {
    dispatch(fetchFandoms(category));
  }, [dispatch, category]);

  const handleCategoryChange = (event, newCategory) => {
    if (newCategory !== null) {
      setCategory(newCategory);
    }
  };

  const transliterate = (text) => {
    const cyrillicToLatin = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'h', 'ґ': 'g', 'д': 'd', 'е': 'e', 'є': 'ye', 'ж': 'zh', 
      'з': 'z', 'и': 'y', 'і': 'i', 'ї': 'yi', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 
      'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 
      'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ь': '', 'ю': 'yu', 'я': 'ya',
      'ы': 'y', 'э': 'e', 'ъ': ''
    };
    return text.split('').map(char => cyrillicToLatin[char] || char).join('');
  };

  const handleRequestNameChange = (e) => {
    const name = e.target.value;
    const slug = transliterate(name.toLowerCase())
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setRequestData({ ...requestData, name, slug });
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    setRequestSuccess('');
    setRequestError('');

    const formData = new FormData();
    formData.append('name', requestData.name);
    formData.append('slug', requestData.slug);
    formData.append('description', requestData.description);
    formData.append('category', requestData.category);
    if (requestImage) {
      formData.append('image', requestImage);
    }

    try {
      await api.post('fandoms/requests/', formData);
      setRequestSuccess('Ваш запит на створення фандому надіслано! Адміністратор розгляне його найближчим часом.');
      setRequestData({ name: '', slug: '', description: '', category: 'anime' });
      setRequestImage(null);
      setTimeout(() => { setRequestSuccess(''); setShowRequestForm(false); }, 4000);
    } catch (error) {
      const errDetail = error.response?.data;
      if (errDetail && typeof errDetail === 'object') {
        const firstKey = Object.keys(errDetail)[0];
        setRequestError(`${firstKey}: ${errDetail[firstKey]}`);
      } else {
        setRequestError('Помилка при надсиланні запиту');
      }
    }
  };

  const filteredList = list.filter(fandom => 
    fandom.name.toLowerCase().includes(search.toLowerCase()) || 
    fandom.description.toLowerCase().includes(search.toLowerCase())
  );

  const categories = [
    { value: 'anime', label: 'Аніме' },
    { value: 'books', label: 'Книги' },
    { value: 'series', label: 'Серіали' },
    { value: 'games', label: 'Ігри' },
    { value: 'other', label: 'Інше' }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" className="anime-title" sx={{ mb: 2 }}>
          Знайди свій Фандом
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Спілкуйся з тими, хто розуміє твої інтереси
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', mb: 4, gap: 2 }}>
        <ToggleButtonGroup
          value={category}
          exclusive
          onChange={handleCategoryChange}
          aria-label="фільтр категорій"
          sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'center',
            '& .MuiToggleButton-root': { 
              color: 'text.secondary', 
              borderColor: 'rgba(255,255,255,0.1)', 
              '&.Mui-selected': { color: '#FF6B00', bgcolor: 'rgba(255,107,0,0.1)' },
              flex: { xs: '1 1 30%', sm: 'none' }
            } 
          }}
        >
          <ToggleButton value="">Всі</ToggleButton>
          <ToggleButton value="anime">Аніме</ToggleButton>
          <ToggleButton value="books">Книги</ToggleButton>
          <ToggleButton value="series">Серіали</ToggleButton>
          <ToggleButton value="games">Ігри</ToggleButton>
          <ToggleButton value="other">Інше</ToggleButton>
        </ToggleButtonGroup>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' }, width: { xs: '100%', md: 'auto' } }}>
          {isAuthenticated && !user?.is_staff && (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => setShowRequestForm(!showRequestForm)}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Запропонувати фандом
            </Button>
          )}
          <TextField
            placeholder="Пошук..."
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#FF6B00' }} /></InputAdornment>,
            }}
            sx={{ width: { xs: '100%', md: '300px' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }, '&.Mui-focused fieldset': { borderColor: '#FF6B00' } } }}
          />
        </Box>
      </Box>

      <Collapse in={showRequestForm}>
        <Paper className="glass-card" sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#FFD700', fontWeight: 'bold' }}>
            Запропонувати новий фандом
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Заповніть форму, і адміністратор розгляне ваш запит. Після схвалення фандом з'явиться на головній сторінці.
          </Typography>

          {requestSuccess && <Alert severity="success" sx={{ mb: 2 }}>{requestSuccess}</Alert>}
          {requestError && <Alert severity="error" sx={{ mb: 2 }}>{requestError}</Alert>}

          <Box component="form" onSubmit={handleSubmitRequest} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth size="small" label="Назва фандому" required value={requestData.name} onChange={handleRequestNameChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth select size="small" label="Категорія" required value={requestData.category} onChange={e => setRequestData({...requestData, category: e.target.value})}>
                  {categories.map((option) => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth size="small" label="Опис фандому" multiline rows={2} required value={requestData.description} onChange={e => setRequestData({...requestData, description: e.target.value})} />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Button variant="outlined" component="label" size="small">
                    Додати обкладинку
                    <input type="file" hidden accept="image/*" onChange={(e) => setRequestImage(e.target.files[0])} />
                  </Button>
                  {requestImage && <Typography variant="caption" color="text.secondary">{requestImage.name}</Typography>}
                  <Box sx={{ flexGrow: 1 }} />
                  <Button type="submit" variant="contained" color="primary" size="small" sx={{ fontWeight: 'bold' }}>
                    Надіслати запит
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Collapse>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {filteredList.map((fandom) => (
            <Grid item key={fandom.id} xs={12} sm={6} md={4}>
              <FandomCard fandom={fandom} />
            </Grid>
          ))}
          {filteredList.length === 0 && (
            <Grid item xs={12}>
              <Typography variant="h6" align="center" color="text.secondary" sx={{ mt: 5 }}>
                За вашим запитом нічого не знайдено.
              </Typography>
            </Grid>
          )}
        </Grid>
      )}
    </Container>
  );
};

export default HomePage;
