const path = require('path');
const blacklist = require('metro/src/blacklist');
const escape = require('escape-string-regexp');

module.exports = {
  getProjectRoots() {
    return [__dirname, path.resolve(__dirname, '../..')];
  },
  getProvidesModuleNodeModules() {
    return ['react-native', 'react', 'prop-types', 'react-router-native'];
  },
  getBlacklistRE() {
    return blacklist([
      new RegExp(`^${escape(path.resolve(__dirname, '../..', 'node_modules'))}\\/.*$`),
      new RegExp(`^${escape(path.resolve(__dirname, '..', 'Usage/node_modules'))}\\/.*$`),
      new RegExp(`^${escape(path.resolve(__dirname, '..', 'SimpleStack/node_modules'))}\\/.*$`),
      new RegExp(`^${escape(path.resolve(__dirname, '..', 'Cube/node_modules'))}\\/.*$`),
      new RegExp(`^${escape(path.resolve(__dirname, 'node_modules'))}\\/.*/node_modules\\/.*$`),
    ]);
  },
};
