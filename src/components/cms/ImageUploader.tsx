'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import { CloseCircle, Gallery, Magicpen } from '@wandersonalwes/iconsax-react';
import { Stack } from '@mui/material';

// Client-side image compression helper
export async function compressImageFile(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.8
): Promise<{ compressedFile: File; originalSize: number; newSize: number }> {
  const originalSize = file.size;

  // Only compress raster images
  if (!file.type.startsWith('image/') || file.type.includes('svg')) {
    return { compressedFile: file, originalSize, newSize: originalSize };
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ compressedFile: file, originalSize, newSize: originalSize });
          return;
        }

        // Fill white background for transparent PNG conversion
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Export as WebP for maximum compression
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve({ compressedFile: file, originalSize, newSize: originalSize });
              return;
            }
            const cleanName = file.name.replace(/\.[^/.]+$/, '') + '.webp';
            const compressedFile = new File([blob], cleanName, {
              type: 'image/webp',
              lastModified: Date.now()
            });

            // Only use compressed if it's smaller, otherwise use original
            if (compressedFile.size < file.size) {
              resolve({ compressedFile, originalSize, newSize: compressedFile.size });
            } else {
              resolve({ compressedFile: file, originalSize, newSize: originalSize });
            }
          },
          'image/webp',
          quality
        );
      };
      img.onerror = () => resolve({ compressedFile: file, originalSize, newSize: originalSize });
    };
    reader.onerror = () => resolve({ compressedFile: file, originalSize, newSize: originalSize });
  });
}

interface ImageUploaderProps {
  value?: File | null;
  currentImageUrl?: string | null;
  onChange: (file: File | null) => void;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  error?: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

export default function ImageUploader({
  value,
  currentImageUrl,
  onChange,
  accept = 'image/jpeg,image/png,image/webp',
  maxSizeMB = 10,
  label = 'رفع صورة',
  error
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [sizeError, setSizeError] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionInfo, setCompressionInfo] = useState<string | null>(null);

  // Build preview when value changes
  useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreview(null);
    if (!value) {
      setCompressionInfo(null);
    }
  }, [value]);

  const displayImage = preview || currentImageUrl;

  const handleFile = useCallback(
    async (file: File | null) => {
      setSizeError(null);
      setCompressionInfo(null);
      if (!file) {
        onChange(null);
        return;
      }

      setIsCompressing(true);
      try {
        const { compressedFile, originalSize, newSize } = await compressImageFile(file);

        if (compressedFile.size > maxSizeMB * 1024 * 1024) {
          setSizeError(`حجم الصورة بعد الضغط يتجاوز ${maxSizeMB} ميغابايت`);
          onChange(null);
          return;
        }

        if (originalSize > newSize) {
          const savingsPercent = Math.round(((originalSize - newSize) / originalSize) * 100);
          setCompressionInfo(`تم ضغط الصورة تلقائياً من ${formatBytes(originalSize)} إلى ${formatBytes(newSize)} (وفرت ${savingsPercent}%)`);
        }

        onChange(compressedFile);
      } catch {
        onChange(file);
      } finally {
        setIsCompressing(false);
      }
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
        onClick={() => !isCompressing && inputRef.current?.click()}
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
          cursor: isCompressing ? 'wait' : 'pointer',
          transition: 'all 0.2s',
          bgcolor: dragOver ? 'action.hover' : 'background.default',
          position: 'relative',
          minHeight: 160,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 1,
          '&:hover': { borderColor: isCompressing ? 'divider' : 'primary.main', bgcolor: 'action.hover' }
        }}
      >
        {isCompressing ? (
          <Stack spacing={1.5} alignItems="center">
            <CircularProgress size={36} color="primary" />
            <Typography variant="body2" color="primary" fontWeight={600}>
              جاري ضغط الصورة وتقليل حجمها تلقائياً...
            </Typography>
          </Stack>
        ) : displayImage ? (
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
              سيتم ضغط وتصغير أي صورة تلقائياً لتكون فورية التحميل 🚀
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

      {compressionInfo && (
        <Box mt={1} display="flex" alignItems="center" gap={0.5}>
          <Chip
            icon={<Magicpen size={14} color="#059669" />}
            label={compressionInfo}
            size="small"
            color="success"
            variant="outlined"
            sx={{ fontWeight: 600, fontSize: '0.75rem' }}
          />
        </Box>
      )}

      {(error || sizeError) && (
        <Typography variant="caption" color="error" mt={0.5} display="block">
          {error || sizeError}
        </Typography>
      )}
    </Box>
  );
}
