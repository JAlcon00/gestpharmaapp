import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('GET requests', () => {
    it('should make GET request with correct URL and params', () => {
      const mockResponse = { data: 'test' };
      const endpoint = 'test-endpoint';
      const params = { page: 1, size: 10 };

      service.get(endpoint, params).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}${endpoint}?page=1&size=10`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle GET request without params', () => {
      const mockResponse = { data: 'test' };
      const endpoint = 'test-endpoint';

      service.get(endpoint).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}${endpoint}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('POST requests', () => {
    it('should make POST request with correct URL and body', () => {
      const mockResponse = { id: 1, name: 'test' };
      const endpoint = 'test-endpoint';
      const body = { name: 'test' };

      service.post(endpoint, body).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}${endpoint}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(body);
      req.flush(mockResponse);
    });
  });

  describe('PUT requests', () => {
    it('should make PUT request with correct URL and body', () => {
      const mockResponse = { id: 1, name: 'updated' };
      const endpoint = 'test-endpoint/1';
      const body = { name: 'updated' };

      service.put(endpoint, body).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}${endpoint}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(body);
      req.flush(mockResponse);
    });
  });

  describe('DELETE requests', () => {
    it('should make DELETE request with correct URL', () => {
      const endpoint = 'test-endpoint/1';

      service.delete(endpoint).subscribe(response => {
        expect(response).toBeUndefined();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}${endpoint}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('Error handling', () => {
    it('should handle HTTP errors', () => {
      const endpoint = 'test-endpoint';
      const errorMessage = '404 Not Found';

      service.get(endpoint).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}${endpoint}`);
      req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
    });

    it('should handle network errors', () => {
      const endpoint = 'test-endpoint';

      service.get(endpoint).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(0);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}${endpoint}`);
      req.error(new ErrorEvent('network error'), { status: 0 });
    });
  });
});