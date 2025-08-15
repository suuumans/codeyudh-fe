// E2E tests using Playwright
// Note: This requires Playwright to be installed and configured

import { test, expect } from '@playwright/test'

test.describe('Complete User Journey', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('/')
  })

  test('should complete registration and solve a problem', async ({ page }) => {
    // Step 1: Register a new user
    await page.click('text=Register')
    
    await page.fill('[data-testid="username-input"]', 'testuser')
    await page.fill('[data-testid="email-input"]', 'testuser@example.com')
    await page.fill('[data-testid="password-input"]', 'password123')
    await page.fill('[data-testid="confirm-password-input"]', 'password123')
    
    await page.click('button:has-text("Create Account")')
    
    // Wait for successful registration
    await expect(page).toHaveURL('/dashboard')
    
    // Step 2: Navigate to problems
    await page.click('text=Problems')
    await expect(page).toHaveURL('/problems')
    
    // Step 3: Select a problem
    await page.click('.problem-card:first-child')
    await expect(page).toHaveURL(/\/problems\/\d+/)
    
    // Step 4: Write and test code
    await page.fill('[data-testid="code-editor"]', `
      function twoSum(nums, target) {
        const map = new Map();
        for (let i = 0; i < nums.length; i++) {
          const complement = target - nums[i];
          if (map.has(complement)) {
            return [map.get(complement), i];
          }
          map.set(nums[i], i);
        }
        return [];
      }
    `)
    
    // Run the code
    await page.click('button:has-text("Run")')
    
    // Wait for test results
    await expect(page.locator('[data-testid="test-results"]')).toBeVisible()
    await expect(page.locator('.test-case.passed')).toBeVisible()
    
    // Step 5: Submit the solution
    await page.click('button:has-text("Submit")')
    
    // Wait for submission results
    await expect(page.locator('[data-testid="submission-success"]')).toBeVisible()
    
    // Step 6: Verify problem is marked as solved
    await page.goto('/problems')
    await expect(page.locator('.problem-card:first-child .status-solved')).toBeVisible()
  })

  test('should handle login and view user statistics', async ({ page }) => {
    // Step 1: Login with existing user
    await page.click('text=Login')
    
    await page.fill('[data-testid="email-input"]', 'test@example.com')
    await page.fill('[data-testid="password-input"]', 'password')
    
    await page.click('button:has-text("Sign In")')
    
    // Wait for successful login
    await expect(page).toHaveURL('/dashboard')
    
    // Step 2: Verify dashboard content
    await expect(page.locator('[data-testid="solved-problems-count"]')).toBeVisible()
    await expect(page.locator('[data-testid="success-rate"]')).toBeVisible()
    await expect(page.locator('[data-testid="current-streak"]')).toBeVisible()
    
    // Step 3: Navigate to profile
    await page.click('[data-testid="user-menu"]')
    await page.click('text=Profile')
    
    await expect(page).toHaveURL('/profile')
    
    // Step 4: Verify profile information
    await expect(page.locator('[data-testid="username"]')).toContainText('test')
    await expect(page.locator('[data-testid="submission-history"]')).toBeVisible()
    await expect(page.locator('[data-testid="streak-calendar"]')).toBeVisible()
  })

  test('should filter and search problems effectively', async ({ page }) => {
    // Navigate to problems page
    await page.goto('/problems')
    
    // Step 1: Test search functionality
    await page.fill('[data-testid="search-input"]', 'Two Sum')
    await page.keyboard.press('Enter')
    
    // Verify search results
    await expect(page.locator('.problem-card')).toHaveCount(1)
    await expect(page.locator('.problem-card:first-child')).toContainText('Two Sum')
    
    // Step 2: Clear search and test filters
    await page.fill('[data-testid="search-input"]', '')
    await page.keyboard.press('Enter')
    
    // Open filters
    await page.click('button:has-text("Filters")')
    
    // Filter by difficulty
    await page.check('[data-testid="difficulty-easy"]')
    await expect(page.locator('.problem-card[data-difficulty="easy"]')).toBeVisible()
    
    // Filter by topic
    await page.check('[data-testid="topic-array"]')
    await expect(page.locator('.problem-card[data-topics*="Array"]')).toBeVisible()
    
    // Step 3: Test view mode toggle
    await page.click('[data-testid="list-view-button"]')
    await expect(page.locator('.problems-list.list-view')).toBeVisible()
    
    await page.click('[data-testid="grid-view-button"]')
    await expect(page.locator('.problems-list.grid-view')).toBeVisible()
  })
})

