import React, { useState } from 'react';
import { ArrowLeft, Phone, Send } from 'lucide-react';

interface Message {
    id: number;
    text: string;
    time: string;
    isSent: boolean;
}

const Chat: React.FC = () => {
    const [messageInput, setMessageInput] = useState('');

    const messages: Message[] = [
        { id: 1, text: "Hi! I'm available for the plumbing work today.", time: "10:30 AM", isSent: false },
        { id: 2, text: "Great! What time can you come?", time: "10:32 AM", isSent: true },
        { id: 3, text: "I can reach by 2:00 PM. Is that okay?", time: "10:35 AM", isSent: false },
        { id: 4, text: "Perfect! See you at 2 PM then.", time: "10:36 AM", isSent: true },
        { id: 5, text: "Sure! I'll bring all necessary tools.", time: "10:38 AM", isSent: false },
    ];

    return (
        <div className="flex h-screen bg-gray-100 items-center justify-center">
            {/* Chat View */}
            <div className="w-full max-w-2xl h-full flex flex-col bg-white shadow-xl">
                {/* Header */}
                <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button className="hover:bg-gray-800 p-2 rounded-lg transition">
                            <ArrowLeft size={24} />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-xl font-semibold">
                                RK
                            </div>
                            <span className="text-lg font-medium">Ramesh Kumar</span>
                        </div>
                    </div>
                    <button className="hover:bg-gray-800 p-2 rounded-lg transition">
                        <Phone size={24} className="text-pink-500" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.isSent ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-md ${message.isSent ? 'order-2' : 'order-1'}`}>
                                <div
                                    className={`px-4 py-3 rounded-2xl ${message.isSent
                                            ? 'bg-blue-500 text-white rounded-br-sm'
                                            : 'bg-gray-200 text-gray-900 rounded-bl-sm'
                                        }`}
                                >
                                    <p className="text-sm">{message.text}</p>
                                </div>
                                <p className="text-xs text-gray-500 mt-1 px-2">{message.time}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input */}
                <div className="p-4 border-t">
                    <div className="flex items-center gap-3">
                        <input
                            type="text"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
                        />
                        <button className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full transition">
                            <Send size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;