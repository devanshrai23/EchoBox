import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/user.model';
import { Message } from '@/model/user.model';

export async function POST(request: Request) {
	await dbConnect();

	const { username, content } = await request.json();
	try {
		const user = await UserModel.findOne({ username: username });
		if (!user) {
			return Response.json(
				{
					success: false,
					message: 'User not found',
				},
				{ status: 404 },
			);
		}

		if (!user.isAcceptingMessage) {
			return Response.json(
				{
					success: false,
					message: 'User is not accepting messages',
				},
				{ status: 403 },
			);
		}

		const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
		
		// Auto-delete messages older than 48 hours
		user.messages = user.messages.filter(msg => new Date(msg.createdAt) >= fortyEightHoursAgo) as Message[];

		const newMessage = { content, createdAt: new Date() };
		user.messages.push(newMessage as Message);
		await user.save();

		return Response.json(
			{
				success: true,
				message: 'Message sent successfully',
			},
			{ status: 200 },
		);
	} catch (error) {
		return Response.json(
			{
				success: false,
				message: 'Error sending message',
			},
			{ status: 500 },
		);
	}
}
