import { CurrencyPipe } from './currency.pipe';

describe('CurrencyPipe', () => {
  let pipe: CurrencyPipe;

  beforeEach(() => {
    pipe = new CurrencyPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty string for null/undefined/empty values', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
    expect(pipe.transform('')).toBe('');
  });

  it('should format MXN currency with symbol by default', () => {
    const result = pipe.transform(1250.50);
    expect(result).toContain('$');
    expect(result).toContain('1,250.50');
  });

  it('should format USD currency with code', () => {
    const result = pipe.transform(1250.50, 'USD', 'code');
    expect(result).toContain('USD');
    expect(result).toContain('1,250.50');
  });

  it('should format with custom digits info', () => {
    const result = pipe.transform(1250.5, 'MXN', 'symbol', '1.0-0');
    expect(result).toContain('$1,251'); // Rounded to 0 decimal places
  });

  it('should handle string numbers', () => {
    const result = pipe.transform('1250.50');
    expect(result).toContain('$');
    expect(result).toContain('1,250.50');
  });

  it('should handle NaN values', () => {
    expect(pipe.transform('not-a-number')).toBe('');
    expect(pipe.transform(NaN)).toBe('');
  });

  it('should format EUR currency', () => {
    const result = pipe.transform(1250.50, 'EUR', 'symbol');
    expect(result).toContain('EUR');
    expect(result).toContain('1,250.50');
  });

  it('should use fallback formatting on error', () => {
    // Mock console.warn to avoid console output in tests
    spyOn(console, 'warn');

    // This should trigger the fallback formatting
    const result = pipe.transform(1250.50, 'INVALID', 'symbol');
    expect(result).toBe('INVALID 1250.50');
  });
});