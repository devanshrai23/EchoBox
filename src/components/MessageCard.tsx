'use client';

import { X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import { deleteMessage } from '@/app/actions';

type Message = {
  _id: string;
  content: string;
  createdAt: Date;
};

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteMessage(message._id);
      if (response.success) {
        // @ts-ignore - Base-UI API
        toast.create({
          title: 'Message Deleted',
          description: 'Your message has been permanently deleted.',
        });
        onMessageDelete(message._id);
      }
    } catch (error) {
      // @ts-ignore
      toast.create({
        title: 'Error',
        description: 'Failed to delete message.',
        type: 'error',
      });
    }
  };

  const displayDate = new Date(message.createdAt).toLocaleString();

  return (
    <Card className="card-bordered">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium leading-tight">{message.content}</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button variant="destructive" size="icon">
                  <X className="w-4 h-4" />
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this message.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="text-sm text-muted-foreground mt-2">
          {displayDate}
        </div>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
