// This file prevents the Strapi build from walking up the directory tree
// and finding the root postcss.config.js (which requires autoprefixer from the frontend).
module.exports = {};
