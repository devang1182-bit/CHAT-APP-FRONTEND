import { createSlice } from "@reduxjs/toolkit";
import { MessageState } from "./messages.type";
import { GetMessagesAction } from "./get-message/get-message.action";

const initialState: MessageState = {
  messages: [],
  messageText: "",
  loading: false,
  error: null,
};

const messageSlice = createSlice({
  name: "message",

  initialState,

  reducers: {
    clearMessages: (state) => {
      state.messages = [];
    },

    clearMessageText: (state) => {
      state.messageText = "";
    },

    addMessage: (state, action) => {
      state.messages = [...state.messages, action.payload];
    },

    setMessageText: (state, action) => {
      state.messageText = action.payload;
    },

    deleteMessageFromState: (state, action) => {
      state.messages = state.messages.filter(
        (msg) => msg.id !== action.payload,
      );
    },

    deleteMessageFromStateByOther: (state, action) => {
      state.messages = state.messages.filter(
        (msg) => msg.id !== action.payload.id,
      );
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(GetMessagesAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(GetMessagesAction.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
        console.log(action.payload);
      })

      .addCase(GetMessagesAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearMessages,
  clearMessageText,
  setMessageText,
  addMessage,
  deleteMessageFromState,
  deleteMessageFromStateByOther
} = messageSlice.actions;

export default messageSlice.reducer;
