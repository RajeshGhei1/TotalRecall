#!/usr/bin/env node

/**
 * Authentication & Access Control Test Runner
 * 
 * This script runs comprehensive tests for all authentication, access control,
 * and user management foundation modules to ensure they are rock solid.
 */

import { execSync } from 'child_process';
import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

console.log('🔐 Starting Authentication Test Suite...\n');

// Test configuration
const testConfig = {
  // Core authentication tests that should always pass
  coreTests: [
    'src/contexts/__tests__/AuthContext.test.tsx',
    'src/components/__tests__/AuthGuard.test.tsx',
    'src/components/access-control/__tests__/ModuleAccessGuard.test.tsx'
  ],
  
  // Tests that need mock fixes
  mockTests: [
    'src/components/people/__tests__/PeopleList.test.tsx',
    'src/components/people/__tests__/PersonDetailView.test.tsx',
    'src/components/people/__tests__/ContactAnalyticsDashboard.test.tsx'
  ],
  
  // Test patterns to exclude
  excludePatterns: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**'
  ]
};

// Test results storage
const testResults = {
  passed: 0,
  failed: 0,
  skipped: 0,
  total: 0,
  errors: [] as string[],
  startTime: Date.now()
};

// Utility functions
function log(message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') {
  const colors = {
    info: '\x1b[36m',    // Cyan
    success: '\x1b[32m', // Green
    error: '\x1b[31m',   // Red
    warning: '\x1b[33m', // Yellow
    reset: '\x1b[0m'     // Reset
  };
  
  console.log(`${colors[type]}${message}${colors.reset}`);
}

function runTest(testFile: string, description: string): boolean {
  try {
    log(`🧪 Running ${description}...`, 'info');
    
    const command = `npx vitest run ${testFile} --reporter=verbose --run`;
    const output = execSync(command, { 
      encoding: 'utf8',
      stdio: 'pipe',
      timeout: 30000 // 30 second timeout
    });
    
    // Parse test results
    const lines = output.split('\n');
    let passed = 0;
    let failed = 0;
    
    for (const line of lines) {
      if (line.includes('✓') || line.includes('PASS')) {
        passed++;
      } else if (line.includes('✗') || line.includes('FAIL')) {
        failed++;
      }
    }
    
    if (failed === 0) {
      log(`✅ ${description} passed (${passed} tests)`, 'success');
      testResults.passed += passed;
      return true;
    } else {
      log(`❌ ${description} failed (${failed} tests failed)`, 'error');
      testResults.failed += failed;
      testResults.errors.push(`${description}: ${failed} tests failed`);
      return false;
    }
    
  } catch (error: unknown) {
    log(`💥 ${description} crashed: ${error.message}`, 'error');
    testResults.errors.push(`${description}: ${error.message}`);
    return false;
  }
}

function generateReport(): void {
  const endTime = Date.now();
  const duration = ((endTime - testResults.startTime) / 1000).toFixed(2);
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 AUTHENTICATION TEST SUITE REPORT');
  console.log('='.repeat(60));
  
  console.log(`\n⏱️  Duration: ${duration}s`);
  console.log(`📈 Total Tests: ${testResults.total}`);
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`⏭️  Skipped: ${testResults.skipped}`);
  
  const passRate = testResults.total > 0 ? (testResults.passed / testResults.total) * 100 : 0;
  console.log(`📊 Pass Rate: ${passRate.toFixed(1)}%`);
  
  if (testResults.errors.length > 0) {
    console.log('\n🚨 ERRORS:');
    testResults.errors.forEach((error, index) => {
      console.log(`  ${index + 1}. ${error}`);
    });
  }
  
  // Generate detailed report file
  const reportPath = join(process.cwd(), 'test-results', 'auth-test-report.json');
  const report = {
    timestamp: new Date().toISOString(),
    duration: `${duration}s`,
    summary: {
      total: testResults.total,
      passed: testResults.passed,
      failed: testResults.failed,
      skipped: testResults.skipped,
      passRate: `${passRate.toFixed(1)}%`
    },
    errors: testResults.errors,
    recommendations: generateRecommendations()
  };
  
  try {
    // Ensure test-results directory exists
    execSync('mkdir -p test-results', { stdio: 'ignore' });
    writeFileSync(reportPath, JSON.stringify(report, null, 2));
    log(`📄 Detailed report saved to: ${reportPath}`, 'info');
  } catch (error) {
    log(`⚠️  Could not save detailed report: ${error}`, 'warning');
  }
  
  console.log('\n' + '='.repeat(60));
}

function generateRecommendations(): string[] {
  const recommendations = [];
  
  if (testResults.failed > 0) {
    recommendations.push('Fix failing authentication tests before deployment');
    recommendations.push('Review mock implementations for consistency');
    recommendations.push('Ensure all test dependencies are properly mocked');
  }
  
  const passRate = testResults.total > 0 ? (testResults.passed / testResults.total) * 100 : 0;
  if (passRate < 80) {
    recommendations.push('Consider improving test coverage for authentication flows');
    recommendations.push('Add integration tests for real authentication scenarios');
  }
  
  if (testResults.errors.length > 0) {
    recommendations.push('Address test setup and configuration issues');
    recommendations.push('Verify all required test utilities are available');
  }
  
  return recommendations;
}

// Main test execution
async function runAuthTestSuite(): Promise<void> {
  log('🚀 Starting Authentication Test Suite...', 'info');
  
  // Run core authentication tests
  log('\n📋 CORE AUTHENTICATION TESTS', 'info');
  log('Testing fundamental authentication and authorization components...', 'info');
  
  for (const testFile of testConfig.coreTests) {
    const description = testFile.split('/').pop()?.replace('.test.tsx', '') || testFile;
    testResults.total++;
    
    if (runTest(testFile, description)) {
      testResults.passed++;
    } else {
      testResults.failed++;
    }
  }
  
  // Run mock-dependent tests (with warnings)
  log('\n⚠️  MOCK-DEPENDENT TESTS', 'warning');
  log('These tests may fail due to mock setup issues...', 'warning');
  
  for (const testFile of testConfig.mockTests) {
    const description = testFile.split('/').pop()?.replace('.test.tsx', '') || testFile;
    testResults.total++;
    
    try {
      if (runTest(testFile, description)) {
        testResults.passed++;
      } else {
        testResults.failed++;
      }
    } catch (error) {
      log(`⏭️  Skipping ${description} due to setup issues`, 'warning');
      testResults.skipped++;
    }
  }
  
  // Generate final report
  generateReport();
  
  // Exit with appropriate code
  process.exit(testResults.failed > 0 ? 1 : 0);
}

// Handle process termination
process.on('SIGINT', () => {
  log('\n⚠️  Test suite interrupted by user', 'warning');
  generateReport();
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  log(`💥 Uncaught exception: ${error.message}`, 'error');
  testResults.errors.push(`Uncaught exception: ${error.message}`);
  generateReport();
  process.exit(1);
});

// Run the test suite
runAuthTestSuite().catch((error) => {
  log(`💥 Test suite failed to start: ${error.message}`, 'error');
  process.exit(1);
}); 