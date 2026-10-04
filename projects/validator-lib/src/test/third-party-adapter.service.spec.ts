import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ThirdPartyAdapterService } from '../lib/services/third-party-adapter.service';
import { ValidationRequest } from '../lib/models/validation-request.model';
import { ValidationResponse } from '../lib/models/validation-response.model';
import { HttpErrorResponse } from '@angular/common/http';

describe('ThirdPartyAdapterService', () => {
  let service: ThirdPartyAdapterService;
  let httpMock: HttpTestingController;

  const mockEndpoint = 'https://api.validation-service.example.com/v1/validate';
  const mockApiKey = 'test-api-key-12345';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ThirdPartyAdapterService,
        { provide: 'VALIDATION_API_ENDPOINT', useValue: mockEndpoint },
        { provide: 'VALIDATION_API_KEY', useValue: mockApiKey }
      ]
    });

    service = TestBed.inject(ThirdPartyAdapterService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('validate', () => {
    const validRequest: ValidationRequest = {
      data: { documentNumber: '12345678', documentType: 'DNI' },
      context: { source: 'web', timestamp: Date.now() }
    };

    const mockSuccessResponse: ValidationResponse = {
      status: 'success',
      data: { isValid: true, confidence: 0.95 },
      requestId: 'req-abc-123'
    };

    it('should validate request successfully', (done) => {
      service.validate(validRequest).subscribe({
        next: (response) => {
          expect(response.status).toBe('success');
          expect(response.data).toBeDefined();
          done();
        },
        error: (err) => fail(`Unexpected error: ${err}`)
      });

      const req = httpMock.expectOne(mockEndpoint);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockApiKey}`);
      req.flush(mockSuccessResponse);
    });

    it('should handle network timeout errors', (done) => {
      service.validate(validRequest).subscribe({
        next: () => fail('Expected error to be thrown'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(0);
          expect(error.statusText).toBe('Unknown Error');
          done();
        }
      });

      const req = httpMock.expectOne(mockEndpoint);
      req.error(new ProgressEvent('error'), { status: 0, statusText: 'Unknown Error' });
    });

    it('should handle server errors (5xx)', (done) => {
      service.validate(validRequest).subscribe({
        next: () => fail('Expected error to be thrown'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(503);
          expect(error.statusText).toBe('Service Unavailable');
          done();
        }
      });

      const req = httpMock.expectOne(mockEndpoint);
      req.flush('Service temporarily unavailable', { status: 503, statusText: 'Service Unavailable' });
    });

    it('should handle client errors (4xx)', (done) => {
      service.validate(validRequest).subscribe({
        next: () => fail('Expected error to be thrown'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(400);
          expect(error.statusText).toBe('Bad Request');
          done();
        }
      });

      const req = httpMock.expectOne(mockEndpoint);
      req.flush('Invalid request format', { status: 400, statusText: 'Bad Request' });
    });

    it('should include idempotency key in request headers', (done) => {
      const requestWithKey: ValidationRequest = {
        ...validRequest,
        idempotencyKey: 'idem-key-abc-456'
      };

      service.validate(requestWithKey).subscribe({
        next: () => done(),
        error: (err) => fail(`Unexpected error: ${err}`)
      });

      const req = httpMock.expectOne(mockEndpoint);
      expect(req.request.headers.get('X-Idempotency-Key')).toBe('idem-key-abc-456');
      req.flush(mockSuccessResponse);
    });

    it('should apply exponential backoff on retry', (done) => {
      const retryAttempts = 3;
      let attemptCount = 0;

      service.validate(validRequest).subscribe({
        next: (response) => {
          expect(response.status).toBe('success');
          expect(attemptCount).toBe(retryAttempts);
          done();
        },
        error: (err) => fail(`Unexpected error: ${err}`)
      });

      for (let i = 0; i < retryAttempts - 1; i++) {
        const req = httpMock.expectOne(mockEndpoint);
        attemptCount++;
        req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
      }

      const finalReq = httpMock.expectOne(mockEndpoint);
      attemptCount++;
      finalReq.flush(mockSuccessResponse);
    });

    it('should include request timeout configuration', (done) => {
      service.validate(validRequest).subscribe({
        next: () => done(),
        error: (err) => fail(`Unexpected error: ${err}`)
      });

      const req = httpMock.expectOne(mockEndpoint);
      expect(req.request.timeout).toBe(5000);
      req.flush(mockSuccessResponse);
    });
  });

  describe('healthCheck', () => {
    it('should return true when service is healthy', (done) => {
      service.healthCheck().subscribe({
        next: (isHealthy) => {
          expect(isHealthy).toBe(true);
          done();
        },
        error: (err) => fail(`Unexpected error: ${err}`)
      });

      const req = httpMock.expectOne(`${mockEndpoint}/health`);
      req.flush({ status: 'ok' });
    });

    it('should return false when service is unavailable', (done) => {
      service.healthCheck().subscribe({
        next: (isHealthy) => {
          expect(isHealthy).toBe(false);
          done();
        },
        error: (err) => fail(`Unexpected error: ${err}`)
      });

      const req = httpMock.expectOne(`${mockEndpoint}/health`);
      req.flush('Service down', { status: 503, statusText: 'Service Unavailable' });
    });
  });
});