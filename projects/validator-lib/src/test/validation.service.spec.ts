import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ValidationService } from '../lib/services/validation.service';
import { ValidationRequest } from '../lib/models/validation-request.model';
import { ValidationResponse } from '../lib/models/validation-response.model';
import { ThirdPartyAdapterService } from '../lib/services/third-party-adapter.service';
import { ErrorHandlerService } from '../lib/utilities/error-handler';
import { PerformanceMonitorService } from '../lib/utilities/performance-monitor';

describe('ValidationService', () => {
  let service: ValidationService;
  let httpMock: HttpTestingController;
  let mockAdapter: ThirdPartyAdapterService;
  let mockErrorHandler: ErrorHandlerService;
  let mockPerformanceMonitor: PerformanceMonitorService;

  beforeEach(() => {
    mockAdapter = {
      validate: jasmine.createSpy('validate').and.returnValue({} as any)
    } as any;

    mockErrorHandler = {
      handleError: jasmine.createSpy('handleError').and.returnValue({} as any)
    } as any;

    mockPerformanceMonitor = {
      recordRequest: jasmine.createSpy('recordRequest'),
      startMonitoring: jasmine.createSpy('startMonitoring'),
      stopMonitoring: jasmine.createSpy('stopMonitoring'),
      getMetrics: jasmine.createSpy('getMetrics').and.returnValue({} as any)
    } as any;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ValidationService,
        { provide: ThirdPartyAdapterService, useValue: mockAdapter },
        { provide: ErrorHandlerService, useValue: mockErrorHandler },
        { provide: PerformanceMonitorService, useValue: mockPerformanceMonitor }
      ]
    });

    service = TestBed.inject(ValidationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería ser creado', () => {
    expect(service).toBeTruthy();
  });

  describe('validate', () => {
    it('debería realizar validación exitosa con datos válidos', (done) => {
      const request: ValidationRequest = {
        data: { field: 'test' },
        validationType: 'schema'
      };

      const mockResponse: ValidationResponse = {
        status: 'success',
        data: { valid: true }
      };

      (mockAdapter.validate as jasmine.Spy).and.returnValue(Promise.resolve(mockResponse));

      service.validate(request).subscribe(response => {
        expect(response.status).toBe('success');
        done();
      });
    });

    it('debería manejar error de validación', (done) => {
      const request: ValidationRequest = {
        data: { field: 'invalid' },
        validationType: 'schema'
      };

      const mockError = new Error('Validation failed');
      (mockAdapter.validate as jasmine.Spy).and.returnValue(Promise.reject(mockError));
      (mockErrorHandler.handleError as jasmine.Spy).and.returnValue(Promise.reject(mockError));

      service.validate(request).subscribe({
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        }
      });
    });

    it('debería registrar métricas de rendimiento', (done) => {
      const request: ValidationRequest = {
        data: { field: 'test' },
        validationType: 'schema'
      };

      const mockResponse: ValidationResponse = {
        status: 'success',
        data: { valid: true }
      };

      (mockAdapter.validate as jasmine.Spy).and.returnValue(Promise.resolve(mockResponse));

      service.validate(request).subscribe(() => {
        expect(mockPerformanceMonitor.recordRequest).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('idempotency', () => {
    it('debería generar clave de idempotencia consistente para mismos datos', () => {
      const request: ValidationRequest = {
        data: { field: 'test' },
        validationType: 'schema'
      };

      const key1 = service.generateIdempotencyKey(request);
      const key2 = service.generateIdempotencyKey(request);

      expect(key1).toBe(key2);
    });

    it('debería generar claves diferentes para datos distintos', () => {
      const request1: ValidationRequest = {
        data: { field: 'test1' },
        validationType: 'schema'
      };

      const request2: ValidationRequest = {
        data: { field: 'test2' },
        validationType: 'schema'
      };

      const key1 = service.generateIdempotencyKey(request1);
      const key2 = service.generateIdempotencyKey(request2);

      expect(key1).not.toBe(key2);
    });
  });

  describe('caching', () => {
    it('debería cachear respuestas para solicitudes idempotentes', (done) => {
      const request: ValidationRequest = {
        data: { field: 'test' },
        validationType: 'schema'
      };

      const mockResponse: ValidationResponse = {
        status: 'success',
        data: { valid: true }
      };

      (mockAdapter.validate as jasmine.Spy).and.returnValue(Promise.resolve(mockResponse));

      service.validate(request).subscribe(() => {
        service.validate(request).subscribe(() => {
          expect(mockAdapter.validate).toHaveBeenCalledTimes(1);
          done();
        });
      });
    });
  });
});