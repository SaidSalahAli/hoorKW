'use client';

import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Link from 'next/link';

import { ArrowRight, Gallery } from '@wandersonalwes/iconsax-react';
import apiClient from 'lib/apiClient';

// ==============================|| SERVICES ARCHIVE PAGE ||============================== //

export default function PublicServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadServices() {
      try {
        const res = await apiClient.get('/api/services?status=active');
        setServices(res.data.data || []);
      } catch (err: any) {
        setError(err.message || 'خطأ في تحميل الخدمات. يرجى المحاولة لاحقاً.');
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, []);

  return (
    <Box>
      {/* Banner */}
      <Box sx={{ bgcolor: '#0f172a', color: 'white', py: 8, textAlign: 'center' }}>
        <Container maxWidth="lg">
          <Typography variant="h1" fontWeight={800} gutterBottom>
            خدماتنا لنقل العفش والأثاث
          </Typography>
          <Typography variant="h5" color="grey.400" fontWeight={400}>
            نوفر خدمات نقل وتعبئة وتغليف وتخزين متكاملة لجميع الاحتياجات السكنية والتجارية في دولة الكويت
          </Typography>
        </Container>
      </Box>

      {/* Services List Content */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : services.length === 0 ? (
          <Box py={8} textAlign="center">
            <Typography color="text.secondary">لا توجد خدمات متاحة حالياً.</Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {services.map((service) => (
              <Grid item xs={12} sm={6} md={4} key={service.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    transition: 'all 0.3s ease',
                    '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }
                  }}
                >
                  <Box sx={{ position: 'relative', height: 220, bgcolor: 'action.hover' }}>
                    {service.image ? (
                      <CardMedia component="img" height="100%" image={service.image} alt={service.title} sx={{ objectFit: 'cover' }} />
                    ) : (
                      <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                        <Gallery size={44} color="#ccc" />
                      </Box>
                    )}
                  </Box>
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                      {service.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, mb: 3 }}>
                      {service.short_description}
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 3, pt: 0 }}>
                    <Link href={`/services/${service.slug}`} passHref legacyBehavior>
                      <Button variant="text" color="primary" endIcon={<ArrowRight size={16} />} sx={{ fontWeight: 700, p: 0 }}>
                        تفاصيل الخدمة وحجز موعد
                      </Button>
                    </Link>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
