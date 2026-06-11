'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';

import { useFormik } from 'formik';
import * as yup from 'yup';

import { Add, Edit, Trash, Gallery } from '@wandersonalwes/iconsax-react';

import PageHeader from 'components/cms/PageHeader';
import DataTable, { ColumnDef } from 'components/cms/DataTable';
import SearchBox from 'components/cms/SearchBox';
import StatusBadge from 'components/cms/StatusBadge';
import ImageUploader from 'components/cms/ImageUploader';
import ConfirmDialog from 'components/cms/ConfirmDialog';

import { useServices, useCreateService, useUpdateService, useDeleteService } from 'hooks/cms/useServices';
import type { Service, ServiceFormValues } from 'types/cms';

// Validation Schema
const validationSchema = yup.object().shape({
  title: yup.string().required('عنوان الخدمة مطلوب').min(3, 'يجب أن يكون العنوان 3 أحرف على الأكثر'),
  slug: yup
    .string()
    .required('رابط slug مطلوب')
    .matches(/^[a-z0-9-\u0600-\u06FF]+$/, 'الرابط يجب أن يحتوي على أحرف وأرقام وشرطات فقط'),
  short_description: yup.string().required('الوصف القصير مطلوب').max(200, 'الحد الأقصى للوصف القصير 200 حرف'),
  description: yup.string().required('الوصف التفصيلي مطلوب'),
  meta_title: yup.string().max(60, 'العنوان الميتا يجب ألا يتجاوز 60 حرفاً'),
  meta_description: yup.string().max(160, 'الوصف الميتا يجب ألا يتجاوز 160 حرفاً'),
  status: yup.string().oneOf(['active', 'inactive', 'draft', 'published']).required('الحالة مطلوبة')
});

