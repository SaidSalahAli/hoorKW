'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { CloseCircle, Gallery } from '@wandersonalwes/iconsax-react';

// ==============================|| COMPONENT — IMAGE UPLOADER ||============================== //

interface ImageUploaderProps {
  value?: File | null;
  currentImageUrl?: string | null;
  onChange: (file: File | null) => void;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  error?: string;
}

export default function ImageUploader({
  value,
  currentImageUrl,
  onChange,
  accept = 'image/jpeg,image/png,image/webp',
  maxSizeMB = 5,
  label = 'رفع صورة',
  error
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [sizeError, setSizeError] = useState<string | null>(null);

  // Build preview when value changes
  useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreview(null);
  }, [value]);

  const displayImage = preview || currentImageUrl;

  const handleFile = useCallback(
    (file: File | null) => {
      setSizeError(null);
      if (!file) {
        onChange(null);
        return;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        setSizeError(`حجم الصورة يجب ألا يتجاوز ${maxSizeMB} ميغابايت`);
        return;
      }
      onChange(file);
    },
    [onChange, maxSizeMB]
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0] ?? null;
    handleFile(file);
  };

  return (
    <Box>
      {label && (
        <Typography variant="subtitle2" mb={1} color="text.secondary">
          {label}
        </Typography>
      )}

      {/* Drop zone */}
      <Box
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        sx={{
          border: '2px dashed',
          borderColor: error || sizeError ? 'error.main' : dragOver ? 'primary.main' : 'divider',
          borderRadius: 2,
          p: 2,
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s',
          bgcolor: dragOver ? 'action.hover' : 'background.default',
          position: 'relative',
          minHeight: 160,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 1,
          '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' }
        }}
      >
        {displayImage ? (
          <>
            <Box
              component="img"
              src={displayImage}
              alt="preview"
              sx={{ maxHeight: 140, maxWidth: '100%', objectFit: 'contain', borderRadius: 1 }}
            />
            <IconButton
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                handleFile(null);
              }}
              sx={{ position: 'absolute', top: 4, right: 4 }}
            >
              <CloseCircle size={20} />
            </IconButton>
          </>
        ) : (
          <>
            <Gallery size={40} color="#9e9e9e" />
            <Typography variant="body2" color="text.secondary">
              اسحب الصورة هنا أو انقر للرفع
            </Typography>
            <Typography variant="caption" color="text.disabled">
              {accept.split(',').join(' / ')} — حتى {maxSizeMB} MB
            </Typography>
          </>
        )}
      </Box>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />

      {(error || sizeError) && (
        <Typography variant="caption" color="error" mt={0.5} display="block">
          {error || sizeError}
        </Typography>
      )}
    </Box>
  );
}
