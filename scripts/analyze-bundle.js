#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Analyzing bundle size and performance...\n');

// Function to run commands and capture output
function runCommand(command) {
  try {
    return execSync(command, { encoding: 'utf8' });
  } catch (error) {
    console.error(`Error running command: ${command}`);
    console.error(error.message);
    return null;
  }
}

// Function to format bytes to human readable
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Function to analyze bundle size
function analyzeBundle() {
  console.log('📦 Building project for analysis...');
  
  // Build the project
  const buildOutput = runCommand('npm run build');
  if (!buildOutput) {
    console.error('❌ Build failed');
    return;
  }
  
  console.log('✅ Build completed\n');
  
  // Analyze dist folder
  const distPath = path.join(process.cwd(), 'dist');
  if (!fs.existsSync(distPath)) {
    console.error('❌ Dist folder not found');
    return;
  }
  
  console.log('📊 Bundle Analysis:\n');
  
  // Get all files in dist
  const files = fs.readdirSync(distPath, { recursive: true });
  const jsFiles = files.filter(file => file.endsWith('.js'));
  const cssFiles = files.filter(file => file.endsWith('.css'));
  
  let totalSize = 0;
  let totalGzippedSize = 0;
  
  console.log('📁 JavaScript Files:');
  jsFiles.forEach(file => {
    const filePath = path.join(distPath, file);
    const stats = fs.statSync(filePath);
    const size = stats.size;
    const gzippedSize = Math.round(size * 0.3); // Rough estimate
    totalSize += size;
    totalGzippedSize += gzippedSize;
    
    console.log(`  ${file}: ${formatBytes(size)} (${formatBytes(gzippedSize)} gzipped)`);
  });
  
  console.log('\n🎨 CSS Files:');
  cssFiles.forEach(file => {
    const filePath = path.join(distPath, file);
    const stats = fs.statSync(filePath);
    const size = stats.size;
    const gzippedSize = Math.round(size * 0.2); // CSS compresses better
    totalSize += size;
    totalGzippedSize += gzippedSize;
    
    console.log(`  ${file}: ${formatBytes(size)} (${formatBytes(gzippedSize)} gzipped)`);
  });
  
  console.log('\n📈 Summary:');
  console.log(`  Total Size: ${formatBytes(totalSize)}`);
  console.log(`  Estimated Gzipped: ${formatBytes(totalGzippedSize)}`);
  
  // Performance recommendations
  console.log('\n💡 Performance Recommendations:');
  
  if (totalSize > 2 * 1024 * 1024) { // 2MB
    console.log('  ⚠️  Bundle is quite large (>2MB). Consider:');
    console.log('     - Implementing more aggressive code splitting');
    console.log('     - Lazy loading heavy components');
    console.log('     - Tree shaking unused dependencies');
  }
  
  if (jsFiles.length > 5) {
    console.log('  ⚠️  Many JavaScript chunks detected. Consider:');
    console.log('     - Consolidating related chunks');
    console.log('     - Using dynamic imports for route-based splitting');
  }
  
  console.log('  ✅ Consider implementing:');
  console.log('     - Service worker for caching');
  console.log('     - CDN for static assets');
  console.log('     - Image optimization');
  console.log('     - Critical CSS inlining');
}

// Function to analyze dependencies
function analyzeDependencies() {
  console.log('\n📋 Dependency Analysis:\n');
  
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  console.log('📦 Large Dependencies (>100KB estimated):');
  
  const largeDeps = [
    'react', 'react-dom', 'react-router-dom',
    'recharts', 'jspdf', 'jspdf-autotable',
    'papaparse', 'xlsx', 'reactflow',
    '@supabase/supabase-js', '@tanstack/react-query'
  ];
  
  largeDeps.forEach(dep => {
    if (dependencies[dep]) {
      console.log(`  ${dep}: ${dependencies[dep]}`);
    }
  });
  
  console.log('\n💡 Optimization Suggestions:');
  console.log('  - Use dynamic imports for heavy libraries (recharts, jspdf)');
  console.log('  - Consider lighter alternatives for some dependencies');
  console.log('  - Implement proper tree shaking');
  console.log('  - Use bundle analyzer for detailed insights');
}

// Main execution
function main() {
  analyzeBundle();
  analyzeDependencies();
  
  console.log('\n🎯 Next Steps:');
  console.log('  1. Run "npm run build" to see the optimized bundle');
  console.log('  2. Use browser dev tools to measure actual load times');
  console.log('  3. Consider implementing service worker for caching');
  console.log('  4. Monitor Core Web Vitals in production');
}

main();