import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { APP_INITIALIZER, ErrorHandler, importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { ValidationService } from './app/core/services/validation.service';
import { ThirdPartyAdapterService } from './app/core/services/third-party-adapter.service';
import { IdempotencyKeyGenerator } from './app/core/utilities/idempotency-key-generator';
import { ErrorHandlerService } from './app/core/utilities/error-handler';
import { PerformanceMonitor } from './app/core/utilities/performance-monitor';
import { HttpClientModule } from '@angular/common/http';

class GlobalErrorHandler implements ErrorHandler {
  constructor(private errorHandler: ErrorHandlerService) {}

  handleError(error: any): void {
    this.errorHandler.handleError(error);
  }
}

function initializeApp(
  validationService: ValidationService,
  performanceMonitor: PerformanceMonitor
): () => Promise<void> {
  return () => {
    // Pre-carga de recursos para mejorar performance
    performanceMonitor.startMonitoring();
    return validationService.preloadCache().toPromise();
  };
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideAnimations(),
    importProvidersFrom(HttpClientModule),
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    },
    ValidationService,
    ThirdPartyAdapterService,
    IdempotencyKeyGenerator,
    ErrorHandlerService,
    PerformanceMonitor,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ValidationService, PerformanceMonitor],
      multi: true
    }
  ]
}).catch(err => {
  console.error('Error al iniciar la aplicación:', err);
  // Inicialización alternativa en caso de fallo crítico
  const fallbackElement = document.createElement('div');
  fallbackElement.innerHTML = `
    <h1>Error de Inicialización</h1>
    <p>La aplicación no pudo iniciarse correctamente.</p>
    <p>Detalle: ${err.message}</p>
  `;
  document.body.appendChild(fallbackElement);
});