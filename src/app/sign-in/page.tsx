'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/toast';
import { signInSchema } from '@/schemas/signInSchema';

export default function SignInForm() {
	const router = useRouter();

	const form = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			identifier: '',
			password: '',
		},
	});

	const onSubmit = async (data: z.infer<typeof signInSchema>) => {
		const result = await signIn('credentials', {
			redirect: false,
			identifier: data.identifier,
			password: data.password,
		});

		if (result?.error) {
			if (result.error === 'CredentialsSignin') {
				toast.add({
					title: 'Login Failed',
					description: 'Incorrect username or password',
					type: 'error',
				});
			} else {
				toast.add({
					title: 'Error',
					description: result.error,
					type: 'error',
				});
			}
		}

		if (result?.url) {
			router.replace('/dashboard');
		}
	};

	return (
		<div className="flex justify-center items-center min-h-[calc(100vh-80px)] bg-background px-4 py-12">
			<div className="w-full max-w-md p-8 space-y-8 bg-card/50 backdrop-blur-xl border border-border rounded-3xl shadow-2xl">
				<div className="text-center">
					<h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3 text-white">
						Welcome Back
					</h1>
					<p className="text-muted-foreground">Sign in to continue your secret conversations</p>
				</div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
						<FormField
							name="identifier"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-foreground">Email or Username</FormLabel>
									<Input className="bg-input/50 border-border focus-visible:ring-primary h-11 transition-all" {...field} />
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
									<Input className="bg-input/50 border-border focus-visible:ring-primary h-11 transition-all" type="password" {...field} />
									<FormMessage className="text-destructive/90" />
								</FormItem>
							)}
						/>
						<Button className="w-full h-11 mt-4 text-base bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all shadow-lg shadow-primary/20" type="submit">Sign In</Button>
					</form>
				</Form>
				<div className="text-center mt-6">
					<p className="text-muted-foreground text-sm">
						Not a member yet?{' '}
						<Link href="/sign-up" className="text-primary hover:text-primary/80 font-medium transition-colors">
							Sign up
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
