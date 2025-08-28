import { Outlet, useNavigate } from 'react-router';
import { selectUser, selectUserLoading } from '../../entities/user/userSlice';
import { useAppSelector } from '../../hooks/hooks';
import { useEffect } from 'react';

function PrivateRoute() {
  const user = useAppSelector(selectUser);
  const userLoading = useAppSelector(selectUserLoading);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userLoading && !user?.id) {
      navigate('/auth/login');
    }
  }, [userLoading, user]);

  return <Outlet />;
}

export default PrivateRoute;
