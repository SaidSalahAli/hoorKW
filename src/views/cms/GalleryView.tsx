'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

import { useFormik } from 'formik';
import * as yup from 'yup';

import { Add, Trash, Eye, Gallery } from '@wandersonalwes/iconsax-react';

import PageHeader from 'components/cms/PageHeader';
import ImageUploader from 'components/cms/ImageUploader';
import ConfirmDialog from 'components/cms/ConfirmDialog';
import SearchBox from 'components/cms/SearchBox';

import { useGallery, useMutateGallery } from 'hooks/cms/useGallery';
import type { GalleryFormValues } from 'types/cms';

// Validation Schema
const validationSchema = yup.object().shape({
  title: yup.string().required('عنوان الصورة مطلوب').min(2, 'العنوان يجب أن يكون حرفين على الأقل'),
  image: yup.mixed().required('يجب اختيار ملف صورة للرفع')
});

export default function GalleryView() {
  const { images, meta, isLoading, error, filters, updateFilters, setPage, mutate } = useGallery();

  const mutation = useMutateGallery();

  // State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Formik
  const formik = useFormik<GalleryFormValues>({
    initialValues: {
      title: '',
      image: null
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await mutation.upload(values);
        mutate();
        handleCloseDialog();
      } catch (err) {
        console.error(err);
      }
    }
  });

  const handleOpenDialog = () => {
    formik.resetForm();
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    formik.resetForm();
  };

  const handleDeleteConfirm = async () => {
    if (deleteId) {
      await mutation.remove(deleteId);
      mutate();
      setDeleteId(null);
    }
  };

  const handleBulkDeleteConfirm = async () => {
    if (selectedIds.length > 0) {
      await mutation.bulkRemove(selectedIds);
      mutate();
      setSelectedIds([]);
      setBulkDeleteOpen(false);
    }
  };

  const handleSelectImage = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const isAllSelected = images.length > 0 && images.every((img) => selectedIds.includes(img.id));

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(selectedIds.filter((id) => !images.map((img) => img.id).includes(id)));
    } else {
      setSelectedIds([...new Set([...selectedIds, ...images.map((img) => img.id)])]);
    }
  };

  return (
    <Box>
      <PageHeader
        title="معرض الصور"
        subtitle="إدارة صور أعمال نقل الأثاث والتعبئة والتغليف التي تبرز جودة الخدمة للعملاء."
        actions={
          <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleOpenDialog}>
            رفع صورة جديدة
          </Button>
        }
      />

      {/* Bulk actions and search */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={2}
        mb={3}
        p={2}
        sx={{ bgcolor: 'background.paper', borderRadius: 1.5, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
      >
        <Stack direction="row" alignItems="center" gap={1}>
          <Checkbox
            checked={isAllSelected}
            indeterminate={images.length > 0 && selectedIds.length > 0 && !isAllSelected}
            onChange={handleSelectAll}
          />
          <Typography variant="body2">اختيار الكل ({selectedIds.length} محدد)</Typography>
          {selectedIds.length > 0 && (
            <Button
              variant="contained"
              color="error"
              size="small"
              startIcon={<Trash size={14} />}
              onClick={() => setBulkDeleteOpen(true)}
              disabled={mutation.isLoading}
              sx={{ ml: 2 }}
            >
              حذف المحدد
            </Button>
          )}
        </Stack>
        <SearchBox
          value={filters.search || ''}
          onChange={(search) => updateFilters({ search })}
          placeholder="بحث في المعرض باسم الصورة..."
        />
      </Stack>

      {/* Grid gallery */}
      {isLoading ? (
        <Box py={10} display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error.message || 'خطأ في تحميل معرض الصور'}</Alert>
      ) : images.length === 0 ? (
        <Box py={8} textAlign="center" sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
          <Gallery size={48} color="#9e9e9e" style={{ marginBottom: '12px' }} />
          <Typography color="text.secondary">لا توجد صور في المعرض حالياً</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {images.map((img) => {
            const isSelected = selectedIds.includes(img.id);
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={img.id}>
                <Card
                  sx={{
                    position: 'relative',
                    border: isSelected ? '2px solid' : '1px solid',
                    borderColor: isSelected ? 'primary.main' : 'divider',
                    '&:hover .actions-overlay': { opacity: 1 }
                  }}
                >
                  <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2, bgcolor: 'background.paper', borderRadius: '50%' }}>
                    <Checkbox checked={isSelected} onChange={() => handleSelectImage(img.id)} size="small" />
                  </Box>
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
                        transition: 'transform 0.3s',
                        '&:hover': { transform: 'scale(1.05)' }
                      }}
                    />
                    {/* Hover Actions Overlay */}
                    <Box
                      className="actions-overlay"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        bgcolor: 'rgba(0, 0, 0, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1.5,
                        opacity: 0,
                        transition: 'opacity 0.2s ease',
                        zIndex: 1
                      }}
                    >
                      <IconButton
                        sx={{ bgcolor: 'background.paper', '&:hover': { bgcolor: 'action.hover' } }}
                        onClick={() => setLightboxImage(img.image)}
                      >
                        <Eye size={18} color="#1890ff" />
                      </IconButton>
                      <IconButton
                        sx={{ bgcolor: 'background.paper', '&:hover': { bgcolor: 'action.hover' } }}
                        onClick={() => setDeleteId(img.id)}
                      >
                        <Trash size={18} color="#ff4d4f" />
                      </IconButton>
                    </Box>
                  </Box>
                  <CardContent sx={{ p: 1.5, textAlign: 'center' }}>
                    <Typography variant="subtitle2" noWrap fontWeight={600}>
                      {img.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(img.created_at).toLocaleDateString('ar-KW')}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Pagination */}
      {meta && meta.total > 0 && (
        <Stack direction="row" justifyContent="center" mt={4}>
          <Button disabled={filters.page === 1} onClick={() => setPage((filters.page || 1) - 1)}>
            السابق
          </Button>
          <Typography alignSelf="center" mx={2}>
            صفحة {filters.page} من {meta.last_page}
          </Typography>
          <Button disabled={filters.page === meta.last_page} onClick={() => setPage((filters.page || 1) + 1)}>
            التالي
          </Button>
        </Stack>
      )}

      {/* Upload Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>رفع صورة لمعرض الأعمال</DialogTitle>
        <DialogContent dividers>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              fullWidth
              name="title"
              label="عنوان الصورة"
              placeholder="مثال: نقل ديوانية في العاصمة"
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
              sx={{ mb: 3 }}
            />
            <ImageUploader
              label="ملف الصورة"
              value={formik.values.image}
              onChange={(file) => formik.setFieldValue('image', file)}
              error={formik.touched.image ? (formik.errors.image as string) : undefined}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} color="secondary" variant="outlined">
            إلغاء
          </Button>
          <Button onClick={() => formik.handleSubmit()} variant="contained" color="primary" disabled={mutation.isLoading}>
            {mutation.isLoading ? <CircularProgress size={24} /> : 'رفع الآن'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Lightbox Preview */}
      <Dialog open={lightboxImage !== null} onClose={() => setLightboxImage(null)} maxWidth="lg">
        <DialogContent
          sx={{ p: 0, position: 'relative', bgcolor: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {lightboxImage && (
            <Box component="img" src={lightboxImage} alt="Lightbox" sx={{ maxWidth: '100%', maxHeight: '85vh', objectFit: 'contain' }} />
          )}
        </DialogContent>
        <DialogActions sx={{ bgcolor: 'black', justifyContent: 'center', borderTop: 'none', py: 1 }}>
          <Button onClick={() => setLightboxImage(null)} variant="contained" color="secondary">
            إغلاق المعاينة
          </Button>
        </DialogActions>
      </Dialog>

      {/* Single Delete Confirm */}
      <ConfirmDialog
        open={deleteId !== null}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteId(null)}
        loading={mutation.isLoading}
      />

      {/* Bulk Delete Confirm */}
      <ConfirmDialog
        open={bulkDeleteOpen}
        onConfirm={handleBulkDeleteConfirm}
        onClose={() => setBulkDeleteOpen(false)}
        loading={mutation.isLoading}
        message={`هل أنت متأكد من حذف ${selectedIds.length} صور محددة نهائياً؟`}
      />
    </Box>
  );
}
