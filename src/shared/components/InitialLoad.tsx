import { useEffect } from 'react';
import { useAuthCheckQuery } from '../../entities/user/authAPI';
import { useGetCurrencyRateQuery } from '../../entities/currency/currencyAPI';
import { useGetCategoriesQuery } from '../../entities/categories/categoriesAPI';
import { LoadingComponent } from '../../widget/Loading/LoadingComponent';

function InitialLoad() {
  const { error: authError, isFetching: authIsLoading } = useAuthCheckQuery();
  const { error: currencyError, isFetching: currencyIsLoading } = useGetCurrencyRateQuery();
  const { error: categoriesError, isFetching: categoriesIsLoading } = useGetCategoriesQuery();

  useEffect(() => {
    if (authError) {
      console.error('Error loading user', authError);
    }
    if (currencyError) {
      console.error('Error loading currency', currencyError);
      throw currencyError;
    }
    if (categoriesError) {
      console.error('Error loading categories', categoriesError);
      throw categoriesError;
    }
  }, [authError, currencyError, categoriesError]);

  if (authIsLoading || currencyIsLoading || categoriesIsLoading) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 9999,
          background: 'white',
        }}
      >
        <LoadingComponent />
      </div>
    );
  }

  return null;
}

export default InitialLoad;
