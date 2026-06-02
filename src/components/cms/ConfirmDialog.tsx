'use client';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LoadingButton from '@mui/lab/LoadingButton';
import { Trash } from '@wandersonalwes/iconsax-react';

// ==============================|| COMPONENT — CONFIRM DIALOG ||============================== //

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
  severity?: 'error' | 'warning' | 'info';
}

export default function ConfirmDialog({
  open,
  title = 'تأكيد الحذف',
  message = 'هل أنت متأكد من حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء.',
  confirmLabel = 'حذف',
  cancelLabel = 'إلغاء',
  loading = false,
  onConfirm,
  onClose,
  severity = 'error'
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined" color="secondary" disabled={loading}>
          {cancelLabel}
        </Button>
        <LoadingButton
          onClick={onConfirm}
          variant="contained"
          color={severity}
          loading={loading}
          startIcon={severity === 'error' ? <Trash size={16} /> : undefined}
        >
          {confirmLabel}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
