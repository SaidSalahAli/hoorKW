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
import Rating from '@mui/material/Rating';

import { useFormik } from 'formik';
import * as yup from 'yup';

import { Add, Edit, Trash } from '@wandersonalwes/iconsax-react';

import PageHeader from 'components/cms/PageHeader';
import DataTable, { ColumnDef } from 'components/cms/DataTable';
import SearchBox from 'components/cms/SearchBox';
import StatusBadge from 'components/cms/StatusBadge';
import ImageUploader from 'components/cms/ImageUploader';
import ConfirmDialog from 'components/cms/ConfirmDialog';

import {
  useTestimonials,
  useMutateTestimonial
} from 'hooks/cms/useTestimonials';
import type { Testimonial, TestimonialFormValues } from 'types/cms';

// Validation Schema
const validationSchema = yup.object().shape({
  name: yup.string().required('اسم العميل مطلوب').min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  job_title: yup.string().required('المسمى الوظيفي مطلوب (مثل: مواطن، مدير شركة)'),
  comment: yup.string().required('الرأي أو التعليق مطلوب').min(10, 'التعليق يجب أن يكون 10 أحرف على الأقل'),
  rating: yup.number().min(1, 'التقييم يجب أن يكون نجمة واحدة على الأقل').max(5).required('التقييم مطلوب'),
  status: yup.string().oneOf(['active', 'inactive']).required('الحالة مطلوبة')
});

export default function TestimonialsView() {
  const {
    testimonials,
    meta,
    isLoading,
    error,
    filters,
    updateFilters,
    setPage,
    mutate
  } = useTestimonials();

  const mutation = useMutateTestimonial();

  // State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Formik
  const formik = useFormik<TestimonialFormValues>({
    initialValues: {
      name: '',
      job_title: '',
      comment: '',
      rating: 5,
      status: 'active',
      image: null
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (selectedTestimonial) {
          await mutation.update(selectedTestimonial.id, values);
        } else {
          await mutation.create(values);
        }
        mutate();
        handleCloseDialog();
      } catch (err) {
        console.error(err);
      }
    }
  });

  const handleOpenAddDialog = () => {
    setSelectedTestimonial(null);
    formik.resetForm();
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    formik.setValues({
      name: testimonial.name,
      job_title: testimonial.job_title,
      comment: testimonial.comment,
      rating: testimonial.rating,
      status: testimonial.status,
      image: null
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedTestimonial(null);
    formik.resetForm();
  };

  const handleDeleteConfirm = async () => {
    if (deleteId) {
      await mutation.remove(deleteId);
      mutate();
      setDeleteId(null);
    }
  };

  // Table Columns
  const columns: ColumnDef<Testimonial>[] = [
    {
      key: 'image',
      label: 'الصورة',
      render: (row) => (
        <Avatar
          src={row.image || undefined}
          alt={row.name}
          sx={{ width: 40, height: 40, bgcolor: 'primary.lighter' }}
        >
          {row.name.charAt(0)}
        </Avatar>
      )
    },
    {
      key: 'name',
      label: 'العميل',
      render: (row) => (
        <Box>
          <Typography variant="subtitle2" fontWeight={600}>{row.name}</Typography>
          <Typography variant="caption" color="text.secondary">{row.job_title}</Typography>
        </Box>
      )
    },
    {
      key: 'rating',
      label: 'التقييم',
      render: (row) => <Rating value={row.rating} readOnly size="small" />
    },
    {
      key: 'comment',
      label: 'الرأي / التعليق',
      render: (row) => (
        <Typography variant="body2" sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {row.comment}
        </Typography>
      )
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (row) => <StatusBadge status={row.status} />
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
        title="آراء العملاء"
        subtitle="إدارة التقييمات والآراء التي يعرضها العملاء على الموقع لزيادة مصداقية الشركة."
        actions={
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleOpenAddDialog}
          >
            إضافة رأي عميل
          </Button>
        }
      />

      <Card>
        <CardContent sx={{ p: 0 }}>
          {/* Filters */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            gap={2}
            p={2}
          >
            <SearchBox
              value={filters.search || ''}
              onChange={(search) => updateFilters({ search })}
              placeholder="بحث في آراء العملاء..."
            />
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
            rows={testimonials}
            loading={isLoading}
            error={error?.message}
            total={meta?.total || 0}
            page={(meta?.current_page || 1) - 1}
            rowsPerPage={meta?.per_page || 10}
            onPageChange={(p) => setPage(p + 1)}
            onRowsPerPageChange={(rpp) => updateFilters({ per_page: rpp })}
            selectable={false} // Disable checkbox selection for simple logs
          />
        </CardContent>
      </Card>

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedTestimonial ? 'تعديل رأي العميل' : 'إضافة رأي جديد'}</DialogTitle>
        <DialogContent dividers>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="name"
                  label="اسم العميل"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="job_title"
                  label="المسمى الوظيفي / الوصف"
                  placeholder="مثال: مواطن - حولي، أو صاحب متجر"
                  value={formik.values.job_title}
                  onChange={formik.handleChange}
                  error={formik.touched.job_title && Boolean(formik.errors.job_title)}
                  helperText={formik.touched.job_title && formik.errors.job_title}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" mb={1} color="text.secondary">التقييم</Typography>
                <Rating
                  name="rating"
                  value={formik.values.rating}
                  onChange={(_, value) => formik.setFieldValue('rating', value)}
                  size="large"
                />
                {formik.touched.rating && formik.errors.rating && (
                  <Typography variant="caption" color="error" display="block">{formik.errors.rating}</Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="comment"
                  label="الرأي / التعليق"
                  multiline
                  rows={4}
                  value={formik.values.comment}
                  onChange={formik.handleChange}
                  error={formik.touched.comment && Boolean(formik.errors.comment)}
                  helperText={formik.touched.comment && formik.errors.comment}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ImageUploader
                  label="صورة العميل (اختياري)"
                  currentImageUrl={selectedTestimonial?.image}
                  value={formik.values.image}
                  onChange={(file) => formik.setFieldValue('image', file)}
                  error={formik.touched.image ? (formik.errors.image as string) : undefined}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="status"
                  select
                  label="الحالة"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  error={formik.touched.status && Boolean(formik.errors.status)}
                  helperText={formik.touched.status && formik.errors.status}
                  sx={{ mt: 3 }}
                >
                  <MenuItem value="active">نشط</MenuItem>
                  <MenuItem value="inactive">غير نشط</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} color="secondary" variant="outlined">
            إلغاء
          </Button>
          <Button
            onClick={() => formik.handleSubmit()}
            variant="contained"
            color="primary"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? <CircularProgress size={24} /> : 'حفظ'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={deleteId !== null}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteId(null)}
        loading={mutation.isLoading}
      />
    </Box>
  );
}
