import { useParams } from 'react-router';
import { useAddToFavoriteMutation, useGetItemByIdQuery, useRemoveFromFavoriteMutation } from '../../entities/items/itemAPI';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Carousel from 'react-material-ui-carousel';
import {
  AppBar,
  Box,
  CardActionArea,
  Chip,
  Grid2,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Toolbar,
  useMediaQuery,
} from '@mui/material';
import type React from 'react';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { forwardRef, useState } from 'react';
import { useNavigate } from 'react-router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteHeartIcon from '../../shared/icons/FavoriteHeartIcon';
import { useAppSelector } from '../../hooks/hooks';
import { selectUser } from '../../entities/user/userSlice';
import ExpandableDescription from './ExpandebleDescription';
import { LoadingComponent } from '../../widget/Loading/LoadingComponent';
import type { PlatformType } from './ResolveIcon';
import { ResolveIcon } from './ResolveIcon';
import { resolveUrl } from './utils/resolveUrl';
import ErrorFallback from '../../shared/components/ErrorComponent/ErrorComponent';
import { resolveLocation } from './utils/resolveLocation';
import SafeSellerBadge from '../../shared/components/Badges/SafeSellerBadge';

type MyPaperProps = {
  className?: string;
  children?: React.ReactNode;
};

const MyPaper = forwardRef<HTMLDivElement, MyPaperProps>(({ className, children }, ref) => {
  return (
    <Box
      display='flex'
      alignItems='center'
      justifyContent='center'
      paddingTop='0.2rem'
    >
      <Paper
        sx={{ width: '98%' }}
        elevation={10}
      >
        {children}
      </Paper>
    </Box>
  );
});

