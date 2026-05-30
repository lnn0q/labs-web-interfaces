import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Paper, Box, Button, TextField, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, MenuItem, Grid, Alert, IconButton,
  Avatar, Tabs, Tab, Dialog, DialogTitle, DialogContent, DialogActions, Divider
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PeopleIcon from '@mui/icons-material/People';
import GroupsIcon from '@mui/icons-material/Groups';
import QueueIcon from '@mui/icons-material/Queue';
import AddIcon from '@mui/icons-material/Add';
import CircleIcon from '@mui/icons-material/Circle';
import EditIcon from '@mui/icons-material/Edit';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SendIcon from '@mui/icons-material/Send';
import CircularProgress from '@mui/material/CircularProgress';
import api from '../services/api';

const AdminPage = () => {
  const [tab, setTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [fandoms, setFandoms] = useState([]);
  const [fandomRequests, setFandomRequests] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [fandomData, setFandomData] = useState({ name: '', slug: '', description: '', category: 'anime' });
  const [fandomImage, setFandomImage] = useState(null);
  const [fandomImagePreview, setFandomImagePreview] = useState(null);
  const [fandomSuccess, setFandomSuccess] = useState('');
  const [fandomError, setFandomError] = useState('');

  const [deleteDialog, setDeleteDialog] = useState({ open: false, type: '', id: null, name: '' });
  
  const [editUserDialog, setEditUserDialog] = useState({ open: false, data: null });
  const [editFandomDialog, setEditFandomDialog] = useState({ open: false, data: null });
  const [approveRequestDialog, setApproveRequestDialog] = useState({ open: false, data: null });

  const [emailSubject, setEmailSubject] = useState('Вогнище кличе! Нові події у твоїх фандомах 🔥');
  const [emailMessage, setEmailMessage] = useState("Привіт! Давно не бачилися біля вогнища. У твоїх улюблених фандомах з'явилося багато нового: свіжі обговорення, нові учасники та гарячі пости. Заходь на Takibi, щоб не пропустити найцікавіше! Твій фандом чекає на тебе.");
  const [emailFandomId, setEmailFandomId] = useState('');

  const [actionSuccess, setActionSuccess] = useState('');



  const fetchUsers = async () => {
    try {
      const response = await api.get('auth/users/');
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFandoms = async () => {
    try {
      const response = await api.get('fandoms/');
      setFandoms(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFandomRequests = async () => {
    try {
      const response = await api.get('fandoms/requests/');
      setFandomRequests(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await api.get('notifications/task-results/');
      setTasks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchFandoms();
    fetchFandomRequests();
    fetchTasks();

    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${window.location.host}/ws/admin/tasks/?token=${token}`;
    const finalWsUrl = window.location.port === '3000' 
      ? `ws://localhost:8000/ws/admin/tasks/?token=${token}` 
      : wsUrl;

    const ws = new WebSocket(finalWsUrl);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'initial_tasks') {
        setTasks(data.tasks);
      } else if (data.type === 'task_update') {
        setTasks(prev => {
          const exists = prev.find(t => t.id === data.task.id);
          if (exists) {
            return prev.map(t => t.id === data.task.id ? data.task : t);
          } else {
            return [data.task, ...prev];
          }
        });
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleRunTask = async (taskType) => {
    try {
      await api.post('notifications/run-task/', { task_type: taskType });
      setActionSuccess('Задачу успішно запущено');
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    try {
      await api.post('notifications/send-email/', {
        subject: emailSubject,
        message: emailMessage,
        fandom_id: emailFandomId
      });
      setActionSuccess('Задачу розсилки листів запущено');
      setEmailFandomId('');
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await api.delete(`auth/users/${deleteDialog.id}/delete/`);
      setActionSuccess(`Користувача "${deleteDialog.name}" видалено`);
      setDeleteDialog({ open: false, type: '', id: null, name: '' });
      fetchUsers();
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (error) {
      setActionSuccess('');
      console.error(error);
    }
  };

  const handleDeleteFandom = async () => {
    try {
      await api.delete(`fandoms/${deleteDialog.id}/delete/`);
      setActionSuccess(`Фандом "${deleteDialog.name}" видалено`);
      setDeleteDialog({ open: false, type: '', id: null, name: '' });
      fetchFandoms();
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenApproveRequest = (req) => {
    setApproveRequestDialog({
      open: true,
      data: { id: req.id, name: req.name, slug: req.slug, category: req.category, description: req.description }
    });
  };

  const handleApproveRequest = async () => {
    try {
      await api.post(`fandoms/requests/${approveRequestDialog.data.id}/approve/`, approveRequestDialog.data);
      setActionSuccess('Запит схвалено, фандом створено!');
      setApproveRequestDialog({ open: false, data: null });
      fetchFandomRequests();
      fetchFandoms();
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateUser = async () => {
    try {
      const payload = { ...editUserDialog.data };
      delete payload.avatar;
      delete payload.last_seen;
      
      await api.patch(`auth/users/${editUserDialog.data.id}/update/`, payload);
      setActionSuccess('Користувача оновлено');
      setEditUserDialog({ open: false, data: null });
      fetchUsers();
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (error) {
      console.error(error);
      setActionSuccess('Помилка оновлення користувача');
      setTimeout(() => setActionSuccess(''), 3000);
    }
  };

  const handleUpdateFandom = async () => {
    try {
      const payload = { ...editFandomDialog.data };
      delete payload.image;
      delete payload.image_url;
      delete payload.members_count;
      delete payload.created_at;

      await api.patch(`fandoms/${editFandomDialog.data.slug}/`, payload);
      setActionSuccess('Фандом оновлено');
      setEditFandomDialog({ open: false, data: null });
      fetchFandoms();
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (error) {
      console.error(error);
      setActionSuccess('Помилка оновлення фандому');
      setTimeout(() => setActionSuccess(''), 3000);
    }
  };

  const handleRejectRequest = async (id) => {
    try {
      await api.post(`fandoms/requests/${id}/reject/`);
      setActionSuccess('Запит відхилено');
      fetchFandomRequests();
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFandomFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFandomImage(file);
      setFandomImagePreview(URL.createObjectURL(file));
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

  const handleFandomNameChange = (e) => {
    const name = e.target.value;
    const slug = transliterate(name.toLowerCase())
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setFandomData({ ...fandomData, name, slug });
  };

  const handleCreateFandom = async (e) => {
    e.preventDefault();
    setFandomSuccess('');
    setFandomError('');
    
    const formData = new FormData();
    formData.append('name', fandomData.name);
    formData.append('slug', fandomData.slug);
    formData.append('description', fandomData.description);
    formData.append('category', fandomData.category);
    if (fandomImage) {
      formData.append('image', fandomImage);
    }

    try {
      await api.post('fandoms/', formData);
      setFandomSuccess('Фандом успішно створено!');
      setFandomData({ name: '', slug: '', description: '', category: 'anime' });
      setFandomImage(null);
      setFandomImagePreview(null);
      fetchFandoms();
    } catch (error) {
      const errDetail = error.response?.data;
      if (errDetail && typeof errDetail === 'object') {
        const firstKey = Object.keys(errDetail)[0];
        setFandomError(`${firstKey}: ${errDetail[firstKey]}`);
      } else {
        setFandomError('Помилка при створенні фандому');
      }
    }
  };

  const categories = [
    { value: 'anime', label: 'Аніме' },
    { value: 'books', label: 'Книги' },
    { value: 'series', label: 'Серіали' },
    { value: 'games', label: 'Ігри' },
    { value: 'other', label: 'Інше' }
  ];

  const statusColor = {
    'success': 'success',
    'pending': 'warning',
    'failure': 'error',
    'approved': 'success',
    'rejected': 'error'
  };

  const pendingRequests = fandomRequests.filter(r => r.status === 'pending');

  return (
    <Container maxWidth="lg" sx={{ mt: 2, pb: 4 }}>
      <Typography variant="h4" className="anime-title" sx={{ mb: 3, fontWeight: 'bold' }}>
        Панель адміністратора
      </Typography>

      {actionSuccess && <Alert severity="success" sx={{ mb: 2 }}>{actionSuccess}</Alert>}

      <Paper className="glass-card" sx={{ mb: 4 }}>
        <Tabs
          value={tab}
          onChange={(e, newVal) => setTab(newVal)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': { color: 'text.secondary', fontWeight: 600, textTransform: 'none', fontSize: '0.95rem' },
            '& .Mui-selected': { color: '#FFD700' },
            '& .MuiTabs-indicator': { backgroundColor: '#FF6B00' },
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            px: 2
          }}
        >
          <Tab icon={<PeopleIcon />} iconPosition="start" label={`Користувачі (${users.length})`} />
          <Tab icon={<GroupsIcon />} iconPosition="start" label={`Фандоми (${fandoms.length})`} />
          <Tab icon={<QueueIcon />} iconPosition="start" label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              Запити на фандоми
              {pendingRequests.length > 0 && (
                <Chip label={pendingRequests.length} color="warning" size="small" sx={{ height: 20, fontWeight: 'bold' }} />
              )}
            </Box>
          } />
          <Tab icon={<AddIcon />} iconPosition="start" label="Створити фандом" />
          <Tab icon={<NotificationsActiveIcon />} iconPosition="start" label="Асинхронні задачі" />
        </Tabs>
      </Paper>

      {tab === 0 && (
        <Paper className="glass-card" sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ color: '#FFD700', fontWeight: 'bold' }}>Користувачі</Typography>
            <Button onClick={fetchUsers} color="secondary" variant="outlined" size="small">Оновити</Button>
          </Box>
          <TableContainer>
            <Table sx={{ '& .MuiTableCell-root': { borderColor: 'rgba(255,255,255,0.05)' } }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#FF6B00', fontWeight: 'bold' }}>Аватар</TableCell>
                  <TableCell sx={{ color: '#FF6B00', fontWeight: 'bold' }}>Ім'я</TableCell>
                  <TableCell sx={{ color: '#FF6B00', fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell sx={{ color: '#FF6B00', fontWeight: 'bold' }}>Статус</TableCell>
                  <TableCell sx={{ color: '#FF6B00', fontWeight: 'bold' }}>Роль</TableCell>
                  <TableCell sx={{ color: '#FF6B00', fontWeight: 'bold' }}>Дії</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id} hover>
                    <TableCell>
                      <Avatar src={u.avatar} sx={{ width: 36, height: 36, bgcolor: '#FF6B00' }}>
                        {u.name?.charAt(0)}
                      </Avatar>
                    </TableCell>
                    <TableCell>{u.name}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{u.email}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CircleIcon sx={{ fontSize: 10, color: u.is_online ? '#4caf50' : '#757575' }} />
                        <Typography variant="body2">
                          {u.is_online ? 'Онлайн' : 'Офлайн'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={u.email === 'kenzo@takibi.ua' ? 'Маскот' : (u.is_staff ? 'Адмін' : 'Користувач')}
                        size="small"
                        color={u.email === 'kenzo@takibi.ua' ? 'secondary' : (u.is_staff ? 'primary' : 'default')}
                        sx={{ fontWeight: 'bold' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => setEditUserDialog({ open: true, data: u })}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setDeleteDialog({ open: true, type: 'user', id: u.id, name: u.name })}
                          disabled={u.is_staff}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>Немає користувачів</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {tab === 1 && (
        <Paper className="glass-card" sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ color: '#FFD700', fontWeight: 'bold' }}>Фандоми</Typography>
            <Button onClick={fetchFandoms} color="secondary" variant="outlined" size="small">Оновити</Button>
          </Box>
          <TableContainer>
            <Table sx={{ '& .MuiTableCell-root': { borderColor: 'rgba(255,255,255,0.05)' } }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#FF6B00', fontWeight: 'bold' }}>Обкладинка</TableCell>
                  <TableCell sx={{ color: '#FF6B00', fontWeight: 'bold' }}>Назва</TableCell>
                  <TableCell sx={{ color: '#FF6B00', fontWeight: 'bold' }}>Категорія</TableCell>
                  <TableCell sx={{ color: '#FF6B00', fontWeight: 'bold' }}>Учасників</TableCell>
                  <TableCell sx={{ color: '#FF6B00', fontWeight: 'bold' }}>Створено</TableCell>
                  <TableCell sx={{ color: '#FF6B00', fontWeight: 'bold' }}>Дії</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fandoms.map((f) => (
                  <TableRow key={f.id} hover>
                    <TableCell>
                      <Box
                        component="img"
                        src={f.image_url}
                        alt={f.name}
                        sx={{ width: 50, height: 35, objectFit: 'cover', borderRadius: 1 }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{f.name}</TableCell>
                    <TableCell>
                      <Chip label={categories.find(c => c.value === f.category)?.label || f.category} size="small" />
                    </TableCell>
                    <TableCell>{f.members_count}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>
                      {new Date(f.created_at).toLocaleDateString('uk-UA')}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => setEditFandomDialog({ open: true, data: f })}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setDeleteDialog({ open: true, type: 'fandom', id: f.id, name: f.name })}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                {fandoms.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>Немає фандомів</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {tab === 2 && (
        <Paper className="glass-card" sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ color: '#FFD700', fontWeight: 'bold' }}>Запити на створення фандомів</Typography>
            <Button onClick={fetchFandomRequests} color="secondary" variant="outlined" size="small">Оновити</Button>
          </Box>
          <TableContainer>
            <Table sx={{ '& .MuiTableCell-root': { borderColor: 'rgba(255,255,255,0.05)' } }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#FF6B00', fontWeight: 'bold' }}>Назва</TableCell>
                  <TableCell sx={{ color: '#FF6B00', fontWeight: 'bold' }}>Категорія</TableCell>
                  <TableCell sx={{ color: '#FF6B00', fontWeight: 'bold' }}>Автор запиту</TableCell>
                  <TableCell sx={{ color: '#FF6B00', fontWeight: 'bold' }}>Дата</TableCell>
                  <TableCell sx={{ color: '#FF6B00', fontWeight: 'bold' }}>Статус</TableCell>
                  <TableCell sx={{ color: '#FF6B00', fontWeight: 'bold' }}>Дії</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fandomRequests.map((req) => (
                  <TableRow key={req.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{req.name}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{req.description.substring(0, 60)}...</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={categories.find(c => c.value === req.category)?.label || req.category} size="small" />
                    </TableCell>
                    <TableCell>{req.user?.name || req.user?.email}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>
                      {new Date(req.created_at).toLocaleDateString('uk-UA')}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={req.status === 'pending' ? 'На розгляді' : req.status === 'approved' ? 'Схвалено' : 'Відхилено'}
                        color={statusColor[req.status]}
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </TableCell>
                    <TableCell>
                      {req.status === 'pending' && (
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton size="small" color="success" onClick={() => handleOpenApproveRequest(req)} title="Схвалити та змінити дані">
                            <CheckCircleIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={() => handleRejectRequest(req.id)} title="Відхилити">
                            <CancelIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {fandomRequests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>Немає запитів на створення фандомів</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {tab === 3 && (
        <Paper className="glass-card" sx={{ p: 4, maxWidth: 600 }}>
          <Typography variant="h5" sx={{ mb: 3, color: '#FFD700', fontWeight: 'bold' }}>
            Створити новий фандом
          </Typography>

          {fandomSuccess && <Alert severity="success" sx={{ mb: 2 }}>{fandomSuccess}</Alert>}
          {fandomError && <Alert severity="error" sx={{ mb: 2 }}>{fandomError}</Alert>}

          <Box component="form" onSubmit={handleCreateFandom} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              size="small"
              label="Назва фандому"
              required
              value={fandomData.name}
              onChange={handleFandomNameChange}
            />
            <TextField
              size="small"
              label="Slug (генерується автоматично)"
              required
              value={fandomData.slug}
              onChange={e => setFandomData({...fandomData, slug: e.target.value})}
            />
            <TextField
              select
              size="small"
              label="Категорія"
              required
              value={fandomData.category}
              onChange={e => setFandomData({...fandomData, category: e.target.value})}
            >
              {categories.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              size="small"
              label="Опис фандому"
              multiline
              rows={3}
              required
              value={fandomData.description}
              onChange={e => setFandomData({...fandomData, description: e.target.value})}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
              {fandomImagePreview && (
                <img src={fandomImagePreview} alt="Preview" style={{ width: 80, height: 50, borderRadius: 4, objectFit: 'cover' }} />
              )}
              <Button variant="outlined" component="label" startIcon={<PhotoCamera />}>
                Завантажити обкладинку
                <input type="file" hidden accept="image/*" onChange={handleFandomFileChange} />
              </Button>
            </Box>

            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, fontWeight: 'bold' }}>
              Створити фандом
            </Button>
          </Box>
        </Paper>
      )}

      {/* Tab 4: Async Tasks */}
      {tab === 4 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Paper className="glass-card" sx={{ p: 3, mb: 3 }}>
              <Typography variant="h5" sx={{ color: '#FFD700', fontWeight: 'bold', mb: 3 }}>Керування задачами</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  startIcon={<PlayArrowIcon />}
                  onClick={() => handleRunTask('stats')}
                >
                  Згенерувати статистику фандомів
                </Button>
                <Button 
                  variant="contained" 
                  color="warning" 
                  startIcon={<PlayArrowIcon />}
                  onClick={() => handleRunTask('cleanup')}
                >
                  Очистити відхилені запити
                </Button>
              </Box>
            </Paper>

            <Paper className="glass-card" sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ color: '#FFD700', fontWeight: 'bold', mb: 3 }}>Email-розсилка</Typography>
              <form onSubmit={handleSendEmail}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    select
                    label="Оберіть фандом"
                    size="small"
                    required
                    fullWidth
                    value={emailFandomId}
                    onChange={(e) => setEmailFandomId(e.target.value)}
                  >
                    {fandoms.map((f) => (
                      <MenuItem key={f.id} value={f.id}>{f.name}</MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    label="Тема листа"
                    size="small"
                    required
                    fullWidth
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                  />
                  <TextField
                    label="Повідомлення"
                    size="small"
                    required
                    multiline
                    rows={4}
                    fullWidth
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                  />
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    endIcon={<SendIcon />}
                    disabled={!emailFandomId}
                  >
                    Надіслати листи
                  </Button>
                </Box>
              </form>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={7}>
            <Paper className="glass-card" sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" sx={{ color: '#FFD700', fontWeight: 'bold', mb: 3 }}>Статус виконання</Typography>
              <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader sx={{ '& .MuiTableCell-root': { borderColor: 'rgba(255,255,255,0.05)' } }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: '#FF6B00', fontWeight: 'bold', bgcolor: '#1E1E1E' }}>Операція</TableCell>
                      <TableCell sx={{ color: '#FF6B00', fontWeight: 'bold', bgcolor: '#1E1E1E' }}>Дані</TableCell>
                      <TableCell sx={{ color: '#FF6B00', fontWeight: 'bold', bgcolor: '#1E1E1E' }}>Результат</TableCell>
                      <TableCell sx={{ color: '#FF6B00', fontWeight: 'bold', bgcolor: '#1E1E1E' }}>Завершено</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tasks.map((t) => (
                      <TableRow key={t.id} hover>
                        <TableCell sx={{ fontWeight: 600 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {t.status === 'success' ? <CheckCircleIcon color="success" fontSize="small"/> : 
                             t.status === 'failure' ? <CancelIcon color="error" fontSize="small"/> :
                             <CircularProgress size={16} color="warning" />}
                            {t.task_name}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>{t.task_data}</TableCell>
                        <TableCell>
                          <Box 
                            sx={{ 
                              display: 'inline-block',
                              maxWidth: 150,
                              py: 0.5,
                              px: 1.5,
                              borderRadius: 4,
                              fontSize: '0.8125rem',
                              lineHeight: 1.2,
                              color: t.status === 'pending' ? 'warning.main' : '#fff',
                              bgcolor: t.status === 'success' ? 'success.main' : t.status === 'failure' ? 'error.main' : 'transparent',
                              border: t.status === 'pending' ? '1px solid' : 'none',
                              borderColor: 'warning.main'
                            }}
                          >
                            {t.result || 'В процесі...'}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                          {t.completed_at ? new Date(t.completed_at).toLocaleString('uk-UA') : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                    {tasks.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary' }}>Задач поки немає</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, type: '', id: null, name: '' })}>
        <DialogTitle sx={{ bgcolor: '#1E1E1E', color: '#fff' }}>
          Підтвердити видалення
        </DialogTitle>
        <DialogContent sx={{ bgcolor: '#1E1E1E' }}>
          <Typography sx={{ color: '#B0B0B0', mt: 1 }}>
            Ви впевнені, що хочете видалити {deleteDialog.type === 'user' ? 'користувача' : 'фандом'} <b style={{ color: '#FFD700' }}>"{deleteDialog.name}"</b>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#1E1E1E' }}>
          <Button onClick={() => setDeleteDialog({ open: false, type: '', id: null, name: '' })} color="inherit">
            Скасувати
          </Button>
          <Button
            onClick={deleteDialog.type === 'user' ? handleDeleteUser : handleDeleteFandom}
            color="error"
            variant="contained"
          >
            Видалити
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editUserDialog.open} onClose={() => setEditUserDialog({ open: false, data: null })} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#1E1E1E', color: '#FFD700' }}>Редагувати користувача</DialogTitle>
        <DialogContent sx={{ bgcolor: '#1E1E1E', pt: 2 }}>
          {editUserDialog.data && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="Ім'я"
                size="small"
                fullWidth
                value={editUserDialog.data.name || ''}
                onChange={(e) => setEditUserDialog({ ...editUserDialog, data: { ...editUserDialog.data, name: e.target.value } })}
              />
              <TextField
                label="Email"
                size="small"
                fullWidth
                value={editUserDialog.data.email || ''}
                onChange={(e) => setEditUserDialog({ ...editUserDialog, data: { ...editUserDialog.data, email: e.target.value } })}
              />
              <TextField
                select
                label="Стать"
                size="small"
                fullWidth
                value={editUserDialog.data.gender || ''}
                onChange={(e) => setEditUserDialog({ ...editUserDialog, data: { ...editUserDialog.data, gender: e.target.value } })}
              >
                <MenuItem value="male">Чоловіча</MenuItem>
                <MenuItem value="female">Жіноча</MenuItem>
                <MenuItem value="other">Інша</MenuItem>
              </TextField>
              <TextField
                select
                label="Роль"
                size="small"
                fullWidth
                value={editUserDialog.data.is_staff ? 'true' : 'false'}
                onChange={(e) => setEditUserDialog({ ...editUserDialog, data: { ...editUserDialog.data, is_staff: e.target.value === 'true' } })}
              >
                <MenuItem value="false">Користувач</MenuItem>
                <MenuItem value="true">Адміністратор</MenuItem>
              </TextField>
              <TextField
                label="Біографія"
                size="small"
                multiline
                rows={3}
                fullWidth
                value={editUserDialog.data.bio || ''}
                onChange={(e) => setEditUserDialog({ ...editUserDialog, data: { ...editUserDialog.data, bio: e.target.value } })}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#1E1E1E' }}>
          <Button onClick={() => setEditUserDialog({ open: false, data: null })} color="inherit">Скасувати</Button>
          <Button onClick={handleUpdateUser} variant="contained" color="primary">Зберегти</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Fandom Dialog */}
      <Dialog open={editFandomDialog.open} onClose={() => setEditFandomDialog({ open: false, data: null })} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#1E1E1E', color: '#FFD700' }}>Редагувати фандом</DialogTitle>
        <DialogContent sx={{ bgcolor: '#1E1E1E', pt: 2 }}>
          {editFandomDialog.data && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="Назва"
                size="small"
                fullWidth
                value={editFandomDialog.data.name || ''}
                onChange={(e) => setEditFandomDialog({ ...editFandomDialog, data: { ...editFandomDialog.data, name: e.target.value } })}
              />
              <TextField
                select
                label="Категорія"
                size="small"
                fullWidth
                value={editFandomDialog.data.category || 'anime'}
                onChange={(e) => setEditFandomDialog({ ...editFandomDialog, data: { ...editFandomDialog.data, category: e.target.value } })}
              >
                {categories.map((option) => (
                  <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="Опис"
                size="small"
                multiline
                rows={4}
                fullWidth
                value={editFandomDialog.data.description || ''}
                onChange={(e) => setEditFandomDialog({ ...editFandomDialog, data: { ...editFandomDialog.data, description: e.target.value } })}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#1E1E1E' }}>
          <Button onClick={() => setEditFandomDialog({ open: false, data: null })} color="inherit">Скасувати</Button>
          <Button onClick={handleUpdateFandom} variant="contained" color="primary">Зберегти</Button>
        </DialogActions>
      </Dialog>

      {/* Approve Request Dialog */}
      <Dialog open={approveRequestDialog.open} onClose={() => setApproveRequestDialog({ open: false, data: null })} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#1E1E1E', color: '#4caf50' }}>Схвалити та відредагувати запит</DialogTitle>
        <DialogContent sx={{ bgcolor: '#1E1E1E', pt: 2 }}>
          {approveRequestDialog.data && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="Назва"
                size="small"
                fullWidth
                value={approveRequestDialog.data.name || ''}
                onChange={(e) => setApproveRequestDialog({ ...approveRequestDialog, data: { ...approveRequestDialog.data, name: e.target.value } })}
              />
              <TextField
                select
                label="Категорія"
                size="small"
                fullWidth
                value={approveRequestDialog.data.category || 'anime'}
                onChange={(e) => setApproveRequestDialog({ ...approveRequestDialog, data: { ...approveRequestDialog.data, category: e.target.value } })}
              >
                {categories.map((option) => (
                  <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="Опис"
                size="small"
                multiline
                rows={4}
                fullWidth
                value={approveRequestDialog.data.description || ''}
                onChange={(e) => setApproveRequestDialog({ ...approveRequestDialog, data: { ...approveRequestDialog.data, description: e.target.value } })}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#1E1E1E' }}>
          <Button onClick={() => setApproveRequestDialog({ open: false, data: null })} color="inherit">Скасувати</Button>
          <Button onClick={handleApproveRequest} variant="contained" color="success">Схвалити</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminPage;
