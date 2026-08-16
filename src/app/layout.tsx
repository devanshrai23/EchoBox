import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/context/AuthProvider';
import Navbar from '@/components/Navbar';
import { Toaster } from '@/components/ui/toast';
import { Analytics } from '@vercel/analytics/next';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Spillit',
	description: 'Send and receive honest, anonymous messages.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
		>
			<body className="min-h-full flex flex-col">
				<AuthProvider>
					<Navbar />
					{children}
					<Toaster />
				</AuthProvider>
				<Analytics />
			</body>
		</html>
	);
}
