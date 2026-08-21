"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/dispatch";
import {
  addMessage,
  deleteMessageFromStateByOther,
} from "@/features/messages/messages.slice";
import { Message } from "@/features/messages/messages.type";
import socket from "@/lib/socket";
import { CurrentUser } from "@/features/users/user.type";

type UseChatSocketProps = {
  currentUser: CurrentUser | null;
  targetUser: string | null;
  roomId: string | null;
};

const useChatSocket = ({
  currentUser,
  targetUser,
  roomId,
}: UseChatSocketProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!currentUser) return;

    socket.connect();

    socket.on("connect", () => {
      console.log("Connected:", socket.id);

      socket.emit("onConnection", currentUser);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.disconnect();
    };
  }, [currentUser]);

  useEffect(() => {
    if (!roomId) return;

    socket.emit("joinRoom", roomId);

    console.log("Joined room:", roomId);

    return () => {
      socket.emit("leaveRoom", roomId);

      console.log("Left room:", roomId);
    };
  }, [roomId]);

  useEffect(() => {
    if (!roomId) return;
    const handleDeleteMessageFromOtherState = (data : {roomId : string , id:string}) => {
      dispatch(deleteMessageFromStateByOther(data));
    };

    socket.on("deleteMessageInOthers", handleDeleteMessageFromOtherState);
    console.log('2');
    console.log("Delete event listened");

    return () => {
      socket.off("deleteMessageInOthers", handleDeleteMessageFromOtherState);
    };
  }, [dispatch, roomId]);

  useEffect(() => {
    if (!roomId) return;
    const handleNewMessage = (message: Message) => {
      console.log("New message:", message);
      dispatch(addMessage(message));
    };
    socket.on("newMessage", handleNewMessage);
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [roomId, dispatch]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    if (!roomId || !currentUser || !targetUser) return;

    socket.emit("sendMessage", {
      roomId,
      text: text.trim(),
      senderId: currentUser.uid,
      receiverId: targetUser,
    });
  };

  const deleteMessage = (msg: Message) => {
    if (!msg) return;
    if (!msg.id) return;
    socket.emit("deleteMessage", {
      roomId: msg.roomId,
      id: msg.id,
    });
    console.log("Delete Event Emitted");
  };

  const sendTyping = () => {
    if (!roomId || !currentUser) return;

    console.log("sendTyping() is running");

    socket.emit("typing", {
      roomId,
      userid: currentUser.uid,
    });
  };

  return {
    sendMessage,
    sendTyping,
    deleteMessage,
  };
};

export default useChatSocket;
