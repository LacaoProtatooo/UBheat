import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { TextGenerateEffect } from "../ui/text-generate";
import PredictionChart from "../pages/prediction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faSun, 
  faCloudRain, 
  faWind, 
  faThermometerHalf, 
  faPaperPlane, 
  faMicrophone 
} from "@fortawesome/free-solid-svg-icons";

export const ChatbotComponent = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const API_URL = "api/chat";

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsTyping(true);

    // Check if the message is about the creator of UBheat
    const lowerCaseInput = input.toLowerCase();
    if (
      lowerCaseInput.includes("who created") || 
      lowerCaseInput.includes("who made") || 
      lowerCaseInput.includes("creator") || 
      lowerCaseInput.includes("developer") || 
      lowerCaseInput.includes("who is behind") || 
      lowerCaseInput.includes("who built") ||
      lowerCaseInput.includes("who developed") ||
      (lowerCaseInput.includes("who") && lowerCaseInput.includes("ubheat"))
    ) {
      setTimeout(() => {
        const creatorMessage = { 
          sender: "bot", 
          text: "The creators of UBheat are third year students from TUP Taguig namely Donn Baldoza, Henrich Lacao, and Juliana Mae Ines." 
        };
        setMessages((prevMessages) => [...prevMessages, creatorMessage]);
        setIsTyping(false);
      }, 800);
    } else {
      try {
        const response = await axios.post(API_URL, { message: input });
        setTimeout(() => {
          const botMessage = { sender: "bot", text: response.data.reply };
          setMessages((prevMessages) => [...prevMessages, botMessage]);
          setIsTyping(false);
        }, 500); // Small delay to simulate typing
      } catch (error) {
        console.error("Error sending message:", error);
        setIsTyping(false);
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: "Sorry, I encountered an error. Please try again." }
        ]);
      }
    }
  };

  const getIconForMessage = (text) => {
    if (text.includes("temperature")) {
      return <FontAwesomeIcon icon={faThermometerHalf} className="text-red-500" />;
    } else if (text.includes("sunny") || text.includes("clear")) {
      return <FontAwesomeIcon icon={faSun} className="text-yellow-500" />;
    } else if (text.includes("rain") || text.includes("precipitation")) {
      return <FontAwesomeIcon icon={faCloudRain} className="text-blue-400" />;
    } else if (text.includes("wind")) {
      return <FontAwesomeIcon icon={faWind} className="text-teal-500" />;
    }
    return null;
  };

  return (
    <div className="flex flex-col h-screen max-h-[700px] w-full max-w-md mx-auto rounded-xl shadow-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-white p-1 shadow-lg overflow-hidden">
            <img
              src="/UB_Logo_animated.gif"
              alt="UBHeat Animated Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">UBheat</h3>
            <div className="flex items-center text-xs text-blue-100">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Online | Your Weather Assistant
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area with subtle weather background */}
      <div 
        className="flex-1 overflow-y-auto p-4 bg-white bg-opacity-80"
        style={{
          backgroundImage: "url('/weather-pattern-light.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay"
        }}
      >
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center p-6 bg-blue-50 rounded-lg shadow-sm">
              <div className="w-16 h-16 mx-auto mb-4">
                <img
                  src="/UB_Logo_animated.gif"
                  alt="UBHeat Animated Logo"
                  className="w-full h-full"
                />
              </div>
              <h4 className="font-semibold text-blue-800 mb-2">Welcome to UBheat!</h4>
              <p className="text-sm text-gray-600">Ask me about weather conditions, forecasts, or temperature trends.</p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-3 rounded-2xl max-w-xs animate-fadeIn shadow-sm ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-gray-100 text-gray-800 rounded-tl-none"
                }`}
              >
                {msg.sender === "bot" && (
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-6 h-6 rounded-full bg-white p-1 overflow-hidden">
                      <img
                        src="/UB_Logo_animated.gif"
                        alt="UBHeat Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-xs font-semibold text-blue-800">UBheat</span>
                  </div>
                )}
                
                <div className="flex items-center">
                  {msg.sender === "bot" && getIconForMessage(msg.text) && (
                    <span className="mr-2">{getIconForMessage(msg.text)}</span>
                  )}
                  {msg.sender === "bot" ? (
                    <TextGenerateEffect words={msg.text} className="text-xs" /> // Changed to text-xs to make bot text smaller
                  ) : (
                    <span className="text-xs">{msg.text}</span> // User text is already text-xs
                  )}
                </div>
                
                <div className="text-xs text-right mt-1 opacity-70">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-white p-1 overflow-hidden">
                    <img
                      src="/UB_Logo_animated.gif"
                      alt="UBHeat Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-gray-200">
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-blue-400 focus-within:bg-white transition-all">
          <button className="text-gray-400 hover:text-blue-500 transition-colors p-1">
            <FontAwesomeIcon icon={faMicrophone} />
          </button>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none focus:outline-none px-3 py-1 text-xs"
            placeholder="Ask about today's weather..."
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={`${
              input.trim() ? "text-blue-500 hover:text-blue-700" : "text-gray-300"
            } transition-colors p-1`}
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
        
        <div className="flex justify-center mt-2">
          <div className="flex space-x-1 text-xs text-gray-400">
            <button className="px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              Today's forecast
            </button>
            <button className="px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              Weekly weather
            </button>
            <button className="px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              Who created UBheat?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add this to your global CSS or component CSS
export const globalStyles = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out forwards;
}

.animate-bounce {
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}
`;

