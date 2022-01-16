module.exports = {
  reactStrictMode: true,
  distDir: "build",
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: {
        // for webpack 5 use
        and: [/\.(js|ts)x?$/],
      },
      use: ["@svgr/webpack"],
    });
    config.module.rules.push({
      test: /\.md$/,
      use: ["ignore-loader"],
    });

    return config;
  },
};
