import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { MessageProps, MessagesState } from '../../types';
import { LAST_MESSAGE } from '../../config';

const initialState: MessagesState = {
  messages: [],
  loading: false,
  error: null,
  lastMessagesAdded: null,
  scrollTargetMessage: -1,
  oldestId: -1,
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
  async ({ amount }: { amount: number }, { rejectWithValue, getState }) => {
    // Correctly type the full Redux store state
    const state = getState() as { messages: MessagesState };

    try {
      const response = await fetch(`http://localhost:4000/api/messages?amount=${amount}&id=${state.messages.oldestId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const messages = data.messages;
      // Sort the messages by id from lowest to highest before returning
      return messages.sort((a: MessageProps, b: MessageProps) => a.id - b.id);
    } catch (error: any) {
      console.log("Add history with amount: %d, oldestId: %d", amount, state.messages.oldestId);
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
      const newMessage = action.payload;
      const date = new Date(newMessage.timestamp);
      // Define locally the inserted_at and updated_at values
      newMessage.inserted_at = date.toISOString()
      newMessage.updated_at = date.toISOString()
      newMessage.id = newMessage.timestamp

      state.messages.push(newMessage);
    },
    setTargetMessage: (state, action) => {
      // Update scrollTargetMessage state
      state.scrollTargetMessage = action.payload;
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
        if (messages.length > 0) {
          state.lastMessagesAdded = messages;
          state.messages = messages;
          state.scrollTargetMessage = LAST_MESSAGE;
          state.oldestId = messages[0].id
        }
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

        if (newMessages.length > 0) {
          // Prepend new messages to the existing ones and re-sort by id
          const allMessages = [...newMessages, ...state.messages];
          state.messages = allMessages.sort((a, b) => a.id - b.id);
          // Store the batch of messages fetched
          state.lastMessagesAdded = newMessages;
          // Set the scroll to the last message available before loading the history
          state.scrollTargetMessage = state.oldestId
          // Update the oldest message id
          state.oldestId = newMessages[0].id;
        } else {
          state.lastMessagesAdded = []
        }
      })
      .addCase(addHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export the action creators
export const { addMessage, setTargetMessage } = messagesSlice.actions;

export default messagesSlice.reducer;
