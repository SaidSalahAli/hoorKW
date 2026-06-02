import Chip from '@mui/material/Chip';
import type { ChipProps } from '@mui/material/Chip';
import type { Status, RequestStatus } from 'types/cms';

// ==============================|| COMPONENT — STATUS BADGE ||============================== //

type BadgeStatus = Status | RequestStatus;

const statusConfig: Record<string, { label: string; color: ChipProps['color'] }> = {
  active:    { label: 'نشط',       color: 'success'  },
  published: { label: 'منشور',     color: 'success'  },
  inactive:  { label: 'غير نشط',   color: 'default'  },
  draft:     { label: 'مسودة',     color: 'warning'  },
  new:       { label: 'جديد',      color: 'primary'  },
  contacted: { label: 'تم التواصل',color: 'info'     },
  completed: { label: 'مكتمل',     color: 'success'  },
  cancelled: { label: 'ملغى',      color: 'error'    }
};

interface StatusBadgeProps {
  status: BadgeStatus;
  size?: ChipProps['size'];
}

export default function StatusBadge({ status, size = 'small' }: StatusBadgeProps) {
  const config = statusConfig[status] ?? { label: status, color: 'default' as ChipProps['color'] };
  return (
    <Chip
      label={config.label}
      color={config.color}
      size={size}
      variant="outlined"
      sx={{ fontWeight: 600, minWidth: 80 }}
    />
  );
}
