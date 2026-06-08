'use client';

import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Link from 'next/link';
import useSWR from 'swr';
import { usePathname } from 'next/navigation';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import { Whatsapp, Setting, HambergerMenu } from '@wandersonalwes/iconsax-react';

import { settingsApi } from 'lib/api/settings';

// ==============================|| PUBLIC WEBSITE LAYOUT ||============================== //

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  const { data: settings } = useSWR('public-settings', settingsApi.get, {
    revalidateOnFocus: false
  });

  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = pathname === '/';

  const phone = settings?.phone || '96512345678';
  const whatsapp = settings?.whatsapp || '96512345678';
  const siteName = settings?.site_name || 'الحور لنقل العفش';

  const navLinks = [
    { href: '/', label: 'الرئيسية' },
    { href: '/about', label: 'من نحن' },
    { href: '/services', label: 'خدماتنا' },
    { href: '/blog', label: 'المدونة' },
    { href: '/gallery', label: 'معرض الأعمال' },
    { href: '/contact', label: 'اتصل بنا' }
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* Header */}
      <AppBar
        position={isHome ? 'fixed' : 'sticky'}
        color="default"
        elevation={0}
        sx={{
          bgcolor: isHome ? (scrolled ? 'rgba(255,255,255,0.96)' : 'transparent') : 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(12px)',
          borderBottom: isHome && !scrolled ? 'none' : '1px solid #f1f5f9',
          boxShadow: isHome && !scrolled ? 'none' : '0 4px 20px rgba(0,0,0,0.03)',
          transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 1100
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', py: 1 }}>
            {/* Logo */}
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 1.5 }}>
                {settings?.logo ? (
                  <Box component="img" src={settings.logo} alt={siteName} sx={{ height: 44, width: 'auto', objectFit: 'contain' }} />
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ bgcolor: '#facc15', color: '#0f172a', p: 0.8, borderRadius: 1.5, display: 'flex' }}>
                      <Setting size={22} />
                    </Box>
                    <Typography
                      variant="h5"
                      fontWeight={850}
                      sx={{ color: isHome && !scrolled ? 'white' : '#0f172a', transition: 'color 0.3s' }}
                    >
                      {siteName}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Link>

            {/* Nav Links with Underline Animations */}
            <Stack direction="row" spacing={0.5} sx={{ display: { xs: 'none', md: 'flex' } }}>
              {navLinks.map((link) => {
                const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
                return (
                  <Button
                    key={link.href}
                    component={Link}
                    href={link.href}
                    sx={{
                      fontWeight: 700,
                      fontSize: '0.92rem',
                      color: isActive
                        ? isHome && !scrolled
                          ? '#facc15'
                          : '#eab308'
                        : isHome && !scrolled
                          ? 'rgba(255,255,255,0.9)'
                          : '#1e293b',
                      px: 1.8,
                      py: 1,
                      position: 'relative',
                      border: 'none !important',
                      outline: 'none !important',
                      boxShadow: 'none !important',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 6,
                        left: '50%',
                        transform: isActive ? 'translateX(-50%) scaleX(1)' : 'translateX(-50%) scaleX(0)',
                        width: '60%',
                        height: 2,
                        bgcolor: '#facc15',
                        borderRadius: 1,
                        transition: 'transform 0.25s ease-in-out'
                      },
                      '&:hover': {
                        color: isHome && !scrolled ? '#facc15' : '#eab308',
                        bgcolor: 'transparent',
                        '&::after': {
                          transform: 'translateX(-50%) scaleX(1)'
                        }
                      },
                      '&:focus, &:focus-visible, &:active, &.Mui-focusVisible': {
                        outline: 'none !important',
                        boxShadow: 'none !important',
                        border: 'none !important',
                        bgcolor: 'transparent'
                      },
                      WebkitTapHighlightColor: 'transparent',
                      transition: 'color 0.3s'
                    }}
                  >
                    {link.label}
                  </Button>
                );
              })}
            </Stack>

            {/* CTA and Burger Menu */}
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Button
                component={Link}
                href="/request-service"
                variant="contained"
                sx={{
                  borderRadius: 2.5,
                  px: 3,
                  py: 1.2,
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  bgcolor: '#facc15',
                  color: '#0f172a',
                  outline: 'none',
                  border: 'none',
                  '&:hover': {
                    bgcolor: '#eab308',
                    transform: 'translateY(-1px)'
                  },
                  '&:focus, &:focus-visible, &:active, &.Mui-focusVisible': {
                    outline: 'none !important',
                    boxShadow: 'none !important',
                    border: 'none !important',
                    bgcolor: '#facc15'
                  },
                  transition: 'all 0.25s ease'
                }}
              >
                طلب تسعيرة
              </Button>
              <Button
                variant="outlined"
                color="success"
                startIcon={<Whatsapp variant="Bold" size={18} />}
                component="a"
                href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                sx={{ display: { xs: 'none', sm: 'inline-flex' }, borderRadius: 2, fontWeight: 700 }}
              >
                واتساب
              </Button>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerToggle}
                sx={{
                  display: { xs: 'flex', md: 'none' },
                  color: isHome && !scrolled ? 'white' : '#0f172a',
                  transition: 'color 0.3s',
                  p: 1,
                  '&:focus, &:focus-visible, &:active, &.Mui-focusVisible': {
                    outline: 'none !important',
                    boxShadow: 'none !important',
                    border: 'none !important'
                  },
                  WebkitTapHighlightColor: 'transparent'
                }}
              >
                <HambergerMenu size={24} />
              </IconButton>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            bgcolor: '#ffffff',
            backgroundImage: 'none',
            p: 3
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h6" fontWeight={850} sx={{ color: '#0f172a' }}>
            {siteName}
          </Typography>
          <IconButton onClick={handleDrawerToggle} sx={{ color: '#0f172a' }}>
            <span style={{ fontSize: '24px', fontWeight: 'bold', lineHeight: 1 }}>&times;</span>
          </IconButton>
        </Box>

        <Stack spacing={1.5}>
          {navLinks.map((link) => {
            const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
            return (
              <Button
                key={link.href}
                component={Link}
                href={link.href}
                onClick={handleDrawerToggle}
                sx={{
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: isActive ? '#eab308' : '#1e293b',
                  bgcolor: isActive ? 'rgba(250, 204, 21, 0.08)' : 'transparent',
                  justifyContent: 'flex-start',
                  px: 2,
                  py: 1.5,
                  borderRadius: 2,
                  width: '100%',
                  border: 'none !important',
                  outline: 'none !important',
                  boxShadow: 'none !important',
                  '&:hover': {
                    bgcolor: 'rgba(250, 204, 21, 0.04)',
                    color: '#eab308'
                  },
                  '&:focus, &:focus-visible, &:active, &.Mui-focusVisible': {
                    outline: 'none !important',
                    border: 'none !important',
                    boxShadow: 'none !important',
                    bgcolor: isActive ? 'rgba(250, 204, 21, 0.08)' : 'transparent'
                  },
                  WebkitTapHighlightColor: 'transparent',
                  transition: 'all 0.2s'
                }}
              >
                {link.label}
              </Button>
            );
          })}
        </Stack>

        <Box sx={{ mt: 'auto', pt: 4 }}>
          <Button
            variant="outlined"
            color="success"
            fullWidth
            startIcon={<Whatsapp variant="Bold" size={18} />}
            component="a"
            href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
            target="_blank"
            sx={{
              borderRadius: 2,
              fontWeight: 700,
              py: 1.2,
              '&:focus, &:focus-visible, &:active, &.Mui-focusVisible': {
                outline: 'none !important',
                boxShadow: 'none !important',
                border: 'none !important'
              },
              WebkitTapHighlightColor: 'transparent'
            }}
          >
            واتساب
          </Button>
        </Box>
      </Drawer>

      {/* Page Content */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: '#0f172a', color: 'white', pt: 8, pb: 4, mt: 'auto' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} mb={6}>
            {/* Brand */}
            <Grid item xs={12} md={4}>
              <Typography variant="h5" fontWeight={700} gutterBottom color="primary.light">
                {siteName}
              </Typography>
              <Typography variant="body2" sx={{ color: 'grey.400', lineHeight: 1.8, mb: 3 }}>
                شركة رائدة ومتخصصة في تقديم خدمات نقل وتغليف وتخزين الأثاث في جميع مناطق ومحافظات الكويت بأحدث المعدات وسيارات النقل المقفلة
                وبأيدي عمالة فنية مدربة.
              </Typography>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                روابط سريعة
              </Typography>
              <Stack spacing={1}>
                {[
                  { href: '/about', label: 'من نحن' },
                  { href: '/services', label: 'خدمات نقل الأثاث' },
                  { href: '/blog', label: 'المدونة والنصائح' },
                  { href: '/privacy', label: 'سياسة الخصوصية' },
                  { href: '/terms', label: 'الشروط والأحكام' }
                ].map(({ href, label }) => (
                  <Link key={href} href={href} style={{ textDecoration: 'none' }}>
                    <Box sx={{ color: 'grey.400', '&:hover': { color: 'white' }, transition: 'color 0.2s' }}>{label}</Box>
                  </Link>
                ))}
              </Stack>
            </Grid>

            {/* Contact */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                معلومات الاتصال
              </Typography>
              <Stack spacing={2} sx={{ color: 'grey.400' }}>
                <Typography variant="body2">العنوان: {settings?.address || 'دولة الكويت'}</Typography>
                <Typography
                  variant="body2"
                  component="a"
                  href={`tel:${phone}`}
                  sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: 'white' } }}
                >
                  الهاتف: {phone}
                </Typography>
                <Typography variant="body2">البريد: {settings?.email}</Typography>
              </Stack>

              <Stack direction="row" spacing={1.5} mt={3}>
                {settings?.facebook && (
                  <Button component={Link} href={settings.facebook} target="_blank" size="small" variant="outlined" color="inherit">
                    فيسبوك
                  </Button>
                )}
                {settings?.instagram && (
                  <Button component={Link} href={settings.instagram} target="_blank" size="small" variant="outlined" color="inherit">
                    إنستغرام
                  </Button>
                )}
                {settings?.twitter && (
                  <Button component={Link} href={settings.twitter} target="_blank" size="small" variant="outlined" color="inherit">
                    إكس
                  </Button>
                )}
              </Stack>
            </Grid>
          </Grid>
          <Box sx={{ borderTop: '1px solid #334155', pt: 4, textAlign: 'center', color: 'grey.500', fontSize: '0.875rem' }}>
            &copy; {new Date().getFullYear()} {siteName}. جميع الحقوق محفوظة.
          </Box>
        </Container>
      </Box>

      {/* Floating WhatsApp Button */}
      <Box
        component="a"
        href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          position: 'fixed',
          bottom: 30,
          left: 30,
          bgcolor: '#25d366',
          color: 'white',
          width: 60,
          height: 60,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          transition: 'all 0.3s ease',
          zIndex: 9999,
          '&:hover': { transform: 'scale(1.1)', bgcolor: '#128c7e' }
        }}
      >
        <Whatsapp size={32} variant="Bold" />
      </Box>
    </Box>
  );
}
