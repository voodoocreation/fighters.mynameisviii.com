const fs = require("fs");
const path = require("path");
const util = require("util");
const ServiceWorkerPlugin = require("serviceworker-webpack-plugin");
const withSass = require("@zeit/next-sass");
const FilterWarningsPlugin = require("webpack-filter-warnings-plugin");

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

module.exports = withSass({
  distDir: "dist",
  exportTrailingSlash: true,
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
      new FilterWarningsPlugin({
        exclude: /Conflicting order between:/
      }),

      new ServiceWorkerPlugin({
        entry: path.join(__dirname, "appService.js"),
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

    return config;
  }
});