export const Item: React.FC<{}> = forwardRef<HTMLDivElement, {}>((props, ref) => {
  const user = useAppSelector(selectUser);

  const params = useParams();
  const { data, isLoading, isError } = useGetItemByIdQuery({ itemId: params.id });
  const [addToFavorite] = useAddToFavoriteMutation();
  const [removeFromFavorite] = useRemoveFromFavoriteMutation();
  const [stateFavorite, setStateFavorite] = useState<boolean>(data?.is_favorite ?? false);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  const navigate = useNavigate();
  const isAuthenticated = !!user?.id;

  const matches = useMediaQuery('(max-width: 480px)');

  if (isLoading) {
    return <LoadingComponent />;
  }
  if (isError) {
    return <ErrorFallback />;
  }

  const handleBack = () => navigate(-1);
  const handleSellerProfileClick = () => {
    navigate(`/about`);
  };
  
  return (
    <>
      <Box
        display={'flex'}
        flexDirection={'column'}
        justifyContent={'center'}
        alignItems={'center'}
        sx={{
          marginTop: '40px',
          marginBottom: '40px',
        }}
      >
        <AppBar color='default'>
          <Toolbar sx={{ justifyContent: 'space-between', minHeight: '40px' }}>
            <IconButton
              edge='start'
              color='inherit'
              onClick={handleBack}
            >
              <ArrowBackIcon />
            </IconButton>

            {isAuthenticated && (
              <IconButton
                edge='end'
                color='inherit'
                onClick={() => {
                  if (stateFavorite) {
                    removeFromFavorite({ itemId: data?.id ?? '' });
                    setStateFavorite(false);
                  } else {
                    addToFavorite({ itemId: data?.id ?? '' });
                    setStateFavorite(true);
                  }
                }}
                size='small'
              >
                {stateFavorite ? <FavoriteHeartIcon isFavorite={true} /> : <FavoriteBorderIcon />}
              </IconButton>
            )}
          </Toolbar>
        </AppBar>

        <MyPaper>
          <Card
            sx={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              padding: 0,
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
              }}
            >
              <Carousel
                autoPlay={false}
                indicators={false}
                sx={{ width: '100%', height: '100%' }}
                navButtonsAlwaysInvisible={matches}
              >
                {data?.images.map((image, index) => {
                  const imageKey = `${image.id || index}`;
                  const isImageLoaded = loadedImages[imageKey];

                  return (
                    <CardActionArea
                      key={imageKey}
                      data-active={data.id}
                      sx={{
                        position: 'relative',
                        minHeight: '45vh',
                        height: '45vh',
                        width: '100%',
                        '&[data-active]': {
                          backgroundColor: 'action.selected',
                          '&:hover': {
                            backgroundColor: 'action.selectedHover',
                          },
                        },
                      }}
                    >
                      {!isImageLoaded && (
                        <Skeleton
                          variant='rectangular'
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                          }}
                          animation='wave'
                        />
                      )}
                      <CardMedia
                        component='img'
                        image={image.public_url}
                        onLoad={() => {
                          setLoadedImages(prev => ({
                            ...prev,
                            [imageKey]: true,
                          }));
                        }}
                        sx={{
                          display: isImageLoaded ? 'block' : 'none',
                        }}
                      />
                      {data?.user?.safe_seller && (
                        <Box
                          sx={{
                            position: 'absolute',
                            left: 8,
                            bottom: 16,
                            zIndex: 2,
                          }}
                          onClick={handleSellerProfileClick}
                        >
                          <SafeSellerBadge
                            size={matches ? 'm' : 'l'}
                            showText={false}
                          />
                        </Box>
                      )}
                      {isImageLoaded && data?.images && (
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 16,
                            right: 16,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            borderRadius: '25%',
                            width: 32,
                            height: 32,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.8rem',
                          }}
                        >
                          {`${index + 1}/${data.images.length}`}
                        </Box>
                      )}
                    </CardActionArea>
                  );
                })}
              </Carousel>
            </Box>
            {isLoading ? (
              <Skeleton
                variant='rectangular'
                width='100%'
                height='100%'
                animation='wave'
              />
            ) : (
              <CardContent
                sx={{
                  width: '100%',
                  display: 'flex',
                  backgroundColor: 'white',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  padding: '0 !important',
                  flexDirection: 'column',
                }}
              >
                <Grid2
                  container
                  sx={{ width: '100%', paddingLeft: 1, paddingRight: 1 }}
                >
                  {data?.title && (
                    <Grid2
                      size={12}
                      sx={{ marginBottom: 2 }}
                    >
                      <Stack>
                        <Typography
                          variant='h6'
                          sx={{ fontWeight: 'bold', textAlign: 'center' }}
                        >
                          {data.title}
                        </Typography>
                      </Stack>
                    </Grid2>
                  )}

                  {data?.price_usd && (
                    <Grid2
                      size={12}
                      sx={{ marginBottom: 2 }}
                    >
                      <Typography sx={{ fontWeight: 'bold', width: '35%', border: 'none' }}>{`Price`}</Typography>
                      <Typography
                        sx={{ fontWeight: 'bold', width: '35%', border: 'none', color: 'primary.main' }}
                        variant={'body1'}
                      >
                        {Number(data?.price ?? 0) > 0 ? `${data.price} ${data.currency}` : 'free'}
                      </Typography>
                    </Grid2>
                  )}

                  {data?.category && (
                    <Grid2
                      size={12}
                      sx={{ marginBottom: 2 }}
                    >
                      <Typography sx={{ fontWeight: 'bold', width: '35%', border: 'none' }}>{`Category`}</Typography>
                      <Typography variant={'body1'}>{data.category.name}</Typography>
                    </Grid2>
                  )}
                  {data?.description && (
                    <Grid2 size={12}>
                      <Typography sx={{ fontWeight: 'bold', width: '35%', border: 'none' }}>{`Description`}</Typography>
                      <ExpandableDescription
                        maxChars={60}
                        text={data.description}
                      />
                    </Grid2>
                  )}
                  {data?.user.username && (
                    <Grid2
                      size={12}
                      sx={{ marginBottom: 2 }}
                    >
                      <Typography sx={{ fontWeight: 'bold', width: '35%', border: 'none' }}>{`Saler`}</Typography>
                      <Typography variant={'body1'}>{data.user.username}</Typography>
                    </Grid2>
                  )}

                  <Grid2
                    size={12}
                    sx={{ marginBottom: 2 }}
                  >
                    <Typography sx={{ fontWeight: 'bold', width: '35%', border: 'none' }}>{`Location`}</Typography>
                    <Typography variant={'body1'}>{resolveLocation(data?.location)}</Typography>
                  </Grid2>

                  <Grid2
                    size={12}
                    sx={{ marginBottom: 2 }}
                  >
                    <Typography sx={{ fontWeight: 'bold', width: '35%', border: 'none' }}>{`Contacts`}</Typography>

                    {data?.user?.contact_platforms && Object.keys(data.user.contact_platforms).length > 0 ? (
                      <Box
                        marginTop={1}
                        display='flex'
                        flexDirection='row'
                        flexWrap='wrap'
                        gap={1}
                      >
                        {Object.entries(data.user.contact_platforms).map(([platform, contact], index: number) => {
                          return (
                            <Chip
                              color={'primary'}
                              sx={{ cursor: 'pointer' }}
                              key={`platform-${index}`}
                              icon={
                                <Box
                                  sx={{ padding: '1px' }}
                                  display={'flex'}
                                  alignItems={'center'}
                                  justifyContent={'center'}
                                >
                                  <ResolveIcon platform={platform as PlatformType} />
                                </Box>
                              }
                              label={contact}
                              onClick={() => resolveUrl(platform, contact)}
                              variant='outlined'
                            />
                          );
                        })}
                      </Box>
                    ) : (
                      <Typography variant='body2'>Not specified</Typography>
                    )}
                  </Grid2>
                </Grid2>
              </CardContent>
            )}
          </Card>
        </MyPaper>
      </Box>
    </>
  );
});

export default Item;
