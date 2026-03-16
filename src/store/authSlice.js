import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null, // Should hold { name: 'Raj', role: 'ADMIN' }
        isAuthenticated: false,
    },
    reducers: {
        setLogin: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        setLogout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
        },
    },
});

export const { setLogin, setLogout } = authSlice.actions;
export default authSlice.reducer;