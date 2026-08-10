'use client';

import { MessageCard } from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/toast';
import { Loader2, RefreshCcw } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';

type Message = {
  _id: string;
  content: string;
  createdAt: Date;
};

export default function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [acceptMessages, setAcceptMessages] = useState(true);

  const { data: session } = useSession();

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const response = await axios.delete<ApiResponse>(`/api/delete-message/${messageId}`);
      toast.add({ title: response.data.message });
      setMessages(messages.filter((message) => message._id !== messageId));
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.add({ title: 'Error', description: axiosError.response?.data.message ?? 'Failed to delete message', type: 'error' });
    }
  };

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    setIsSwitchLoading(false);
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages');
      setMessages((response.data.messages as unknown as Message[]) || []);
      if (refresh) {
        toast.add({ title: 'Refreshed Messages', description: 'Showing latest messages' });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      if (axiosError.response?.status === 401 && axiosError.response.data.message === 'User not found') {
        // Safe to ignore, user just has no messages yet (the API throws 401 if user length === 0 from aggregation)
        setMessages([]);
      } else {
        toast.add({ title: 'Error', description: axiosError.response?.data.message || 'Failed to fetch messages', type: 'error' });
      }
    } finally {
      setIsLoading(false);
      setIsSwitchLoading(false);
    }
  }, []);

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      setAcceptMessages(response.data.isAcceptingMessages as boolean);
    } catch (error) {
      toast.add({ title: 'Error', description: 'Failed to fetch message settings', type: 'error' });
    } finally {
      setIsSwitchLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessages();
  }, [session, fetchMessages, fetchAcceptMessages]);

  const handleSwitchChange = async (checked: boolean) => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: checked,
      });
      setAcceptMessages(checked);
      toast.add({ title: response.data.message });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.add({ title: 'Error', description: axiosError.response?.data.message ?? 'Failed to update message settings', type: 'error' });
    } finally {
      setIsSwitchLoading(false);
    }
  };

  if (!session || !session.user) {
    return <div className="text-center p-8">Please login to view dashboard</div>;
  }

  const { username, email } = session.user as User;
  
  // Use a fallback for baseUrl if window is undefined
  const baseUrl = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : '';
  const profileUrl = `${baseUrl}/u/${username || email?.split('@')[0]}`; // fallback to email prefix if no username

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.add({ title: 'URL Copied!' });
  };

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white dark:bg-gray-900 rounded w-full max-w-6xl shadow-sm">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input border rounded-md w-full p-2 mr-2 bg-gray-100 dark:bg-gray-800 text-gray-500"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-6 flex items-center">
        <Switch
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2 font-medium">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-6 mb-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p className="text-muted-foreground">No messages to display.</p>
        )}
      </div>
    </div>
  );
}
