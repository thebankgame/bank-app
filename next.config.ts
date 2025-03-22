import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects: async () => {
    return [
      {
        source: "/api/sso/logout",
        destination: `${process.env.COGNITO_DOMAIN}/logout?client_id=${process.env.COGNITO_CLIENT_ID}&logout_uri=${process.env.OAUTH_SIGN_OUT_REDIRECT_URL}&redirect_uri=${process.env.OAUTH_SIGN_IN_REDIRECT_URL}&response_type=code`,
        // destination: process.env.COGNITO_LOGOUT_URL, // the logout url from the sso provider
        permanent: false,
      },
    ];
  },};

export default nextConfig;
