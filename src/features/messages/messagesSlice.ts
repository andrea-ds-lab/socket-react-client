import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Define the message type (same as before)
interface Message {
  body: string;
  timestamp: number;
  user: string;
  boosted: boolean;
}

// Initial state
interface MessagesState {
  messages: Message[];
  loading: boolean;
  error: string | null;
}

const initialState: MessagesState = {
  messages: [],
  loading: false,
  error: null,
};

// Async thunk action for fetching messages
export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:4000/api/messages');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data.messages; // Assuming `data.messages` is the array of messages
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Messages slice
const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default messagesSlice.reducer;
