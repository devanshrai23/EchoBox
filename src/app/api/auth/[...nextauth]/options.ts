import {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/user.model";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials : any): Promise<any>{
                await dbConnect();
                try{
                    const user = await userModel.findOne({
                        $or: [
                            { email: credentials.email },
                            { username: credentials.email }
                        ]
                    });
                    if(!user){
                        throw new Error("User not found");
                    }
                    if(!user.isVerified){
                        throw new Error("User not verfied");
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
                    if(isPasswordCorrect){
                        return user;
                    }
                    else{
                        throw new Error("Invalid password");
                    }
                }
                catch(err : any){
                    throw new Error(err.message);
                }
            }
        })
    ],
    callbacks:{
        async session({session, token}){
            if(token){
                session.user._id = token._id;
                session.user.username = token.username;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
            }
            return session;
        },
        async jwt({token, user}){
            if(user){
                token._id = user._id?.toString();
                token.username = user.username;
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
            }
            return token;
        }
    },
    pages:{
        signIn: "/sign-in"
    },
    session:{
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
}