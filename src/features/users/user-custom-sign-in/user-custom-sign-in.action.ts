import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import CustomSignInService from "./user-custom-sign-in.service";

export const CustomSignInAction = createAsyncThunk(
  "user/customSignIn",
  async (
    userData: {
      email: string;
      password: string;
    },
    thunkAPI,
  ) => {
    try {
      const data = await CustomSignInService(userData);
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
