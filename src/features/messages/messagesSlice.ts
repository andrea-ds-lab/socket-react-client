import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Define the message type (same as before)
interface Message {
  id: number,
  body: string;
  timestamp: number;
  user: string;
  boosted: boolean;
  channel: string,
  inserted_at: string,
  updated_at: string,
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
  async (startFrom: string | null, { rejectWithValue }) => {
    const startFromDate = startFrom || '2024-01-01T00:00:00Z';  // 2024 January 1st
    try {
      const response = await fetch(`http://localhost:4000/api/messages?start_from=${encodeURIComponent(startFromDate)}`);
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
