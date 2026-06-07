'use client';

import { useRef } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import { SearchNormal1, CloseCircle } from '@wandersonalwes/iconsax-react';

// ==============================|| COMPONENT — SEARCH BOX ||============================== //

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export default function SearchBox({ value, onChange, placeholder = 'بحث...', debounceMs = 400 }: SearchBoxProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onChange(v), debounceMs);
  };

  return (
    <OutlinedInput
      defaultValue={value}
      onChange={handleChange}
      placeholder={placeholder}
      size="small"
      startAdornment={
        <InputAdornment position="start">
          <SearchNormal1 size={18} />
        </InputAdornment>
      }
      endAdornment={
        value ? (
          <InputAdornment position="end">
            <IconButton size="small" onClick={() => onChange('')} edge="end">
              <CloseCircle size={16} />
            </IconButton>
          </InputAdornment>
        ) : null
      }
      sx={{ minWidth: 240 }}
    />
  );
}
