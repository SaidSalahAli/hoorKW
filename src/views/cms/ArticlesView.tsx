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
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import { useFormik } from 'formik';
import { openSnackbar } from 'api/snackbar';
import { SnackbarProps } from 'types/snackbar';
import * as yup from 'yup';

import { Add, Edit, Trash, Eye, Gallery } from '@wandersonalwes/iconsax-react';

import PageHeader from 'components/cms/PageHeader';
import DataTable, { ColumnDef } from 'components/cms/DataTable';
import SearchBox from 'components/cms/SearchBox';
import StatusBadge from 'components/cms/StatusBadge';
import ImageUploader from 'components/cms/ImageUploader';
import ConfirmDialog from 'components/cms/ConfirmDialog';

import { useArticles, useMutateArticle } from 'hooks/cms/useArticles';
import type { Article, ArticleFormValues } from 'types/cms';

// Validation Schema
const validationSchema = yup.object().shape({
  title: yup.string().required('عنوان المقال مطلوب').min(3, 'يجب أن يكون العنوان 3 أحرف على الأقل'),
  slug: yup
    .string()
    .required('رابط slug مطلوب')
    .matches(/^[a-z0-9-\u0600-\u06FF]+$/, 'الرابط يجب أن يحتوي على أحرف وأرقام وشرطات فقط'),
  excerpt: yup.string().required('مقتطف المقال مطلوب').max(300, 'الحد الأقصى للمقتطف 300 حرف'),
  content: yup.string().required('محتوى المقال مطلوب'),
  meta_title: yup.string().max(60, 'العنوان الميتا يجب ألا يتجاوز 60 حرفاً'),
  meta_description: yup.string().max(160, 'الوصف الميتا يجب ألا يتجاوز 160 حرفاً'),
  status: yup.string().oneOf(['active', 'inactive', 'draft', 'published']).required('الحالة مطلوبة')
});

