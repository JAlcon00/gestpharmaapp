import { TimeAgoPipe } from './time-ago.pipe';

describe('TimeAgoPipe', () => {
  let pipe: TimeAgoPipe;

  beforeEach(() => {
    pipe = new TimeAgoPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty string for null/undefined values', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should return "ahora mismo" for very recent dates', () => {
    const now = new Date();
    expect(pipe.transform(now)).toBe('ahora mismo');
  });

  it('should return minutes ago for recent dates', () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    expect(pipe.transform(fiveMinutesAgo)).toBe('hace 5 minutos');
  });

  it('should return hours ago for dates within last day', () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    expect(pipe.transform(twoHoursAgo)).toBe('hace 2 horas');
  });

  it('should return "ayer" for yesterday', () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    expect(pipe.transform(yesterday)).toBe('ayer');
  });

  it('should return days ago for dates within last week', () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    expect(pipe.transform(threeDaysAgo)).toBe('hace 3 días');
  });

  it('should return formatted date for older dates', () => {
    const oldDate = new Date('2023-01-15');
    const result = pipe.transform(oldDate);
    expect(result).toContain('2023'); // Should include year for different year
  });

  it('should handle string dates', () => {
    const dateString = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    expect(pipe.transform(dateString)).toBe('hace 30 minutos');
  });

  it('should handle number timestamps', () => {
    const timestamp = Date.now() - 45 * 60 * 1000; // 45 minutes ago
    expect(pipe.transform(timestamp)).toBe('hace 45 minutos');
  });
});