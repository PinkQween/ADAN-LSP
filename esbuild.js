const esbuild = require("esbuild");

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

const buildOptions = {
  entryPoints: ['src/extension.ts'],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  outfile: 'dist/extension.js',
  minify: production,
  sourcemap: !production,
  external: ['vscode', 'tree-sitter', 'tree-sitter-adan'],
  logLevel: 'silent',
  plugins: [
    {
      name: 'esbuild-problem-matcher',
      setup(build) {
        build.onStart(() => console.log('[watch] build started'));
        build.onEnd(result => {
          result.errors.forEach(err => {
            console.error(`✘ [ERROR] ${err.text}`);
            if (err.location) {
              console.error(`    ${err.location.file}:${err.location.line}:${err.location.column}`);
            }
          });
          console.log('[watch] build finished');
        });
      },
    },
  ],
};

async function main() {
  if (watch) {
    const ctx = await esbuild.context(buildOptions);
    await ctx.watch();  // ctx.watch() is correct, no rebuild needed
  } else {
    await esbuild.build(buildOptions);
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
