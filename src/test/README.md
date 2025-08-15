# Testing Documentation

This document outlines the testing strategy and implementation for the competitive coding platform.

## Testing Structure

```
src/test/
├── __tests__/                 # Component unit tests
│   ├── auth/                  # Authentication component tests
│   ├── problems/              # Problem-related component tests
│   └── ui/                    # UI component tests
├── integration/               # Integration tests
├── e2e/                      # End-to-end tests
├── accessibility/            # Accessibility tests
├── msw/                      # Mock Service Worker setup
├── utils.tsx                 # Test utilities and helpers
├── mocks.ts                  # Mock data
├── setup.ts                  # Test environment setup
└── README.md                 # This file
```

## Test Types

### 1. Unit Tests
- **Location**: `src/test/__tests__/`
- **Purpose**: Test individual components in isolation
- **Tools**: Vitest, React Testing Library, User Events
- **Coverage**: Authentication forms, problem cards, filters, code editor components

#### Key Test Files:
- `LoginForm.test.tsx` - Login form validation and submission
- `RegisterForm.test.tsx` - Registration form with password strength
- `ProblemCard.test.tsx` - Problem display and interaction
- `ProblemsList.test.tsx` - Problem listing and view modes
- `FilterPanel.test.tsx` - Problem filtering functionality
- `EnhancedCodeEditor.test.tsx` - Code editor features
- `ErrorBoundary.test.tsx` - Error handling components

### 2. Integration Tests
- **Location**: `src/test/integration/`
- **Purpose**: Test component interactions and API integration
- **Tools**: MSW (Mock Service Worker), React Testing Library
- **Coverage**: Authentication flows, problem-solving workflows

#### Key Test Files:
- `auth-flow.test.tsx` - Complete authentication workflows
- `problem-solving-flow.test.tsx` - End-to-end problem solving

### 3. End-to-End Tests
- **Location**: `src/test/e2e/`
- **Purpose**: Test complete user journeys in a real browser
- **Tools**: Playwright
- **Coverage**: User registration, problem solving, responsive design

#### Key Test Files:
- `user-journey.spec.ts` - Complete user workflows
- Responsive design tests for mobile, tablet, desktop
- Performance and accessibility validation

### 4. Accessibility Tests
- **Location**: `src/test/accessibility/`
- **Purpose**: Ensure WCAG compliance and screen reader compatibility
- **Tools**: axe-core, jest-axe
- **Coverage**: All interactive components, forms, navigation

## Test Configuration

### Vitest Configuration
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
})
```

### Playwright Configuration
```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './src/test/e2e',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium' },
    { name: 'firefox' },
    { name: 'webkit' },
    { name: 'Mobile Chrome' },
    { name: 'Mobile Safari' },
  ],
})
```

## Mock Service Worker (MSW)

MSW is used to mock API calls during testing:

### Setup Files:
- `msw/handlers.ts` - API endpoint handlers
- `msw/server.ts` - Node.js server setup
- `msw/browser.ts` - Browser worker setup

### Mocked Endpoints:
- Authentication: login, register, logout, refresh
- Problems: list, detail, run code, submit solution
- User: profile, statistics, submissions

## Test Utilities

### Custom Render Function
```typescript
// test/utils.tsx
const customRender = (ui, options) => 
  render(ui, { 
    wrapper: AllTheProviders, 
    ...options 
  })
```

### Mock Data
```typescript
// test/mocks.ts
export const mockUser = { /* user data */ }
export const mockProblem = { /* problem data */ }
export const mockSubmission = { /* submission data */ }
```

## Running Tests

### Unit Tests
```bash
# Run all unit tests
bun test

# Run specific test file
bun test src/test/__tests__/auth/LoginForm.test.tsx

# Run tests in watch mode
bun test --watch

# Run tests with coverage
bun test --coverage
```

### Integration Tests
```bash
# Run integration tests
bun test src/test/integration/

# Run specific integration test
bun test src/test/integration/auth-flow.test.tsx
```

### E2E Tests
```bash
# Install Playwright browsers (first time only)
bunx playwright install

# Run E2E tests
bunx playwright test

# Run E2E tests in headed mode
bunx playwright test --headed

# Run specific E2E test
bunx playwright test src/test/e2e/user-journey.spec.ts
```

### Accessibility Tests
```bash
# Run accessibility tests
bun test src/test/accessibility/

# Run with axe-core rules
bun test src/test/accessibility/axe.test.tsx
```

## Test Coverage Goals

- **Unit Tests**: 80% code coverage for components and utilities
- **Integration Tests**: Cover all major user workflows
- **E2E Tests**: Cover critical user journeys
- **Accessibility Tests**: 100% coverage of interactive components

## Best Practices

### Unit Testing
1. Test component behavior, not implementation details
2. Use semantic queries (getByRole, getByLabelText)
3. Test user interactions with userEvent
4. Mock external dependencies appropriately
5. Write descriptive test names

### Integration Testing
1. Test realistic user workflows
2. Use MSW for API mocking
3. Test error scenarios and edge cases
4. Verify state management across components

### E2E Testing
1. Test critical user paths
2. Use data-testid for reliable element selection
3. Test on multiple browsers and devices
4. Include performance and accessibility checks

### Accessibility Testing
1. Use axe-core for automated accessibility testing
2. Test keyboard navigation
3. Verify screen reader compatibility
4. Check color contrast and focus indicators

## Continuous Integration

Tests should be run in CI/CD pipeline:

```yaml
# Example GitHub Actions workflow
- name: Run Unit Tests
  run: bun test --coverage

- name: Run E2E Tests
  run: bunx playwright test

- name: Upload Coverage
  uses: codecov/codecov-action@v3
```

## Debugging Tests

### Unit Tests
- Use `screen.debug()` to see rendered HTML
- Use `--reporter=verbose` for detailed output
- Add `console.log` statements for debugging

### E2E Tests
- Use `--headed` to see browser actions
- Use `--debug` to pause execution
- Check screenshots and videos in test-results/

## Future Improvements

1. **Visual Regression Testing**: Add screenshot comparison tests
2. **Performance Testing**: Add Lighthouse CI integration
3. **Load Testing**: Test with large datasets
4. **Cross-browser Testing**: Expand browser coverage
5. **Mobile Testing**: Add more mobile-specific tests

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/)
- [MSW Documentation](https://mswjs.io/)
- [axe-core Documentation](https://github.com/dequelabs/axe-core)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)