import { loginAction } from "@/lib/auth";
import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import NextAuth from "next-auth/next";
import Credentials from "next-auth/providers/credentials";

// Define the authentication options
const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        Credentials({
            type: 'credentials',
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
                device_id: { label: 'Device ID', type: 'text' },
            },
            authorize: async (credentials) => {
                const { email, password, device_id } = credentials;
                
                // Call the login action to authenticate the user
                const user = await loginAction({ email, password, device_id });
                
                if (user) {
                    return user; // Return user object on successful authentication
                } else {
                    return null; // Return null on failure
                }
            }
        })
    ],
    pages: {
        signIn: '/login', // Custom sign-in page
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.access_token = {
                    token_type: user.token_type,
                    token: user.access_token,
                };
                token.user = user.data_customer; // Add user data to token
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.access_token = token.access_token;
                session.user = token.user; // Add token data to session
            }
            return session;
        }
    }
};

// Initialize NextAuth with the defined options
const handler = NextAuth(authOptions);

// Export handler for GET and POST requests
export { handler as GET, handler as POST };
