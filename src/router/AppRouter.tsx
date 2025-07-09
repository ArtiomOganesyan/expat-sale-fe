import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router';
import PrivateRoute from './routes/PrivateRoute';
import ListingMasonry from '../features/items/ListingMasonry';

const ListingMenu = lazy(() => import('../pages/ListingMenu/ListingMenu'));
const Listing = lazy(() => import('../pages/Listing/Listing'));
const Item = lazy(() => import('../pages/Item/Item'));
const NewItem = lazy(() => import('../pages/NewItem/NewItem'));
const LoginForm = lazy(() => import('../features/auth/ui/LoginForm'));
const RegisterForm = lazy(() => import('../features/auth/ui/RegisterForm'));
const Auth = lazy(() => import('../pages/Auth/Auth'));
const ProfilePage = lazy(() => import('../pages/Profile/ProfilePage'));
const UserItemsList = lazy(() => import('../pages/UserItemsList/UserItemsList'));
const UserItemEdit = lazy(() => import('../pages/UserItemEdit/UserItemEdit'));

function AppRouter() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route element={<Listing />}>
          <Route
            index
            element={<ListingMenu />}
          />
          <Route
            path='listing'
            element={<ListingMasonry />}
          />
        </Route>

        <Route
          path='listing/:id'
          element={<Item />}
        />
        <Route
          path='about'
          element={<div>ABOUT</div>}
        />

        <Route
          path='auth'
          element={<Auth />}
        >
          <Route
            path='login'
            element={<LoginForm />}
          />
          <Route
            path='register'
            element={<RegisterForm />}
          />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route
            path='profile'
            element={<ProfilePage />}
          />
          <Route
            path='item/new'
            element={<NewItem />}
          />
          <Route
            path='profile/userItemsList'
            element={<UserItemsList />}
          />
          <Route
            path='profile/userItemsList/:id'
            element={<UserItemEdit />}
          />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default AppRouter;
