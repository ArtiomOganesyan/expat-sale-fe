import React, { useEffect } from 'react';
import styles from './AuthForm.module.css';
import { useLoginMutation } from '../../../entities/user/authAPI';
import { useNavigate } from 'react-router';
import FormInput from '../../../shared/components/FormInput/FormInput';
import FormError from '../../../shared/components/FormError/FormError';
import { Button } from '@mui/material';
import { useSnackbar } from '../../../shared/hooks/useSnackbar';

function LoginForm() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const { showSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const [login, meta] = useLoginMutation();

  useEffect(() => {
    if (meta.isError) {
      const err = (meta?.error as any)?.data?.error || 'Invalid username or password';
      setError(err);

      showSnackbar({
        title: 'Login failed',
        subtitle: err,
        severity: 'error',
      });

      setTimeout(() => {
        setError('');
      }, 3000);
    }
  }, [meta]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const res = await login({ username, password });

    if (res?.data?.id) {
      showSnackbar({
        title: 'Welcome back!',
        subtitle: 'You have successfully logged in',
        severity: 'success',
      });
      navigate('/');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>Login to your account</div>
      <div className={styles.subtitle}>It’s great to see you again!</div>
      <form
        onSubmit={handleSubmit}
        className={styles.form}
      >
        <FormInput
          label={'Username'}
          type={'text'}
          id={'username'}
          name={'username'}
          placeholder={"What's your username?"}
          onChange={e => setUsername(e.target.value)}
        />
        <FormInput
          label={'Password'}
          type={'password'}
          id={'password'}
          name={'password'}
          placeholder={'What was your password?'}
          onChange={e => setPassword(e.target.value)}
        />
        <FormError error={error} />
        <Button
          type='submit'
          disabled={!password || !username}
        >
          {meta.isLoading ? 'Loading...' : 'Login'}
        </Button>
      </form>
    </div>
  );
}

export default LoginForm;
