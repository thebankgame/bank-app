/**
 * @fileoverview Middleware for handling authentication and authorization using NextAuth.
 */

import { withAuth } from "next-auth/middleware";

/**
 * Middleware function for handling authentication.
 *
 * @param {Request} req - The incoming request object.
 */
export default withAuth(
  function middleware() {
    // No-op
  },
  {
    callbacks: {
      /**
       * Callback to determine if the user is authorized.
       *
       * @param {Object} param - The callback parameter.
       * @param {Object} param.token - The user's token.
       * @returns {boolean} True if the user is authorized, false otherwise.
       */
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/",
    },
  }
);

/**
 * Configuration for the middleware.
 *
 * @type {Object}
 * @property {string[]} matcher - The routes to which the middleware applies.
 */
export const config = {
  matcher: ["/dashboard"],
};
