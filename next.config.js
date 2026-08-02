/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // fluent-ffmpeg and @ffmpeg-installer/ffmpeg resolve their platform
  // binary via a dynamic require that webpack can't statically bundle --
  // keeping them external lets Node's own require resolve them at runtime
  // instead.
  experimental: {
    serverComponentsExternalPackages: ["fluent-ffmpeg", "@ffmpeg-installer/ffmpeg"],
  },
};

module.exports = nextConfig;
