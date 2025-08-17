import UserData from '../../features/user_data/UserData';
import style from './ProfilePage.module.css';

function ProfilePage() {
  return (
    <div className={style.container}>
      <UserData />
    </div>
  );
}

export default ProfilePage;
