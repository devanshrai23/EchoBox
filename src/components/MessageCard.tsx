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
				toast.add({
					title: 'Message Deleted',
					description:
						'Your message has been permanently deleted.',
				});
				onMessageDelete(message._id);
			}
		} catch (error) {
			toast.add({
				title: 'Error',
				description: 'Failed to delete message.',
				type: 'error',
			});
		}
	};

	const displayDate = new Date(message.createdAt).toLocaleString();

	return (
		<Card className="bg-background/40 backdrop-blur-md border border-border/50 shadow-md hover:shadow-primary/5 transition-all rounded-2xl overflow-hidden group">
			<CardHeader>
				<div className="flex justify-between items-start gap-4">
					<CardTitle className="text-lg font-medium leading-relaxed text-foreground flex-1 break-words">
						{message.content}
					</CardTitle>
					<AlertDialog>
						<AlertDialogTrigger
							render={
								<Button
									variant="destructive"
									size="icon"
									className="opacity-0 group-hover:opacity-100 transition-opacity rounded-xl h-8 w-8 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground"
								>
									<X className="w-4 h-4" />
								</Button>
							}
						/>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									Are you
									absolutely
									sure?
								</AlertDialogTitle>
								<AlertDialogDescription>
									This
									action
									cannot
									be
									undone.
									This
									will
									permanently
									delete
									this
									message.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>
									Cancel
								</AlertDialogCancel>
								<AlertDialogAction
									onClick={
										handleDeleteConfirm
									}
								>
									Continue
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
				<div className="text-xs font-medium text-muted-foreground/60 mt-3 flex items-center gap-2">
					<div className="h-1 w-1 rounded-full bg-primary/40"></div>
					{displayDate}
				</div>
			</CardHeader>
			<CardContent></CardContent>
		</Card>
	);
}
