import {
  Button,
  Card,
  CardContent,
  Typography,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Slide,
  List,
  ListItemButton,
  ListItemText,
  DialogContent,
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import BasicSpeedDial, { type SpeedDialActionItem } from '../../shared/components/SpeedDial/SpeedDial';
import i18n from '../../i18n';
import { LOCAL_STORAGE_KEY_LANGUAGE } from '../../utils/constants/Item';
import type { TransitionProps } from '@mui/material/transitions';
import { LoadingComponent } from '../../widget/Loading/LoadingComponent';
import styles from './ListingMenu.module.css';
import { useGetLatestProductsQuery, useGetLatestServicesQuery } from '../../entities/items/itemsAPI';
import { useNavigate } from 'react-router';
import ImageWithSkeleton from '../../shared/components/ImageWithSkeleton/ImageWithSkeleton';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { useGetParentCategoriesQuery } from '../../entities/categories/categoriesAPI';
import CloseIcon from '@mui/icons-material/Close';
import { useState, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { toSnakeCase } from '../../utils/toSnakeCase';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
] as const;

async function changeLang(code: string) {
  await i18n.changeLanguage(code);
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_LANGUAGE, code);
  } catch {
    /* noop to satisfy eslint no-empty */
  }
  if (typeof document !== 'undefined') document.dir = i18n.dir(code);
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return (
    <Slide
      direction='up'
      ref={ref}
      {...props}
    />
  );
});

function ListingMenu() {
  const { data: categories, isLoading: isLoadingCategories } = useGetParentCategoriesQuery();

  const navigate = useNavigate();
  const { t } = useTranslation('listing');

  const { data: latestServices, isLoading: isLoadingServices } = useGetLatestServicesQuery();
  const { data: latestProducts, isLoading: isLoadingProducts } = useGetLatestProductsQuery();

  // State hooks must come before any conditional early returns to preserve hook order
  const [openCatDialog, setOpenCatDialog] = useState(false);

  const secondaryCategories = (categories || []).slice(1);

  const languageActions: SpeedDialActionItem[] = LANGUAGES.map(l => ({
    name: l.label,
    onClick: () => changeLang(l.code),
    icon: <span style={{ fontWeight: 700, fontSize: 12 }}>{l.code.toUpperCase()}</span>,
    fab: {
      size: 'small',
      sx: {
        width: 40,
        height: 40,
        minHeight: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: 0.5,
      },
    },
  }));

  if (isLoadingServices || isLoadingProducts || isLoadingCategories) return <LoadingComponent />;

  const handleOpenCategories = () => setOpenCatDialog(true);
  const handleCloseCategories = () => setOpenCatDialog(false);

  const handleSelectCategory = (id: string) => {
    handleCloseCategories();
    navigate(`/listing?categoryId=${id}`);
  };

  return (
    <div className={styles.container}>
      <div>
        <Typography variant='h2'>{t('explore')}</Typography>
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        <Button
          variant='outlined'
          sx={{ display: 'flex', gap: 2, alignItems: 'center' }}
          onClick={() => navigate(`/listing?categoryId=${categories?.[0]?.id}`)}
        >
          <SupportAgentIcon />
          <Typography
            variant='h6'
            color='primary.main'
          >
            {t('services')}
          </Typography>
        </Button>
        <Button
          variant='outlined'
          sx={{ display: 'flex', gap: 2, alignItems: 'center' }}
          onClick={handleOpenCategories}
          disabled={secondaryCategories.length === 0}
        >
          <StorefrontIcon />
          <Typography
            variant='h6'
            color='primary.main'
          >
            {t('market')}
          </Typography>
        </Button>
      </div>
      <Dialog
        fullScreen
        open={openCatDialog}
        onClose={handleCloseCategories}
        TransitionComponent={Transition}
      >
        <AppBar
          sx={{ position: 'relative' }}
          color='default'
          elevation={0}
        >
          <Toolbar>
            <Typography
              sx={{ ml: 2, flex: 1 }}
              variant='h6'
              component='div'
            >
              {t('market.categories')}
            </Typography>
            <IconButton
              edge='end'
              color='inherit'
              onClick={handleCloseCategories}
              aria-label='close'
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent dividers>
          {secondaryCategories.length === 0 ? (
            <Typography
              variant='body2'
              color='text.secondary'
            >
              {t('no_more_items')}
            </Typography>
          ) : (
            <List>
              {secondaryCategories.map(cat => (
                <ListItemButton
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat.id)}
                >
                  <ListItemText primary={t(`market.categories.${toSnakeCase(cat.name)}`)} />
                </ListItemButton>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>
      {latestServices && latestServices.length ? (
        <>
          <Typography variant='h4'>Latest New Services</Typography>
          <div className={styles['horizontal-row']}>
            {latestServices.map(service => (
              <Card
                key={service.id}
                className={styles['card-item']}
                variant='outlined'
              >
                <CardContent className={styles['card-content']}>
                  {service.images && (
                    <ImageWithSkeleton
                      src={service.images[0]?.public_url}
                      alt={service.title}
                      height={250}
                    />
                  )}
                  <Typography variant='h6'>{service.title}</Typography>
                  <Typography
                    className={styles.price}
                    color='primary'
                  >
                    {service.is_free ? 'Free' : `${service.price} ${service.currency}`}
                  </Typography>
                  <Typography
                    variant='body2'
                    className={styles['clamp-3']}
                  >
                    {service.description}
                  </Typography>
                  <div className={styles.actions}>
                    <Button
                      variant='text'
                      onClick={() => navigate(`/listing/${service.id}`)}
                    >
                      <Typography
                        color='primary'
                        marginLeft={'auto'}
                      >
                        View
                      </Typography>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : null}
      {latestProducts && latestProducts.length ? (
        <>
          <Typography variant='h4'>Latest New Products</Typography>
          <div className={styles['horizontal-row']}>
            {latestProducts.map(product => (
              <Card
                key={product.id}
                className={styles['card-item']}
                variant='outlined'
              >
                <CardContent className={styles['card-content']}>
                  {product.images && product.images.length > 0 && (
                    <ImageWithSkeleton
                      src={product.images[0].public_url}
                      alt={product.title}
                      height={250}
                    />
                  )}
                  <Typography variant='h6'>{product.title}</Typography>
                  <Typography
                    className={styles.price}
                    color='primary'
                  >
                    {product.is_free ? 'Free' : `${product.price} ${product.currency}`}
                  </Typography>
                  <Typography
                    variant='body2'
                    className={styles['clamp-4']}
                  >
                    {product.description}
                  </Typography>
                  <div className={styles.actions}>
                    <Button
                      variant='text'
                      onClick={() => navigate(`/listing/${product.id}`)}
                    >
                      <Typography
                        color='primary'
                        marginLeft={'auto'}
                      >
                        View
                      </Typography>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : null}
      <BasicSpeedDial
        actions={languageActions}
        Icon={LanguageIcon}
        ariaLabel='language-switcher'
        bottom={100}
        right={26}
      />
    </div>
  );
}

export default ListingMenu;
