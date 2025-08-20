import { selectUser } from '../../entities/user/userSlice';
import { useAppSelector } from '../../hooks/hooks';
import { Navigate, Outlet } from 'react-router';

function PrivateRoute() {
  const user = useAppSelector(selectUser);

  if (!user?.id) {
    return (
      <Navigate
        to='/auth/login'
        replace
      />
    );
  }

  return <Outlet />;
}

export default PrivateRoute;
