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
import { suggestMessages } from '@/app/actions';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';

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
			const response = await axios.post<ApiResponse>('/api/send-message', {
				username: username as string,
				content: data.content,
			});

			if (response.data.success) {
				toast.add({ title: response.data.message });
				form.reset({ content: '' });
			} else {
				toast.add({ title: 'Error', type: 'error' });
			}
		}  
		catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			toast.add({
				title: 'Error',
				description: axiosError.response?.data.message || 'Failed to send message',
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
		<div className="container mx-auto my-4 md:my-8 px-4 md:px-8 w-full max-w-6xl">
			<div className="bg-card/50 backdrop-blur-xl border border-border rounded-3xl shadow-2xl p-6 md:p-8">
				<h1 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-6 text-center text-white">
					Public Profile Link
				</h1>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-stretch">
					{/* Left Column: Form */}
					<div className="flex flex-col h-full">
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-4 flex flex-col h-full"
							>
								<FormField
									control={form.control}
									name="content"
									render={({ field }) => (
										<FormItem className="flex-1 flex flex-col">
											<FormLabel className="text-xl text-foreground font-semibold">
												Send Anonymous Message to @{username}
											</FormLabel>
											<FormControl className="flex-1 mt-2">
												<Textarea
													placeholder="Write your anonymous message here"
													className="resize-none h-full min-h-[200px] bg-input/50 border-border focus-visible:ring-primary text-lg leading-relaxed"
													{...field}
												/>
											</FormControl>
											<FormMessage className="text-destructive/90" />
										</FormItem>
									)}
								/>
								<div className="flex justify-center mt-4 shrink-0">
									{isLoading ? (
										<Button disabled className="w-full md:w-auto h-12 px-8 text-lg rounded-xl">
											<Loader2 className="mr-2 h-5 w-5 animate-spin" />
											Please wait
										</Button>
									) : (
										<Button
											type="submit"
											disabled={isLoading || !messageContent}
											className="w-full md:w-auto h-12 px-8 text-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all shadow-lg shadow-primary/20"
										>
											Send It
										</Button>
									)}
								</div>
							</form>
						</Form>
					</div>

					{/* Right Column: Suggested Messages */}
					<div className="flex flex-col h-full overflow-hidden">
						<div className="flex flex-col items-center md:items-start space-y-3 shrink-0 mb-4">
							<Button
								onClick={fetchSuggestedMessages}
								disabled={isSuggestLoading}
								variant="secondary"
								className="h-11 rounded-xl w-full md:w-auto"
							>
								{isSuggestLoading ? (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								) : null}
								Suggest Messages
							</Button>
							<p className="text-sm text-muted-foreground text-center md:text-left">
								Click on any message below to select it.
							</p>
						</div>
						<Card className="bg-background/40 border-border shadow-none flex-1 flex flex-col min-h-0 overflow-hidden md:max-h-[320px]">
							<CardHeader className="shrink-0 pb-3 pt-4">
								<h3 className="text-lg font-semibold text-foreground">
									Suggested Messages
								</h3>
							</CardHeader>
							<CardContent className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
								{parseStringMessages(suggestedString).map(
									(message, index) => (
										<Button
											key={index}
											variant="outline"
											title={message}
											className="h-auto w-full py-3 px-5 justify-start text-left bg-background/50 border-border hover:bg-background/80 hover:text-primary transition-colors rounded-xl items-start"
											onClick={() => handleMessageClick(message)}
										>
											<span className="line-clamp-2 whitespace-normal break-words w-full">
												{message}
											</span>
										</Button>
									)
								)}
							</CardContent>
						</Card>
					</div>
				</div>

				<Separator className="my-10 bg-border/60" />
				
				<div className="text-center mt-6 flex flex-col items-center justify-center space-y-5 pb-2">
					<div className="text-lg font-medium text-foreground">
						Get Your Own Message Board
					</div>
					<Link 
						href={'/sign-up'}
						className="inline-flex items-center justify-center h-12 px-8 bg-white hover:bg-gray-200 text-black font-bold rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)]"
					>
						Create Your Account
					</Link>
				</div>
			</div>
		</div>
	);
}
