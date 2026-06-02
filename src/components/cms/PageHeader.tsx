'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import type { ReactNode } from 'react';

// ==============================|| COMPONENT — PAGE HEADER ||============================== //

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  breadcrumb?: ReactNode;
}

export default function PageHeader({ title, subtitle, actions, breadcrumb }: PageHeaderProps) {
  return (
    <Box mb={3}>
      {breadcrumb && <Box mb={1}>{breadcrumb}</Box>}
      <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h4" fontWeight={600}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {actions && <Stack direction="row" gap={1}>{actions}</Stack>}
      </Stack>
      <Divider sx={{ mt: 2 }} />
    </Box>
  );
}
