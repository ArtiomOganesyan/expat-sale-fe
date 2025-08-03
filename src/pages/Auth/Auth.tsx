import { Outlet } from 'react-router';

import styles from './Auth.module.css';

function Auth() {
  return (
    <div className={styles.container}>
      <Outlet />
    </div>
  );
}

export default Auth;
