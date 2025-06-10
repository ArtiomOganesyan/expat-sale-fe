import { useEffect } from 'react';
import { useAuthCheckQuery } from '../entities/user/authAPI';
import { useGetCurrencyRateQuery } from '../entities/currency/currencyAPI';
import { useGetCategoriesQuery } from '../entities/categories/categoriesAPI';

function InitialLoad() {
  const { error: authError, isLoading: authIsLoading } = useAuthCheckQuery();
  const { error: currencyError, isLoading: currencyIsLoading } = useGetCurrencyRateQuery({});
  const { error: categoriesError, isLoading: categoriesIsLoading } = useGetCategoriesQuery({});

  useEffect(() => {
    if (authError) {
      console.error('Error loading user', authError);
    }
    if (currencyError) {
      console.error('Error loading currency', currencyError);
    }
  }, [authError, currencyError]);

  if (currencyError) {
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
          textAlign: 'center',
        }}
      >
        <h1>Error occur while loading. Please try again later.</h1>
      </div>
    );
  }

  if (authIsLoading || currencyIsLoading) {
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
        Loading....
      </div>
    );
  }

  return null;
}

export default InitialLoad;
