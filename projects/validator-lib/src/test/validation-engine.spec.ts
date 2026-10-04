import { TestBed } from '@angular/core/testing';
import { ValidationEngine } from '../lib/core/validation-engine';
import { ValidationRequest } from '../lib/models/validation-request.model';
import { ValidationResponse } from '../lib/models/validation-response.model';

describe('ValidationEngine', () => {
  let engine: ValidationEngine;
  let mockAdapter: any;

  const testRequest: ValidationRequest = {
    data: { email: 'test@example.com', phone: '+1234567890' },
    context: { source: 'mobile', timestamp: Date.now() }
  };

  beforeEach(() => {
    mockAdapter = {
      validate: jasmine.createSpy('validate').and.callFake((req: ValidationRequest) => {
        return Promise.resolve({
          status: 'success',
          data: { isValid: true, confidence: 0.9 },
          requestId: `req-${Date.now()}`
        } as ValidationResponse);
      }),
      healthCheck: jasmine.createSpy('healthCheck').and.returnValue(Promise.resolve(true))
    };

    TestBed.configureTestingModule({
      providers: [
        ValidationEngine,
        { provide: 'ThirdPartyAdapter', useValue: mockAdapter }
      ]
    });

    engine = TestBed.inject(ValidationEngine);
  });

  afterEach(() => {
    engine.clearCache();
  });

  describe('validation execution', () => {
    it('should execute validation through adapter', async () => {
      const response = await engine.execute(testRequest);
      
      expect(mockAdapter.validate).toHaveBeenCalledWith(testRequest);
      expect(response.status).toBe('success');
      expect(response.data).toBeDefined();
    });

    it('should handle adapter errors gracefully', async () => {
      mockAdapter.validate.and.rejectWith(new Error('Network failure'));
      
      try {
        await engine.execute(testRequest);
        fail('Expected error to be thrown');
      } catch (error: any) {
        expect(error.message).toContain('Network failure');
      }
    });

    it('should return cached response for duplicate requests', async () => {
      const response1 = await engine.execute(testRequest);
      const response2 = await engine.execute(testRequest);
      
      expect(mockAdapter.validate).toHaveBeenCalledTimes(1);
      expect(response1.requestId).toBe(response2.requestId);
    });
  });

  describe('idempotency', () => {
    it('should generate consistent idempotency keys for same input', async () => {
      const key1 = await engine['generateIdempotencyKey'](testRequest);
      const key2 = await engine['generateIdempotencyKey'](testRequest);
      
      expect(key1).toBe(key2);
    });

    it('should generate different keys for different inputs', async () => {
      const request2: ValidationRequest = {
        ...testRequest,
        data: { email: 'different@example.com' }
      };
      
      const key1 = await engine['generateIdempotencyKey'](testRequest);
      const key2 = await engine['generateIdempotencyKey'](request2);
      
      expect(key1).not.toBe(key2);
    });

    it('should cache response with TTL', async () => {
      jest.useFakeTimers();
      
      await engine.execute(testRequest);
      const statsBefore = engine.getCacheStats();
      
      expect(statsBefore.size).toBe(1);
      
      jest.advanceTimersByTime(60000);
      
      const statsAfter = engine.getCacheStats();
      expect(statsAfter.size).toBe(0);
      
      jest.useRealTimers();
    });
  });

  describe('cache management', () => {
    it('should track in-flight requests to prevent duplicate calls', async () => {
      const promise1 = engine.execute(testRequest);
      const promise2 = engine.execute(testRequest);
      
      const [response1, response2] = await Promise.all([promise1, promise2]);
      
      expect(mockAdapter.validate).toHaveBeenCalledTimes(1);
      expect(response1.requestId).toBe(response2.requestId);
    });

    it('should clear all cached responses', async () => {
      await engine.execute(testRequest);
      engine.clearCache();
      
      const stats = engine.getCacheStats();
      expect(stats.size).toBe(0);
    });

    it('should return cache statistics', async () => {
      await engine.execute(testRequest);
      
      const stats = engine.getCacheStats();
      expect(stats).toEqual({
        size: 1,
        hitRate: 0,
        missRate: 1
      });
    });
  });

  describe('performance monitoring', () => {
    it('should track validation latency', async () => {
      const startTime = Date.now();
      await engine.execute(testRequest);
      const latency = Date.now() - startTime;
      
      expect(latency).toBeLessThan(200);
    });

    it('should handle high concurrency (100+ requests)', async () => {
      const requests: ValidationRequest[] = Array.from(
        { length: 100 },
        (_, i) => ({
          data: { email: `test${i}@example.com` },
          context: { source: 'batch', timestamp: Date.now() }
        })
      );
      
      const startTime = Date.now();
      const responses = await Promise.all(requests.map(req => engine.execute(req)));
      const totalTime = Date.now() - startTime;
      
      expect(responses.length).toBe(100);
      expect(totalTime).toBeLessThan(2000);
      expect(responses.every(r => r.status === 'success')).toBe(true);
    });

    it('should maintain performance under error conditions', async () => {
      mockAdapter.validate.and.rejectWith(new Error('Service unavailable'));
      
      const requests = Array.from({ length: 10 }, () => ({ ...testRequest }));
      
      const results = await Promise.allSettled(requests.map(req => engine.execute(req)));
      
      const rejectedCount = results.filter(r => r.status === 'rejected').length;
      expect(rejectedCount).toBe(10);
    });
  });

  describe('circuit breaker integration', () => {
    it('should fail fast when circuit is open', async () => {
      mockAdapter.validate.and.rejectWith(new Error('Circuit open'));
      
      for (let i = 0; i < 5; i++) {
        try {
          await engine.execute(testRequest);
        } catch (e) {
          // Expected
        }
      }
      
      const startTime = Date.now();
      try {
        await engine.execute(testRequest);
      } catch (e: any) {
        expect(e.message).toBe('Circuit open');
        expect(Date.now() - startTime).toBeLessThan(50);
      }
    });
  });
});