function generateFrancoSlug(text: string): string {
  const arabicMap: Record<string, string> = {
    'أ': 'a', 'إ': 'e', 'آ': 'a', 'ا': 'a', 'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'g',
    'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'th', 'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh',
    'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z', 'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'q',
    'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n', 'ه': 'h', 'و': 'w', 'ي': 'y', 'ى': 'a',
    'ئ': 'e', 'ء': 'a', 'ؤ': 'w', 'ة': 'h'
  };

  const latinized = text
    .split('')
    .map((char) => arabicMap[char] || char)
    .join('');

  return latinized
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function ArticlesView() {
  const { articles, meta, isLoading, error, filters, updateFilters, setPage, mutate } = useArticles();

  const mutation = useMutateArticle();

  // State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewArticle, setPreviewArticle] = useState<Article | null>(null);
  const [tabValue, setTabValue] = useState(0); // For Add/Edit tabs (Content vs SEO vs Preview)

  // Formik
  const formik = useFormik<ArticleFormValues>({
    initialValues: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      meta_title: '',
      meta_description: '',
      status: 'published',
      image: null
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (selectedArticle) {
          await mutation.update(selectedArticle.id, values);
          openSnackbar({
            open: true,
            message: 'تم تحديث المقال بنجاح',
            variant: 'alert',
            alert: { color: 'success' }
          } as SnackbarProps);
        } else {
          await mutation.create(values);
          openSnackbar({
            open: true,
            message: 'تم نشر المقال بنجاح',
            variant: 'alert',
            alert: { color: 'success' }
          } as SnackbarProps);
        }
        mutate();
        handleCloseDialog();
      } catch (err: any) {
        console.error(err);
        openSnackbar({
          open: true,
          message: err.message || 'حدث خطأ غير متوقع',
          variant: 'alert',
          alert: { color: 'error' }
        } as SnackbarProps);
      }
    }
  });

  const handleOpenAddDialog = () => {
    setSelectedArticle(null);
    formik.resetForm();
    setTabValue(0);
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (article: Article) => {
    setSelectedArticle(article);
    formik.setValues({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      meta_title: article.meta_title || '',
      meta_description: article.meta_description || '',
      status: article.status,
      image: null
    });
    setTabValue(0);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedArticle(null);
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

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    formik.setFieldValue('title', title);
    if (!selectedArticle) {
      const generatedSlug = generateFrancoSlug(title);
      formik.setFieldValue('slug', generatedSlug);
    }
  };

  const handleOpenPreview = (article: Article) => {
    setPreviewArticle(article);
    setPreviewOpen(true);
  };

  // Table Columns
  const columns: ColumnDef<Article>[] = [
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
      label: 'عنوان المقال',
      render: (row) => (
        <Box>
          <Typography variant="subtitle2" fontWeight={600}>
            {row.title}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            المشاهدات: {row.views}
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
      label: 'تاريخ النشر',
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
          <IconButton size="small" color="info" onClick={() => handleOpenPreview(row)}>
            <Eye size={16} />
          </IconButton>
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
        title="المقالات والأخبار"
        subtitle="إدارة المقالات، أخبار النقل، ونصائح نقل الأثاث لتحسين محركات البحث وجذب العملاء."
        actions={
          <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleOpenAddDialog}>
            كتابة مقال جديد
          </Button>
        }
      />

      <Card>
        <CardContent sx={{ p: 0 }}>
          {/* Filters */}
          <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2} p={2}>
            <SearchBox value={filters.search || ''} onChange={(search) => updateFilters({ search })} placeholder="بحث في المقالات..." />
            <TextField
              select
              size="small"
              value={filters.status || 'all'}
              onChange={(e) => updateFilters({ status: e.target.value === 'all' ? undefined : e.target.value })}
              sx={{ minWidth: 140 }}
            >
              <MenuItem value="all">كل الحالات</MenuItem>
              <MenuItem value="published">منشور</MenuItem>
              <MenuItem value="draft">مسودة</MenuItem>
              <MenuItem value="inactive">غير نشط</MenuItem>
            </TextField>
          </Stack>

          {/* DataTable */}
          <DataTable
            columns={columns}
            rows={articles}
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
            bulkDeleteLoading={mutation.isLoading}
          />
        </CardContent>
      </Card>

      {/* Write / Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ pb: 0 }}>
          <Typography variant="h5" fontWeight={600}>
            {selectedArticle ? 'تعديل المقال' : 'كتابة مقال جديد'}
          </Typography>
          <Tabs value={tabValue} onChange={(_, val) => setTabValue(val)} sx={{ mt: 2 }}>
            <Tab label="المحتوى الأساسي" />
            <Tab label="إعدادات SEO" />
            <Tab label="معاينة حية" />
          </Tabs>
        </DialogTitle>
        <DialogContent dividers sx={{ minHeight: '400px' }}>
          {tabValue === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  name="title"
                  label="عنوان المقال"
                  value={formik.values.title}
                  onChange={handleTitleChange}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                  sx={{ mb: 3 }}
                />
                <TextField
                  fullWidth
                  name="slug"
                  label="رابط المقال (SEO URL)"
                  value={formik.values.slug}
                  onChange={formik.handleChange}
                  error={formik.touched.slug && Boolean(formik.errors.slug)}
                  helperText={formik.touched.slug && formik.errors.slug}
                  sx={{ mb: 3 }}
                />
                <TextField
                  fullWidth
                  name="excerpt"
                  label="مقتطف قصير (يظهر في صفحة الأخبار)"
                  multiline
                  rows={2}
                  value={formik.values.excerpt}
                  onChange={formik.handleChange}
                  error={formik.touched.excerpt && Boolean(formik.errors.excerpt)}
                  helperText={formik.touched.excerpt && formik.errors.excerpt}
                  sx={{ mb: 3 }}
                />
                <TextField
                  fullWidth
                  name="content"
                  label="محتوى المقال (يدعم فقرات متعددة)"
                  multiline
                  rows={10}
                  placeholder="اكتب المحتوى هنا... يمكنك استخدام فقرات عادية."
                  value={formik.values.content}
                  onChange={formik.handleChange}
                  error={formik.touched.content && Boolean(formik.errors.content)}
                  helperText={formik.touched.content && formik.errors.content}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <ImageUploader
                  label="صورة المقال المميزة"
                  currentImageUrl={selectedArticle?.image}
                  value={formik.values.image}
                  onChange={(file) => formik.setFieldValue('image', file)}
                  error={formik.touched.image ? (formik.errors.image as string) : undefined}
                  maxSizeMB={5}
                />
                <Box mt={3}>
                  <TextField
                    fullWidth
                    name="status"
                    select
                    label="حالة المقال"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    error={formik.touched.status && Boolean(formik.errors.status)}
                    helperText={formik.touched.status && formik.errors.status}
                  >
                    <MenuItem value="published">منشور</MenuItem>
                    <MenuItem value="draft">مسودة</MenuItem>
                    <MenuItem value="inactive">غير نشط</MenuItem>
                  </TextField>
                </Box>
              </Grid>
            </Grid>
          )}

          {tabValue === 1 && (
            <Box py={2}>
              <Typography variant="subtitle1" fontWeight={600} mb={3} color="primary">
                تخصيص بيانات الأرشفة للمقال (SEO Metadata)
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="meta_title"
                    label="عنوان البحث (Meta Title)"
                    value={formik.values.meta_title}
                    onChange={formik.handleChange}
                    error={formik.touched.meta_title && Boolean(formik.errors.meta_title)}
                    helperText={(formik.touched.meta_title && formik.errors.meta_title) || 'يفضل ألا يزيد عن 60 حرفاً'}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="meta_description"
                    label="وصف البحث (Meta Description)"
                    multiline
                    rows={3}
                    value={formik.values.meta_description}
                    onChange={formik.handleChange}
                    error={formik.touched.meta_description && Boolean(formik.errors.meta_description)}
                    helperText={(formik.touched.meta_description && formik.errors.meta_description) || 'يفضل ألا يزيد عن 160 حرفاً'}
                  />
                </Grid>
              </Grid>
            </Box>
          )}

          {tabValue === 2 && (
            <Box py={2}>
              <Typography variant="h3" gutterBottom fontWeight={700}>
                {formik.values.title || 'عنوان المقال التجريبي'}
              </Typography>
              <Box color="text.secondary" fontSize="0.875rem" mb={2}>
                تم التحديث: {new Date().toLocaleDateString('ar-KW')}
              </Box>
              {formik.values.image && (
                <Box
                  component="img"
                  src={URL.createObjectURL(formik.values.image)}
                  alt="Preview"
                  sx={{ width: '100%', maxHeight: 400, objectFit: 'cover', borderRadius: 2, mb: 3 }}
                />
              )}
              {!formik.values.image && selectedArticle?.image && (
                <Box
                  component="img"
                  src={selectedArticle.image}
                  alt="Preview"
                  sx={{ width: '100%', maxHeight: 400, objectFit: 'cover', borderRadius: 2, mb: 3 }}
                />
              )}
              <Typography
                variant="subtitle1"
                sx={{ fontStyle: 'italic', color: 'text.secondary', borderLeft: '3px solid #ccc', pl: 2, mb: 3 }}
              >
                {formik.values.excerpt || 'مقتطف المقال يظهر هنا...'}
              </Typography>
              <Typography
                variant="body1"
                component="div"
                dangerouslySetInnerHTML={{
                  __html: formik.values.content || 'اكتب محتوى المقال في التبويب الأول لعرض المعاينة الكاملة هنا...'
                }}
                sx={{ lineHeight: 1.8 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={handleCloseDialog} color="secondary" variant="outlined">
            إلغاء
          </Button>
          <Button onClick={() => formik.handleSubmit()} variant="contained" color="primary" disabled={mutation.isLoading}>
            {mutation.isLoading ? <CircularProgress size={24} /> : 'حفظ المقال'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" fontWeight={600}>
            معاينة المقال
          </Typography>
          <Button onClick={() => setPreviewOpen(false)} color="secondary">
            إغلاق
          </Button>
        </DialogTitle>
        <DialogContent dividers>
          {previewArticle && (
            <Box>
              <Typography variant="h3" fontWeight={700} mb={1}>
                {previewArticle.title}
              </Typography>
              <Box display="flex" gap={2} mb={3} color="text.secondary" fontSize="0.875rem">
                <span>الزيارات: {previewArticle.views}</span>
                <span>•</span>
                <span>الحالة: {previewArticle.status}</span>
                <span>•</span>
                <span>تاريخ النشر: {new Date(previewArticle.created_at).toLocaleDateString('ar-KW')}</span>
              </Box>
              {previewArticle.image && (
                <Box
                  component="img"
                  src={previewArticle.image}
                  alt={previewArticle.title}
                  sx={{ width: '100%', maxHeight: 380, objectFit: 'cover', borderRadius: 2, mb: 3 }}
                />
              )}
              <Typography
                variant="subtitle1"
                sx={{ fontStyle: 'italic', borderRight: '4px solid', borderColor: 'primary.main', pr: 2, mb: 3, color: 'text.secondary' }}
              >
                {previewArticle.excerpt}
              </Typography>
              <Typography
                variant="body1"
                component="div"
                dangerouslySetInnerHTML={{ __html: previewArticle.content }}
                sx={{ lineHeight: 1.8 }}
              />
            </Box>
          )}
        </DialogContent>
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
        message={`هل أنت متأكد من حذف ${selectedIds.length} مقالات محددة نهائياً؟`}
      />
    </Box>
  );
}
