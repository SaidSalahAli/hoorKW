'use client';

import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import ScrollReveal from 'components/ScrollReveal';

import { Eye } from '@wandersonalwes/iconsax-react';
import { publicApiClient as apiClient } from 'lib/apiClient';

// ==============================|| PUBLIC GALLERY PAGE ||============================== //

export default function PublicGalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    async function loadGallery() {
      try {
        const res = await apiClient.get('/api/gallery?per_page=12');
        setImages(res.data.data || []);
      } catch (err: any) {
        setError(err.message || 'خطأ في تحميل معرض الصور.');
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, []);

  return (
    <Box>
      {/* Banner */}
      <Box
        sx={{
          color: 'white',
          py: { xs: 10, md: 14 },
          position: 'relative',
          overflow: 'hidden',
          backgroundImage:
            'linear-gradient(135deg, rgba(6, 13, 31, 0.95) 0%, rgba(15, 23, 42, 0.9) 40%, rgba(26, 39, 68, 0.95) 100%), url(/assets/images/home/hero.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          textAlign: 'center'
        }}
      >
        {/* Decorative blurred circles */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 250,
            height: 250,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(250,204,21,0.15) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -50,
            left: '20%',
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(250,204,21,0.1) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <ScrollReveal direction="up">
            <Typography variant="h1" fontWeight={900} sx={{ fontSize: { xs: '2.4rem', md: '3.4rem' }, mb: 2 }}>
              معرض أعمال شركة الحور
            </Typography>
            <Typography variant="h6" sx={{ color: 'grey.400', fontWeight: 400, maxWidth: 720, mx: 'auto', lineHeight: 1.7 }}>
              شاهد صوراً حية لعمليات نقل العفش وتغليف الأثاث التي قمنا بها لعملائنا في مختلف مناطق الكويت
            </Typography>
          </ScrollReveal>
        </Container>
      </Box>

      {/* Content */}
      <Container maxWidth="lg" sx={{ py: 12 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress size={44} sx={{ color: '#eab308' }} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            {error}
          </Alert>
        ) : images.length === 0 ? (
          <Box py={8} textAlign="center">
            <Typography color="text.secondary">لا توجد صور في المعرض حالياً.</Typography>
          </Box>
        ) : (
          <Grid container spacing={3.5}>
            {images.map((img, idx) => (
              <Grid item xs={12} sm={6} md={4} key={img.id}>
                <ScrollReveal direction="up" delay={idx * 0.08}>
                  <Card
                    sx={{
                      position: 'relative',
                      cursor: 'pointer',
                      borderRadius: 4,
                      overflow: 'hidden',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                      transition: 'all 0.35s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-6px)',
                        borderColor: '#eab308',
                        boxShadow: '0 15px 30px rgba(234,179,8,0.1)'
                      },
                      '&:hover .overlay-action': { opacity: 1 },
                      '&:hover img': { transform: 'scale(1.08)' }
                    }}
                    onClick={() => setLightboxImage(img.image)}
                  >
                    <Box sx={{ position: 'relative', paddingTop: '75%', overflow: 'hidden' }}>
                      <CardMedia
                        component="img"
                        image={img.image}
                        alt={img.title}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.5s ease'
                        }}
                      />
                      {/* Hover Action Overlay */}
                      <Box
                        className="overlay-action"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          bgcolor: 'rgba(15,23,42,0.45)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: 0,
                          transition: 'opacity 0.3s ease'
                        }}
                      >
                        <Box
                          sx={{
                            bgcolor: '#ffffff',
                            p: 1.5,
                            borderRadius: '50%',
                            display: 'flex',
                            color: '#eab308',
                            boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
                          }}
                        >
                          <Eye size={24} variant="Bold" />
                        </Box>
                      </Box>
                    </Box>
                    <Box p={2.5} textAlign="center" bgcolor="background.paper">
                      <Typography variant="subtitle1" fontWeight={700} color="#1e293b" noWrap>
                        {img.title}
                      </Typography>
                    </Box>
                  </Card>
                </ScrollReveal>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Lightbox */}
      <Dialog
        open={lightboxImage !== null}
        onClose={() => setLightboxImage(null)}
        maxWidth="lg"
        sx={{ '& .MuiPaper-root': { borderRadius: 4, overflow: 'hidden' } }}
      >
        <DialogContent
          sx={{ p: 0, bgcolor: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
        >
          {lightboxImage && (
            <Box component="img" src={lightboxImage} alt="Lightbox" sx={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }} />
          )}
        </DialogContent>
        <DialogActions sx={{ bgcolor: 'black', borderTop: 'none', justifyContent: 'center', py: 2 }}>
          <Button
            onClick={() => setLightboxImage(null)}
            variant="contained"
            sx={{
              bgcolor: '#eab308',
              color: '#0f172a',
              fontWeight: 800,
              px: 4,
              '&:hover': { bgcolor: '#ca8a04' },
              '&:focus, &:focus-visible, &:active, &.Mui-focusVisible': {
                outline: 'none !important',
                boxShadow: 'none !important',
                border: 'none !important'
              },
              WebkitTapHighlightColor: 'transparent'
            }}
          >
            إغلاق المعاينة
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
