import { FilterPipe } from './filter.pipe';

interface TestItem {
  id: number;
  name: string;
  description?: string;
  category: string;
}

describe('FilterPipe', () => {
  let pipe: FilterPipe;
  let testData: TestItem[];

  beforeEach(() => {
    pipe = new FilterPipe();
    testData = [
      { id: 1, name: 'Paracetamol', description: 'Analgésico', category: 'Analgésicos' },
      { id: 2, name: 'Ibuprofeno', description: 'Antiinflamatorio', category: 'Analgésicos' },
      { id: 3, name: 'Amoxicilina', description: 'Antibiótico', category: 'Antibióticos' },
      { id: 4, name: 'Vitamina C', description: 'Suplemento', category: 'Vitaminas' }
    ];
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return all items when no search term', () => {
    const result = pipe.transform(testData, 'name', null);
    expect(result).toEqual(testData);
  });

  it('should return all items when empty search term', () => {
    const result = pipe.transform(testData, 'name', '');
    expect(result).toEqual(testData);
  });

  it('should return all items when undefined search term', () => {
    const result = pipe.transform(testData, 'name', undefined);
    expect(result).toEqual(testData);
  });

  it('should return empty array for null/undefined input', () => {
    expect(pipe.transform(null, 'name', 'test')).toEqual([]);
    expect(pipe.transform(undefined, 'name', 'test')).toEqual([]);
  });

  it('should filter by single property', () => {
    const result = pipe.transform(testData, 'name', 'para');
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Paracetamol');
  });

  it('should filter by multiple properties', () => {
    const result = pipe.transform(testData, ['name', 'description'], 'anti');
    expect(result.length).toBe(2);
    expect(result.map(item => item.name)).toEqual(['Ibuprofeno', 'Amoxicilina']);
  });

  it('should be case insensitive', () => {
    const result = pipe.transform(testData, 'name', 'PARACETAMOL');
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Paracetamol');
  });

  it('should handle partial matches', () => {
    const result = pipe.transform(testData, 'name', 'prof');
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Ibuprofeno');
  });

  it('should return multiple matches', () => {
    const result = pipe.transform(testData, 'category', 'Analgésicos');
    expect(result.length).toBe(2);
    expect(result.map(item => item.name)).toEqual(['Paracetamol', 'Ibuprofeno']);
  });

  it('should return empty array when no matches', () => {
    const result = pipe.transform(testData, 'name', 'nonexistent');
    expect(result).toEqual([]);
  });

  it('should handle properties with null/undefined values', () => {
    const dataWithNulls = [
      { id: 1, name: 'Test', description: null },
      { id: 2, name: 'Another', description: 'Valid' }
    ];

    const result = pipe.transform(dataWithNulls, 'description', 'valid');
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Another');
  });

  it('should trim whitespace from search term', () => {
    const result = pipe.transform(testData, 'name', '  para  ');
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Paracetamol');
  });
});