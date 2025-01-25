import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ToastState {
    severity: 'success' | 'error' | 'warning' | 'info';
    message: string;
    visible: boolean;
}

const initialState: ToastState = {
    severity: 'success',
    message: '',
    visible: false,
};

const toastSlice = createSlice({
    name: 'toast',
    initialState,
    reducers: {
        setToast: (state, action: PayloadAction<Omit<ToastState, 'visible'>>) => {
            state.severity = action.payload.severity;
            state.message = action.payload.message;
            state.visible = true;
        },
        clearToast: (state) => {
            state.visible = false;
            state.message = '';
        },
    },
});

export const { setToast, clearToast } = toastSlice.actions;
export default toastSlice.reducer;
