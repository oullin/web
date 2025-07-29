import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AliasOptions } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const aliases: AliasOptions = [
    { find: /^~.+/, replacement: '$1' },
    { find: '@', replacement: path.resolve(__dirname, './src') },
    { find: '@css', replacement: path.resolve(__dirname, './src/css') },
    { find: '@pages', replacement: path.resolve(__dirname, './src/pages') },
    { find: '@fonts', replacement: path.resolve(__dirname, './src/fonts') },
    { find: '@images', replacement: path.resolve(__dirname, './src/images') },
    { find: '@public', replacement: path.resolve(__dirname, './src/public') },
    { find: '@partials', replacement: path.resolve(__dirname, './src/partials') },
    { find: '@stores', replacement: path.resolve(__dirname, './src/stores') },
    { find: '@api', replacement: path.resolve(__dirname, './src/stores/api') },
];

export default aliases;
