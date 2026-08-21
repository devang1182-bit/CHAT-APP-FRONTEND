/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";

import { useAppSelector } from "@/hooks/selector";
import { useAppDispatch } from "@/hooks/dispatch";
import { GetUsersAction } from "@/features/users/get-users/get-users.action";
import { logout } from "@/features/users/user.slice";
import { GetMessagesAction } from "@/features/messages/get-message/get-message.action";
import UsersList from "./components/usersList";
import MessageList from "./components/messageList";

const Chat = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const { users, currentUser, selectedChatUser } = useAppSelector(
    (state) => state.users,
  );
  console.log("Users : ", users);
  console.log("Current User : ", currentUser);

  const targetUser = selectedChatUser?.id ?? null;
  const roomId =
    currentUser?.uid && targetUser
      ? [currentUser.uid, targetUser].sort().join("_")
      : null;

  const menuOpen = Boolean(anchorEl);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/auth/sign-in");
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    dispatch(GetUsersAction());
  }, []);

  useEffect(() => {
    if (!roomId) return;
    dispatch(GetMessagesAction(roomId));
  }, [roomId, dispatch]);

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
      }}
    >
      <AppBar position="static">
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6">
            {currentUser?.displayName || "Chat App"}
          </Typography>

          <IconButton color="inherit" onClick={handleMenuOpen}>
            <Typography>⋮</Typography>
          </IconButton>

          <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
            <MenuItem onClick={handleLogout} sx={{ color: "red" }}>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          overflow: "hidden",
        }}
      >
        <UsersList />
        <MessageList roomId={roomId} targetUser={targetUser} />
      </Box>
    </Box>
  );
};

export default Chat;
