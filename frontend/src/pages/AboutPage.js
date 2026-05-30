import React, { useState } from 'react';
import { Container, Typography, Box, Grid, Paper } from '@mui/material';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import ImageModal from '../components/ImageModal';

const AboutPage = () => {
  const [openImage, setOpenImage] = useState(null);

  return (
    <Container maxWidth="lg" sx={{ mt: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
        <LocalFireDepartmentIcon sx={{ fontSize: 60, color: '#FF6B00', mr: 2 }} />
        <Typography variant="h2" align="center" sx={{ fontWeight: 800, letterSpacing: 2, color: '#FF6B00' }}>
          ПРО "TAKIBI"
        </Typography>
      </Box>
      
      <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 8, maxWidth: 800, mx: 'auto', lineHeight: 1.8 }}>
        «Takibi» - це сучасна українська платформа для гіків, анімешників та фанатів різних всесвітів. 
        Назва походить з японської мови і означає "вогнище" (ієрогліфами пишеться 焚き火). Цей вибір зумовлений бажанням
        відтворити такий же затишок, як перед костром. Мета Takibi - створити простір, де кожен зможе знайти однодумців, 
        поділитися враженнями від улюбленого аніме, серіалу чи книги, та поспілкуватися в реальному часі.
      </Typography>

      <Grid container spacing={6} alignItems="center">
        <Grid item xs={12} md={6}>
          <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <Box 
              component="img"
              src="/images/mascot.png" 
              alt="Маскот Кензо"
              sx={{ 
                width: '100%', 
                maxWidth: 400, 
                borderRadius: '24px',
                boxShadow: '0 20px 40px rgba(255, 107, 0, 0.2)',
                border: '2px solid rgba(255, 107, 0, 0.3)',
                transition: 'transform 0.3s ease-in-out',
                cursor: 'pointer',
                '&:hover': { transform: 'scale(1.05)' }
              }}
              onClick={() => setOpenImage('/images/mascot.png')}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper className="glass-card" sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#FFD700' }}>
              Знайомтесь - Кензо!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, fontSize: '1.1rem', lineHeight: 1.7, color: 'text.secondary' }}>
              Це офіційний талісман. Крутий аніме-свин, який слідкує за порядком на платформі, 
              обожнює попкорн, дивиться всі новинки аніме і завжди готовий підтримати бесіду в чаті.
            </Typography>

            <Typography variant="h5" sx={{ mb: 2, mt: 4, fontWeight: 'bold', color: '#FFD700' }}>
              Технології платформи
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.7, color: 'text.secondary' }}>
              Цей сайт створений з любов'ю та використанням сучасних технологій:
              <br/><br/>
              <strong>React & Material-UI</strong> - для швидкого та красивого інтерфейсу.<br/>
              <strong>Django & Python</strong> - потужний і надійний бекенд.<br/>
              <strong>Redis & WebSockets</strong> - для миттєвих повідомлень у чатах.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 8, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <Paper className="glass-card" sx={{ p: 4, maxWidth: 600, width: '100%', textAlign: 'center', background: 'linear-gradient(145deg, rgba(30,30,30,0.9) 0%, rgba(20,20,20,0.9) 100%)', border: '1px solid rgba(255, 107, 0, 0.2)' }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#FFD700' }}>
            Потрібна допомога?
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '1.2rem', color: '#fff' }}>
            Виникли проблеми чи питання? Звертайтесь в телеграм - <a href="https://t.me/lnn0q" target="_blank" rel="noopener noreferrer" style={{ color: '#FF6B00', textDecoration: 'none', fontWeight: 'bold' }}>@lnn0q</a>
          </Typography>
        </Paper>
      </Box>
      <ImageModal 
        isOpen={!!openImage} 
        imageUrl={openImage} 
        onClose={() => setOpenImage(null)} 
      />
    </Container>
  );
};

export default AboutPage;

