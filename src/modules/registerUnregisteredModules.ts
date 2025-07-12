import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';

// Configure your Supabase credentials
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const modulesDir = __dirname;

async function getLocalModuleNames() {
  return fs.readdirSync(modulesDir).filter(f => {
    const fullPath = path.join(modulesDir, f);
    return fs.statSync(fullPath).isDirectory();
  });
}

async function getRegisteredModuleNames() {
  const { data, error } = await supabase
    .from('system_modules')
    .select('name');
  if (error) {
    console.error('Error fetching registered modules:', error);
    return [];
  }
  return data.map((m: any) => m.name);
}

async function registerModule(moduleName: string) {
  const { error } = await supabase
    .from('system_modules')
    .insert({
      name: moduleName,
      category: 'business', // Default, can be updated later
      description: '',
      version: '1.0.0',
      is_active: true,
      maturity_status: 'alpha',
      author: 'System',
      license: 'MIT',
      entry_point: 'index.tsx',
      required_permissions: ['read'],
      subscription_tiers: ['basic', 'pro', 'enterprise'],
      load_order: 100,
      auto_load: false,
      can_unload: true,
      hot_reload: true,
      development_stage: {
        "stage": "alpha",
        "progress": 30,
        "milestones": ["requirements_defined", "prototype_created"],
        "requirements": ["complete_development", "testing", "documentation"]
      }
    });
  if (error) {
    console.error(`Error registering module ${moduleName}:`, error);
  } else {
    console.log(`Registered new module: ${moduleName}`);
  }
}

async function main() {
  const localModules = await getLocalModuleNames();
  const registeredModules = await getRegisteredModuleNames();
  const unregistered = localModules.filter(m => !registeredModules.includes(m));

  if (unregistered.length === 0) {
    console.log('All modules are registered.');
    return;
  }

  for (const moduleName of unregistered) {
    await registerModule(moduleName);
  }

  console.log('Registration check complete.');
}

main(); 