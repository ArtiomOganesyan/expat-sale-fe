import { useContext } from 'react';
import { SnackbarContext } from '../components/SnackbarProvider/SnackbarProvider';

export const useSnackbar = () => useContext(SnackbarContext);
