const postcssEasyImport = require("postcss-easy-import");
const autoprefixer = require("autoprefixer");
const postcssMqpacker = require("css-mqpacker");

module.exports = {
  plugins: [
    postcssMqpacker({
      sort: true
    }),
    postcssEasyImport({ prefix: "_" }),
    autoprefixer()
  ]
};
