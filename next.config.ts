import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  transpilePackages: ['three'],
  webpack: (config, { isServer }) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };

    config.output.environment = {
      ...(config.output.environment ?? {}),
      asyncFunction: true,
    };

    config.module.rules.push({
      test: /\.wasm$/,
      type: "webassembly/async",
    });

    config.output.webassemblyModuleFilename =
      isServer ? "../static/wasm/[modulehash].wasm" : "static/wasm/[modulehash].wasm";
    
    return config
  },
  turbopack: {}
};

export default nextConfig;
