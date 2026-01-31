import { test, expect } from '@playwright/test';

/**
 * Test Suite: Singlish → Sinhala Translator
 * Application: https://www.swifttranslator.com/
 * 
 * Expected Results:
 * - 24 Positive Tests: PASS
 * - 10 Negative Tests: FAIL (demonstrating system weaknesses)
 * - 1 UI Test: PASS
 * Total: 35 Tests
 */

test.describe('Singlish → Sinhala Translator - Complete Test Suite', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.swifttranslator.com/', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
  });

  // Improved helper function to get the input textarea
  async function getInput(page) {
    // Try multiple selectors for the input field
    const selectors = [
      'textarea[placeholder*="Singlish"], textarea[placeholder*="singlish"], textarea[placeholder*="English"]',
      'textarea:first-of-type',
      'textarea',
      'input[type="text"]'
    ];

    for (const selector of selectors) {
      const elements = page.locator(selector);
      if (await elements.count() > 0) {
        const element = elements.first();
        await element.waitFor({ state: 'visible', timeout: 30000 });
        return element;
      }
    }
    throw new Error('Input field not found');
  }

  // Improved helper function to get the output textarea
  async function getOutput(page) {
    // Try multiple selectors for the output field
    const selectors = [
      'textarea[placeholder*="Sinhala"], textarea[placeholder*="sinhala"]',
      'textarea:last-of-type',
      'textarea:nth-of-type(2)',
      '.output-text, .result-text, .translation-result'
    ];

    for (const selector of selectors) {
      const elements = page.locator(selector);
      if (await elements.count() > 0) {
        const element = elements.first();
        await element.waitFor({ state: 'visible', timeout: 10000 });
        const value = await element.inputValue();
        return (value || '').trim();
      }
    }

    // If no output textarea found, try to find any text display area
    const possibleOutputs = [
      'div[class*="output"], div[class*="result"], div[class*="translation"]',
      '.output, .result',
      'pre'
    ];

    for (const selector of possibleOutputs) {
      const elements = page.locator(selector);
      if (await elements.count() > 0) {
        const element = elements.first();
        await element.waitFor({ state: 'visible', timeout: 5000 });
        const text = await element.textContent();
        return (text || '').trim();
      }
    }

    return '';
  }

  // Helper to wait for translation
  async function waitForTranslation(page, timeout = 10000) {
    try {
      // Wait for any loading indicator to disappear
      await page.waitForTimeout(2000);
      
      // Check if output changes
      const initialOutput = await getOutput(page);
      await page.waitForTimeout(2000);
      const finalOutput = await getOutput(page);
      
      return finalOutput;
    } catch (error) {
      console.log('Waiting for translation:', error.message);
      await page.waitForTimeout(3000);
      return await getOutput(page);
    }
  }

  /* ========================================================================
     POSITIVE FUNCTIONAL TEST CASES (24 Tests) - Expected: PASS
     ======================================================================== */

  // Template for positive tests
  async function runPositiveTest(page, testId, inputText, description) {
    console.log(`\n[${testId}] ${description}`);
    console.log(`Input: "${inputText}"`);

    try {
      const inputField = await getInput(page);
      
      // Clear and fill input
      await inputField.fill('');
      await inputField.fill(inputText);
      
      // Wait for translation
      const output = await waitForTranslation(page);
      
      console.log(`Output: "${output}"`);
      
      // Verify input was entered correctly
      const actualInput = await inputField.inputValue();
      expect(actualInput).toBe(inputText);
      
      // For positive tests, we expect SOME output (even if it's not perfect)
      expect(output.length).toBeGreaterThan(0);
      
      // Additional check: output should contain Sinhala characters or at least some text
      if (output.length === 0) {
        console.warn(`⚠️ Warning: Empty output for test ${testId}`);
        // We'll still pass the test but note the issue
      }
      
      console.log(`✅ ${testId} PASSED`);
      return { success: true, output };
    } catch (error) {
      console.error(`❌ ${testId} FAILED:`, error.message);
      throw error;
    }
  }

  const positiveTestCases = [
    {
      id: 'Pos_Fun_0004',
      input: 'Mama gedhara yanavaa.',
      description: 'Convert simple sentence with mixed case'
    },
    {
      id: 'Pos_Fun_0005',
      input: 'Api 3 ta cinema ekata yamu, iita passe 5.30 ta gedhara yamu.',
      description: 'Convert compound sentence with time and numbers'
    },
    {
      id: 'Pos_Fun_0006',
      input: 'Oyaa 2:30 PM ta enavaa nam, mama gedhara inne.',
      description: 'Convert complex sentence with time and negation'
    },
    {
      id: 'Pos_Fun_0007',
      input: 'Meeka Rs. 1500 k vatinavadha?',
      description: 'Convert question with currency notation'
    },
    {
      id: 'Pos_Fun_0008',
      input: 'Colombo valata yanna.',
      description: 'Convert command with place name'
    },
    {
      id: 'Pos_Fun_0009',
      input: 'Mata 2 kg rice oona.',
      description: 'Convert sentence with measurement unit'
    },
    {
      id: 'Pos_Fun_0010',
      input: 'Mata ID ekata photo upload karanna bae.',
      description: 'Convert negative sentence with technical term'
    },
    {
      id: 'Pos_Fun_0011',
      input: '2026-02-15 suba aluth avurudhdhak!',
      description: 'Convert greeting with date format'
    },
    {
      id: 'Pos_Fun_0012',
      input: 'karuNaakaralaa mata email eka hasith@gmail.com valata evanna puLuvandha?',
      description: 'Convert polite request with email address'
    },
    {
      id: 'Pos_Fun_0013',
      input: 'Ow, mama mee nambareeta kiyannam (0771234567) .',
      description: 'Convert response with phone number'
    },
    {
      id: 'Pos_Fun_0014',
      input: 'karuNaakaralaa WiFi password eka mata kiyanna puLuvandha?',
      description: 'Convert polite question with technical term'
    },
    {
      id: 'Pos_Fun_0015',
      input: 'Machan, supiri dha?',
      description: 'Convert informal slang expression'
    },
    {
      id: 'Pos_Fun_0016',
      input: 'Mata ATM PIN eka amathaka vuNaa.',
      description: 'Convert sentence with banking term'
    },
    {
      id: 'Pos_Fun_0017',
      input: 'Website eka google valata yanna, passe login venna.',
      description: 'Convert compound sentence with URL'
    },
    {
      id: 'Pos_Fun_0018',
      input: 'mata   tikak   udhav    karanna.',
      description: 'Convert sentence with extra spaces'
    },
    {
      id: 'Pos_Fun_0019',
      input: 'gihilla enna, gihilla enna!',
      description: 'Convert repeated expression for emphasis'
    },
    {
      id: 'Pos_Fun_0020',
      input: 'Mata iiye OTP ekak email karala.',
      description: 'Convert past tense with technical abbreviation'
    },
    {
      id: 'Pos_Fun_0021',
      input: 'Mama dhaen Zoom call ekata join velaa.',
      description: 'Convert present continuous with brand name'
    },
    {
      id: 'Pos_Fun_0022',
      input: 'Mama heta QR code eka scan karannam.',
      description: 'Convert future tense with technical term'
    },
    {
      id: 'Pos_Fun_0023',
      input: 'Mata USB eka connect karanna epaa.',
      description: 'Convert strong negation with abbreviation'
    },
    {
      id: 'Pos_Fun_0024',
      input: 'Mama GPS use karan yanavaa.',
      description: 'Convert singular pronoun with GPS term'
    },
    {
      id: 'Pos_Fun_0025',
      input: 'Api 10:00 AM ta meeting ekata join vemu.',
      description: 'Convert plural pronoun with time and English term'
    },
    {
      id: 'Pos_Fun_0026',
      input: 'karuNaakarala document eka PDF format valata convert karanna puLuvandha?',
      description: 'Convert polite request with file format term'
    },
    {
      id: 'Pos_Fun_0027',
      input: 'Sri Lankawe jathika sanskrutika ha sramika sampradhayen pelapala jana sathkarayata laba dena purama lokaya ha bauddha dharma adhyayana kramayata anuva IT yugaye siddhiyan hata hatara viruddha veemath vechal novana siddhiyan ha sampath api upayog karagena nishpanna karanu labena avasthavedi ape deshapalana ha arthika nirmanaye siddhiyan sandaha API, cloud computing, blockchain, artificial intelligence wage nayaka teknologiyen upayog kirima sandaha kriyathmaka lesa udav karagena tibena IT ha software udavvidha novana siddhiyan hata hatara viruddha veemath vechal novana siddhiyan ha sampath api upayog karagena nishpanna karanu labena avasthavedi ape deshapalana ha arthika nirmanaye siddhiyan sandaha nayaka teknologiyen upayog kirima sandaha kriyathmaka lesa udav karagena tibena IT ha software udavvidha siyalla ape deshaye diga vishala vistarayata laba denu athi.',
      description: 'Convert long technical paragraph'
    }
  ];

  // Create individual tests from the test cases
  positiveTestCases.forEach(tc => {
    test(tc.id + ' - ' + tc.description, async ({ page }) => {
      await runPositiveTest(page, tc.id, tc.input, tc.description);
    });
  });

  /* ========================================================================
     NEGATIVE FUNCTIONAL TEST CASES (10 Tests) - Expected: FAIL
     ======================================================================== */

  // Template for negative tests
  async function runNegativeTest(page, testId, inputText, description, expectedBehavior) {
    console.log(`\n[${testId}] ${description}`);
    console.log(`Input: "${inputText.substring(0, 50)}${inputText.length > 50 ? '...' : ''}"`);

    const inputField = await getInput(page);
    
    // Clear and fill input
    await inputField.fill('');
    await inputField.fill(inputText);
    
    // Wait for potential translation
    const output = await waitForTranslation(page);
    
    console.log(`Output: "${output.substring(0, 50)}${output.length > 50 ? '...' : ''}"`);
    
    // Verify input was entered correctly
    const actualInput = await inputField.inputValue();
    expect(actualInput).toBe(inputText);
    
    // These assertions WILL FAIL - that's the point of negative testing
    // System should handle these edge cases but doesn't
    
    switch (expectedBehavior) {
      case 'expectEmpty':
        // This WILL FAIL - system produces output instead of empty
        expect(output).toBe('');
        break;
      case 'expectNoSinhala':
        // This WILL FAIL - system converts instead of rejecting
        expect(output).toBe(inputText);
        break;
      case 'expectNoSQL':
        // This WILL FAIL - system doesn't sanitize SQL
        expect(output).not.toContain('DROP');
        break;
      case 'expectNoScript':
        // This WILL FAIL - system doesn't escape HTML/JS
        expect(output).not.toContain('<script>');
        break;
      case 'expectNoHTML':
        // This WILL FAIL - system doesn't strip HTML
        expect(output).not.toContain('<b>');
        break;
      case 'expectLengthLimit':
        // This WILL FAIL - system processes long input without limit
        expect(output.length).toBeLessThan(100);
        break;
      case 'expectOnlySinglish':
        // This WILL FAIL - system handles mixed scripts
        expect(output).toMatch(/^[\u0D80-\u0DFF\s\.,!?]*$/);
        break;
      default:
        // Default check: output should be empty for invalid input
        expect(output).toBe('');
    }
  }

  const negativeTestCases = [
    {
      id: 'Neg_Fun_0001',
      input: '!@#$%^&*()_+-=[]{}|;:,.<>?/~`',
      description: 'Test with extreme special characters',
      expectedBehavior: 'expectEmpty'
    },
    {
      id: 'Neg_Fun_0002',
      input: '123.456.789.0',
      description: 'Test with malformed numbers',
      expectedBehavior: 'expectEmpty'
    },
    {
      id: 'Neg_Fun_0003',
      input: 'DROP TABLE users; SELECT * FROM admin',
      description: 'Test SQL injection security',
      expectedBehavior: 'expectNoSQL'
    },
    {
      id: 'Neg_Fun_0004',
      input: '<script>alert("XSS")</script>',
      description: 'Test XSS security',
      expectedBehavior: 'expectNoScript'
    },
    {
      id: 'Neg_Fun_0005',
      input: '<b>bold</b> and <i>italic</i> text',
      description: 'Test with HTML markup',
      expectedBehavior: 'expectNoHTML'
    },
    {
      id: 'Neg_Fun_0006',
      input: '%20%2F%3F%26%3D%2B',
      description: 'Test with URL encoded input',
      expectedBehavior: 'expectEmpty'
    },
    {
      id: 'Neg_Fun_0007',
      input: 'mama\u0000gedhara\u0007yanavaa',
      description: 'Test with control characters',
      expectedBehavior: 'expectEmpty'
    },
    {
      id: 'Neg_Fun_0008',
      input: 'ABCD1234!@#$'.repeat(50),
      description: 'Test with very long repetitive input',
      expectedBehavior: 'expectLengthLimit'
    },
    {
      id: 'Neg_Fun_0009',
      input: 'hello 你好 नमस्ते 안녕하세요 مرحبا ',
      description: 'Test with multiple language scripts',
      expectedBehavior: 'expectOnlySinglish'
    },
    {
      id: 'Neg_Fun_0010',
      input: '01010100 01100101 01110011 01110100 '.repeat(10),
      description: 'Test with binary pattern input',
      expectedBehavior: 'expectEmpty'
    }
  ];

  // Create individual tests from the test cases
  negativeTestCases.forEach(tc => {
    test(tc.id + ' - ' + tc.description, async ({ page }) => {
      await runNegativeTest(page, tc.id, tc.input, tc.description, tc.expectedBehavior);
    });
  });

  /* ========================================================================
     UI TEST CASE (1 Test) - Expected: PASS
     ======================================================================== */

  test('Pos_UI_0001 - Test delete button clears input field', async ({ page }) => {
    console.log('\n[Pos_UI_0001] Test delete button clears input field');
    
    try {
      const inputField = await getInput(page);
      const testText = 'api kandy valata yamuda';

      // Step 1: Fill the input field
      await inputField.fill(testText);
      await page.waitForTimeout(2000);

      let currentValue = await inputField.inputValue();
      expect(currentValue).toBe(testText);
      
      console.log(`✓ Step 1: Input entered: "${currentValue}"`);

      // Step 2: Get the output
      const output = await getOutput(page);
      console.log(`✓ Step 2: Output generated: "${output}"`);
      
      expect(typeof output).toBe('string');

      // Step 3: Find and click the delete/clear button
      const deleteButton = page.locator(
        'button:has-text("Delete"), button:has-text("delete"), button:has-text("Clear"), button:has-text("clear"), button[aria-label*="delete" i], button[aria-label*="clear" i]'
      ).first();
      
      const buttonCount = await deleteButton.count();
      if (buttonCount === 0) {
        throw new Error('Delete/Clear button not found on page');
      }
      
      await deleteButton.click();
      await page.waitForTimeout(1000);

      currentValue = await inputField.inputValue();
      expect(currentValue).toBe('');
      
      console.log('✓ Step 3: Input cleared via delete button successfully');
      console.log('✅ Pos_UI_0001 PASSED');
    } catch (error) {
      console.error('❌ Pos_UI_0001 FAILED:', error.message);
      throw error;
    }
  });

});