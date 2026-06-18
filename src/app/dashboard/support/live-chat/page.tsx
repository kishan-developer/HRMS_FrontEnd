'use client';

import { useState } from 'react';
import { MessageSquare, Send, MoreVertical, Search, User, Bot, Clock, Check, CheckCheck } from 'lucide-react';
import Button from '@/components/ui/Button/Button';

interface Message {
  id: string;
  sender: 'User' | 'Agent';
  message: string;
  timestamp: Date;
  isRead?: boolean;
}

interface ChatSession {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  status: 'Active' | 'Waiting' | 'Closed';
  messages: Message[];
  startedAt: Date;
  endedAt?: Date;
  lastMessage?: string;
  lastMessageTime?: Date;
}

export default function LiveChatPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedChat, setSelectedChat] = useState<ChatSession | null>(null);
  const [messageInput, setMessageInput] = useState('');

  const mockChats: ChatSession[] = [
    {
      id: 'CHAT-001',
      userId: 'EMP-001',
      userName: 'Alice Smith',
      status: 'Active',
      startedAt: new Date('2024-01-15T10:30:00'),
      messages: [
        { id: 'MSG-001', sender: 'User', message: 'Hi, I need help with my leave balance', timestamp: new Date('2024-01-15T10:30:00') },
        { id: 'MSG-002', sender: 'Agent', message: 'Hello Alice! I can help you with that. What specific issue are you facing?', timestamp: new Date('2024-01-15T10:31:00'), isRead: true },
        { id: 'MSG-003', sender: 'User', message: 'My leave balance is not showing correctly in the app', timestamp: new Date('2024-01-15T10:32:00') },
      ],
      lastMessage: 'My leave balance is not showing correctly in the app',
      lastMessageTime: new Date('2024-01-15T10:32:00'),
    },
    {
      id: 'CHAT-002',
      userId: 'EMP-002',
      userName: 'Bob Johnson',
      status: 'Waiting',
      startedAt: new Date('2024-01-15T11:00:00'),
      messages: [
        { id: 'MSG-004', sender: 'User', message: 'I cannot log in to the system', timestamp: new Date('2024-01-15T11:00:00') },
      ],
      lastMessage: 'I cannot log in to the system',
      lastMessageTime: new Date('2024-01-15T11:00:00'),
    },
    {
      id: 'CHAT-003',
      userId: 'EMP-003',
      userName: 'Charlie Brown',
      status: 'Closed',
      startedAt: new Date('2024-01-14T15:30:00'),
      endedAt: new Date('2024-01-14T16:00:00'),
      messages: [
        { id: 'MSG-005', sender: 'User', message: 'How do I submit an expense claim?', timestamp: new Date('2024-01-14T15:30:00') },
        { id: 'MSG-006', sender: 'Agent', message: 'You can submit expense claims from the payroll section. Go to Payroll > Reimbursement and click on New Claim', timestamp: new Date('2024-01-14T15:35:00'), isRead: true },
        { id: 'MSG-007', sender: 'User', message: 'Thank you!', timestamp: new Date('2024-01-14T15:40:00') },
      ],
      lastMessage: 'Thank you!',
      lastMessageTime: new Date('2024-01-14T15:40:00'),
    },
  ];

  const statusColors = {
    Active: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    Waiting: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
    Closed: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  };

  const statusIcons = {
    Active: <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />,
    Waiting: <div className="w-2 h-2 bg-yellow-500 rounded-full" />,
    Closed: <div className="w-2 h-2 bg-zinc-400 rounded-full" />,
  };

  const filteredChats = mockChats.filter(chat => {
    const matchesSearch = chat.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         chat.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || chat.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChat) return;
    // Send message logic would go here
    setMessageInput('');
  };

  const currentChat = selectedChat || filteredChats[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-blue-500" />
            Live Chat
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Real-time support chat with employees</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Online
          </span>
        </div>
      </div>

      {/* Chat Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <MessageSquare className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{mockChats.filter(c => c.status === 'Active').length}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Active Chats</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{mockChats.filter(c => c.status === 'Waiting').length}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Waiting</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{mockChats.length}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Total Today</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Bot className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">2.5m</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Avg Response</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Chat List */}
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 flex flex-col">
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-zinc-50"
              />
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setStatusFilter('All')}
                className={`text-xs px-3 py-1 rounded-full ${statusFilter === 'All' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'}`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('Active')}
                className={`text-xs px-3 py-1 rounded-full ${statusFilter === 'Active' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'}`}
              >
                Active
              </button>
              <button
                onClick={() => setStatusFilter('Waiting')}
                className={`text-xs px-3 py-1 rounded-full ${statusFilter === 'Waiting' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'}`}
              >
                Waiting
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`p-4 border-b border-zinc-200 dark:border-zinc-700 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors ${selectedChat?.id === chat.id ? 'bg-zinc-50 dark:bg-zinc-900/50' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{chat.userName}</span>
                      <div className="flex items-center gap-2">
                        {statusIcons[chat.status]}
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                          {chat.lastMessageTime && new Date(chat.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{chat.lastMessage}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 flex flex-col">
          {currentChat ? (
            <>
              <div className="p-4 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{currentChat.userName}</h3>
                    <div className="flex items-center gap-2">
                      {statusIcons[currentChat.status]}
                      <span className={`text-xs ${statusColors[currentChat.status]}`}>{currentChat.status}</span>
                    </div>
                  </div>
                </div>
                <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {currentChat.messages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === 'Agent' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-lg p-3 ${
                      message.sender === 'Agent' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50'
                    }`}>
                      <p className="text-sm">{message.message}</p>
                      <div className={`flex items-center justify-end gap-1 mt-1 text-xs ${
                        message.sender === 'Agent' ? 'text-blue-100' : 'text-zinc-500 dark:text-zinc-400'
                      }`}>
                        <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {message.sender === 'Agent' && (
                          message.isRead ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {currentChat.status !== 'Closed' && (
                <div className="p-4 border-t border-zinc-200 dark:border-zinc-700">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1 px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-zinc-50"
                    />
                    <Button onClick={handleSendMessage} className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Send
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
                <p className="text-zinc-500 dark:text-zinc-400">Select a chat to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
