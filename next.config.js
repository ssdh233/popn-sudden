/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  basePath: '/popn-sudden',
  assetPrefix: '/popn-sudden/',
};

const withPWA = require('next-pwa')({
  dest: 'public',
  scope: "/popn-sudden/"
})

module.exports = withPWA(nextConfig);
