import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import EditMessageService from "./edit-message.service";

export const EditMessageAction = createAsyncThunk(
  "edit/editMessage",
  async (newData: { text: string; messageId: string }, thunkAPI) => {
    try {
      console.log("Message action ran");
      const data = await EditMessageService(newData);
      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;

        return thunkAPI.rejectWithValue(errorMessage);
      }

      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message);
      }

      return thunkAPI.rejectWithValue("An unexpected error occurred");
    }
  },
);
