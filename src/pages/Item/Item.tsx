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
  Grid2,
  IconButton,
  List,
  ListItem,
  ListItemText,
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

  console.log(data);

  const matches = useMediaQuery('(max-width: 480px)');

  const handleBack = () => navigate(-1);
  return (
    <>
      <Box
        display={'flex'}
        flexDirection={'column'}
        justifyContent={'center'}
        alignItems={'center'}
        sx={{
          marginTop: '40px',
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
                      >{`${data.price} ${data.currency}`}</Typography>
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
                    <Typography variant={'body1'}>
                      {data?.location
                        ? `${data.location.country}, ${data.location.region}, ${data.location.city}`
                        : 'Not specified'}
                    </Typography>
                  </Grid2>

                  <Grid2
                    size={12}
                    sx={{ marginBottom: 2 }}
                  >
                    <Typography sx={{ fontWeight: 'bold', width: '35%', border: 'none' }}>{`Contacts`}</Typography>

                    {data?.user?.contact_platforms && data.user.contact_platforms.length > 0 ? (
                      <List dense={true}>
                        {data.user.contact_platforms.map((platform: string, index: number) => (
                          <ListItem key={`platform-${index}`}>
                            <ListItemText primary={platform} />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography variant='body2'>Не указано</Typography>
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
