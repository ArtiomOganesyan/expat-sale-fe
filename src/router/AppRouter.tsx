import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import PrivateRoute from './routes/PrivateRoute';
import ListingMasonry from '../features/items/ListingMasonry';
import Layout from '../layouts/MainLayout/MainLayout';
import AboutPage from '../pages/AboutPage/AboutPage';
import { LoadingComponent } from '../widget/Loading/LoadingComponent';

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
const SettingsPage = lazy(() => import('../pages/Settings/SettingsPage'));

function AppRouter() {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <Routes>
        <Route element={<Layout />}>
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
            element={<AboutPage />}
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

          <Route
            path='settings'
            element={<SettingsPage />}
          />

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
          {/* redirect to index if no match */}
          <Route
            path='*'
            element={<Navigate to='/' />}
          />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default AppRouter;
