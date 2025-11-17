import { useEffect, useMemo, useState } from 'react';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import styles from './FormFiles.module.css';

import FormError from '../FormError/FormError';
import { useTranslation } from 'react-i18next';

export default function InputFileUpload({ files, setFiles }: { files: File[]; setFiles: (files: File[]) => void }) {
  const { t } = useTranslation('item');
  const [error, setError] = useState('');

  // Build object URLs for previews and clean them up on change
  const previews = useMemo(() => files.map(f => URL.createObjectURL(f)), [files]);
  useEffect(() => {
    return () => {
      previews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const handleRemove = (index: number) => {
    const next = files.filter((_, i) => i !== index);
    setFiles(next);
  };

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        setError('');
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [error]);

  return (
    <div style={{ width: '100%' }}>
      <Button
        component='label'
        role={undefined}
        variant='contained'
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
        onClick={() => {
          setError('');
        }}
        sx={{ width: '100%' }}
      >
        {files.length ? `${t('form.images.count')} (${files.length}/5)` : t('form.images')}
        <input
          hidden
          type='file'
          accept='image/*'
          onChange={event => {
            const list = event.target.files;
            if (!list || list.length === 0) {
              setError(t('form.error.images.empty'));
              return;
            }

            const selectedFiles = Array.from(list);
            const validFiles = selectedFiles.filter(file => {
              const fileSizeInMB = file.size / (1024 * 1024);
              if (fileSizeInMB > 5) {
                setError(t('form.error.images.size'));
                return false;
              }
              return true;
            });

            // Enforce max 5 in total
            const remaining = Math.max(0, 5 - files.length);
            if (remaining === 0) {
              setError(t('form.error.images'));
              event.currentTarget.value = '';
              return;
            }
            const toAdd = validFiles.slice(0, remaining);
            if (files.length + toAdd.length > 5) {
              setError(t('form.error.images'));
              event.currentTarget.value = '';
              return;
            }
            setFiles([...files, ...toAdd]);
            // Clear the input to allow re-select same files
            event.currentTarget.value = '';
          }}
          multiple
        />
      </Button>
      <FormError
        error={error}
        style={{ background: 'white', padding: 10, borderRadius: 5, marginTop: 8 }}
      />

      {files.length > 0 && (
        <div className={styles.previews}>
          {previews.map((url, index) => (
            <div
              key={url}
              className={styles.preview}
            >
              <img
                src={url}
                alt={files[index]?.name || `image-${index}`}
                className={styles.thumb}
              />
              <IconButton
                size='small'
                aria-label='remove image'
                className={styles.removeBtn}
                onClick={() => handleRemove(index)}
              >
                <CloseIcon fontSize='small' />
              </IconButton>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
