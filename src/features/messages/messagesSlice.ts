import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { MessageProps } from '../../types';

// Initial state
interface MessagesState {
  messages: MessageProps[];
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
  async (startFromId: number | null, { rejectWithValue }) => {
    const startFrom = startFromId !== null ? startFromId : 0; // Default to 0 or any other appropriate ID
    try {
      const response = await fetch(`http://localhost:4000/api/messages?id=${startFrom}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const messages = data.messages;

      // Sort the messages by id from lowest to highest before returning
      return messages.sort((a: MessageProps, b: MessageProps) => a.id - b.id);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk action for adding history
export const addHistory = createAsyncThunk(
  'messages/addHistory',
  async ({ amount, oldestId }: { amount: number, oldestId: number }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:4000/api/messages?amount=${amount}&id=${oldestId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const messages = data.messages;

      // Sort the messages by id from lowest to highest before returning
      return messages.sort((a: MessageProps, b: MessageProps) => a.id - b.id);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Messages slice
const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      // Add the new message to the end of the messages array
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        const messages: MessageProps[] = action.payload;
        state.messages = messages.length === 0 ? [] : messages;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addHistory.fulfilled, (state, action) => {
        state.loading = false;
        const newMessages: MessageProps[] = action.payload;

        // Prepend new messages to the existing ones and re-sort by id
        const allMessages = [...newMessages, ...state.messages];
        state.messages = allMessages.sort((a, b) => a.id - b.id);
      })
      .addCase(addHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export the action creator for adding a message
export const { addMessage } = messagesSlice.actions;

export default messagesSlice.reducer;
