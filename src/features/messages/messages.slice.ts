import { createSlice } from "@reduxjs/toolkit";
import { MessageState } from "./messages.type";
import { GetMessagesAction } from "./get-message/get-message.action";
import { EditMessageAction } from "./edit-message/edit-message.action";

const initialState: MessageState = {
  messages: [],
  messageText: "",
  editedMessage: null,
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

    setEditedMessage: (state, action) => {
      state.editedMessage = action.payload;
    },
    clearEditedMessage: (state) => {
      state.editedMessage = null;
    },

    editMessageInOtherState: (state, action) => {
      const messageToBeEditedIndex = state.messages.findIndex(
        (item) => item.id === action.payload.id,
      );
      const toBeUpdated = state.messages[messageToBeEditedIndex];
      state.messages[messageToBeEditedIndex] = {
        ...toBeUpdated,
        message: action.payload.text,
      };
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
      })
      .addCase(EditMessageAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(EditMessageAction.fulfilled, (state, action) => {
        state.loading = false;
        const messageToBeEditedIndex = state.messages.findIndex(
          (item) => item.id === action.payload.messageId,
        );
        if (messageToBeEditedIndex !== -1) {
          state.messages[messageToBeEditedIndex] = {
            ...state.messages[messageToBeEditedIndex],
            message: action.payload.message,
          };
        }
        console.log(action.payload);
      })

      .addCase(EditMessageAction.rejected, (state, action) => {
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
  deleteMessageFromStateByOther,
  setEditedMessage,
  clearEditedMessage,
  editMessageInOtherState,
} = messageSlice.actions;

export default messageSlice.reducer;
