// Load the native tree-sitter binding
const path = require('path');
const fs = require('fs');

let binding;
try {
  // Try to load using node-gyp-build (it looks for binding.gyp in the directory)
  const nodeGypBuild = require('node-gyp-build');
  binding = nodeGypBuild(__dirname);
} catch (e) {
  // Fallback: try to require the binding directly from build directory
  try {
    binding = require(path.join(__dirname, 'build', 'Release', 'tree_sitter_adan_binding.node'));
  } catch (e2) {
    throw new Error('tree-sitter-adan native binding not found. Please run "npm install" in the syntax/tree-sitter directory to build the binding. Error: ' + e.message);
  }
}

// Load highlight queries if they exist
const queriesDir = path.join(__dirname, 'queries');
const queries = {
  HIGHLIGHTS_QUERY: 'highlights.scm',
  INJECTIONS_QUERY: 'injections.scm',
  LOCALS_QUERY: 'locals.scm',
  TAGS_QUERY: 'tags.scm',
};

for (const [prop, filename] of Object.entries(queries)) {
  const queryPath = path.join(queriesDir, filename);
  if (fs.existsSync(queryPath)) {
    Object.defineProperty(binding, prop, {
      configurable: true,
      enumerable: true,
      get() {
        try {
          return fs.readFileSync(queryPath, 'utf8');
        } catch {
          return '';
        }
      }
    });
  }
}

// The binding exports { language } and query properties
module.exports = binding;
