"use client";

import { useChat } from "@ai-sdk/react";
import {
  ArrowUpRight,
  BotMessageSquare,
  Clipboard,
  Mic,
  RefreshCw,
  ThumbsDown,
  ThumbsUp,
  Waves,
  X,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

interface ChatProps {
  onClose?: () => void;
}

export default function Chat({ onClose }: ChatProps) {
  const [input, setInput] = useState("");
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [width, setWidth] = useState(384); // Default width (max-w-md = 384px)
  const [isResizing, setIsResizing] = useState(false);
  const { messages, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatCardRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages come in
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle mouse down event on the resize handle
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  // Handle mouse move event while resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      // Calculate new width based on mouse position
      // Window width - mouse X position from right edge
      const newWidth = Math.max(
        320,
        Math.min(800, window.innerWidth - e.clientX),
      );
      setWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div className="fixed z-50 top-20 right-4 flex items-start">
      {/* Resize handle */}
      <div
        className={`w-1 h-[calc(100vh-6rem)] bg-transparent hover:bg-green-500 cursor-col-resize transition-colors ${isResizing ? "bg-green-500" : ""}`}
        onMouseDown={handleMouseDown}
        style={{ cursor: "col-resize" }}
        title="Drag to resize chat window"
      ></div>
      <Card
        ref={chatCardRef}
        className="h-[calc(100vh-6rem)] bg-background text-foreground border-border shadow-xl"
        style={{ width: `${width}px` }}
      >
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-foreground bold">FloatChat</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground hover:bg-muted"
            onClick={onClose}
          >
            <X size={18} />
            <span className="sr-only">Close</span>
          </Button>
        </CardHeader>

        <CardContent
          className="p-0 flex-1 overflow-hidden"
          style={{ height: "calc(100vh - 6rem - 145px)" }}
        >
          <ScrollArea className="h-full p-4">
            {messages.length === 0 && !isWaitingForResponse ? (
              <div className="h-full justify-center flex flex-col text-center text-muted-foreground">
                <div className="mx-auto mb-4 p-3 rounded-full">
                  <BotMessageSquare
                    size={32}
                    className="text-blue-600 dark:text-blue-400"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  Argo Data Assistant
                </h3>
                <p className="mb-4 text-muted-foreground">
                  Ask me anything about oceanographic data, Argo floats, or
                  marine research insights.
                </p>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• "Analyze temperature profiles in the Pacific"</p>
                  <p>• "Show salinity trends for this region"</p>
                  <p>• "What do recent measurements indicate?"</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 w-full">
                {messages.map((message) => (
                  <div key={message.id} className="space-y-2 w-full">
                    <div
                      className={`whitespace-pre-wrap p-3 rounded-lg ${
                        message.role === "user"
                          ? "bg-muted ml-6"
                          : "bg-background w-full"
                      }`}
                    >
                      <div className="font-medium mb-1 text-foreground">
                        {message.role === "user" ? "You" : "Assistant"}
                      </div>
                      {message.parts.map((part, i) => {
                        switch (part.type) {
                          case "text":
                            return message.role === "assistant" ? (
                              <div
                                key={`${message.id}-${i}`}
                                className="text-foreground markdown-content prose prose-sm max-w-none w-full overflow-x-auto dark:prose-invert"
                              >
                                <ReactMarkdown
                                  remarkPlugins={[remarkGfm]}
                                  components={{
                                    a: ({ node, ...props }) => (
                                      <a
                                        {...props}
                                        className="text-blue-400 hover:underline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      />
                                    ),
                                    p: ({ node, ...props }) => (
                                      <p {...props} className="mb-3" />
                                    ),
                                    ul: ({ node, ...props }) => (
                                      <ul
                                        {...props}
                                        className="list-disc ml-6 mb-3"
                                      />
                                    ),
                                    ol: ({ node, ...props }) => (
                                      <ol
                                        {...props}
                                        className="list-decimal ml-6 mb-3"
                                      />
                                    ),
                                    li: ({ node, ...props }) => (
                                      <li {...props} className="mb-1" />
                                    ),
                                    h1: ({ node, ...props }) => (
                                      <h1
                                        {...props}
                                        className="text-xl font-bold mb-3 mt-4"
                                      />
                                    ),
                                    h2: ({ node, ...props }) => (
                                      <h2
                                        {...props}
                                        className="text-lg font-bold mb-3 mt-4"
                                      />
                                    ),
                                    h3: ({ node, ...props }) => (
                                      <h3
                                        {...props}
                                        className="text-md font-bold mb-2 mt-3"
                                      />
                                    ),
                                    code: ({ node, className, ...props }) => {
                                      const match = /language-(\w+)/.exec(
                                        className || "",
                                      );
                                      const isInline = !match;
                                      return isInline ? (
                                        <code
                                          {...props}
                                          className="bg-muted px-1 rounded text-green-500"
                                        />
                                      ) : (
                                        <code
                                          {...props}
                                          className="block bg-muted p-2 rounded text-green-500 my-3 overflow-x-auto"
                                        />
                                      );
                                    },
                                    pre: ({ node, ...props }) => (
                                      <pre
                                        {...props}
                                        className="bg-transparent p-0 my-0"
                                      />
                                    ),
                                    table: ({ node, ...props }) => (
                                      <div className="overflow-x-auto my-4">
                                        <table
                                          {...props}
                                          className="border-collapse w-full"
                                        />
                                      </div>
                                    ),
                                    thead: ({ node, ...props }) => (
                                      <thead {...props} className="bg-muted" />
                                    ),
                                    tbody: ({ node, ...props }) => (
                                      <tbody
                                        {...props}
                                        className="bg-background"
                                      />
                                    ),
                                    tr: ({ node, ...props }) => (
                                      <tr
                                        {...props}
                                        className="border-b border-border"
                                      />
                                    ),
                                    th: ({ node, ...props }) => (
                                      <th
                                        {...props}
                                        className="border border-border px-4 py-2 text-left text-sm font-bold"
                                      />
                                    ),
                                    td: ({ node, ...props }) => (
                                      <td
                                        {...props}
                                        className="border border-border px-4 py-2 text-sm"
                                      />
                                    ),
                                  }}
                                >
                                  {part.text}
                                </ReactMarkdown>
                              </div>
                            ) : (
                              <div
                                key={`${message.id}-${i}`}
                                className="text-foreground"
                              >
                                {part.text}
                              </div>
                            );
                          default:
                            return null;
                        }
                      })}
                    </div>

                    {message.role === "assistant" && (
                      <div className="flex space-x-2 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-foreground hover:bg-muted"
                          onClick={() => {
                            setInput("");
                          }}
                          title="Regenerate"
                        >
                          <RefreshCw size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-foreground hover:bg-muted"
                          onClick={() => {
                            const textContent = message.parts
                              .filter((part) => part.type === "text")
                              .map((part) => part.text)
                              .join("");
                            navigator.clipboard.writeText(textContent);
                          }}
                          title="Copy"
                        >
                          <Clipboard size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-foreground hover:bg-muted"
                          onClick={() => {
                            // Like logic would go here
                          }}
                          title="Like"
                        >
                          <ThumbsUp size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-foreground hover:bg-muted"
                          onClick={() => {
                            // Dislike logic would go here
                          }}
                          title="Dislike"
                        >
                          <ThumbsDown size={16} />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}

                {isWaitingForResponse && (
                  <div className="bg-background mr-6 p-3 rounded-lg">
                    <div className="font-medium mb-1 text-foreground">
                      Assistant
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[80%] bg-muted" />
                      <Skeleton className="h-4 w-[90%] bg-muted" />
                      <Skeleton className="h-4 w-[60%] bg-muted" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>
        </CardContent>

        <CardFooter className="relative z-10">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (input.trim()) {
                setIsWaitingForResponse(true);
                await sendMessage({ text: input });
                setIsWaitingForResponse(false);
                setInput("");
              }
            }}
            className="w-full"
          >
            <div className="flex items-center space-x-2">
              <div className="relative h-[50%] w-full bg-muted/60 border-border text-md text-foreground px-2 py-2 border rounded-sm flex flex-col justify-center">
                <textarea
                  className="h-full w-full  resize-none focus:outline-none focus:outline-0 placeholder-muted-foreground bg-transparent"
                  value={input}
                  placeholder="Ask anything"
                  onChange={(e) => setInput(e.currentTarget.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (input.trim()) {
                        setIsWaitingForResponse(true);
                        sendMessage({ text: input }).then(() => {
                          setIsWaitingForResponse(false);
                          setInput("");
                        });
                      }
                    }
                  }}
                />
                <div className="w-full flex flex-row justify-between space-x-1">
                  <div className="px-2 flex items-center">
                    <p className="text-sm text-muted-foreground">
                      FloatChat 1.7
                    </p>
                  </div>
                  <div>
                    <Button
                      type="submit"
                      variant="ghost"
                      size="sm"
                      className="h-10 w-10 p-0 text-blue-500 hover:text-blue-400 hover:bg-muted rounded-full"
                      disabled={!input.trim()}
                    >
                      <ArrowUpRight size={26} />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-transparent"
                    >
                      <Mic size={20} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
