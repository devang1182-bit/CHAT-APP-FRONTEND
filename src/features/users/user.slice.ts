import { createSlice } from "@reduxjs/toolkit";
import { UserState } from "./user.type";
import { GetUsersAction } from "./get-users/get-users.action";
import { GoogleSignInAction } from "./user-google-sign-in/user-google-sign-in.action";
import { CustomSignInAction } from "./user-custom-sign-in/user-custom-sign-in.action";
import { CustomSignUpAction } from "./user-custom-sign-up/user-custom-sign-up.action";

const initialState: UserState = {
  users: [],
  selectedChatUser: null,
  currentUser: null,
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    logout: (state) => {
      state.currentUser = null;
    },

    setSelectedChatUser : (state , action) => {
      state.selectedChatUser = action.payload
    }
  },
  extraReducers: (builder) => {
    builder

      .addCase(GetUsersAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetUsersAction.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(GetUsersAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(GoogleSignInAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GoogleSignInAction.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload ?? null;
        console.log("Current User : ", state.currentUser);
      })
      .addCase(GoogleSignInAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(CustomSignInAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(CustomSignInAction.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload ?? null;
        console.log("Current User : ", state.currentUser);
      })
      .addCase(CustomSignInAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(CustomSignUpAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(CustomSignUpAction.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload ?? null;
        console.log("Current User : ", state.currentUser);
      })
      .addCase(CustomSignUpAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout , setSelectedChatUser} = usersSlice.actions;
export default usersSlice.reducer;
