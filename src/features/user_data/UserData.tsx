import { type ChangeEvent, useEffect, useRef, useState } from 'react';
import { useLazyLogoutQuery } from '../../entities/user/authAPI';
import { useAppSelector } from '../../hooks/hooks';
import { selectUser } from '../../entities/user/userSlice';
import { useUpdateUserAvatarMutation, useUpdateUserMutation } from '../../entities/user/userAPI';
import { useNavigate } from 'react-router';
import style from './UserData.module.css';
import FormInput from '../../shared/components/FormInput/FormInput';
import ImageContainer from './ui/ImageContainer';
import Actions from './ui/Actions';
import FormError from '../../shared/components/FormError/FormError';
import { Paper, Typography } from '@mui/material';
import { type User } from '../../entities/user/user.type';
import { useSnackbar } from '../../shared/hooks/useSnackbar';
import UserProfileNavigation from './UserProfileNavigation';

function UserData() {
  const [edit, setEdit] = useState(false);
  const [error, setError] = useState('');
  const [updatedUser, setUpdatedUser] = useState<User | null>(null);
  const [logout, logoutMeta] = useLazyLogoutQuery();

  const user = useAppSelector(selectUser);
  const [updateUserMutation, updateMeta] = useUpdateUserMutation();
  const [updateUserAvatarMutation, updateAvatarMeta] = useUpdateUserAvatarMutation();

  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    setUpdatedUser(user);
  }, [user]);

  useEffect(() => {
    if (updateMeta.isError) {
      const err = (updateMeta?.error as any)?.data?.error || 'An error occurred.';
      setError(err);

      showSnackbar({
        title: 'Update failed',
        subtitle: err,
        severity: 'error',
      });

      setTimeout(() => {
        setError('');
      }, 3000);
    }
  }, [updateMeta, showSnackbar]);

  const handleEdit = () => {
    setEdit(bool => {
      if (bool) {
        setUpdatedUser(() => user);
      }
      return !bool;
    });
  };

  const handleEditSave = async () => {
    setEdit(false);

    const data = { ...updatedUser };

    delete data.id;
    delete data.created_at;
    delete data.updated_at;
    delete data.image;
    delete data.role;

    if (user) {
      const res = await updateUserMutation({ id: user?.id, data });
      if (!('error' in res)) {
        showSnackbar({
          title: 'Profile updated',
          subtitle: 'Your information has been saved',
          severity: 'success',
        });
      }
    }
  };

  const handleUpdateUser = (e: ChangeEvent<HTMLInputElement>) => {
    setUpdatedUser(prev => (prev ? { ...prev, [e.target.name]: e.target.value } : prev));
  };

  const handleUpdateUserContacts = (e: ChangeEvent<HTMLInputElement>) => {
    setUpdatedUser(prev =>
      prev ? { ...prev, contact_platforms: { ...prev.contact_platforms, [e.target.name]: e.target.value } } : prev
    );
  };

  const handleLogout = async () => {
    try {
      const res = await logout();
      navigate('/auth/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const updateUserAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });

    try {
      if (user) {
        await updateUserAvatarMutation({
          id: user.id,
          entity: 'user',
          formData,
        });
        showSnackbar({
          title: 'Avatar updated',
          subtitle: 'Your avatar has been successfully updated',
          severity: 'success',
        });
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
    }
  };

  return (
    <Paper
      elevation={10}
      className={style.container}
    >
      <form>
        <div className={style.header}>
          <ImageContainer
            user={user}
            updateUserAvatar={updateUserAvatar}
            fileInputRef={fileInputRef}
            handleFileInputClick={handleFileInputClick}
          />
          <FormInput
            id='username'
            label='Username'
            type='text'
            name='username'
            placeholder='Username'
            value={updatedUser?.username || ''}
            disabled={!edit}
            onChange={handleUpdateUser}
          />
          <Actions
            edit={edit}
            updateMeta={updateMeta}
            handleEdit={handleEdit}
            handleEditSave={handleEditSave}
            handleLogout={handleLogout}
            logoutMeta={logoutMeta}
          />
        </div>
        <div className={style.break_line} />
        <UserProfileNavigation />
        <div className={style.break_line} />
        <Typography variant='h4'>Contact Information</Typography>
        <div className={style.user_data}>
          <FormInput
            id='email'
            type='text'
            label='Email'
            placeholder='Email'
            name='email'
            value={updatedUser?.contact_platforms.email || ''}
            disabled={!edit}
            onChange={handleUpdateUserContacts}
          />
          <FormInput
            id='telegram'
            type='text'
            label='Telegram'
            placeholder='Telegram'
            name='telegram'
            value={updatedUser?.contact_platforms.telegram || ''}
            disabled={!edit}
            onChange={handleUpdateUserContacts}
          />
          <FormInput
            id='zalo'
            type='text'
            label='Zalo'
            placeholder='Zalo'
            name='zalo'
            value={updatedUser?.contact_platforms.zalo || ''}
            disabled={!edit}
            onChange={handleUpdateUserContacts}
          />
          <FormInput
            id='facebook'
            type='text'
            label='Facebook'
            placeholder='Facebook'
            name='facebook'
            value={updatedUser?.contact_platforms.facebook || ''}
            disabled={!edit}
            onChange={handleUpdateUserContacts}
          />
          <FormInput
            id='phone'
            type='text'
            label='Phone'
            placeholder='Phone number'
            name='phone'
            value={updatedUser?.contact_platforms.phone || ''}
            disabled={!edit}
            onChange={handleUpdateUserContacts}
          />
        </div>
        <FormError error={error} />
      </form>
    </Paper>
  );
}

export default UserData;
