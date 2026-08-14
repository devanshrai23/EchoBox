'use client';

import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDebounceValue } from 'usehooks-ts';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signUpSchema';

export default function SignUpForm() {
	const [username, setUsername] = useState('');
	const [usernameMessage, setUsernameMessage] = useState('');
	const [isCheckingUsername, setIsCheckingUsername] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [debouncedUsername] = useDebounceValue(username, 300);

	const router = useRouter();

	const form = useForm<z.infer<typeof signUpSchema>>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			username: '',
			email: '',
			password: '',
		},
	});

	useEffect(() => {
		const checkUsernameUnique = async () => {
			if (debouncedUsername) {
				setIsCheckingUsername(true);
				setUsernameMessage('');
				try {
					const response = await axios.get<ApiResponse>(
						`/api/check-unique-username?username=${debouncedUsername}`,
					);
					setUsernameMessage(response.data.message);
				} catch (error) {
					const axiosError = error as AxiosError<ApiResponse>;
					setUsernameMessage(
						axiosError.response?.data.message ?? 'Error checking username',
					);
				} finally {
					setIsCheckingUsername(false);
				}
			}
		};
		checkUsernameUnique();
	}, [debouncedUsername]);

	const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
		setIsSubmitting(true);
		try {
			const response = await axios.post<ApiResponse>('/api/sign-up', data);

			toast.add({
				title: 'Success',
				description: response.data.message,
			});

			router.replace(`/verify/${username}`);
			setIsSubmitting(false);
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			const errorMessage = axiosError.response?.data.message ?? 'There was a problem with your sign-up. Please try again.';

			toast.add({
				title: 'Sign Up Failed', 
				description: errorMessage,
				type: 'error',
			});

			setIsSubmitting(false);
		}
	};

	return (
		<div className="flex justify-center items-center min-h-[calc(100vh-80px)] bg-background px-4 py-12">
			<div className="w-full max-w-md p-8 space-y-8 bg-card/50 backdrop-blur-xl border border-border rounded-3xl shadow-2xl">
				<div className="text-center">
					<h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3 text-white">
						Join Spillit
					</h1>
					<p className="text-muted-foreground">Sign up to start your anonymous adventure</p>
				</div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
						<FormField
							name="username"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-foreground">Username</FormLabel>
									<Input
										className="bg-input/50 border-border focus-visible:ring-primary h-11 transition-all"
										{...field}
										onChange={(e) => {
											field.onChange(e);
											setUsername(e.target.value);
										}}
									/>
									{isCheckingUsername && <Loader2 className="animate-spin h-4 w-4 mt-2 text-primary" />}
									{!isCheckingUsername && usernameMessage && (
										<p
											className={`text-sm mt-2 font-medium ${
												usernameMessage.toLowerCase() === 'username is unique'
													? 'text-emerald-400'
													: 'text-destructive'
											}`}
										>
											{usernameMessage}
										</p>
									)}
									<FormMessage className="text-destructive/90" />
								</FormItem>
							)}
						/>
						<FormField
							name="email"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-foreground">Email</FormLabel>
									<Input className="bg-input/50 border-border focus-visible:ring-primary h-11 transition-all" {...field} name="email" />
									<p className="text-muted-foreground text-xs mt-1">We will send you a verification code</p>
									<FormMessage className="text-destructive/90" />
								</FormItem>
							)}
						/>

						<FormField
							name="password"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-foreground">Password</FormLabel>
									<Input className="bg-input/50 border-border focus-visible:ring-primary h-11 transition-all" type="password" {...field} name="password" />
									<FormMessage className="text-destructive/90" />
								</FormItem>
							)}
						/>
						<Button type="submit" className="w-full h-11 mt-4 text-base bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all shadow-lg shadow-primary/20" disabled={isSubmitting}>
							{isSubmitting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Creating Account...
								</>
							) : (
								'Create Account'
							)}
						</Button>
					</form>
				</Form>
				<div className="text-center mt-6">
					<p className="text-muted-foreground text-sm">
						Already a member?{' '}
						<Link href="/sign-in" className="text-primary hover:text-primary/80 font-medium transition-colors">
							Sign in
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
