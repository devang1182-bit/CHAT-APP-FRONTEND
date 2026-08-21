import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import GoogleSignInService from "./user-google-sign-in.service";

export const GoogleSignInAction = createAsyncThunk(
  "user/googleSignIn",
  async (_, thunkAPI) => {
    try {
      const data = await GoogleSignInService();
      console.log("Google Sign In Action : ", data);
      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(errorMessage);
      }

      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message);
      } else {
        console.error("An unexpected error occurred", error);
      }
    }
  },
);