export default function ServicesView() {
  const { services, meta, isLoading, error, filters, updateFilters, setPage, mutate } = useServices();

  const createMutation = useCreateService();
  const updateMutation = useUpdateService();
  const deleteMutation = useDeleteService();

  // State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  // Formik for Add/Edit
  const formik = useFormik<ServiceFormValues>({
    initialValues: {
      title: '',
      slug: '',
      short_description: '',
      description: '',
      meta_title: '',
      meta_description: '',
      status: 'active',
      image: null
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (selectedService) {
          await updateMutation.update(selectedService.id, values);
        } else {
          await createMutation.create(values);
        }
        mutate();
        handleCloseDialog();
      } catch (err) {
        console.error(err);
      }
    }
  });

  const handleOpenAddDialog = () => {
    setSelectedService(null);
    formik.resetForm();
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (service: Service) => {
    setSelectedService(service);
    formik.setValues({
      title: service.title,
      slug: service.slug,
      short_description: service.short_description,
      description: service.description,
      meta_title: service.meta_title || '',
      meta_description: service.meta_description || '',
      status: service.status,
      image: null // Selected image is handled separately by uploader
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedService(null);
    formik.resetForm();
  };

  const handleDeleteConfirm = async () => {
    if (deleteId) {
      await deleteMutation.remove(deleteId);
      mutate();
      setDeleteId(null);
    }
  };

  const handleBulkDeleteConfirm = async () => {
    if (selectedIds.length > 0) {
      await deleteMutation.bulkRemove(selectedIds);
      mutate();
      setSelectedIds([]);
      setBulkDeleteOpen(false);
    }
  };

  // Auto slug generation helper
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    formik.setFieldValue('title', title);
    if (!selectedService) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\u0621-\u064A -]/g, '') // Keep English/Arabic chars, numbers, spaces
        .replace(/\s+/g, '-') // Replace spaces with -
        .trim();
      formik.setFieldValue('slug', generatedSlug);
    }
  };

  // Table Columns
  const columns: ColumnDef<Service>[] = [
    {
      key: 'image',
      label: 'الصورة',
      render: (row) => (
        <Avatar src={row.image || undefined} alt={row.title} variant="rounded" sx={{ width: 44, height: 44, bgcolor: 'primary.lighter' }}>
          <Gallery size={20} />
        </Avatar>
      )
    },
    {
      key: 'title',
      label: 'عنوان الخدمة',
      render: (row) => (
        <Box>
          <Typography variant="subtitle2" fontWeight={600}>
            {row.title}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            {row.short_description}
          </Typography>
        </Box>
      )
    },
    {
      key: 'slug',
      label: 'رابط Slug',
      render: (row) => (
        <Typography variant="body2" color="primary">
          {row.slug}
        </Typography>
      )
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      key: 'created_at',
      label: 'تاريخ الإنشاء',
      render: (row) => (
        <Typography variant="body2" color="text.secondary">
          {new Date(row.created_at).toLocaleDateString('ar-KW')}
        </Typography>
      )
    },
    {
      key: 'actions',
      label: 'العمليات',
      align: 'center',
      render: (row) => (
        <Stack direction="row" spacing={1} justifyContent="center">
          <IconButton size="small" color="primary" onClick={() => handleOpenEditDialog(row)}>
            <Edit size={16} />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => setDeleteId(row.id)}>
            <Trash size={16} />
          </IconButton>
        </Stack>
      )
    }
  ];

  return (
    <Box>
      <PageHeader
        title="الخدمات"
        subtitle="إدارة خدمات نقل الأثاث والتغليف والتخزين المعروضة على الموقع."
        actions={
          <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleOpenAddDialog}>
            إضافة خدمة جديدة
          </Button>
        }
      />

      <Card>
        <CardContent sx={{ p: 0 }}>
          {/* Filters Bar */}
          <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2} p={2}>
            <SearchBox value={filters.search || ''} onChange={(search) => updateFilters({ search })} placeholder="بحث باسم الخدمة..." />
            <TextField
              select
              size="small"
              value={filters.status || 'all'}
              onChange={(e) => updateFilters({ status: e.target.value === 'all' ? undefined : e.target.value })}
              sx={{ minWidth: 140 }}
            >
              <MenuItem value="all">كل الحالات</MenuItem>
              <MenuItem value="active">نشط</MenuItem>
              <MenuItem value="inactive">غير نشط</MenuItem>
            </TextField>
          </Stack>

          {/* DataTable */}
          <DataTable
            columns={columns}
            rows={services}
            loading={isLoading}
            error={error?.message}
            total={meta?.total || 0}
            page={(meta?.current_page || 1) - 1}
            rowsPerPage={meta?.per_page || 10}
            onPageChange={(p) => setPage(p + 1)}
            onRowsPerPageChange={(rpp) => updateFilters({ per_page: rpp })}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            onBulkDelete={() => setBulkDeleteOpen(true)}
            bulkDeleteLoading={deleteMutation.isLoading}
          />
        </CardContent>
      </Card>

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>{selectedService ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}</DialogTitle>
        <DialogContent dividers>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="title"
                  label="عنوان الخدمة"
                  value={formik.values.title}
                  onChange={handleTitleChange}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                  sx={{ mb: 3 }}
                />
                <TextField
                  fullWidth
                  name="slug"
                  label="رابط Slug (SEO)"
                  value={formik.values.slug}
                  onChange={formik.handleChange}
                  error={formik.touched.slug && Boolean(formik.errors.slug)}
                  helperText={formik.touched.slug && formik.errors.slug}
                  sx={{ mb: 3 }}
                />
                <TextField
                  fullWidth
                  name="short_description"
                  label="وصف قصير للبطاقات"
                  multiline
                  rows={2}
                  value={formik.values.short_description}
                  onChange={formik.handleChange}
                  error={formik.touched.short_description && Boolean(formik.errors.short_description)}
                  helperText={formik.touched.short_description && formik.errors.short_description}
                  sx={{ mb: 3 }}
                />
                <TextField
                  fullWidth
                  name="status"
                  select
                  label="حالة الخدمة"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  error={formik.touched.status && Boolean(formik.errors.status)}
                  helperText={formik.touched.status && formik.errors.status}
                >
                  <MenuItem value="active">نشط</MenuItem>
                  <MenuItem value="inactive">غير نشط</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <ImageUploader
                  label="الصورة المميزة للخدمة"
                  currentImageUrl={selectedService?.image}
                  value={formik.values.image}
                  onChange={(file) => formik.setFieldValue('image', file)}
                  error={formik.touched.image ? (formik.errors.image as string) : undefined}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="description"
                  label="الوصف التفصيلي للخدمة"
                  multiline
                  rows={6}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                />
              </Grid>

              {/* SEO Fields Accordion or Header */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight={600} mb={2} mt={1} color="primary">
                  إعدادات محركات البحث (SEO)
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="meta_title"
                      label="عنوان الميتا (Meta Title)"
                      value={formik.values.meta_title}
                      onChange={formik.handleChange}
                      error={formik.touched.meta_title && Boolean(formik.errors.meta_title)}
                      helperText={formik.touched.meta_title && formik.errors.meta_title}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="meta_description"
                      label="وصف الميتا (Meta Description)"
                      value={formik.values.meta_description}
                      onChange={formik.handleChange}
                      error={formik.touched.meta_description && Boolean(formik.errors.meta_description)}
                      helperText={formik.touched.meta_description && formik.errors.meta_description}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={handleCloseDialog} color="secondary" variant="outlined">
            إلغاء
          </Button>
          <Button
            onClick={() => formik.handleSubmit()}
            variant="contained"
            color="primary"
            disabled={createMutation.isLoading || updateMutation.isLoading}
          >
            {createMutation.isLoading || updateMutation.isLoading ? <CircularProgress size={24} /> : 'حفظ'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Single Delete Confirm */}
      <ConfirmDialog
        open={deleteId !== null}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteId(null)}
        loading={deleteMutation.isLoading}
      />

      {/* Bulk Delete Confirm */}
      <ConfirmDialog
        open={bulkDeleteOpen}
        onConfirm={handleBulkDeleteConfirm}
        onClose={() => setBulkDeleteOpen(false)}
        loading={deleteMutation.isLoading}
        message={`هل أنت متأكد من حذف ${selectedIds.length} خدمات محددة نهائياً؟`}
      />
    </Box>
  );
}
