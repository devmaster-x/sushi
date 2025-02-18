import LogtoClient from '@logto/next';

export const logtoClient = new LogtoClient({
  endpoint: 'https://3rhrf0.logto.app/',
  appId: 'd6o1em2njgoyu1p2qox15',
  appSecret: 'TqRd2EfCz1xFKYBGp3PyM0jRbv1vg39I',
  baseUrl: 'https://sushi-fest.vercel.app/', // Change to your own base URL
  // baseUrl: 'http://localhost:3000/', // Change to your own base URL
  cookieSecret: 'GS3fXmWmARc0s7E98BkEaE9E3phFhmSW', // Auto-generated 32 digit secret
  cookieSecure: process.env.NODE_ENV === 'production',
});