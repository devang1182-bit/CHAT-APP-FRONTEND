/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { DeleteMessageAction } from "@/features/messages/delete-message/delete-message.action";
import {
  clearMessageText,
  deleteMessageFromState,
  setMessageText,
} from "@/features/messages/messages.slice";
import { Message } from "@/features/messages/messages.type";
import useChatSocket from "@/hooks/chat.events";
import { useAppDispatch } from "@/hooks/dispatch";
import { useAppSelector } from "@/hooks/selector";
import { Box, Button, Divider, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import styles from "../../style.module.css";
import SendIcon from "@mui/icons-material/Send";
import socket from "@/lib/socket";

const MessageList = ({
  roomId,
  targetUser,
}: {
  roomId: string | null;
  targetUser: string | null;
}) => {
  let typingTimeout: string | number | NodeJS.Timeout | undefined;
  const dispatch = useAppDispatch();
  const [typing, setTyping] = useState<boolean>(false);

  const { currentUser, selectedChatUser } = useAppSelector(
    (state) => state.users,
  );
  const { messages, messageText } = useAppSelector((state) => state.messages);

  const [menuControl, setMenuControl] = useState({
    visible: false,
    x: 0,
    y: 0,
  });

  const { sendMessage, sendTyping, deleteMessage } = useChatSocket({
    currentUser,
    targetUser,
    roomId,
  });

  const handleContextMenu = (e: {
    preventDefault: () => void;
    clientX: number;
    clientY: number;
  }) => {
    e.preventDefault();
    setMenuControl({
      visible: true,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleDelete = (msg: Message) => {
    dispatch(DeleteMessageAction(msg.id));
    dispatch(deleteMessageFromState(msg.id));
    deleteMessage(msg);
  };

  const handleSendMessage = () => {
    if (!messageText?.trim()) return;
    if (!selectedChatUser) return;
    sendMessage(messageText);
    dispatch(clearMessageText());
  };

  const handleMessageChange = (value: string) => {
    dispatch(setMessageText(value));
    if (value.trim()) {
      sendTyping();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    const closeMenu = () =>
      setMenuControl((prev) => ({ ...prev, visible: false }));
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  useEffect(() => {
    if (!roomId) return;
    const handleTyping = (data: { roomId: string; userid: string }) => {
      if (!typing) {
        setTyping(true);
      }
      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => {
        setTyping(false);
      }, 1000);
      console.log("someone is typing", data);
    };

    socket.on("typing", handleTyping);
  }, [roomId]);

  return (
    <>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ p: 2 }}>
          <h3 style={{ color: "black" }}>
            {" "}
            {selectedChatUser ? selectedChatUser.displayName : "Select a user"}
          </h3>
        </Box>
        <Divider />

        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 2,
            backgroundColor: "#f5f5f5",
          }}
        >
          {!selectedChatUser ? (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography color="primary">
                Select a user to start chatting
              </Typography>
            </Box>
          ) : messages.length === 0 ? (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography color="text.secondary">No messages yet</Typography>
            </Box>
          ) : (
            messages.map((msg: Message) => {
              const isCurrentUser = msg.senderId === currentUser?.uid;
              return (
                <Box
                  key={msg.id}
                  className={`${styles.messageRow} ${isCurrentUser ? styles.currentUser : styles.other}`}
                >
                  <Typography
                    sx={{ m: 0.5 }}
                    color="primary"
                    onContextMenu={handleContextMenu}
                    className={`${styles.messageBubble} ${isCurrentUser ? styles.sent : styles.received}`}
                  >
                    {msg.message}
                    <span className={styles.msgTime}>
                      {new Date(Number(msg.createdAt)).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </Typography>

                  {menuControl.visible && (
                    <ul
                      style={{
                        position: "absolute",
                        top: `${menuControl.y}px`,
                        left: `${menuControl.x}px`,
                        zIndex: 1000,
                        display:"flex",
                        flexDirection:"column",
                        rowGap:"8px"
                      }}
                    >
                      <li>
                        <button
                          className={styles.myButton}
                          onClick={() => handleDelete(msg)}
                        >
                          Delete Msg
                        </button>
                      </li>
                      <li>
                        <button
                          className={styles.myButton}
                        >
                          Edit
                        </button>
                      </li>
                    </ul>
                  )}
                </Box>
              );
            })
          )}

          {typing ? (
            <div className={styles.typingBubble}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          ) : (
            <></>
          )}
        </Box>

        {selectedChatUser && (
          <Box
            sx={{
              p: 2,
              borderTop: "1px solid #ddd",
              display: "flex",
              gap: 1,
            }}
          >
            <TextField
              fullWidth
              size="small"
              value={messageText}
              placeholder="Type a message..."
              onChange={(event) => handleMessageChange(event.target.value)}
              onKeyDown={handleKeyDown}
            />

            <Button
              variant="contained"
              onClick={handleSendMessage}
              disabled={!messageText?.trim()}
              endIcon={<SendIcon />}
            >
              Send
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
};

export default MessageList;
