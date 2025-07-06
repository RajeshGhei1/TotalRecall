import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Set your Supabase credentials
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const modulesDir = path.join(__dirname);

async function importModules() {
  const moduleFolders = fs.readdirSync(modulesDir).filter(f => {
    const fullPath = path.join(modulesDir, f);
    return fs.statSync(fullPath).isDirectory();
  });

  for (const folder of moduleFolders) {
    const configPath = path.join(modulesDir, folder, 'module.json');
    if (fs.existsSync(configPath)) {
      const moduleData = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      // Insert into Supabase
      const { error } = await supabase
        .from('system_modules') // Use your actual table name
        .insert({
          name: moduleData.name,
          description: moduleData.description || '',
          category: moduleData.category || '',
          type: moduleData.type || '',
          is_active: true,
          version: moduleData.version || '1.0.0',
          dependencies: moduleData.dependencies || [],
          default_limits: moduleData.default_limits || {},
          maturity_status: moduleData.maturity_status || 'planning',
        });
      if (error) {
        console.error(`Error inserting module ${moduleData.name}:`, error);
      } else {
        console.log(`Inserted module: ${moduleData.name}`);
      }
    }
  }
}

importModules(); 