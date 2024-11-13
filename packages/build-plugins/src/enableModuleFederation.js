const { NextFederationPlugin } = require("@module-federation/nextjs-mf");

/**
 * Adds the Module Federation config as per the APP
 *
 * @template T
 * @param {T & { appName?: string, exposes?: any, shared?: any, remotes?: any, capeExtraOptions?: any, webpack?: any }} nextConfig
 * @returns {Omit<T, "exposes" | "shared" | "capeExtraOptions">}
 */
function enableModuleFederation({
  exposes = {},
  shared = {},
  remotes = {},
  capeExtraOptions: extraOptions = {},
  ...nextConfig
}) {
  const { appName } = nextConfig;

  if (!appName) {
    throw new Error("appName is required to enable Module Federation");
  }

  const currentWebpackFn = nextConfig.webpack;
  const MFConfig = {
    name: appName,
    filename: "static/chunks/remoteEntry.js",
    extraOptions: {
      debug: true,
      ...extraOptions,
    },
    exposes,
    shared,
    remotes,
  };
  nextConfig.webpack = function webpack(
    /** @type {any} */ baseConfig,
    /** @type {any} */ options,
  ) {
    let newConfig = baseConfig;
    if (currentWebpackFn) newConfig = currentWebpackFn(baseConfig, options);
    if (!newConfig.plugins) newConfig.plugins = [];
    newConfig.plugins.push(new NextFederationPlugin(MFConfig));
    return newConfig;
  };

  return nextConfig;
}

module.exports = {
  enableModuleFederation,
};
