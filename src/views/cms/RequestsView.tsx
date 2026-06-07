'use client';

import React, { useState, useEffect } from 'react';
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
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import { Eye, Whatsapp, CallCalling } from '@wandersonalwes/iconsax-react';

import PageHeader from 'components/cms/PageHeader';
import DataTable, { ColumnDef } from 'components/cms/DataTable';
import SearchBox from 'components/cms/SearchBox';
import StatusBadge from 'components/cms/StatusBadge';

import { useRequests, useUpdateRequestStatus } from 'hooks/cms/useRequests';
import type { ServiceRequest, RequestStatus } from 'types/cms';

export default function RequestsView() {
  const { requests, meta, isLoading, error, filters, updateFilters, setPage, mutate } = useRequests();

  const statusMutation = useUpdateRequestStatus();

  // State
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Check URL query search params for direct details trigger (e.g. from Dashboard click)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const idStr = params.get('id');
      if (idStr && requests.length > 0) {
        const id = parseInt(idStr, 10);
        const req = requests.find((r) => r.id === id);
        if (req) {
          setSelectedRequest(req);
          setDetailsOpen(true);
          // clear param from url quietly
          window.history.replaceState({}, '', window.location.pathname);
        }
      }
    }
  }, [requests]);

  const handleOpenDetails = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setSelectedRequest(null);
    setDetailsOpen(false);
  };

  const handleStatusChange = async (status: RequestStatus) => {
    if (selectedRequest) {
      await statusMutation.updateStatus(selectedRequest.id, status);
      mutate();
      // Update local request status in state
      setSelectedRequest({ ...selectedRequest, status });
    }
  };

  // Columns definition
  const columns: ColumnDef<ServiceRequest>[] = [
    {
      key: 'name',
      label: 'العميل',
      render: (row) => (
        <Typography variant="subtitle2" fontWeight={600}>
          {row.name}
        </Typography>
      )
    },
    {
      key: 'phone',
      label: 'رقم الهاتف',
      render: (row) => (
        <Typography variant="body2" sx={{ direction: 'ltr', textAlign: 'right' }}>
          {row.phone}
        </Typography>
      )
    },
    {
      key: 'service',
      label: 'الخدمة المطلوبة',
      render: (row) => <Typography variant="body2">{row.service?.title || 'طلب عام (نقل أثاث)'}</Typography>
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      key: 'created_at',
      label: 'تاريخ الطلب',
      render: (row) => (
        <Typography variant="body2" color="text.secondary">
          {new Date(row.created_at).toLocaleDateString('ar-KW')}{' '}
          {new Date(row.created_at).toLocaleTimeString('ar-KW', { hour: '2-digit', minute: '2-digit' })}
        </Typography>
      )
    },
    {
      key: 'actions',
      label: 'العمليات',
      align: 'center',
      render: (row) => (
        <Stack direction="row" spacing={1} justifyContent="center">
          <IconButton size="small" color="primary" onClick={() => handleOpenDetails(row)}>
            <Eye size={16} />
          </IconButton>
          {/* Quick WhatsApp Link */}
          <IconButton
            size="small"
            color="success"
            component="a"
            href={`https://wa.me/${row.phone.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Whatsapp size={16} variant="Bold" />
          </IconButton>
        </Stack>
      )
    }
  ];

  return (
    <Box>
      <PageHeader title="طلبات الخدمة" subtitle="متابعة طلبات نقل العفش والأثاث الواردة من نموذج الاتصال بالموقع والتواصل مع العملاء." />

      <Card>
        <CardContent sx={{ p: 0 }}>
          {/* Filters */}
          <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2} p={2}>
            <SearchBox
              value={filters.search || ''}
              onChange={(search) => updateFilters({ search })}
              placeholder="بحث باسم العميل أو الهاتف..."
            />
            <TextField
              select
              size="small"
              value={filters.status || 'all'}
              onChange={(e) => updateFilters({ status: e.target.value === 'all' ? undefined : (e.target.value as RequestStatus) })}
              sx={{ minWidth: 160 }}
            >
              <MenuItem value="all">كل طلبات الخدمة</MenuItem>
              <MenuItem value="new">جديد (غير مقروء)</MenuItem>
              <MenuItem value="contacted">تم التواصل</MenuItem>
              <MenuItem value="completed">مكتمل</MenuItem>
              <MenuItem value="cancelled">ملغى</MenuItem>
            </TextField>
          </Stack>

          {/* DataTable */}
          <DataTable
            columns={columns}
            rows={requests}
            loading={isLoading}
            error={error?.message}
            total={meta?.total || 0}
            page={(meta?.current_page || 1) - 1}
            rowsPerPage={meta?.per_page || 10}
            onPageChange={(p) => setPage(p + 1)}
            onRowsPerPageChange={(rpp) => updateFilters({ per_page: rpp })}
            selectable={false}
          />
        </CardContent>
      </Card>

      {/* Request Details Dialog */}
      <Dialog open={detailsOpen} onClose={handleCloseDetails} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>تفاصيل طلب الخدمة</DialogTitle>
        <DialogContent dividers>
          {selectedRequest && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  اسم العميل
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {selectedRequest.name}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  الهاتف
                </Typography>
                <Typography variant="body1" fontWeight={600} sx={{ direction: 'ltr', textAlign: 'right' }}>
                  {selectedRequest.phone}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  الخدمة المطلوبة
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {selectedRequest.service?.title || 'طلب عام (نقل أثاث)'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  تاريخ وموعد الإرسال
                </Typography>
                <Typography variant="body1">{new Date(selectedRequest.created_at).toLocaleString('ar-KW')}</Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">
                  حالة الطلب الحالية
                </Typography>
                <Box mt={1} mb={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel>الحالة</InputLabel>
                    <Select
                      value={selectedRequest.status}
                      label="الحالة"
                      onChange={(e) => handleStatusChange(e.target.value as RequestStatus)}
                      disabled={statusMutation.isLoading}
                    >
                      <MenuItem value="new">جديد (قيد الانتظار)</MenuItem>
                      <MenuItem value="contacted">تم التواصل بالعميل</MenuItem>
                      <MenuItem value="completed">مكتمل (تم النقل بنجاح)</MenuItem>
                      <MenuItem value="cancelled">ملغى</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">
                  الرسالة / متطلبات النقل بالتفصيل
                </Typography>
                <Card variant="outlined" sx={{ mt: 1, bgcolor: 'action.hover' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                      {selectedRequest.message || 'لا توجد تفاصيل إضافية في رسالة العميل.'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          {selectedRequest && (
            <>
              <Button
                variant="contained"
                color="success"
                startIcon={<Whatsapp size={16} variant="Bold" />}
                component="a"
                href={`https://wa.me/${selectedRequest.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                تواصل واتساب
              </Button>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<CallCalling size={16} />}
                component="a"
                href={`tel:${selectedRequest.phone}`}
              >
                اتصال هاتفي
              </Button>
            </>
          )}
          <Button onClick={handleCloseDetails} color="secondary" sx={{ ml: 'auto' }}>
            إغلاق
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
