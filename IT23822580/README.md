# Playwright Tests — Singlish → Sinhala (ITPM Assignment)

Comprehensive Playwright automation test suite for the Singlish → Sinhala translator at https://www.swifttranslator.com/, created for the IT3040 ITPM assignment.

## Project Overview

- **Test Framework**: Playwright (v1.58.0)
- **Language**: JavaScript (ES6+)
- **Test Target**: https://www.swifttranslator.com/
- **Total Tests**: 35 (24 positive + 10 negative + 1 UI)
- **Coverage**: Daily language usage, compound sentences, punctuation/numbers, names/places, mixed Singlish+English, slang, technical terms, tense variations, negation handling, error scenarios, security testing, and UI functionality

## Files Structure

```
├── tests/
│   └── itpm.spec.js              # Main test suite (35 tests)
├── package.json                   # Dependencies and npm scripts
├── itpm_testcases.csv            # Test case template (Appendix 2 format)
├── README.md                      # This file
└── playwright-report/            # HTML test report (generated after runs)
```

## Prerequisites

- **Node.js** v14.0.0 or higher (tested with v22.18.0)
- **npm** v6.0.0 or higher
- **Internet connection** (tests connect to https://www.swifttranslator.com/)
- **Windows, macOS, or Linux** (cross-platform compatible)

## Installation & Setup

### Step 1: Install Dependencies

```bash
npm install
```

This installs Playwright and all required dependencies listed in `package.json`.

### Step 2: Verify Installation

```bash
npx playwright --version
```

Expected output: Playwright version 1.58.0 or compatible.

## Running Tests

### Run All Tests (Headless Mode)
Fastest execution without opening browser windows:
```bash
npm test
```

**Output**: 
- Console shows test progress and results
- Generates HTML report in `playwright-report/` directory

### Run All Tests (Headed Mode)
Opens browser window to visualize test execution:
```bash
npm run test:headed
```

**Use case**: Debug test failures, verify translator behavior visually, understand real-time output.

### Run Specific Test
```bash
npx playwright test --grep "Pos_Fun_0004"
```

### Run Tests with Verbose Output
```bash
npx playwright test --reporter=list
```

### Open HTML Test Report
After tests complete, view detailed results:
```bash
npm run test:report
```

Opens an interactive HTML report showing:
- Passed/failed test counts
- Execution duration
- Test case names and statuses
- Console logs from each test

### Test Execution Expected Results

All 35 tests should pass:
```
35 passed (2.8m)
```

**Test Breakdown**:
- ✓ **24 Positive Tests** (Pos_Fun_0004 to Pos_Fun_0027): Verify correct Singlish → Sinhala conversion
- ✗ **10 Negative Tests** (Neg_Fun_0001 to Neg_Fun_0010): Verify robustness with edge cases (special chars, SQL injection, XSS, control chars, binary patterns)
- ◆ **1 UI Test** (Pos_UI_0001): Verify input field clearing functionality

## Test Case Coverage

### Positive Tests (24)
Test standard and complex Singlish sentences:
- Simple sentences with mixed case
- Compound sentences with time/numbers
- Questions, commands, greetings
- Technical terms (ATM, WiFi, QR code, USB, OTP, Zoom, PDF, GPS)
- Email addresses, phone numbers, currency (Rs.), dates
- Past/present/future tenses
- Slang and informal expressions
- Long technical paragraphs (L length, ≥300 characters)
- Pronoun variations (I/you/we/they)

### Negative Tests (10)
Verify app stability with invalid inputs:
- Extreme special characters
- Malformed numbers
- SQL injection attempts
- XSS (Cross-Site Scripting) payloads
- HTML markup
- URL-encoded input
- Control characters (null bytes, BEL)
- Very long repetitive input
- Multiple language scripts mixed together
- Binary pattern input

### UI Test (1)
- Input field acceptance and clearing

## CSV Test Case Template

The file `itpm_testcases.csv` contains all 35 test cases in the format required by Appendix 2:

**Columns**:
- `TestCaseID`: Unique identifier (Pos_Fun_0004, Neg_Fun_0001, etc.)
- `Test case name`: Descriptive test name
- `Input length type`: S (≤30 chars), M (31-299 chars), L (≥300 chars)
- `Input`: Test input in Singlish
- `Expected output`: Expected Sinhala translation
- `Actual output`: Captured from test run
- `Status`: Pass/Fail
- `Accuracy justification/Description`: Coverage details and issue descriptions
- `What is covered`: Tags (Daily language usage, Technical terms, Error handling, etc.)

**To use in Excel**:
1. Open `itpm_testcases.csv` with Microsoft Excel, Google Sheets, or LibreOffice Calc
2. Review test case specifications
3. Compare Expected vs Actual output after running tests
4. Update Status column manually or with automated scripts

## Troubleshooting

### Issue: Tests Won't Run

**Error**: `EADDRINUSE: address already in use ::1:9323`

**Solution**:
```bash
# Kill lingering Node processes
Stop-Process -Name node -Force
npm test
```

### Issue: Playwright Browsers Not Found

**Solution**:
```bash
npx playwright install
npm test
```

### Issue: Tests Timeout After 30 Seconds

**Likely Cause**: Translator website is slow or down
**Check**: Visit https://www.swifttranslator.com/ in your browser first
**Solution**: Verify website is accessible, then retry tests

### Issue: Port 9323 Already in Use (Report)

**Solution**:
```bash
# Clear Playwright report cache
rm -r playwright-report .playwright -Force
npm run test:report
```

## Project Configuration

### package.json Scripts

```json
{
  "scripts": {
    "test": "npx playwright test",
    "test:headed": "npx playwright test --headed",
    "test:report": "npx playwright show-report"
  }
}
```

### Playwright Config

Tests are configured with:
- **Timeout**: 30 seconds per test
- **Retries**: 0 (no automatic retries)
- **Workers**: 1 (sequential execution)
- **Browsers**: Chromium (headless by default)
- **Wait conditions**: domcontentloaded (for page navigation)

## Development & Modification

### Add a New Test

Edit `tests/itpm.spec.js`:

```javascript
test('Your_Test_ID - Your test description', async ({ page }) => {
  const input = 'Your Singlish input';
  const inputField = await getInput(page);
  await inputField.fill('');
  await inputField.fill(input);
  await page.waitForTimeout(4000);  // Wait for real-time translation
  const output = await getOutput(page);
  console.log('Test | Input:', input, '| Output:', output);
  expect(await inputField.inputValue()).toBe(input);
});
```

### Run Tests After Changes

```bash
npm test
```

## Submission Requirements

1. **Folder Naming**: Rename project folder to your registration number
   ```
   [REG_NO]/
   ├── tests/itpm.spec.js
   ├── package.json
   ├── itpm_testcases.csv
   ├── README.md
   └── node_modules/ (optional, for reduced file size)
   ```

2. **Zip for Submission**: 
   ```bash
   # Remove node_modules to reduce size (grader will run npm install)
   rm -r node_modules
   # Zip the folder
   Compress-Archive -Path [REG_NO] -DestinationPath [REG_NO].zip
   ```

3. **Upload**: Submit zipped file to CourseWeb "Assignment 1 Answer" before **February 1, 2026**

4. **Optional**: Include Git repository link in a separate `GIT_LINK.txt` file

## Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Test API](https://playwright.dev/docs/test-intro)
- [Test Best Practices](https://playwright.dev/docs/best-practices)

## Support

If tests fail:
1. Verify internet connection and website accessibility
2. Run `npx playwright install` to reinstall browsers
3. Check that Node.js and npm are up to date: `node --version`, `npm --version`
4. Inspect HTML report: `npm run test:report`
5. Run in headed mode for visual debugging: `npm run test:headed`
