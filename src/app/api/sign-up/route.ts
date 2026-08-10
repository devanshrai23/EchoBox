import dbConnect from '@/lib/dbConnect';
import userModel from '@/model/user.model';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/helpers/sendVerificationEmail';

export async function POST(request: Request) {
	await dbConnect();

	try {
		const { username, email, password } = await request.json();

		const existingUserVerifiedByUsername = await userModel.findOne({
			username,
			isVerified: true,
		});
		if (existingUserVerifiedByUsername) {
			return new Response(
				JSON.stringify({
					success: false,
					message: 'Username already exists',
				}),
				{ status: 400 },
			);
		}

		const existingUserByEmail = await userModel.findOne({ email });
		const verifyCode = Math.floor(
			100000 + Math.random() * 900000,
		).toString(); // Generate a 6-digit verification code
		if (existingUserByEmail) {
			if (existingUserByEmail.isVerified) {
				return new Response(
					JSON.stringify({
						success: false,
						message: 'Email already exists with this email',
					}),
					{ status: 400 },
				);
			} else {
				const hashedPassword = await bcrypt.hash(
					password,
					10,
				);
				existingUserByEmail.password = hashedPassword;
				existingUserByEmail.username = username;
				existingUserByEmail.verifyCode = verifyCode;
				existingUserByEmail.verifyCodeExpiry = new Date(
					Date.now() + 60 * 60 * 1000,
				); // Set expiry to 1 hour from now

				await existingUserByEmail.save();
			}
		} else {
			const hashedPassword = await bcrypt.hash(password, 10);
			const expiryDate = new Date();
			expiryDate.setHours(expiryDate.getHours() + 1); // Set expiry to 1 hour from now
			const newUser = new userModel({
				username,
				email,
				password: hashedPassword,
				verifyCode,
				verifyCodeExpiry: expiryDate,
				isVerified: false,
				isAcceptingMessage: true,
				messages: [],
			});

			await newUser.save();
		}

		// Send Verification Email for both new users and unverified existing users
		const emailResponse = await sendVerificationEmail(
			email,
			username,
			verifyCode,
		);
		if (!emailResponse.success) {
			return new Response(
				JSON.stringify({
					success: false,
					message: emailResponse.message,
				}),
				{ status: 500 },
			);
		}

		return new Response(
			JSON.stringify({
				success: true,
				message: 'User registered successfully. Verification email sent.',
			}),
			{ status: 201 },
		);
	} catch (error) {
		console.error('Error in sign-up route:', error);
		return new Response(
			JSON.stringify({
				success: false,
				message: 'Internal server error',
			}),
			{ status: 500 },
		);
	}
}
