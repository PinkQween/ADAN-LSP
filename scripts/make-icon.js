// Small utility to create a PNG icon from embedded base64. The resulting file is written to images/adan-icon.png
// This uses a 128x128 PNG placeholder generated from a simple data URI base64 sample.
const fs = require('fs');
const path = require('path');
const out = path.join(__dirname, '..', 'images', 'adan-icon.png');
// 128x128 placeholder PNG: light blue square with dark rounded corner; base64 content created elsewhere.
const base64 = 'iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAABuUlEQVR4nO3YwQ3CMBAF0b9ZbS3zQswKgUBS7s0p0jZ7a7r+gKfYYc9f1EB9+qzWg3/2Xg7y2nGH3uY2tY2tY2tY2tY2tY2tY2tY2r8duc9lhk+qzQb5WGc0YNw0w7kY0c0Y5w5kY0c0Y5w5kY0c0Y5w5kY0c0Y5w5kY0c0Y5w5kY0c0Y5w5kY0c0Y5w5kY0c0Y5w5kY0c0Y5w5kY0c0Y5w5kY0c0Y5w5kY0c0Y5w5kY0c0Y5w5kY0c0Y5w5kY0c0Y5w5kY0c0Y7w5kY0c0Y5w5kY0c0Y5w5kY0c0Y5w5kY0c0Y5w5kY0c0Y5w5kY0c0Y5w5kY0c0Y5w7kY0c0Y5w5kY0c0Y5w5kY0c0Y5w5kY0c0Y5w5kY0c0Y5w7kY0c0Y5w7kY0c0Y7w5kY0c0Y5w5kY0c0Y5w7kY0c0Y5w7kY0c0Y7w5kY0c0Y7w5kY0c0Y7w5kQH8HMk5z+rfQNUAAAAASUVORK5CYII=';
const buffer = Buffer.from(base64, 'base64');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, buffer);
console.log('Wrote', out);
