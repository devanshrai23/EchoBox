'use client';

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
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { verifySchema } from '@/schemas/verifySchema';
import React from 'react';

export default function VerifyAccount() {
	const router = useRouter();
	const params = useParams<{ username: string }>();
	const form = useForm<z.infer<typeof verifySchema>>({
		resolver: zodResolver(verifySchema),
		defaultValues: {
			verifyCode: ''
		}
	});

	const onSubmit = async (data: z.infer<typeof verifySchema>) => {
		try {
			const response = await axios.post<ApiResponse>(`/api/verify-code`, {
				username: params.username,
				code: data.verifyCode,
			});

			toast.add({
				title: 'Success',
				description: response.data.message,
			});

			router.replace('/sign-in');
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			toast.add({
				title: 'Verification Failed',
				description:
					axiosError.response?.data.message ??
					'An error occurred. Please try again.',
				type: 'error',
			});
		}
	};

	return (
		<div className="flex justify-center items-center min-h-[calc(100vh-80px)] bg-background px-4 py-12">
			<div className="w-full max-w-md p-8 space-y-8 bg-card/50 backdrop-blur-xl border border-border rounded-3xl shadow-2xl">
				<div className="text-center">
					<h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3 text-white">
						Verify Account
					</h1>
					<p className="text-muted-foreground">Enter the verification code sent to your email</p>
				</div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<FormField
							name="verifyCode"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-foreground">Verification Code</FormLabel>
									<Input className="bg-input/50 border-border focus-visible:ring-primary h-11 text-center text-lg tracking-widest transition-all" {...field} placeholder="000000" />
									<FormMessage className="text-destructive/90" />
								</FormItem>
							)}
						/>
						<Button type="submit" className="w-full h-11 mt-4 text-base bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all shadow-lg shadow-primary/20">Verify</Button>
					</form>
				</Form>
			</div>
		</div>
	);
}
