'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';

export default function Navbar() {
	const { data: session } = useSession();
	const user = session?.user;

	return (
		<nav className="p-4 md:p-6 sticky top-0 z-50 w-full border-b border-border bg-background/60 backdrop-blur-md supports-[backdrop-filter]:bg-background/40">
			<div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
				<Link
					href="/"
					className="text-xl font-bold mb-4 md:mb-0"
				>
					EchoBox
				</Link>
				{session ? (
					<div className="flex items-center gap-4">
						<span className="mr-4">
							Welcome,{' '}
							{user?.username ||
								user?.email}
						</span>
						<Button
							onClick={() => signOut()}
							className="w-full md:w-auto rounded-full"
							variant="secondary"
						>
							Logout
						</Button>
					</div>
				) : (
					<Link href="/sign-in">
						<Button
							className="w-full md:w-auto rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
						>
							Login
						</Button>
					</Link>
				)}
			</div>
		</nav>
	);
}
