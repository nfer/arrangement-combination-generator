const { GitRevisionPlugin } = require('git-revision-webpack-plugin');
const Package = require('./package.json');

module.exports = {
  publicPath: '/arrangement-combination-generator',
  chainWebpack: (config) => {
    config.plugin('define').tap((definitions) => {
      const gitRevisionPlugin = new GitRevisionPlugin({ branch: true });
      const commit = gitRevisionPlugin.commithash().substring(0, 8);
      const branch = gitRevisionPlugin.branch();
      const buildTime = new Date().toString();
      Object.assign(definitions[0]['process.env'], {
        GIT_VERSION: JSON.stringify(`${branch}-${commit}`),
        GIT_BRANCH: JSON.stringify(branch),
        GIT_COMMIT: JSON.stringify(commit),
        PROJ_VERSION: JSON.stringify(Package.version),
        BUILD_TIME: JSON.stringify(buildTime),
      });
      return definitions;
    });
  },
};
