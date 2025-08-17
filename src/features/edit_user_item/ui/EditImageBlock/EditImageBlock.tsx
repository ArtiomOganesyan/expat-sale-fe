import { type FC, useEffect, useRef, useState } from 'react';
import styles from './EditImageBlock.module.css';
import clsx from 'clsx';
import ImageContainer from '../ImageContainer/ImageContainer';
import { useDeleteImageInItemMutation, useUpdateImageToItemMutation } from '../../../../entities/items/itemAPI';
import { GradientCircularProgress } from '../../../../widget/Loading/LoadingComponent';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { IconButton } from '@mui/material';
import { type Item } from '../../../../entities/items/types/items';
import { useSnackbar } from '../../../../shared/hooks/useSnackbar';

interface EditImageBlockProps {
  className?: string;
  item?: Item;
  edit: boolean;
}

export const EditImageBlock: FC<EditImageBlockProps> = ({ className, item, edit }) => {
  const [updateImageToItem] = useUpdateImageToItemMutation();
  const [deleteImageInItemMutation] = useDeleteImageInItemMutation();
  const [images, setImages] = useState<Partial<Item['images'][number]>[]>(item?.images || []);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (item?.images) {
      setImages(item.images);
    }
  }, [item?.images]);

  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const updateItemImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });

    try {
      setIsUploadingImage(true);
      if (item) {
        await updateImageToItem({
          id: item.id,
          formData,
        });

        const uploadedImage: Partial<Item['images'][number]> = {
          id: Date.now().toString(),
          public_url: URL.createObjectURL(files[0]),
        };

        setImages(prev => [...prev, uploadedImage]);
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
      showSnackbar({
        title: 'Image upload failed',
        subtitle: 'Something went wrong while uploading. Try again later.',
        severity: 'error',
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const deleteItemImage = async (imageId: string) => {
    try {
      setImages(prev => prev.filter(img => img.id !== imageId));
      await deleteImageInItemMutation({ imageId }).unwrap();
    } catch (err) {
      console.error('Ошибка при удалении изображения:', err);
      showSnackbar({
        title: 'Delete failed',
        subtitle: 'Could not delete the image. Try again later.',
        severity: 'error',
      });
    }
  };
  return (
    <div className={clsx(styles.block, className)}>
      {images.map(img => (
        <ImageContainer
          edit={edit}
          key={img.id}
          image={img.public_url ?? ''}
          updateItemImage={updateItemImage}
          handleFileDeleteClick={() => deleteItemImage(img.id || '')}
          fileInputRef={fileInputRef}
          handleFileInputClick={handleFileInputClick}
        />
      ))}
      {isUploadingImage && (
        <div className={styles.loading}>
          <GradientCircularProgress />
        </div>
      )}
      {edit && (
        <>
          <IconButton
            type='button'
            onClick={handleFileInputClick}
          >
            <AddPhotoAlternateIcon style={{ width: '100px', height: '100px' }} />
          </IconButton>
          <input
            style={{
              display: 'none',
            }}
            type='file'
            name='image'
            accept='image/*'
            onChange={updateItemImage}
            ref={fileInputRef}
          />
        </>
      )}
    </div>
  );
};
