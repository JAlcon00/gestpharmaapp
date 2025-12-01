import { of, throwError } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { retryWithBackoff, cacheWithTTL, logWithContext, mapErrorMessages } from './operators';

describe('RxJS Custom Operators', () => {

  describe('retryWithBackoff', () => {
    it('should retry on error with exponential backoff', (done) => {
      let attempts = 0;
      const source$ = of('success').pipe(
        map(() => {
          attempts++;
          if (attempts < 3) {
            throw new Error('Test error');
          }
          return 'success';
        })
      );

      const startTime = Date.now();

      source$.pipe(
        retryWithBackoff(2, 100, 2)
      ).subscribe({
        next: (result) => {
          expect(result).toBe('success');
          expect(attempts).toBe(3); // Initial + 2 retries
          done();
        },
        error: () => fail('Should not error')
      });
    });

    it('should fail after max retries', (done) => {
      const source$ = throwError(() => new Error('Persistent error'));

      source$.pipe(
        retryWithBackoff(2, 10, 2)
      ).subscribe({
        next: () => fail('Should not succeed'),
        error: (error) => {
          expect(error.message).toBe('Persistent error');
          done();
        }
      });
    });
  });

  describe('cacheWithTTL', () => {
    beforeEach(() => {
      // Clear localStorage mock
      spyOn(localStorage, 'getItem').and.returnValue(null);
      spyOn(localStorage, 'setItem');
    });

    it('should cache successful responses', (done) => {
      const source$ = of({ data: 'test' });

      source$.pipe(
        cacheWithTTL('test-key', 1000)
      ).subscribe(result => {
        expect(result.data).toBe('test');
        expect(localStorage.setItem).toHaveBeenCalled();
        done();
      });
    });

    it('should return cached data if available and valid', (done) => {
      const cachedData = { data: 'cached', timestamp: Date.now() };
      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(cachedData));

      const source$ = of({ data: 'fresh' });

      source$.pipe(
        cacheWithTTL('test-key', 1000)
      ).subscribe(result => {
        expect(result.data).toBe('cached'); // Should return cached data
        done();
      });
    });
  });

  describe('logWithContext', () => {
    it('should log next values with context', (done) => {
      spyOn(console, 'log');

      const source$ = of('test value');

      source$.pipe(
        logWithContext('TestService')
      ).subscribe(() => {
        expect(console.log).toHaveBeenCalledWith('[TestService] "test value"');
        done();
      });
    });

    it('should log errors with context', (done) => {
      spyOn(console, 'error');

      const source$ = throwError(() => new Error('Test error'));

      source$.pipe(
        logWithContext('TestService')
      ).subscribe({
        next: () => fail('Should not succeed'),
        error: () => {
          expect(console.error).toHaveBeenCalledWith('[TestService] Error:', jasmine.any(Error));
          done();
        }
      });
    });

    it('should log completion with context', (done) => {
      spyOn(console, 'log');

      const source$ = of('complete');

      source$.pipe(
        logWithContext('TestService')
      ).subscribe({
        next: () => {},
        complete: () => {
          expect(console.log).toHaveBeenCalledWith('[TestService] Completed');
          done();
        }
      });
    });
  });

  describe('mapErrorMessages', () => {
    it('should map error status to custom messages', (done) => {
      const errorMessages = {
        '404': 'Recurso no encontrado',
        '500': 'Error del servidor',
        'default': 'Error desconocido'
      };

      const source$ = throwError(() => ({ status: 404 }));

      source$.pipe(
        mapErrorMessages(errorMessages)
      ).subscribe({
        next: () => fail('Should not succeed'),
        error: (error) => {
          expect(error.message).toBe('Recurso no encontrado');
          done();
        }
      });
    });

    it('should use default message for unmapped errors', (done) => {
      const errorMessages = {
        '404': 'Recurso no encontrado',
        'default': 'Error desconocido'
      };

      const source$ = throwError(() => ({ status: 403 }));

      source$.pipe(
        mapErrorMessages(errorMessages)
      ).subscribe({
        next: () => fail('Should not succeed'),
        error: (error) => {
          expect(error.message).toBe('Error desconocido');
          done();
        }
      });
    });
  });
});