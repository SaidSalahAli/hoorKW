'use client';

import { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { Trash } from '@wandersonalwes/iconsax-react';

// ==============================|| COMPONENT — DATA TABLE ||============================== //

export interface ColumnDef<T> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
  width?: number | string;
  align?: 'left' | 'right' | 'center';
  sortable?: boolean;
}

interface DataTableProps<T extends { id: number }> {
  columns: ColumnDef<T>[];
  rows: T[];
  loading?: boolean;
  error?: string | null;
  total?: number;
  page?: number;
  rowsPerPage?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rpp: number) => void;
  selectable?: boolean;
  selectedIds?: number[];
  onSelectionChange?: (ids: number[]) => void;
  onBulkDelete?: (ids: number[]) => void;
  bulkDeleteLoading?: boolean;
  emptyMessage?: string;
  stickyHeader?: boolean;
}

export default function DataTable<T extends { id: number }>({
  columns,
  rows,
  loading = false,
  error = null,
  total = 0,
  page = 0,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
  selectable = true,
  selectedIds = [],
  onSelectionChange,
  onBulkDelete,
  bulkDeleteLoading = false,
  emptyMessage = 'لا توجد بيانات',
  stickyHeader = true
}: DataTableProps<T>) {
  const allIds = rows.map((r) => r.id);
  const allSelected = allIds.length > 0 && allIds.every((id) => selectedIds.includes(id));
  const someSelected = allIds.some((id) => selectedIds.includes(id));

  const handleSelectAll = () => {
    if (!onSelectionChange) return;
    if (allSelected) {
      onSelectionChange(selectedIds.filter((id) => !allIds.includes(id)));
    } else {
      onSelectionChange([...new Set([...selectedIds, ...allIds])]);
    }
  };

  const handleSelectRow = (id: number) => {
    if (!onSelectionChange) return;
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((sid) => sid !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  return (
    <Box>
      {/* Bulk Actions Bar */}
      {selectable && selectedIds.length > 0 && (
        <Stack direction="row" alignItems="center" gap={2} px={2} py={1} mb={1} sx={{ bgcolor: 'primary.lighter', borderRadius: 1 }}>
          <Typography variant="body2" fontWeight={600}>
            تم اختيار {selectedIds.length} عنصر
          </Typography>
          {onBulkDelete && (
            <Button
              size="small"
              color="error"
              variant="contained"
              startIcon={<Trash size={14} />}
              onClick={() => onBulkDelete(selectedIds)}
              disabled={bulkDeleteLoading}
            >
              حذف المحدد
            </Button>
          )}
        </Stack>
      )}

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Table */}
      <TableContainer sx={{ maxHeight: stickyHeader ? 520 : undefined, overflowX: 'auto' }}>
        <Table stickyHeader={stickyHeader} size="small">
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox indeterminate={someSelected && !allSelected} checked={allSelected} onChange={handleSelectAll} />
                </TableCell>
              )}
              {columns.map((col) => (
                <TableCell key={col.key} align={col.align ?? 'left'} sx={{ fontWeight: 700, whiteSpace: 'nowrap', width: col.width }}>
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 1 : 0)} align="center" sx={{ py: 6 }}>
                  <CircularProgress size={32} />
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 1 : 0)} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">{emptyMessage}</Typography>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id} hover selected={selectedIds.includes(row.id)} sx={{ '&:last-child td': { border: 0 } }}>
                  {selectable && (
                    <TableCell padding="checkbox">
                      <Checkbox checked={selectedIds.includes(row.id)} onChange={() => handleSelectRow(row.id)} />
                    </TableCell>
                  )}
                  {columns.map((col) => (
                    <TableCell key={col.key} align={col.align ?? 'left'}>
                      {col.render ? col.render(row) : (row as any)[col.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {total > 0 && onPageChange && (
        <TablePagination
          component="div"
          count={total}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          onPageChange={(_, p) => onPageChange(p)}
          onRowsPerPageChange={(e) => onRowsPerPageChange?.(parseInt(e.target.value, 10))}
          labelRowsPerPage="صفوف في الصفحة:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} من ${count}`}
        />
      )}
    </Box>
  );
}
