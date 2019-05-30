const fs = require("fs");
const path = require("path");
const util = require("util");
const webpack = require("webpack");
const ServiceWorkerPlugin = require("serviceworker-webpack-plugin");
const withSass = require("@zeit/next-sass");
const withTypescript = require("@zeit/next-typescript");
const PluginLodashModuleReplacement = require("lodash-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const getPages = () => {
  const paths = {
    "/": { page: "/" }
  };

  fs.readdirSync(path.join(__dirname, "src/data/games")).forEach(file => {
    const slug = file.split(".")[0];
    paths[`/games/${slug}/`] = {
      page: "/games",
      query: { slug }
    };
  });

  return paths;
};

const getFiles = (dir, files = []) => {
  const list = fs.readdirSync(dir);

  return list.reduce((acc, curr) => {
    const name = `${dir}/${curr}`;

    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files);
    } else {
      acc.push(name.replace(__dirname, "").replace(/\\/g, "/"));
    }

    return acc;
  }, files);
};

module.exports = withSass(
  withTypescript({
    distDir: "dist",
    poweredByHeader: false,
    exportPathMap: async (_, { distDir, outDir }) => {
      if (outDir) {
        await util.promisify(fs.copyFile)(
          path.join(distDir, "appService.js"),
          path.join(outDir, "appService.js")
        );
      }
      return getPages();
    },
    webpack: (config, { buildId, dev }) => {
      config.module.rules.push(
        {
          test: /\.(svg)$/,
          use: "svg-loader"
        },
        {
          test: /\.(jpg|jpeg|png)$/,
          use: "file-loader"
        },
        {
          test: /\.(yml|yaml)$/,
          use: ["json-loader", "yaml-loader"]
        }
      );

      config.plugins.push(
        new PluginLodashModuleReplacement(),

        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

        new ServiceWorkerPlugin({
          entry: path.join(__dirname, "src/services/appService.ts"),
          filename: "appService.js",
          transformOptions: swOptions => ({
            ...swOptions,
            assets: swOptions.assets
              .map(asset => `/_next${asset.replace(/\\/g, "/")}`)
              .filter(asset => asset.startsWith("/_next/static/")),
            staticFiles: [
              ...getFiles(path.join(__dirname, "static")),
              ...Object.keys(getPages())
            ],
            buildId
          })
        })
      );

      if (!dev) {
        config.plugins.push(new OptimizeCSSAssetsPlugin({}));
      }

      return config;
    }
  })
);
