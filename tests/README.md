# Testing Infrastructure

This directory contains the comprehensive testing framework for the Two-AIs application.

## Test Structure

```
tests/
├── setup.ts                    # Global test setup and mocks
├── __mocks__/                  # Shared mock implementations
│   └── firebase.ts             # Firebase mock utilities
├── generators/                 # Property-based test generators (fast-check arbitraries)
│   ├── conversation.ts         # Generate random conversation data
│   ├── messages.ts             # Generate random messages
│   ├── sessionConfig.ts        # Generate random session configs
│   └── ttsSettings.ts          # Generate random TTS settings
├── helpers/                    # Test utilities and fixtures
│   ├── firebase-helpers.ts     # Firebase test utilities
│   └── test-data.ts            # Common test fixtures
└── integration/                # End-to-end integration tests
    ├── conversation-flow.test.ts
    └── tts-playback.test.ts
```

## Running Tests

```bash
# Run all tests once
npm run test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage

# Run only property-based tests
npm run test:properties
```

## Test Types

### Unit Tests
- Located alongside source files with `.test.ts` or `.test.tsx` extension
- Test individual functions, components, and modules
- Use mocked dependencies

### Property-Based Tests
- Located alongside source files with `.properties.test.ts` extension
- Test universal properties across all valid inputs
- Use fast-check generators from `tests/generators/`
- Run 100 iterations per property by default

### Integration Tests
- Located in `tests/integration/`
- Test complete user flows end-to-end
- Use Firebase emulators (no production data)
- Optional Ollama integration (skips if unavailable)

## Mocking Strategy

### Firebase
- Mock Firebase services in individual test files
- Import mocks from `tests/__mocks__/firebase.ts`
- Use Firebase emulators for integration tests

### Next.js
- Router, navigation, and Image component mocked in `tests/setup.ts`
- Mocks are automatically applied to all tests

### Web APIs
- `window.speechSynthesis` - Mocked for TTS tests
- `Audio` - Mocked for audio playback tests
- `IntersectionObserver` - Mocked for scroll tests
- `ResizeObserver` - Mocked for layout tests

## Coverage Goals

- **Lines**: 80%
- **Functions**: 80%
- **Branches**: 80%
- **Statements**: 80%

Coverage reports are generated in `coverage/` directory.

## Property-Based Test Annotations

Each property-based test must include a comment linking to the design document:

```typescript
// Feature: comprehensive-testing, Property 1: Conversation initialization
// Validates: Requirements 1.1
test('conversation creation initializes with valid state', () => {
  fc.assert(
    fc.property(conversationConfigArbitrary(), (config) => {
      // Test implementation
    }),
    { numRuns: 100 }
  );
});
```

## Best Practices

1. **Co-locate tests**: Place unit tests next to source files
2. **Use descriptive names**: Test names should explain what is being tested
3. **Mock external dependencies**: Never call production APIs or databases
4. **Clean up after tests**: Use `afterEach` hooks to reset state
5. **Test behavior, not implementation**: Focus on what the code does, not how
6. **Use property-based tests for universal properties**: Generate random inputs to explore edge cases
7. **Use unit tests for specific examples**: Test known edge cases and error conditions

## Troubleshooting

### Tests timeout
- Check for infinite loops or unresolved promises
- Increase timeout in `vitest.config.ts` if needed

### Mock not working
- Ensure mocks are defined before imports
- Use `vi.mock()` at the top of test files
- Check that mock paths match actual import paths

### Coverage below threshold
- Run `npm run test:coverage` to see uncovered lines
- Add tests for uncovered code paths
- Consider if code is testable (may need refactoring)
