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
      <Box sx={{ bgcolor: '#0f172a', color: 'white', py: 8, textAlign: 'center' }}>
        <Container maxWidth="lg">
          <Typography variant="h1" fontWeight={800} gutterBottom>
            معرض أعمال شركة حور
          </Typography>
          <Typography variant="h5" color="grey.400" fontWeight={400}>
            شاهد صوراً حية لعمليات نقل العفش وتغليف الأثاث التي قمنا بها لعملائنا في مختلف مناطق الكويت
          </Typography>
        </Container>
      </Box>

      {/* Content */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : images.length === 0 ? (
          <Box py={8} textAlign="center">
            <Typography color="text.secondary">لا توجد صور في المعرض حالياً.</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {images.map((img) => (
              <Grid item xs={12} sm={6} md={4} key={img.id}>
                <Card
                  sx={{
                    position: 'relative',
                    cursor: 'pointer',
                    borderRadius: 3,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover .overlay-action': { opacity: 1 }
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
                        objectFit: 'cover'
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
                        bgcolor: 'rgba(0,0,0,0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0,
                        transition: 'opacity 0.25s ease'
                      }}
                    >
                      <Box sx={{ bgcolor: 'white', p: 1.5, borderRadius: '50%', display: 'flex', color: 'primary.main' }}>
                        <Eye size={24} />
                      </Box>
                    </Box>
                  </Box>
                  <Box p={2} textAlign="center" bgcolor="background.paper">
                    <Typography variant="subtitle1" fontWeight={600} noWrap>
                      {img.title}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Lightbox */}
      <Dialog open={lightboxImage !== null} onClose={() => setLightboxImage(null)} maxWidth="lg">
        <DialogContent sx={{ p: 0, bgcolor: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {lightboxImage && (
            <Box component="img" src={lightboxImage} alt="Lightbox" sx={{ maxWidth: '100%', maxHeight: '85vh', objectFit: 'contain' }} />
          )}
        </DialogContent>
        <DialogActions sx={{ bgcolor: 'black', borderTop: 'none', justifyContent: 'center', py: 1 }}>
          <Button onClick={() => setLightboxImage(null)} color="secondary" variant="contained">
            إغلاق
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
