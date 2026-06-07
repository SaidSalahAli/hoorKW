'use client';

import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Link from 'next/link';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

import { CallCalling, Category, Document, MessageText1, Gallery, Eye } from '@wandersonalwes/iconsax-react';

import PageHeader from 'components/cms/PageHeader';
import StatCard from 'components/cms/StatCard';
import StatusBadge from 'components/cms/StatusBadge';
import { useDashboardStats } from 'hooks/cms/useDashboard';

// ==============================|| VIEW — DASHBOARD ||============================== //

export default function DashboardView() {
  const { stats, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 3 }}>
        {error.message || 'خطأ في تحميل بيانات لوحة التحكم'}
      </Alert>
    );
  }

  const latestRequests = stats?.latest_requests || [];
  const monthlyRequests = stats?.monthly_requests || [];
  const servicesPerformance = stats?.services_performance || [];

  // Finding the maximum request count for percentage-based bar charts
  const maxMonthlyCount = Math.max(...monthlyRequests.map((m) => m.count), 1);
  const maxServiceCount = Math.max(...servicesPerformance.map((s) => s.requests), 1);

  return (
    <Box>
      <PageHeader
        title="لوحة التحكم"
        subtitle="مرحباً بك في لوحة تحكم شركة نقل الأثاث. هنا يمكنك متابعة طلبات الخدمة والإحصائيات العامة."
      />

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard title="إجمالي الطلبات" value={stats?.total_requests || 0} icon={<CallCalling size={28} />} color="#2f54eb" />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard title="الخدمات النشطة" value={stats?.total_services || 0} icon={<Category size={28} />} color="#52c41a" />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard title="المقالات والأخبار" value={stats?.total_articles || 0} icon={<Document size={28} />} color="#1890ff" />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard title="آراء العملاء" value={stats?.total_testimonials || 0} icon={<MessageText1 size={28} />} color="#faad14" />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard title="معرض الصور" value={stats?.total_gallery || 0} icon={<Gallery size={28} />} color="#eb2f96" />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} mb={4}>
        {/* Monthly Requests Bar Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardHeader title="طلبات الخدمة الشهرية" />
            <CardContent>
              {monthlyRequests.length === 0 ? (
                <Typography color="text.secondary" align="center">
                  لا توجد بيانات شهرية كافية
                </Typography>
              ) : (
                <Stack spacing={2} sx={{ pt: 2 }}>
                  {monthlyRequests.map((item, idx) => {
                    const percent = (item.count / maxMonthlyCount) * 100;
                    return (
                      <Box key={idx}>
                        <Stack direction="row" justifyContent="space-between" mb={0.5}>
                          <Typography variant="body2" fontWeight={500}>
                            {item.month}
                          </Typography>
                          <Typography variant="body2" fontWeight={600} color="primary">
                            {item.count} طلب
                          </Typography>
                        </Stack>
                        <Box sx={{ width: '100%', bgcolor: 'action.hover', borderRadius: 1, height: 12, overflow: 'hidden' }}>
                          <Box
                            sx={{
                              width: `${percent}%`,
                              bgcolor: 'primary.main',
                              height: '100%',
                              borderRadius: 1,
                              transition: 'width 0.6s ease'
                            }}
                          />
                        </Box>
                      </Box>
                    );
                  })}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Services Performance Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardHeader title="أداء الخدمات (الطلبات الأكثر طلباً)" />
            <CardContent>
              {servicesPerformance.length === 0 ? (
                <Typography color="text.secondary" align="center">
                  لا توجد بيانات كافية للخدمات
                </Typography>
              ) : (
                <Stack spacing={2} sx={{ pt: 2 }}>
                  {servicesPerformance.map((item, idx) => {
                    const percent = (item.requests / maxServiceCount) * 100;
                    return (
                      <Box key={idx}>
                        <Stack direction="row" justifyContent="space-between" mb={0.5}>
                          <Typography variant="body2" fontWeight={500}>
                            {item.service}
                          </Typography>
                          <Typography variant="body2" fontWeight={600} color="secondary">
                            {item.requests} طلب
                          </Typography>
                        </Stack>
                        <Box sx={{ width: '100%', bgcolor: 'action.hover', borderRadius: 1, height: 12, overflow: 'hidden' }}>
                          <Box
                            sx={{
                              width: `${percent}%`,
                              bgcolor: 'success.main',
                              height: '100%',
                              borderRadius: 1,
                              transition: 'width 0.6s ease'
                            }}
                          />
                        </Box>
                      </Box>
                    );
                  })}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Latest Requests Table */}
      <Card>
        <CardHeader
          title="أحدث طلبات الخدمة الواردة"
          action={
            <Link href="/dashboard/requests" passHref legacyBehavior>
              <Button size="small" variant="outlined" color="primary">
                عرض جميع الطلبات
              </Button>
            </Link>
          }
        />
        <CardContent sx={{ p: 0 }}>
          {latestRequests.length === 0 ? (
            <Box py={4} textAlign="center">
              <Typography color="text.secondary">لا توجد طلبات واردة حالياً</Typography>
            </Box>
          ) : (
            <Box sx={{ overflowX: 'auto' }}>
              <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
                <Box component="thead" sx={{ bgcolor: 'action.hover' }}>
                  <Box component="tr">
                    <Box component="th" sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', fontWeight: 600 }}>
                      العميل
                    </Box>
                    <Box component="th" sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', fontWeight: 600 }}>
                      الهاتف
                    </Box>
                    <Box component="th" sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', fontWeight: 600 }}>
                      الخدمة المطلوبة
                    </Box>
                    <Box component="th" sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', fontWeight: 600 }}>
                      الحالة
                    </Box>
                    <Box component="th" sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', fontWeight: 600 }}>
                      التاريخ
                    </Box>
                    <Box
                      component="th"
                      sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', fontWeight: 600, textAlign: 'center' }}
                    >
                      العمليات
                    </Box>
                  </Box>
                </Box>
                <Box component="tbody">
                  {latestRequests.map((req) => (
                    <Box component="tr" key={req.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                      <Box component="td" sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="body2" fontWeight={600}>
                          {req.name}
                        </Typography>
                      </Box>
                      <Box
                        component="td"
                        sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', direction: 'ltr', textAlign: 'right' }}
                      >
                        {req.phone}
                      </Box>
                      <Box component="td" sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                        {req.service?.title || 'عام / نقل عفش'}
                      </Box>
                      <Box component="td" sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                        <StatusBadge status={req.status} />
                      </Box>
                      <Box
                        component="td"
                        sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', color: 'text.secondary', fontSize: '0.825rem' }}
                      >
                        {new Date(req.created_at).toLocaleDateString('ar-KW', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Box>
                      <Box component="td" sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
                        <Link href={`/dashboard/requests?id=${req.id}`} passHref legacyBehavior>
                          <Button size="small" variant="text" startIcon={<Eye size={16} />}>
                            تفاصيل
                          </Button>
                        </Link>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
