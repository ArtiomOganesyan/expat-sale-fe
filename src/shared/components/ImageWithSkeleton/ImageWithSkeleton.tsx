import { Skeleton } from '@mui/material';
import { useState, useEffect } from 'react';
import styles from './ImageWithSkeleton.module.css';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';

function ImageWithSkeleton({ src, alt, height = 180 }: { src?: string | null; alt: string; height?: number }) {
  // Initialize loaded immediately if image is already cached to prevent skeleton flash
  const [loaded, setLoaded] = useState<boolean>(() => {
    if (!src) return false;
    const img = new Image();
    img.src = src;
    return img.complete && img.naturalWidth > 0;
  });
  const [error, setError] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);

  // Delay showing skeleton a tiny bit; if image loads fast we skip skeleton to avoid flicker
  useEffect(() => {
    if (loaded || error || !src) return;
    const t = setTimeout(() => {
      if (!loaded) setShowSkeleton(true);
    }, 80); // 80ms threshold
    return () => clearTimeout(t);
  }, [loaded, error, src]);

  const showIcon = !src || error;

  return (
    <div
      className={styles.imageWrapper}
      style={{ height }}
    >
      {showIcon ? (
        <div className={styles.iconWrapper}>
          <ImageNotSupportedIcon className={styles.icon} />
        </div>
      ) : (
        <>
          {!loaded && showSkeleton && (
            <Skeleton
              variant='rectangular'
              width='100%'
              height={height}
              animation='wave'
            />
          )}
          <img
            src={src!}
            alt={alt}
            height={height}
            className={`${styles.image} ${loaded ? styles.loaded : ''}`}
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
            style={{ display: loaded ? 'block' : 'none' }}
          />
        </>
      )}
    </div>
  );
}

export default ImageWithSkeleton;
