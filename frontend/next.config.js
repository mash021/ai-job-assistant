/**
 * Next.js configuration.
 *
 * `output: "standalone"` produces a self-contained build that copies only the
 * files needed to run the app. This keeps the production Docker image small.
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
};

module.exports = nextConfig;
