import React, { useEffect } from 'react';
import styles from './AuthForm.module.css';
import { useNavigate } from 'react-router';
import { useRegisterMutation } from '../../../entities/user/authAPI';
import FormInput from '../../../shared/components/FormInput/FormInput';
import { Button } from '@mui/material';
import FormError from '../../../shared/components/FormError/FormError';
import { useSnackbar } from '../../../shared/hooks/useSnackbar';

function RegisterForm() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const { showSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const [register, meta] = useRegisterMutation();

  useEffect(() => {
    // <div
    //       style={{
    //         opacity: password !== confirmPassword || meta.isError ? 1 : 0,
    //         lineHeight: password !== confirmPassword || meta.isError ? 1 : 0,
    //         fontSize: 12,
    //         color: "red",
    //         transition: "opacity 0.3s, line-height 0.3s",
    //       }}
    //     >
    //       {(meta?.error as any)?.data?.error ||
    //         (meta.isError && "An error occurred.") ||
    //         "Passwords do not match"}
    //     </div>

    if (password !== confirmPassword || meta.isError) {
      setError((meta?.error as any)?.data?.error || (meta.isError && 'An error occurred.') || 'Passwords do not match');

      setTimeout(() => {
        setError('');
      }, 3000);
    }
  }, [password, confirmPassword, meta]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const res = await register({ username, password });

    if (res?.data?.id) {
      showSnackbar({
        title: 'Account created',
        subtitle: 'You can now log in with your credentials',
        severity: 'success',
      });
      navigate('/');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>Create an account</div>
      <div className={styles.subtitle}>Let’s create your account!</div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <FormInput
          label='Username'
          placeholder='Create a unique username'
          id='username'
          type='text'
          name='username'
          onChange={e => setUsername(e.target.value)}
        />
        <FormInput
          label='Password'
          placeholder='Pick a strong password'
          type='password'
          id='password'
          name='password'
          onChange={e => setPassword(e.target.value)}
        />
        <FormInput
          label='Confirm Password'
          placeholder='Confirm your password'
          type='password'
          id='confirmPassword'
          name='confirmPassword'
          onChange={e => setConfirmPassword(e.target.value)}
        />

        <FormError error={error} />

        <Button
          type='submit'
          disabled={!password || !username || password !== confirmPassword}
        >
          {meta.isLoading ? 'Loading...' : 'Register'}
        </Button>
      </form>
    </div>
  );
}

export default RegisterForm;
