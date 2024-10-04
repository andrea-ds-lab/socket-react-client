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

    // Access the 'messages' state
    console.log("Stato aggiornato");
    console.log(state.messages, state.messages.error, state.messages.loading, state.messages.oldestId, state.messages.scrollTargetMessage);

    try {
      const response = await fetch(`http://localhost:4000/api/messages?amount=${amount}&id=${state.messages.oldestId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const messages = data.messages;
      console.log(messages)

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
      // Add the new message to the end of the messages array
      state.messages.push(action.payload);
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
        console.log("Stato aggiornato")
        console.log(state.messages, state.error, state.loading, state.oldestId, state.scrollTargetMessage)
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

        console.log("Pre-aggiornamento (addHistory)")
        console.log(state.messages, state.error, state.loading, state.oldestId, state.scrollTargetMessage)

        if (newMessages.length > 0) {
          // Prepend new messages to the existing ones and re-sort by id
          const allMessages = [...newMessages, ...state.messages];
          state.lastMessagesAdded = newMessages;
          state.messages = allMessages.sort((a, b) => a.id - b.id);
          state.scrollTargetMessage = state.oldestId
          state.oldestId = newMessages[0].id;
        } else {
          state.lastMessagesAdded = []
        }

        console.log("Stato aggiornato (addHistory)")
        console.log(state.messages, state.error, state.loading, state.oldestId, state.scrollTargetMessage)


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
