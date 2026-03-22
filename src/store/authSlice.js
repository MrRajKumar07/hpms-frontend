import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../api/authApi';

// Async Thunk for Login
export const loginThunk = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
    try {
        const response = await authApi.login(credentials);
        // Matches your ApiResponse<AuthResponse> structure from the Spring Boot controller
        return response.data.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || { message: "Network Error" });
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        // Safe parsing to prevent crashes if localStorage is empty
        user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
        accessToken: localStorage.getItem('accessToken') || null,
        loading: false,
        error: null,
    },
    reducers: {
        setTokens: (state, action) => {
            state.accessToken = action.payload.accessToken;
            localStorage.setItem('accessToken', action.payload.accessToken);
            localStorage.setItem('refreshToken', action.payload.refreshToken);
        },
        // CHANGED: Renamed from 'logout' to 'setLogout' to match your Sidebar.jsx imports
        setLogout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.loading = false;
            state.error = null;
            localStorage.clear();
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.accessToken = action.payload.accessToken;

                // Persistence
                localStorage.setItem('user', JSON.stringify(action.payload));
                localStorage.setItem('accessToken', action.payload.accessToken);
                localStorage.setItem('refreshToken', action.payload.refreshToken);
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.loading = false;
                // Grabs the message from your backend ApiResponse DTO
                state.error = action.payload?.message || "Login Failed";
            });
    }
});

// Exporting 'setLogout' specifically so Vite stops throwing the error
export const { setLogout, setTokens } = authSlice.actions;
export default authSlice.reducer;