export const UBHeatComponent = () => (
  <div className="p-6 bg-white rounded-xl shadow-lg">
    <div className="flex items-center space-x-4 mb-4">
      <div className="w-16 h-16 rounded-full bg-blue-100 p-1 overflow-hidden">
        <img
          src="/UB_Logo_animated.gif"
          alt="UBHeat Animated Logo"
          className="w-full h-full object-contain"
        />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-blue-800">UBHeat</h3>
        <p className="text-xs text-gray-600">Your intelligent weather assistant</p>
        <p className="text-xs text-gray-500 mt-1">Created by Donn Baldoza, Henrich Lacao, and Juliana Mae Ines</p>
      </div>
    </div>
    <p className="text-xs text-gray-700 mb-4">
      UBHeat is designed to assist users with various weather-related queries, providing real-time forecasts, temperature trends, and climate insights.
    </p>
    <div className="grid grid-cols-2 gap-3 mt-4">
      <div className="bg-blue-50 p-3 rounded-lg">
        <FontAwesomeIcon icon={faThermometerHalf} className="text-red-500 mb-2 text-xl" />
        <h4 className="font-medium text-blue-800">Temperature Data</h4>
        <p className="text-xs text-gray-600">Current and historical temperature readings</p>
      </div>
      <div className="bg-blue-50 p-3 rounded-lg">
        <FontAwesomeIcon icon={faCloudRain} className="text-blue-500 mb-2 text-xl" />
        <h4 className="font-medium text-blue-800">Precipitation</h4>
        <p className="text-xs text-gray-600">Rain and snow forecasts</p>
      </div>
    </div>
  </div>
);

export const PredictionComponent = () => (
  <div className="bg-white p-6 rounded-xl shadow-lg">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-xl font-bold text-blue-800">Weather Predictions</h3>
      <div className="w-10 h-10 rounded-full bg-blue-100 p-1 overflow-hidden">
        <img
          src="/UB_Logo_animated.gif"
          alt="UBHeat Logo"
          className="w-full h-full object-contain"
        />
      </div>
    </div>
    <div className="text-xs text-right text-gray-500 mb-2">
      Built by TUP Taguig Students: Donn Baldoza, Henrich Lacao, and Juliana Mae Ines
    </div>
    <PredictionChart />
  </div>
);