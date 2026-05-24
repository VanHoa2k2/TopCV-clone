"use client";

import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Input } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import { AiOutlineSend } from "react-icons/ai";

interface IChatUser {
  userId: number;
  name: string;
  email: string;
  lastMessageAt: string;
}

interface IMessage {
  id: number;
  senderId: number;
  receiverId: number | null;
  content: string;
  createdAt: string;
}

const AdminChatPage = () => {
  const [users, setUsers] = useState<IChatUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const selectedUserIdRef = useRef<number | null>(null);
  const backendUrl = process.env.NEXT_PUBLIC_URL_BACKEND;

  selectedUserIdRef.current = selectedUserId;

  // Connect socket (only once)
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token || socketRef.current) return;

    const socket = io(`${backendUrl}/chat`, {
      auth: { token },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("[AdminChat] Socket connected:", socket.id);
      setSocketConnected(true);
      socket.emit("joinAdminRoom");
      console.log("[AdminChat] Emitted joinAdminRoom");
    });

    socket.on("disconnect", () => {
      console.log("[AdminChat] Socket disconnected");
      setSocketConnected(false);
    });

    socket.on("newMessage", (msg: IMessage & { senderName?: string }) => {
      console.log("[AdminChat] Received newMessage:", msg);

      const currentSelectedId = selectedUserIdRef.current;
      console.log("[AdminChat] currentSelectedId:", currentSelectedId);

      const isFromSelectedUser = msg.senderId === currentSelectedId;
      const isReplyToSelectedUser = msg.receiverId === currentSelectedId;

      // Only append if this message belongs to the current conversation
      if (isFromSelectedUser || isReplyToSelectedUser) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [
            ...prev,
            {
              id: msg.id,
              position: isFromSelectedUser ? "left" : "right",
              type: "text",
              text: msg.content,
              date: new Date(msg.createdAt),
              senderName: msg.senderName,
            },
          ];
        });
      } else {
        console.log(
          "[AdminChat] Message ignored - not for current conversation",
        );
      }

      // Refresh user list to update lastMessageAt
      fetchUsers();
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [backendUrl]);

  // Fetch users with messages
  const fetchUsers = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.warn("[AdminChat] No access_token found");
      return;
    }

    try {
      const res = await fetch(`${backendUrl}/api/v1/chat/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log("[AdminChat] /chat/users response:", data);
      if (data?.data) {
        setUsers(data.data);
      } else {
        console.warn("[AdminChat] /chat/users returned no data");
      }
    } catch (err) {
      console.error("[AdminChat] Failed to fetch chat users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backendUrl]);

  // Load history when selecting a user
  useEffect(() => {
    if (!selectedUserId) {
      setMessages([]);
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) return;

    fetch(`${backendUrl}/api/v1/chat/history/${selectedUserId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const history = (data?.data || []).map((msg: IMessage) => ({
          id: msg.id,
          position: msg.senderId === selectedUserId ? "left" : "right",
          type: "text",
          text: msg.content,
          date: new Date(msg.createdAt),
        }));
        setMessages(history);
      })
      .catch((err) => console.error("Failed to load history:", err));
  }, [selectedUserId, backendUrl]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim() || !socketRef.current || !selectedUserId) return;

    const tempContent = inputText;
    setInputText("");

    socketRef.current.emit("sendMessage", {
      content: tempContent,
      receiverId: selectedUserId,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)] bg-white rounded-lg shadow">
      {/* User list sidebar */}
      <div className="w-64 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="font-semibold text-gray-700">Người dùng chat</h2>
          <span
            className={`inline-block mt-1 w-2 h-2 rounded-full ${
              socketConnected ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-xs text-gray-500 ml-1">
            {socketConnected ? "Online" : "Offline"}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {users.length === 0 ? (
            <div className="p-4 text-gray-400 text-sm text-center">
              Chưa có người dùng nào
            </div>
          ) : (
            users.map((u) => (
              <button
                key={u.userId}
                onClick={() => setSelectedUserId(u.userId)}
                className={`w-full text-left p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  selectedUserId === u.userId
                    ? "bg-blue-50 border-l-4 border-l-blue-500"
                    : ""
                }`}
              >
                <div className="font-medium text-sm text-gray-800 truncate">
                  {u.name}
                </div>
                <div className="text-xs text-gray-500 truncate">{u.email}</div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {selectedUserId ? (
          <>
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <span className="font-semibold text-gray-700">
                Chat với{" "}
                {users.find((u) => u.userId === selectedUserId)?.name ||
                  `User #${selectedUserId}`}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.position === "right" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                      msg.position === "right"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                    <div
                      className={`text-[10px] mt-1 ${
                        msg.position === "right"
                          ? "text-blue-100"
                          : "text-gray-400"
                      }`}
                    >
                      {msg.date.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-gray-200 bg-white flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Nhập tin nhắn trả lời..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                onClick={handleSend}
                disabled={!socketConnected}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <AiOutlineSend size={20} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Chọn một người dùng để xem và trả lời tin nhắn
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChatPage;
