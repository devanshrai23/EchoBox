'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/toast';
import * as z from 'zod';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';
import { suggestMessages, sendMessage } from '@/app/actions';

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
	return messageString.split(specialChar);
};

const initialMessageString =
	"What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
	const params = useParams<{ username: string }>();
	const username = params.username;

	const [suggestedString, setSuggestedString] =
		useState(initialMessageString);
	const [isSuggestLoading, setIsSuggestLoading] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<z.infer<typeof messageSchema>>({
		resolver: zodResolver(messageSchema),
	});

	const messageContent = form.watch('content');

	const handleMessageClick = (message: string) => {
		form.setValue('content', message);
	};

	const onSubmit = async (data: z.infer<typeof messageSchema>) => {
		setIsLoading(true);
		try {
			if (!username) return;
			const response = await sendMessage(
				username as string,
				data.content,
			);

			if (response.success) {
				// @ts-expect-error Base UI ToastManager typing
				toast.create({ title: response.message });
				form.reset({ content: '' });
			} else {
				// @ts-expect-error Base UI ToastManager typing
				toast.create({ title: 'Error', type: 'error' });
			}
		}  
		catch (error) {
			// @ts-expect-error Base UI ToastManager typing
			toast.create({
				title: 'Error',
				description: 'Failed to send message',
				type: 'error',
			});
		} finally {
			setIsLoading(false);
		}
	};

	const fetchSuggestedMessages = async () => {
		setIsSuggestLoading(true);
		try {
			const result = await suggestMessages();
			if (result.success && result.text) {
				setSuggestedString(result.text);
			} else {
				setSuggestedString(initialMessageString);
			}
		} catch (error) {
			console.error('Error fetching messages:', error);
		} finally {
			setIsSuggestLoading(false);
		}
	};

	return (
		<div className="container mx-auto my-8 p-6 bg-white dark:bg-gray-900 rounded max-w-4xl shadow-sm">
			<h1 className="text-4xl font-bold mb-6 text-center">
				Public Profile Link
			</h1>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6"
				>
					<FormField
						control={form.control}
						name="content"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-lg">
									Send
									Anonymous
									Message
									to @
									{
										username
									}
								</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Write your anonymous message here"
										className="resize-none h-32"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="flex justify-center">
						{isLoading ? (
							<Button disabled>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Please wait
							</Button>
						) : (
							<Button
								type="submit"
								disabled={
									isLoading ||
									!messageContent
								}
							>
								Send It
							</Button>
						)}
					</div>
				</form>
			</Form>

			<div className="space-y-4 my-12">
				<div className="space-y-2">
					<Button
						onClick={fetchSuggestedMessages}
						disabled={isSuggestLoading}
					>
						{isSuggestLoading ? (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						) : null}
						Suggest Messages
					</Button>
					<p className="text-sm text-muted-foreground">
						Click on any message below to
						select it.
					</p>
				</div>
				<Card>
					<CardHeader>
						<h3 className="text-xl font-semibold">
							Messages
						</h3>
					</CardHeader>
					<CardContent className="flex flex-col space-y-4">
						{parseStringMessages(
							suggestedString,
						).map((message, index) => (
							<Button
								key={index}
								variant="outline"
								className="mb-2 h-auto text-wrap py-3"
								onClick={() =>
									handleMessageClick(
										message,
									)
								}
							>
								{message}
							</Button>
						))}
					</CardContent>
				</Card>
			</div>
			<Separator className="my-6" />
			<div className="text-center">
				<div className="mb-4">
					Get Your Own Message Board
				</div>
				<Link href={'/sign-up'}>
					<Button variant="default">
						Create Your Account
					</Button>
				</Link>
			</div>
		</div>
	);
}
