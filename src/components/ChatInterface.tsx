"use client";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { useEffect, useRef, useState } from "react";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface ChatInterfaceProps {
  isVisible?: boolean;
  onClose?: () => void;
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || "",
);

export default function ChatInterface({
  isVisible = true,
  onClose,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue.trim();
    setInputValue("");
    setIsLoading(true);

    try {
      // Initialize the model
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      // Create context about Argo floats for better responses
      const context = `You are an AI assistant specializing in oceanography and Argo float data. 
      Argo floats are autonomous profiling floats that collect temperature, salinity, and pressure data from the ocean. 
      You're helping users understand ocean data, Argo float measurements, and marine science concepts.
      
      User question: ${currentInput}`;

      const result = await model.generateContent(context);
      const response = await result.response;
      const text = response.text();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: text,
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error calling Gemini API:", error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I'm sorry, I encountered an error while processing your request. Please check your API key and try again. For Argo float questions, I can help you understand ocean temperature, salinity, and pressure measurements.",
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 w-96 h-[calc(100vh-2rem)] flex flex-col bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden z-50">
      {/* Header with Close Button */}
      <header className="border-b border-gray-700 p-4 bg-gray-800 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">FloatChat</h1>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors duration-200 p-1 rounded hover:bg-gray-700"
          aria-label="Close chat"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </header>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full p-6">
            <div className="text-center text-gray-400">
              <div className="text-4xl mb-4">🌊</div>
              <h2 className="text-2xl font-semibold mb-2 text-white">
                Ask about Argo Floats!
              </h2>
              <p className="text-gray-500 mb-4">
                I can help you understand ocean data and Argo float
                measurements.
              </p>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• "What is temperature profiling?"</p>
                <p>• "How do Argo floats measure salinity?"</p>
                <p>• "Explain ocean currents in the Indian Ocean"</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`py-6 px-4 ${
                  message.role === "assistant" ? "bg-gray-800" : "bg-gray-900"
                }`}
              >
                <div className="px-4 flex gap-4">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        message.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-green-600 text-white"
                      }`}
                    >
                      {message.role === "user" ? "U" : "AI"}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="prose prose-invert max-w-none">
                      <p className="whitespace-pre-wrap text-gray-100 leading-relaxed">
                        {message.content}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="py-6 px-4 bg-gray-800">
                <div className="px-4 flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-sm font-semibold text-white">
                      AI
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-700 p-4 bg-gray-800">
        <div className="w-full">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative bg-gray-800 rounded-lg border border-gray-600 focus-within:border-gray-500">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message FloatChat..."
                className="w-full bg-transparent text-white placeholder-gray-400 border-0 resize-none focus:outline-none p-4 pr-12 min-h-[56px] max-h-[200px]"
                rows={1}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="absolute right-2 bottom-2 p-2 rounded-md bg-white text-black hover:bg-gray-200 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m22 2-7 20-4-9-9-4Z" />
                  <path d="M22 2 11 13" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
