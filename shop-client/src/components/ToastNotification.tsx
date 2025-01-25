// components/ToastNotification.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../context/store';
import { clearToast } from '../context/ToastSlice';
import { Snackbar, Alert } from '@mui/material';

const ToastNotification = () => {
    const dispatch = useDispatch();
    const { severity, message, visible } = useSelector((state: RootState) => state.toast);

    useEffect(() => {
        if (visible) {
            setTimeout(() => {
                dispatch(clearToast());
            }, 4000);
        }
    }, [visible, dispatch]);

    return (
        <Snackbar open={visible} autoHideDuration={3000}>
            <Alert severity={severity} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default ToastNotification;
