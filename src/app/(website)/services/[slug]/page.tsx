'use client';

import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Link from 'next/link';

import { useFormik } from 'formik';
import * as yup from 'yup';

import { publicApiClient as apiClient } from 'lib/apiClient';
import { requestsApi } from 'lib/api/requests';

// ==============================|| SERVICE DETAILS PAGE ||============================== //

interface ServiceDetailsProps {
    params: Promise<{ slug: string }>;
}

export default function ServiceDetailsPage({ params }: ServiceDetailsProps) {
    const [slug, setSlug] = useState<string | null>(null);
    const [service, setService] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formSuccess, setFormSuccess] = useState(false);
    const [formSubmitting, setFormSubmitting] = useState(false);

    // Unwrap params using React.use() style or simple useEffect/unwrapper
    useEffect(() => {
        params.then((p) => setSlug(p.slug));
    }, [params]);

    useEffect(() => {
        if (!slug) return;

        async function loadService() {
            try {
                const res = await apiClient.get(`/api/services/slug/${slug}`);
                setService(res.data.data);
            } catch (err: any) {
                setError(err.message || 'لم نتمكن من العثور على الخدمة المطلوبة.');
            } finally {
                setLoading(false);
            }
        }
        loadService();
    }, [slug]);

    // Formik for the service-specific order form
    const formik = useFormik({
        initialValues: {
            name: '',
            phone: '',
            message: ''
        },
        validationSchema: yup.object({
            name: yup.string().required('الرجاء إدخال اسمك الكريم'),
            phone: yup.string().required('رقم الهاتف مطلوب للتواصل').min(8, 'رقم الهاتف غير صحيح'),
            message: yup.string().required('الرجاء إدخال تفاصيل النقل المطلوبة')
        }),
        enableReinitialize: true,
        onSubmit: async (values, { resetForm }) => {
            if (!service) return;
            setFormSubmitting(true);
            setError(null);
            setFormSuccess(false);
            try {
                await requestsApi.submit({
                    name: values.name,
                    phone: values.phone,
                    service_id: String(service.id),
                    message: values.message
                });
                setFormSuccess(true);
                resetForm();
            } catch (err: any) {
                setError(err.message || 'حدث خطأ أثناء الإرسال. يرجى المحاولة لاحقاً.');
            } finally {
                setFormSubmitting(false);
            }
        }
    });

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error || !service) {
        return (
            <Container maxWidth="lg" sx={{ py: 10 }}>
                <Alert severity="error" sx={{ mb: 4 }}>
                    {error || 'الخدمة المطلوبة غير متوفرة حالياً.'}
                </Alert>
                <Link href="/services" passHref legacyBehavior>
                    <Button variant="contained" color="primary">
                        العودة لكل الخدمات
                    </Button>
                </Link>
            </Container>
        );
    }

    return (
        <Box>
            {/* Dynamic breadcrumb header */}
            <Box sx={{ bgcolor: '#0f172a', color: 'white', py: 6 }}>
                <Container maxWidth="lg">
                    <Stack direction="row" spacing={1} alignItems="center" mb={1} color="grey.400" fontSize="0.875rem">
                        <Link href="/" passHref legacyBehavior>
                            <Box component="a" sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: 'white' } }}>
                                الرئيسية
                            </Box>
                        </Link>
                        <span>/</span>
                        <Link href="/services" passHref legacyBehavior>
                            <Box component="a" sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: 'white' } }}>
                                الخدمات
                            </Box>
                        </Link>
                        <span>/</span>
                        <Typography variant="caption" color="white">
                            {service.title}
                        </Typography>
                    </Stack>
                    <Typography variant="h1" fontWeight={800} sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>
                        {service.title}
                    </Typography>
                </Container>
            </Box>

            {/* Main Content */}
            <Container maxWidth="lg" sx={{ py: 10 }}>
                <Grid container spacing={5}>
                    {/* Details Section */}
                    <Grid item xs={12} md={8}>
                        {service.image && (
                            <Box
                                component="img"
                                src={service.image}
                                alt={service.title}
                                sx={{ width: '100%', maxHeight: 420, objectFit: 'cover', borderRadius: 4, mb: 4 }}
                            />
                        )}
                        <Typography variant="h3" fontWeight={700} gutterBottom>
                            تفاصيل ومميزات الخدمة
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.9, fontSize: '1.05rem', color: 'text.secondary', mb: 4 }}
                        >
                            {service.description}
                        </Typography>

                        <Box sx={{ bgcolor: '#f1f5f9', p: 4, borderRadius: 3, mb: 4 }}>
                            <Typography variant="h4" fontWeight={700} mb={2}>
                                لماذا تختار خدمة {service.title} من شركة الحور؟
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                1. كفاءة وسرعة في إنجاز عملية النقل دون تأخير.
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                2. نستخدم خامات تغليف عالية الجودة مخصصة لكل قطعة أثاث.
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                3. التزام تام بالمحافظة على المنقولات، مع وجود ضمان حقيقي يحميك من أي خسائر.
                            </Typography>
                        </Box>
                    </Grid>

                    {/* Request Quote Widget Sidebar */}
                    <Grid item xs={12} md={4}>
                        <Card
                            sx={{
                                position: 'sticky',
                                top: 100,
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 3,
                                boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                            }}
                        >
                            <CardContent sx={{ p: 4 }}>
                                <Typography variant="h4" fontWeight={700} mb={1}>
                                    اطلب الخدمة الآن
                                </Typography>
                                <Typography variant="body2" color="text.secondary" mb={3}>
                                    أدخل بياناتك وسنتصل بك فوراً للاتفاق وتحديد الموعد.
                                </Typography>

                                {formSuccess && (
                                    <Alert severity="success" sx={{ mb: 3 }}>
                                        تم إرسال طلبك بنجاح! سنتواصل معك قريباً.
                                    </Alert>
                                )}

                                <Box component="form" noValidate onSubmit={formik.handleSubmit}>
                                    <TextField
                                        fullWidth
                                        name="name"
                                        label="الاسم الكريم"
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        error={formik.touched.name && Boolean(formik.errors.name)}
                                        helperText={formik.touched.name && formik.errors.name}
                                        sx={{ mb: 2.5 }}
                                    />
                                    <TextField
                                        fullWidth
                                        name="phone"
                                        label="رقم الهاتف"
                                        value={formik.values.phone}
                                        onChange={formik.handleChange}
                                        error={formik.touched.phone && Boolean(formik.errors.phone)}
                                        helperText={formik.touched.phone && formik.errors.phone}
                                        sx={{ mb: 2.5 }}
                                    />
                                    <TextField
                                        fullWidth
                                        name="message"
                                        label="تفاصيل الطلب (أماكن الفك والنقل)"
                                        multiline
                                        rows={3}
                                        placeholder={`مثال: أريد نقل أثاث من منطقة السالمية إلى حولي مع الفك والتركيب...`}
                                        value={formik.values.message}
                                        onChange={formik.handleChange}
                                        error={formik.touched.message && Boolean(formik.errors.message)}
                                        helperText={formik.touched.message && formik.errors.message}
                                        sx={{ mb: 3 }}
                                    />
                                    <Button
                                        fullWidth
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                        disabled={formSubmitting}
                                        sx={{ py: 1.5, fontWeight: 700, borderRadius: 2 }}
                                    >
                                        {formSubmitting ? <CircularProgress size={24} /> : 'إرسال الطلب'}
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
