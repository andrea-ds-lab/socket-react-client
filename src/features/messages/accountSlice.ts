import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Define the structure of user authentication state
interface User {
  id: number;
  name: string;
  email: string;
}

interface AccountState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Initial state for the account slice
const initialState: AccountState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Async thunk action for logging in
export const login = createAsyncThunk(
  'account/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      return data.user; // Assuming the response contains user data
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk action for logging in
export const fakeLogin = createAsyncThunk(
  'account/fakeLogin',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    const fakeUser: User = { id: 1, name: email, email: email }
    console.log(fakeUser)
    return fakeUser; // Assuming the response contains user data
  }
);

// Account slice
const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    // Reducer for logging out
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    // Reducer for updating user information if needed
    updateUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      .addCase(fakeLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      });
  },
});

// Export the actions (logout and updateUser)
export const { logout, updateUser } = accountSlice.actions;

// Export the reducer to be used in the store
export default accountSlice.reducer;
