import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import CustomSignUpService from "./user-custom-sign-up.service";

export const CustomSignUpAction = createAsyncThunk(
  "user/customSignUp",
  async (
    userData: {
      email: string;
      password: string;
      displayName: string;
    },
    thunkAPI,
  ) => {
    try {
      const data = await CustomSignUpService(userData);
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
