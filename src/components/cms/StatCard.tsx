'use client';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import type { ReactNode } from 'react';

// ==============================|| COMPONENT — STAT CARD ||============================== //

interface StatCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  color?: string;
  bgColor?: string;
  trend?: { value: number; label: string };
}

export default function StatCard({ title, value, icon, color = '#1890ff', bgColor, trend }: StatCardProps) {
  return (
    <Card sx={{ height: '100%', boxShadow: '0 2px 14px 0 rgba(32,40,45,0.08)' }}>
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h3" fontWeight={700} color="text.primary">
              {typeof value === 'number' ? value.toLocaleString('ar-KW') : value}
            </Typography>
            {trend && (
              <Typography variant="caption" color={trend.value >= 0 ? 'success.main' : 'error.main'} mt={0.5} display="block">
                {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: bgColor || `${color}18`,
              color
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
