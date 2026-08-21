"use client";

import { clearMessages, clearMessageText } from "@/features/messages/messages.slice";
import { setSelectedChatUser } from "@/features/users/user.slice";
import { User } from "@/features/users/user.type";
import { useAppDispatch } from "@/hooks/dispatch";
import { useAppSelector } from "@/hooks/selector";
import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Paper,
} from "@mui/material";

const UsersList = () => {
  const dispatch = useAppDispatch();

  const { users, currentUser , selectedChatUser } = useAppSelector((state) => state.users);

  const handleSelectedUser = (user: User) => {
    dispatch(setSelectedChatUser(user));
  };

  const handleSelectUser = (user: User) => {
    dispatch(clearMessages());
    handleSelectedUser(user);
    clearMessageText();
  };

  return (
    <>
      <Paper
        square
        sx={{
          width: 280,
          borderRight: "1px solid #ddd",
          overflowY: "auto",
        }}
      >
        <Box sx={{ p: 2 }}>
          <h3>Users</h3>
        </Box>

        <Divider />

        <List>
          {users
            .filter((user) => user.id !== currentUser?.uid)
            .map((user) => (
              <ListItemButton
                key={user.id}
                selected={selectedChatUser?.id === user.id}
                onClick={() => handleSelectUser(user)}
              >
                <ListItemText primary={user.displayName} />
              </ListItemButton>
            ))}
        </List>
      </Paper>
    </>
  );
};

export default UsersList;
