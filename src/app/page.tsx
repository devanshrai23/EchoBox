'use client';

import { Mail, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
	return (
		<main className="flex-grow flex flex-col bg-background text-foreground overflow-hidden">
			{/* Hero Section */}
			<section className="relative flex flex-col items-center justify-center px-6 py-24 md:py-32 text-center min-h-[80vh]">
				{/* Background Glow */}
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

				<div className="relative z-10 max-w-3xl space-y-8">
					<div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
						<Sparkles className="h-4 w-4 mr-2" />
						Now powered by Gemini AI
					</div>
					
					<h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white drop-shadow-sm">
						Send and receive <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">honest</span>, anonymous messages.
					</h1>
					
					<p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
						Echobox is your secret space for unfiltered feedback. Share your unique link, get real thoughts from friends, and use AI to spark amazing conversations.
					</p>

					<div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
						<Link href="/sign-up" className="w-full sm:w-auto">
							<Button size="lg" className="w-full sm:w-auto text-base rounded-full px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:scale-105">
								Get Started <ArrowRight className="ml-2 h-4 w-4" />
							</Button>
						</Link>
						<Link href="/sign-in" className="w-full sm:w-auto">
							<Button variant="outline" size="lg" className="w-full sm:w-auto text-base rounded-full px-8 border-border bg-card/50 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground transition-all">
								Sign In
							</Button>
						</Link>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="relative px-6 py-24 bg-card/30 border-t border-border backdrop-blur-md">
				<div className="max-w-5xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to connect</h2>
						<p className="text-muted-foreground text-lg">Powerful features wrapped in a beautiful, secure interface.</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{/* Feature 1 */}
						<div className="p-8 rounded-3xl bg-card border border-border shadow-xl hover:border-primary/50 transition-colors group">
							<div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
								<Mail className="h-6 w-6 text-primary" />
							</div>
							<h3 className="text-xl font-semibold mb-3">Anonymous Message Board</h3>
							<p className="text-muted-foreground leading-relaxed">
								Get your own personal link to share on social media. Anyone can send you a message without revealing their identity.
							</p>
						</div>

						{/* Feature 2 */}
						<div className="p-8 rounded-3xl bg-card border border-border shadow-xl hover:border-primary/50 transition-colors group">
							<div className="h-12 w-12 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
								<Sparkles className="h-6 w-6 text-blue-400" />
							</div>
							<h3 className="text-xl font-semibold mb-3">AI-Suggested Prompts</h3>
							<p className="text-muted-foreground leading-relaxed">
								Writer's block? Visitors can click a button to have Google's Gemini AI generate unique, engaging questions to ask you instantly.
							</p>
						</div>

						{/* Feature 3 */}
						<div className="p-8 rounded-3xl bg-card border border-border shadow-xl hover:border-primary/50 transition-colors group">
							<div className="h-12 w-12 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
								<ShieldCheck className="h-6 w-6 text-purple-400" />
							</div>
							<h3 className="text-xl font-semibold mb-3">Full Message Control</h3>
							<p className="text-muted-foreground leading-relaxed">
								You are in control. Easily toggle your profile to stop accepting new messages at any time, straight from your private dashboard.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="text-center py-8 border-t border-border text-sm text-muted-foreground bg-background">
				© {new Date().getFullYear()} Echobox. Designed with 💜
			</footer>
		</main>
	);
}
