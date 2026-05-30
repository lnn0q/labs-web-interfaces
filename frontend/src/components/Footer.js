import React from 'react';
import { Box, Typography, Container, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

const Footer = () => {
  return (
    <Box sx={{ bgcolor: '#121212', py: 4, mt: 'auto', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
      <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, md: 0 } }}>
          <LocalFireDepartmentIcon sx={{ fontSize: 24, color: '#FF6B00', mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Takibi</Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Takibi. Денисенко Богдан Романович, КВ-51мн.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 3, mt: { xs: 2, md: 0 } }}>
          <MuiLink component={Link} to="/about" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: '#FF6B00' } }}>Про додаток</MuiLink>
          <MuiLink component={Link} to="/" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: '#FF6B00' } }}>Фандоми</MuiLink>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
