"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageBox, Input, Button } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import { AiOutlineClose, AiOutlineSend } from "react-icons/ai";
import chatbotApiRequest from "@/apiRequests/chatbotRasa";
import ChatbotIcon from "@/assets/icons/bot-icon.jpg";
import Image from "next/image";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any>([]);
  const [inputText, setInputText] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      handleSend("Xin chào");
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSend = async (text: string) => {
    if (text.trim()) {
      setMessages((prevMessages: any) => [
        ...prevMessages,
        {
          position: "right",
          type: "text",
          text: text,
          date: new Date(),
          // avatar: "avatar user",
        },
      ]);

      // Thêm tin nhắn "Đang trả lời" vào danh sách tin nhắn
      const typingMessage = {
        position: "left",
        type: "text",
        text: "",
        date: new Date(),
        isTyping: true, // Thêm thuộc tính để xác định tin nhắn đang gõ
        avatar:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPYtqytSUUShobf3PDxLMbcfTYj9DmcY3P1Q&s",
      };
      setMessages((prevMessages: any) => [...prevMessages, typingMessage]);

      try {
        const response = await chatbotApiRequest(text);
        if (response && response.length > 0) {
          response.forEach((botResponse: any) => {
            // Encode job name and location if present in botResponse.text
            let modifiedText = botResponse.text;

            // Tìm và thay thế phần URL trong botResponse.text nếu có
            const jobNameMatch = botResponse.text.match(/name=([^&]*)/);
            const jobLocationMatch = botResponse.text.match(/location=([^&]*)/);

            if (jobNameMatch) {
              modifiedText = modifiedText.replace(
                jobNameMatch[1],
                encodeURIComponent(jobNameMatch[1])
              );
            }

            if (jobLocationMatch) {
              modifiedText = modifiedText.replace(
                jobLocationMatch[1],
                encodeURIComponent(jobLocationMatch[1])
              );
            }

            setMessages((prevMessages: any) => [
              ...prevMessages,
              {
                position: "left",
                type: "text",
                text: modifiedText,
                date: new Date(),
                buttons: botResponse.buttons,
                avatar:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPYtqytSUUShobf3PDxLMbcfTYj9DmcY3P1Q&s",
              },
            ]);
          });

          // Xóa tin nhắn "Đang trả lời..." sau khi nhận được phản hồi
          setMessages((prevMessages: any) =>
            prevMessages.filter((msg: any) => !msg.isTyping)
          );
        }
      } catch (error) {
        console.error("Error communicating with Rasa:", error);
        setMessages((prevMessages: any) => [
          ...prevMessages,
          {
            position: "left",
            type: "text",
            text: "Xin lỗi, có lỗi xảy ra khi kết nối với chatbot. Vui lòng thử lại sau.",
            date: new Date(),
            avatar: ChatbotIcon,
          },
        ]);
      }
    }
    setInputText("");
  };

  // const handleSend = async (text: string) => {
  //   if (text.trim()) {
  //     setMessages((prevMessages: any) => [
  //       ...prevMessages,
  //       {
  //         position: "right",
  //         type: "text",
  //         text: text,
  //         date: new Date(),
  //       },
  //     ]);

  //     try {
  //       const response = await chatbotApiRequest(text);
  //       if (response && response.length > 0) {
  //         response.forEach((botResponse: any) => {
  //           setMessages((prevMessages: any) => [
  //             ...prevMessages,
  //             {
  //               position: "left",
  //               type: "text",
  //               text: botResponse.text,
  //               date: new Date(),
  //               buttons: botResponse.buttons,
  //             },
  //           ]);
  //         });
  //       }
  //     } catch (error) {
  //       console.error("Error communicating with Rasa:", error);
  //       setMessages((prevMessages: any) => [
  //         ...prevMessages,
  //         {
  //           position: "left",
  //           type: "text",
  //           text: "Xin lỗi, có lỗi xảy ra khi kết nối với chatbot. Vui lòng thử lại sau.",
  //           date: new Date(),
  //         },
  //       ]);
  //     }
  //   }
  //   setInputText("");
  // };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend(inputText);
    }
  };

  const convertUrlsToLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, i) =>
      part.match(urlRegex) ? (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline break-words cursor-pointer"
        >
          {part}
        </a>
      ) : (
        part
      )
    );
  };

  const renderMessageText = (text: string) => {
    return (
      <div className="whitespace-pre-wrap">{convertUrlsToLinks(text)}</div>
    );
  };

  const handleOptionClick = (option: string) => {
    handleSend(option);
  };

  const renderMessageContent = (message: any) => {
    return (
      <div>
        {renderMessageText(message.text)}
        {message.isTyping && (
          <div className="flex">
            <div style={styles.typingIndicator} />
            <div style={styles.typingIndicator} />
            <div style={styles.typingIndicator} />
          </div>
        )}
        {message.buttons && (
          <div className="mt-2 flex flex-wrap gap-2">
            {message.buttons.map((button: any, index: number) => (
              <Button
                key={index}
                text={button.title}
                onClick={() => handleOptionClick(button.title)}
                className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition-colors"
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Thêm CSS cho hiệu ứng typing
  const styles = {
    typingIndicator: {
      display: "inline-block",
      width: "1em",
      height: "1em",
      margin: "0 2px",
      borderRadius: "50%",
      backgroundColor: "gray",
      animation: "typing 1s infinite",
    },
  };

  // Thêm keyframes cho animation
  const typingAnimation = `
  @keyframes typing {
    0%, 20% {
      opacity: 0;
    }
    20%, 40% {
      opacity: 1;
    }
    40%, 60% {
      opacity: 0;
    }
    60%, 80% {
      opacity: 1;
    }
    80%, 100% {
      opacity: 0;
    }
  }
`;

  // Thêm vào head của document
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = typingAnimation;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen ? (
        <div
          ref={chatRef}
          className={`h-[500px] w-[350px] bg-primary rounded-xl shadow-xl flex flex-col transition-all transform duration-300 ease-in-out ${
            isOpen ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-5 flex justify-between items-center rounded-t-xl">
            <span className="text-lg font-semibold">Hỗ trợ trực tuyến</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xl text-white hover:text-gray-200 focus:outline-none"
            >
              <AiOutlineClose />
            </button>
          </div>

          {/* Message Box */}
          <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-gray-500 text-center mt-10">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((message: any, index: number) => (
                <MessageBox
                  key={index}
                  position={message.position}
                  type={message.type}
                  // text={String(renderMessageContent(message))}
                  text={renderMessageContent(message) as unknown as string}
                  date={message.date}
                  avatar={message.avatar}
                />
              ))
            )}
          </div>

          {/* Input Box */}
          <div className="p-2 border-t border-gray-200 bg-white flex items-center">
            <Input
              placeholder="Type your message..."
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
                  onClick={() => handleSend(inputText)}
                  className="text-blue-600 ml-2 text-[26px] focus:outline-none"
                >
                  <AiOutlineSend />
                </button>
              }
            />
          </div>
        </div>
      ) : (
        <Image
          onClick={() => setIsOpen(true)}
          src={ChatbotIcon}
          alt="ChatbotIcon"
          width={70}
          height={70}
          className="bg-[#E9FDFF] rounded-full p-1 border-2 border-solid border-blue-600 cursor-pointer shadow-xl focus:outline-none transition-transform transform hover:scale-110"
        />
      )}
    </div>
  );
};

export default ChatWidget;
