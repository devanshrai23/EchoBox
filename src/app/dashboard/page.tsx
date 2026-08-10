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
  const switchLock = React.useRef(false);

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
    if (switchLock.current) return;
    switchLock.current = true;
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
      switchLock.current = false;
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
    <div className="container mx-auto my-8 px-4 md:px-8 w-full max-w-6xl">
      <div className="bg-card/50 backdrop-blur-xl border border-border rounded-3xl shadow-2xl p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6 text-white">
          User Dashboard
        </h1>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3 text-foreground">Copy Your Unique Link</h2>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="bg-input/50 border-border text-muted-foreground border rounded-xl w-full p-3 focus-visible:ring-primary transition-all h-11"
            />
            <Button onClick={copyToClipboard} className="h-11 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all shadow-lg shadow-primary/20">
              Copy
            </Button>
          </div>
        </div>

        <div className="mb-6 flex items-center bg-background/40 p-4 rounded-xl border border-border w-fit">
          <Switch
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
          <span className="ml-3 font-medium text-foreground">
            Accept Messages: <span className={acceptMessages ? 'text-emerald-400' : 'text-destructive'}>{acceptMessages ? 'On' : 'Off'}</span>
          </span>
        </div>
        
        <Separator className="bg-border/60 my-6" />

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Your Messages</h2>
          <Button
            variant="outline"
            className="rounded-full bg-background/50 hover:bg-background border-border"
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            ) : (
              <RefreshCcw className="h-4 w-4 text-primary" />
            )}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {messages.length > 0 ? (
            messages.map((message) => (
              <MessageCard
                key={message._id}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <div className="col-span-full py-12 text-center bg-background/30 rounded-2xl border border-border border-dashed">
              <p className="text-muted-foreground">No messages to display.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
