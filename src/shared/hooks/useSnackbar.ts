import { useContext } from 'react';
import { SnackbarContext } from '../context/SnackbarProvider/SnackbarProvider';

export const useSnackbar = () => useContext(SnackbarContext);
