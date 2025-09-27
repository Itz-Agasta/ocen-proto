'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { X, RefreshCw, Clipboard, ThumbsUp, ThumbsDown, ArrowUpRight, Mic } from 'lucide-react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatProps {
    onClose?: () => void;
}

export default function Chat({ onClose }: ChatProps) {
    const [input, setInput] = useState('');
    const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
    const [width, setWidth] = useState(384); // Default width (max-w-md = 384px)
    const [isResizing, setIsResizing] = useState(false);
    const { messages, sendMessage } = useChat();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatCardRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages come in
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
            const newWidth = Math.max(320, Math.min(800, window.innerWidth - e.clientX));
            setWidth(newWidth);
        };

        const handleMouseUp = () => {
            setIsResizing(false);
        };

        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);

    return (
        <div className="fixed z-50 bottom-4 right-4 flex items-start">
            {/* Resize handle */}
            <div
                className={`w-1 h-[95vh] bg-transparent hover:bg-green-500 cursor-col-resize transition-colors ${isResizing ? 'bg-green-500' : ''}`}
                onMouseDown={handleMouseDown}
                style={{ cursor: 'col-resize' }}
                title="Drag to resize chat window"
            ></div>
            <Card
                ref={chatCardRef}
                className="h-[95vh] bg-zinc-900 text-white border-zinc-800 shadow-xl"
                style={{ width: `${width}px` }}
            >
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-white bold">FloatChat</CardTitle>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                        onClick={onClose}
                    >
                        <X size={18} />
                        <span className="sr-only">Close</span>
                    </Button>
                </CardHeader>

                <CardContent className="p-0 flex-1 overflow-hidden" style={{ height: "calc(95vh - 145px)" }}>
                    <ScrollArea className="h-full p-4">
                        {messages.length === 0 && !isWaitingForResponse ? (
                            <div className="h-full justify-center flex flex-col text-center text-zinc-400">
                                <Image src={'/ocean.png'} alt="Chat Icon" width={64} height={64} className="mx-auto mb-4" />
                                <p className="mb-2">Ask with AI Agent. <br />AI responses may be inaccurate.</p>
                                <p className="text-sm">I'm here to help you find the information you need.</p>
                            </div>
                        ) : (
                            <div className="space-y-4 w-full">
                                {messages.map(message => (
                                    <div key={message.id} className="space-y-2 w-full">
                                        <div
                                            className={`whitespace-pre-wrap p-3 rounded-lg ${message.role === 'user' ? 'bg-zinc-800 ml-6' : 'bg-zinc-900 w-full'
                                                }`}
                                        >
                                            <div className="font-medium mb-1 text-white">
                                                {message.role === 'user' ? 'You' : 'Assistant'}
                                            </div>
                                            {message.parts.map((part, i) => {
                                                switch (part.type) {
                                                    case 'text':
                                                        return message.role === 'assistant' ? (
                                                            <div key={`${message.id}-${i}`} className="text-white markdown-content prose prose-invert prose-sm max-w-none w-full overflow-x-auto">
                                                                <ReactMarkdown
                                                                    remarkPlugins={[remarkGfm]}
                                                                    components={{
                                                                        a: ({ node, ...props }) => <a {...props} className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer" />,
                                                                        p: ({ node, ...props }) => <p {...props} className="mb-3" />,
                                                                        ul: ({ node, ...props }) => <ul {...props} className="list-disc ml-6 mb-3" />,
                                                                        ol: ({ node, ...props }) => <ol {...props} className="list-decimal ml-6 mb-3" />,
                                                                        li: ({ node, ...props }) => <li {...props} className="mb-1" />,
                                                                        h1: ({ node, ...props }) => <h1 {...props} className="text-xl font-bold mb-3 mt-4" />,
                                                                        h2: ({ node, ...props }) => <h2 {...props} className="text-lg font-bold mb-3 mt-4" />,
                                                                        h3: ({ node, ...props }) => <h3 {...props} className="text-md font-bold mb-2 mt-3" />,
                                                                        code: ({ node, className, ...props }) => {
                                                                            const match = /language-(\w+)/.exec(className || '');
                                                                            const isInline = !match;
                                                                            return isInline ?
                                                                                <code {...props} className="bg-zinc-800 px-1 rounded text-green-300" /> :
                                                                                <code {...props} className="block bg-zinc-800 p-2 rounded text-green-300 my-3 overflow-x-auto" />;
                                                                        },
                                                                        pre: ({ node, ...props }) => <pre {...props} className="bg-transparent p-0 my-0" />,
                                                                        table: ({ node, ...props }) => <div className="overflow-x-auto my-4"><table {...props} className="border-collapse w-full" /></div>,
                                                                        thead: ({ node, ...props }) => <thead {...props} className="bg-zinc-800" />,
                                                                        tbody: ({ node, ...props }) => <tbody {...props} className="bg-zinc-900" />,
                                                                        tr: ({ node, ...props }) => <tr {...props} className="border-b border-zinc-800" />,
                                                                        th: ({ node, ...props }) => <th {...props} className="border border-zinc-700 px-4 py-2 text-left text-sm font-bold" />,
                                                                        td: ({ node, ...props }) => <td {...props} className="border border-zinc-700 px-4 py-2 text-sm" />
                                                                    }}
                                                                >
                                                                    {part.text}
                                                                </ReactMarkdown>
                                                            </div>
                                                        ) : (
                                                            <div key={`${message.id}-${i}`} className="text-white">{part.text}</div>
                                                        );
                                                    default:
                                                        return null;
                                                }
                                            })}
                                        </div>

                                        {message.role === 'assistant' && (
                                            <div className="flex space-x-2 justify-end">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-zinc-400 hover:text-white hover:bg-zinc-600"
                                                    onClick={() => {
                                                        setInput('');
                                                    }}
                                                    title="Regenerate"
                                                >
                                                    <RefreshCw size={16} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-zinc-400 hover:text-white hover:bg-zinc-600"
                                                    onClick={() => {
                                                        const textContent = message.parts
                                                            .filter(part => part.type === 'text')
                                                            .map(part => part.text)
                                                            .join('');
                                                        navigator.clipboard.writeText(textContent);
                                                    }}
                                                    title="Copy"
                                                >
                                                    <Clipboard size={16} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-zinc-400 hover:text-white hover:bg-zinc-600"
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
                                                    className="text-zinc-400 hover:text-white
                                                hover:bg-zinc-600"
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
                                    <div className="bg-zinc-900 mr-6 p-3 rounded-lg">
                                        <div className="font-medium mb-1 text-white">Assistant</div>
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-[80%] bg-zinc-800" />
                                            <Skeleton className="h-4 w-[90%] bg-zinc-800" />
                                            <Skeleton className="h-4 w-[60%] bg-zinc-800" />
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
                        onSubmit={async e => {
                            e.preventDefault();
                            if (input.trim()) {
                                setIsWaitingForResponse(true);
                                await sendMessage({ text: input });
                                setIsWaitingForResponse(false);
                                setInput('');
                            }
                        }}
                        className="w-full"
                    >
                        <div className="flex items-center space-x-2">
                            <div className="relative h-[50%] w-full bg-zinc-800/60 border-zinc-600 text-md text-white px-2 py-2 border rounded-sm flex flex-col justify-center">
                                <textarea
                                    autoFocus
                                    className="h-full w-full  resize-none focus:outline-white focus:outline-0 placeholder-black-400"
                                    value={input}
                                    placeholder="Ask anything"
                                    onChange={e => setInput(e.currentTarget.value)}
                                />
                                <div className="w-full flex flex-row justify-between space-x-1">
                                    <div className='px-2 flex items-center'>
                                        <p className='text-sm'>FloatChat 1.7</p>
                                    </div>
                                    <div>
                                        <Button
                                            type="submit"
                                            variant="ghost"
                                            size="sm"
                                            className="h-10 w-10 p-0 text-green-500 hover:text-green-400 hover:bg-zinc-700 rounded-full"
                                            disabled={!input.trim()}
                                        >
                                            <ArrowUpRight size={26} />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 text-zinc-400 hover:text-white hover:bg-transparent"
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