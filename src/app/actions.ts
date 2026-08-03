'use server';

import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

export async function deleteMessage(messageId: string) {
	// TODO: implement delete logic in database
	console.log('Deleting message:', messageId);
	return { success: true };
}

export async function toggleAcceptMessages(acceptMessages: boolean) {
	// TODO: implement in database
	console.log('Toggling accept messages to:', acceptMessages);
	return { success: true };
}

export async function sendMessage(username: string, content: string) {
	// TODO: implement in database
	console.log(`Sending message to ${username}:`, content);
	return { success: true, message: 'Message sent successfully' };
}

export async function suggestMessages() {
	try {
		const { text } = await generateText({
			model: google('gemini-1.5-pro-latest'),
			prompt: "Create a list of 3 open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous messaging platform, like 'What's a secret talent you have?'. Do not include quotes or numbering.",
		});
		return { success: true, text };
	} catch (error) {
		console.error('Error generating messages:', error);
		return {
			success: false,
			text: "What's your favorite movie?||Do you have any pets?||What's your dream job?",
		};
	}
}
