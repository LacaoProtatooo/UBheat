import React, { useState } from "react";
import axios from "axios";
import { TextGenerateEffect } from "../ui/text-generate"; // Import the TextGenerateEffect component
import PredictionChart from "../pages/prediction"; // Import the PredictionChart component

export const ChatbotComponent = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const API_URL = "api/chat"; // Backend API endpoint

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await axios.post(API_URL, { message: input });
      const botMessage = { sender: "bot", text: response.data.reply };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setInput("");
  };

  return (
    <div className="w-full mx-auto p-4 border border-gray-300 rounded-md bg-white shadow-md">
      <h3 className="text-xl font-semibold mb-3">Chatbot</h3>
      <div className="h-60 overflow-y-auto p-2 border border-gray-200 rounded-md mb-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 my-1 rounded-md ${
              msg.sender === "user"
                ? "bg-blue-200 text-right"
                : "bg-gray-200 text-left"
            }`}
          >
            <strong>{msg.sender === "user" ? "You" : "Bot"}:</strong>{" "}
            {msg.sender === "bot" ? (
              <TextGenerateEffect words={msg.text} className="inline-block" />
            ) : (
              msg.text
            )}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-md"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export const UBHeatComponent = () => (
  <div className="p-4">
    <h3 className="text-xl font-semibold">UBHeat</h3>
    <p>
      UBHeat is designed to assist users with various queries Test Test Test.
    </p>
    <img
      src="../../../public/UB_Logo.png"
      alt="UBHeat Logo"
      className="mt-4 w-full h-auto rounded-md"
    />
  </div>
);

export const PredictionComponent = () => (
  <div>
    <PredictionChart />
  </div>
);
