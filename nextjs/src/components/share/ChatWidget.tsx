"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageBox, Input } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import { AiOutlineClose, AiOutlineSend, AiOutlineMessage } from "react-icons/ai";
import { io, Socket } from "socket.io-client";
import { useAppSelector } from "@/redux/hooks";

interface IMessageFromServer {
  id: number;
  senderId: number;
  receiverId: number | null;
  content: string;
  createdAt: string;
}

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  const user = useAppSelector((state: any) => state?.account?.user);
  const userId = user?.id;

  // Load chat history when opening widget
  useEffect(() => {
    if (!isOpen || !userId) return;

    const token = localStorage.getItem("access_token");
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/api/v1/chat/history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const history = (data?.data || []).map((msg: IMessageFromServer) => ({
          id: msg.id,
          position: msg.senderId === userId ? "right" : "left",
          type: "text",
          text: msg.content,
          date: new Date(msg.createdAt),
        }));
        setMessages(history);
      })
      .catch((err) => console.error("Failed to load chat history:", err));
  }, [isOpen, userId]);

  // Connect/disconnect socket when chat opens/closes
  useEffect(() => {
    if (!isOpen) return;

    if (!userId) {
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) return;

    const socket = io(`${process.env.NEXT_PUBLIC_URL_BACKEND}/chat`, {
      auth: { token },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Chat socket connected");
      setSocketConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Chat socket disconnected");
      setSocketConnected(false);
    });

    socket.on("newMessage", (msg: IMessageFromServer) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [
          ...prev,
          {
            id: msg.id,
            position: msg.senderId === userId ? "right" : "left",
            type: "text",
            text: msg.content,
            date: new Date(msg.createdAt),
          },
        ];
      });
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isOpen, userId]);

  // Close widget when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSend = () => {
    if (!inputText.trim() || !socketRef.current) return;

    const tempContent = inputText;
    setInputText("");

    // Optimistic update: show user message immediately
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(), // temporary id
        position: "right",
        type: "text",
        text: tempContent,
        date: new Date(),
      },
    ]);

    socketRef.current.emit("sendMessage", { content: tempContent });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const notLoggedInContent = (
    <div className="flex items-center justify-center h-full text-gray-500">
      Vui lòng đăng nhập để sử dụng chat
    </div>
  );

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen ? (
        <div
          ref={chatRef}
          className="h-[520px] w-[350px] bg-primary rounded-xl shadow-xl flex flex-col transition-all transform duration-300 ease-in-out translate-y-0 opacity-100"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-5 flex justify-between items-center rounded-t-xl">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">Hỗ trợ trực tuyến</span>
              {socketConnected && (
                <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                  Online
                </span>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xl text-white hover:text-gray-200 focus:outline-none"
            >
              <AiOutlineClose />
            </button>
          </div>

          {/* Message Box */}
          <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-gray-50">
            {!userId ? (
              notLoggedInContent
            ) : messages.length === 0 ? (
              <div className="text-gray-500 text-center mt-10">
                Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!
              </div>
            ) : (
              messages.map((message: any) => (
                <MessageBox
                  key={message.id ?? message.text}
                  id={message.id ?? 0}
                  position={message.position}
                  type={message.type}
                  text={message.text}
                  date={message.date}
                  title=""
                  titleColor=""
                  focus={false}
                  status="received"
                  notch={true}
                  forwarded={false}
                  replyButton={false}
                  removeButton={false}
                  retracted={false}
                />
              ))
            )}
          </div>

          {/* Input Box */}
          <div className="p-2 border-t border-gray-200 bg-white flex items-center rounded-b-xl">
            <Input
              placeholder="Nhập tin nhắn..."
              multiline={false}
              value={inputText}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              inputStyle={{
                borderRadius: "0.375rem",
                borderColor: "#D1D5DB",
              }}
              className="w-full"
              rightButtons={
                <button
                  onClick={handleSend}
                  disabled={!userId || !socketConnected}
                  className="text-blue-600 ml-2 text-[26px] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <AiOutlineSend />
                </button>
              }
              maxHeight={40}
            />
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white rounded-full p-4 shadow-xl hover:bg-blue-700 transition-transform transform hover:scale-110 focus:outline-none"
        >
          <AiOutlineMessage size={28} />
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
