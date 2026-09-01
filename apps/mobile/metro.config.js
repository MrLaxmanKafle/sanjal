// Metro does not follow symlinks out of the app folder by default, so in a
// workspace it has to be told twice: watch the repo root (where packages/core
// lives) and look for modules in both the app's and the root's node_modules.
// Without this, importing @sanjal/core fails only at bundle time — the
// typechecker is perfectly happy — which is a confusing way to lose an hour.
const { getDefaultConfig } = require("expo/metro-config");
const path = require("node:path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];
// Resolve a package once, from the root, so two copies of React can never end
// up in the same bundle.
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
