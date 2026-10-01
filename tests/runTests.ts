import { TestRunner, SuiteResult, TestResult } from './testUtils';
import { registerMathEngineTests } from './mathEngine.test';
import { registerOxyzTests } from './oxyz.test';
import { registerCurriculumTests } from './curriculum.test';

async function main() {
  console.log('================================================================');
  console.log('   BỘ KIỂM THỬ TỰ ĐỘNG CÔNG THỨC & TÍNH TOÁN TOÁN HỌC LỚP 12   ');
  console.log('================================================================\n');

  const runner = new TestRunner();

  // Register all suites
  registerMathEngineTests(runner);
  registerOxyzTests(runner);
  registerCurriculumTests(runner);

  const startTime = performance.now();
  const results: SuiteResult[] = await runner.run();
  const totalDuration = performance.now() - startTime;

  let totalTests = 0;
  let totalPassed = 0;
  let totalFailed = 0;

  for (const suite of results) {
    console.log(`\n📌 [SUITE]: ${suite.suiteName}`);
    console.log('----------------------------------------------------------------');
    for (const test of suite.tests) {
      if (test.passed) {
        console.log(`  ✓ PASS: ${test.testName} (${test.durationMs.toFixed(2)}ms)`);
      } else {
        console.log(`  ✗ FAIL: ${test.testName} (${test.durationMs.toFixed(2)}ms)`);
        console.log(`    ↳ Nguyên nhân lỗi: ${test.error}`);
        if (test.expected !== undefined) {
          console.log(`    ↳ Kỳ vọng: ${JSON.stringify(test.expected)}`);
        }
        if (test.actual !== undefined) {
          console.log(`    ↳ Thực tế: ${JSON.stringify(test.actual)}`);
        }
      }
    }
    console.log(`  Tổng kết nhóm: ${suite.passed}/${suite.total} Đạt (${suite.failed} Thất bại)`);

    totalTests += suite.total;
    totalPassed += suite.passed;
    totalFailed += suite.failed;
  }

  console.log('\n================================================================');
  console.log('                    BÁO CÁO TỔNG HỢP KIỂM THỬ                  ');
  console.log('================================================================');
  console.log(`  Tổng số test cases đã chạy: ${totalTests}`);
  console.log(`  Số test cases ĐẠT (PASS)  : ${totalPassed} (${((totalPassed / totalTests) * 100).toFixed(1)}%)`);
  console.log(`  Số test cases HỎNG (FAIL) : ${totalFailed} (${((totalFailed / totalTests) * 100).toFixed(1)}%)`);
  console.log(`  Tổng thời gian thực thi   : ${totalDuration.toFixed(2)} ms`);
  console.log('================================================================\n');

  if (totalFailed > 0) {
    console.error(`❌ CẢNH BÁO: Có ${totalFailed} test case bị thất bại!`);
    process.exit(1);
  } else {
    console.log('✅ XÁC NHẬN: 100% Các công thức và hàm tính toán đều vượt qua kiểm tra độc lập!');
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('Lỗi nghiêm trọng khi thực thi bộ kiểm thử:', err);
  process.exit(1);
});
