import { readFile } from 'fs/promises';
import path from 'path';

export const license = () => readFile(path.join(__dirname, '../../LICENSE'), { encoding: 'utf8' });
