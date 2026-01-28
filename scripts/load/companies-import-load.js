/**
 * Load test scaffold for Companies bulk import.
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... NODE_ENV=production \
 *   node scripts/load/companies-import-load.js --rows 5000 --batch 1000
 */
import { createClient } from '@supabase/supabase-js';

const args = process.argv.slice(2);
const getArg = (key, fallback) => {
  const idx = args.indexOf(key);
  if (idx === -1) return fallback;
  return args[idx + 1] ?? fallback;
};

const totalRows = Number(getArg('--rows', '5000'));
const batchSize = Number(getArg('--batch', '1000'));

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env var.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

const buildRow = (index) => ({
  name: `Load Company ${index}`,
  cin: `LOAD-${String(index).padStart(6, '0')}`,
  website: `https://company-${index}.example.com`,
  email: `company-${index}@example.com`,
});

const run = async () => {
  const rows = Array.from({ length: totalRows }, (_, i) => buildRow(i + 1));
  let inserted = 0;

  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const { data, error } = await supabase.rpc('import_companies_bulk', {
      p_rows: batch,
      p_owner_type: 'platform',
      p_tenant_id: null,
      p_skip_duplicates: true,
    });

    if (error) {
      console.error('Batch failed:', error.message);
      break;
    }

    inserted += data?.inserted ?? 0;
    console.log(`Batch ${i / batchSize + 1}: inserted ${data?.inserted ?? 0}`);
  }

  console.log(`Done. Inserted ${inserted} records.`);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

