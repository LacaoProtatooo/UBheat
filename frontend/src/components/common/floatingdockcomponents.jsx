import React, { useState } from "react";
import axios from "axios";
import { TextGenerateEffect } from "../ui/text-generate"; // Import the TextGenerateEffect component
import PredictionChart from "../pages/prediction"; // Import the PredictionChart component
import ChatbotBackground from "../../assets/Chatbot.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faCloudRain, faWind, faThermometerHalf } from "@fortawesome/free-solid-svg-icons";

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

  const getIconForMessage = (text) => {
    if (text.includes("temperature")) {
      return <FontAwesomeIcon icon={faThermometerHalf} className="mr-2" />;
    } else if (text.includes("sunny")) {
      return <FontAwesomeIcon icon={faSun} className="mr-2" />;
    } else if (text.includes("rain")) {
      return <FontAwesomeIcon icon={faCloudRain} className="mr-2" />;
    } else if (text.includes("wind")) {
      return <FontAwesomeIcon icon={faWind} className="mr-2" />;
    } else {
      return null;
    }
  };

  return (
    <div
      className="w-full max-w-full mx-auto p-6 bg-white rounded-xl shadow-2xl transform transition-all duration-300 hover:scale-105 relative overflow-hidden"
      style={{
        zIndex: 10,
        backgroundImage: `url(${ChatbotBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${ChatbotBackground})` }}
      ></div>

      {/* Overlay to ensure content is readable */}
      <div className="absolute inset-0 bg-black opacity-10"></div>

      {/* Chatbot Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <img
              src="/UB_Logo.png"
              alt="UBHeat Logo"
              className="w-12 h-12 mr-3 rounded-full shadow-sm"
            />
            <h3 className="text-2xl font-bold text-blue-800">UBheat</h3>
          </div>
          <span className="flex items-center text-sm text-gray-500">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Online
          </span>
        </div>

        <div className="h-96 overflow-y-auto p-4 bg-gray-50 rounded-lg mb-4 shadow-inner bg-opacity-90">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 my-2 rounded-lg max-w-xs ${
                msg.sender === "user"
                  ? "ml-auto bg-blue-500 text-white"
                  : "mr-auto bg-gray-200 text-gray-800"
              }`}
            >
              <strong className="block text-sm font-semibold mb-1">
                {msg.sender === "user" ? "You" : (
                  <div className="flex items-center">
                    <img
                      src="/UB_Logo.png"
                      alt="UBHeat Logo"
                      className="w-6 h-6 inline-block mr-2"
                    />
                    UBheat
                  </div>
                )}
              </strong>
              {msg.sender === "bot" ? (
                <div className="flex items-center">
                  {getIconForMessage(msg.text)}
                  <TextGenerateEffect words={msg.text} className="inline-block" />
                </div>
              ) : (
                <span className="text-sm">{msg.text}</span>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white bg-opacity-90"
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="ml-3 px-5 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 transform rotate-90"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
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
      src="../../../UB_Logo.png"
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
