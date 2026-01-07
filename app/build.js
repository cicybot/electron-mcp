// build.js
const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const srcContent = path.join(__dirname, 'src', 'content.js');
const distContent = path.join(__dirname, 'dist', 'content.js');

esbuild.build({
    entryPoints: ['src/main.js'],
    bundle: true,
    platform: 'node',
    outfile: 'dist/main.js',
    external: ['electron'],
    minify: false,
    sourcemap: true
}).then(() => {
    console.log('Build finished');

    // Copy content.js to dist
    fs.copyFile(srcContent, distContent, (err) => {
        if (err) {
            console.error('Failed to copy content.js:', err);
        } else {
            console.log('content.js copied to dist');
        }
    });

}).catch(() => process.exit(1));
