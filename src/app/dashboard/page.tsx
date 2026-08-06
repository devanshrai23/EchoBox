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
import { toggleAcceptMessages } from '@/app/actions';

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

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    try {
      // TODO: Fetch messages from Server Action instead of API
      const fakeMessages: Message[] = [
        { _id: '1', content: 'This is a test message that someone sent you!', createdAt: new Date() }
      ];
      setMessages(fakeMessages);
      if (refresh) {
        // @ts-expect-error Base UI ToastManager typing
        toast.create({ title: 'Refreshed Messages' });
      }
    } catch (error) {
      // @ts-expect-error Base UI ToastManager typing
      toast.create({ title: 'Error', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
  }, [session, fetchMessages]);

  const handleSwitchChange = async (checked: boolean) => {
    setIsSwitchLoading(true);
    try {
      await toggleAcceptMessages(checked);
      setAcceptMessages(checked);
      // @ts-expect-error Base UI ToastManager typing
      toast.create({ title: `Accept Messages is now ${checked ? 'ON' : 'OFF'}` });
    } catch (error) {
      // @ts-expect-error Base UI ToastManager typing
      toast.create({ title: 'Error', type: 'error' });
    } finally {
      setIsSwitchLoading(false);
    }
  };

  if (!session || !session.user) {
    return <div className="text-center p-8">Please login to view dashboard</div>;
  }

  const { email } = session.user as User;
  
  // Use a fallback for baseUrl if window is undefined
  const baseUrl = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : '';
  const profileUrl = `${baseUrl}/u/${email?.split('@')[0]}`; // fallback to email prefix if no username

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    // @ts-expect-error Base UI ToastManager typing
    toast.create({ title: 'URL Copied!' });
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