test.describe('Responsive Design Tests', () => {
  test('should work correctly on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Test mobile navigation
    await page.click('[data-testid="mobile-menu-button"]')
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible()
    
    // Navigate to problems on mobile
    await page.click('text=Problems')
    await expect(page).toHaveURL('/problems')
    
    // Verify mobile-optimized problem cards
    await expect(page.locator('.problem-card.mobile-optimized')).toBeVisible()
    
    // Test mobile code editor
    await page.click('.problem-card:first-child')
    await expect(page.locator('[data-testid="mobile-code-editor"]')).toBeVisible()
  })

  test('should work correctly on tablet devices', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/problems/1')
    
    // Verify tablet layout
    await expect(page.locator('[data-testid="split-view-layout"]')).toBeVisible()
    await expect(page.locator('[data-testid="problem-description"]')).toBeVisible()
    await expect(page.locator('[data-testid="code-editor"]')).toBeVisible()
  })

  test('should work correctly on desktop', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/problems/1')
    
    // Verify desktop layout with full features
    await expect(page.locator('[data-testid="full-featured-editor"]')).toBeVisible()
    await expect(page.locator('[data-testid="advanced-settings"]')).toBeVisible()
    await expect(page.locator('[data-testid="split-screen-toggle"]')).toBeVisible()
  })
})

test.describe('Accessibility Tests', () => {
  test('should be accessible with keyboard navigation', async ({ page }) => {
    await page.goto('/')
    
    // Test keyboard navigation through main elements
    await page.keyboard.press('Tab')
    await expect(page.locator(':focus')).toHaveAttribute('data-testid', 'main-nav-link')
    
    await page.keyboard.press('Tab')
    await expect(page.locator(':focus')).toHaveAttribute('data-testid', 'login-button')
    
    // Test form accessibility
    await page.goto('/login')
    await page.keyboard.press('Tab')
    await expect(page.locator(':focus')).toHaveAttribute('data-testid', 'email-input')
    
    await page.keyboard.press('Tab')
    await expect(page.locator(':focus')).toHaveAttribute('data-testid', 'password-input')
  })

  test('should have proper ARIA labels and roles', async ({ page }) => {
    await page.goto('/problems')
    
    // Check for proper ARIA labels
    await expect(page.locator('[role="main"]')).toBeVisible()
    await expect(page.locator('[aria-label="Problems list"]')).toBeVisible()
    await expect(page.locator('[aria-label="Filter problems"]')).toBeVisible()
    
    // Check form accessibility
    await page.goto('/login')
    await expect(page.locator('[aria-describedby="email-error"]')).toBeVisible()
    await expect(page.locator('[aria-describedby="password-error"]')).toBeVisible()
  })

  test('should work with screen readers', async ({ page }) => {
    await page.goto('/problems/1')
    
    // Check for screen reader friendly content
    await expect(page.locator('[aria-live="polite"]')).toBeVisible() // For status updates
    await expect(page.locator('[aria-describedby="problem-description"]')).toBeVisible()
    await expect(page.locator('[role="textbox"][aria-label="Code editor"]')).toBeVisible()
  })
})

test.describe('Performance Tests', () => {
  test('should load pages within acceptable time limits', async ({ page }) => {
    const startTime = Date.now()
    await page.goto('/')
    const loadTime = Date.now() - startTime
    
    // Page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000)
  })

  test('should handle large problem lists efficiently', async ({ page }) => {
    await page.goto('/problems')
    
    // Simulate loading many problems
    await page.evaluate(() => {
      // This would trigger loading more problems
      window.scrollTo(0, document.body.scrollHeight)
    })
    
    // Verify virtual scrolling or pagination works
    await expect(page.locator('[data-testid="problem-card"]')).toHaveCount(20) // Should limit visible items
  })
})