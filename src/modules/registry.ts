import fs from 'fs';
import path from 'path';

const modulesDir = path.join(__dirname);
const moduleFolders = fs.readdirSync(modulesDir).filter(f => fs.statSync(path.join(modulesDir, f)).isDirectory());

const registry = moduleFolders.map(folder => {
  const configPath = path.join(modulesDir, folder, 'module.json');
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  }
  return null;
}).filter(Boolean);

export default registry; 