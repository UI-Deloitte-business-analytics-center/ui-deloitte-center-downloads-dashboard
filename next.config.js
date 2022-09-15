/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // Add any logic you want here, returning `true` to enable password protect.
    PASSWORD_PROTECT: process.env.ENVIRONMENT === "production",
  },
};

module.exports = nextConfig;
