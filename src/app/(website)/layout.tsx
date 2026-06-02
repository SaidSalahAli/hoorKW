'use client';

import React from 'react';
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
import { Whatsapp, Setting } from '@wandersonalwes/iconsax-react';

import { settingsApi } from 'lib/api/settings';

// ==============================|| PUBLIC WEBSITE LAYOUT ||============================== //

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  // Fetch settings dynamically to feed into the branding/contact details
  const { data: settings } = useSWR('public-settings', settingsApi.get, {
    revalidateOnFocus: false
  });

  const phone = settings?.phone || '96512345678';
  const whatsapp = settings?.whatsapp || '96512345678';
  const siteName = settings?.site_name || 'حور لنقل العفش';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* Dynamic Header */}
      <AppBar position="sticky" color="default" elevation={1} sx={{ bgcolor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', py: 1 }}>
            {/* Logo / Title */}
            <Link href="/" passHref legacyBehavior>
              <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 1.5 }}>
                {settings?.logo ? (
                  <Box component="img" src={settings.logo} alt={siteName} sx={{ height: 44, width: 'auto', objectFit: 'contain' }} />
                ) : (
                  <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 1, borderRadius: 1.5, display: 'flex' }}>
                    <Setting size={24} />
                  </Box>
                )}
                <Typography variant="h5" fontWeight={700} color="primary.main">
                  {siteName}
                </Typography>
              </Box>
            </Link>

            {/* Navigation links */}
            <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Link href="/" passHref legacyBehavior><Button color="inherit" sx={{ fontWeight: 600 }}>الرئيسية</Button></Link>
              <Link href="/about" passHref legacyBehavior><Button color="inherit" sx={{ fontWeight: 600 }}>من نحن</Button></Link>
              <Link href="/services" passHref legacyBehavior><Button color="inherit" sx={{ fontWeight: 600 }}>خدماتنا</Button></Link>
              <Link href="/blog" passHref legacyBehavior><Button color="inherit" sx={{ fontWeight: 600 }}>المدونة</Button></Link>
              <Link href="/gallery" passHref legacyBehavior><Button color="inherit" sx={{ fontWeight: 600 }}>معرض الأعمال</Button></Link>
              <Link href="/contact" passHref legacyBehavior><Button color="inherit" sx={{ fontWeight: 600 }}>اتصل بنا</Button></Link>
            </Stack>

            {/* Quick Action Button */}
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Link href="/request-service" passHref legacyBehavior>
                <Button variant="contained" color="primary" sx={{ borderRadius: 2, px: 3, fontWeight: 700 }}>
                  طلب تسعيرة
                </Button>
              </Link>
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
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Page Content */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: '#0f172a', color: 'white', pt: 8, pb: 4, mt: 'auto' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} mb={6}>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" fontWeight={700} gutterBottom color="primary.light">
                {siteName}
              </Typography>
              <Typography variant="body2" sx={{ color: 'grey.400', lineHeight: 1.8, mb: 3 }}>
                شركة رائدة ومتخصصة في تقديم خدمات نقل وتغليف وتخزين الأثاث في جميع مناطق ومحافظات الكويت بأحدث المعدات وسيارات النقل المقفلة وبأيدي عمالة فنية مدربة.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                روابط سريعة
              </Typography>
              <Stack spacing={1}>
                <Link href="/about" passHref legacyBehavior><Box component="a" sx={{ color: 'grey.400', textDecoration: 'none', '&:hover': { color: 'white' } }}>من نحن</Box></Link>
                <Link href="/services" passHref legacyBehavior><Box component="a" sx={{ color: 'grey.400', textDecoration: 'none', '&:hover': { color: 'white' } }}>خدمات نقل الأثاث</Box></Link>
                <Link href="/blog" passHref legacyBehavior><Box component="a" sx={{ color: 'grey.400', textDecoration: 'none', '&:hover': { color: 'white' } }}>المدونة والنصائح</Box></Link>
                <Link href="/privacy" passHref legacyBehavior><Box component="a" sx={{ color: 'grey.400', textDecoration: 'none', '&:hover': { color: 'white' } }}>سياسة الخصوصية</Box></Link>
                <Link href="/terms" passHref legacyBehavior><Box component="a" sx={{ color: 'grey.400', textDecoration: 'none', '&:hover': { color: 'white' } }}>الشروط والأحكام</Box></Link>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                معلومات الاتصال
              </Typography>
              <Stack spacing={2} sx={{ color: 'grey.400' }}>
                <Typography variant="body2">العنوان: {settings?.address || 'دولة الكويت'}</Typography>
                <Typography variant="body2" component="a" href={`tel:${phone}`} sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: 'white' } }}>
                  الهاتف: {phone}
                </Typography>
                <Typography variant="body2">البريد: {settings?.email}</Typography>
              </Stack>

              {/* Social links */}
              <Stack direction="row" spacing={1.5} mt={3}>
                {settings?.facebook && <Link href={settings.facebook} target="_blank"><Button size="small" variant="outlined" color="inherit">فيسبوك</Button></Link>}
                {settings?.instagram && <Link href={settings.instagram} target="_blank"><Button size="small" variant="outlined" color="inherit">إنستغرام</Button></Link>}
                {settings?.twitter && <Link href={settings.twitter} target="_blank"><Button size="small" variant="outlined" color="inherit">إكس</Button></Link>}
              </Stack>
            </Grid>
          </Grid>
          <Box sx={{ borderTop: '1px solid #334155', pt: 4, textAlign: 'center', color: 'grey.500', fontSize: '0.875rem' }}>
            &copy; {new Date().getFullYear()} {siteName}. جميع الحقوق محفوظة.
          </Box>
        </Container>
      </Box>

      {/* Floating WhatsApp Action Widget (Critical for Kuwait conversions) */}
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
