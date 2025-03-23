/**
 * @fileoverview This file configures NextAuth for authentication using AWS Cognito.
 * It defines providers, callbacks, and session handling for the application.
 */

import NextAuth from "next-auth";
import { authOptions } from "./authOptions"; // Import authOptions from the new file

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
