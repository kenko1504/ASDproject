// Example test file for backend related stuff

describe('Jest ES Module Setup', () => {
  it('should perform basic math operations', () => {
    expect(1 + 1).toBe(2);
    expect(2 * 3).toBe(6);
  });

  it('should handle async operations', async () => {
    const asyncFunction = async () => {
      return new Promise(resolve => setTimeout(() => resolve('success'), 10));
    };

    const result = await asyncFunction();
    expect(result).toBe('success');
  });

  it('should work with ES module imports', async () => {
    // Test that we can dynamically import modules
    const fs = await import('fs/promises');
    expect(typeof fs.readFile).toBe('function');
  });
});

