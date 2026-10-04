# AGENTS.md

Instrucciones para el agente de IA que abra este repositorio (Claude Code, Cursor, Codex, Copilot, Gemini). Se cargan solas: no hay que pegar nada en ningun chat.

## Que es este repositorio

Es el codigo base de un reto de aprendizaje de Pragma: **Mejora y Mantenimiento de una Librería Angular**.

| | |
|---|---|
| Tema | Mantenibilidad framework/librería/componente |
| Nivel | senior-l2 |
| Chapter | Frontend |
| Especialidad | Angular |
| Stack | TypeScript / Angular 20 |
| Patron arquitectonico | modular con separación de responsabilidades (core, services, models, utilities) y patrón adaptador para integración con servicio de terceros |
| Tiempo estimado | 20 horas |

## Receta del stack

Esqueleto obligatorio:

- `package.json, angular.json y tsconfig.json en la raiz`
- `src/main.ts con bootstrapApplication`
- `src/app/app.config.ts con los providers`
- `src/app/core con servicios y modelos`
- `src/app/features con componentes contenedores`
- `src/app/shared con componentes presentacionales`

Trampas conocidas:

- No inventes versiones de npm: una version inexistente hace fallar `npm install` con ETARGET y el proyecto no instala. Usa rango con caret sobre una version que exista.
- El `package.json` tiene que ser JSON valido y UNICO: nada despues de la llave de cierre.
- Angular necesita `angular.json` y `tsconfig.json` ademas del `package.json`, o `ng build` no corre.

Dependencias:

- @angular/core 20.2.0
- @angular/common 20.2.0
- @angular/common/http 20.2.0
- rxjs 7.8.0
- @angular/platform-browser 20.2.0
- typescript 5.4.2
- vitest 1.4.0
- @vitest/coverage-c8 1.4.0
- @angular-devkit/build-angular 20.2.0
- ng-packagr 20.2.0
- typedoc 0.25.0

## Tu tarea

Dejar este proyecto en estado **verificable**: que el comando de verificacion corra sin errores. Escribi los archivos en disco, en este repositorio. No generes ZIPs ni archivos adjuntos.

En orden:

1. Corre `npm install && npm run build` y mira que falla.
2. Completa lo que falte de la lista de abajo: manifiesto de dependencias, punto de entrada, capa de interfaz y las capas del patron declarado.
3. Arregla SOLO los errores que impiden compilar o arrancar.
4. Volve a correr `npm install && npm run build` hasta que pase.
5. Pará ahí.

## Regla dura: las fases son trabajo del humano

**PROHIBIDO implementar los entregables de las fases.** El valor del reto esta en que la persona los resuelva. Tu trabajo es que tenga un proyecto que arranca; el hueco pedagogico se queda como esta.

No resuelvas nada de esto:

- **Fase 1 — Evaluación y Documentación**: Documentación completa de la librería existente con ejemplos de uso y casos de prueba.
- **Fase 2 — Mejora de Idempotencia y Manejo de Errores**: Librería mejorada con idempotencia en las operaciones de validación y manejo adecuado de errores de red.
- **Fase 3 — Optimización y Pruebas**: Librería optimizada y pruebas unitarias y de integración realizadas.

Distincion operativa:

- **Arreglar** (si): import faltante, tipo que no existe, dependencia sin declarar, error de sintaxis, archivo referenciado que no existe.
- **No tocar** (no): logica de negocio incompleta, validaciones ausentes, secretos hardcodeados, APIs deprecadas que funcionan, concurrencia insegura, patrones mejorables. Eso es lo que la persona tiene que encontrar.

## Superficie de practica (NO completes)

Estos archivos SON el ejercicio de la persona. No los implementes; deja stubs. No toques la logica que el reto pide completar.

- [ ] `projects/validator-lib/src/test/validation.service.spec.ts` — El topic pide TDD/pruebas: este archivo es el ejercicio.
- [ ] `projects/validator-lib/src/test/third-party-adapter.service.spec.ts` — El topic pide TDD/pruebas: este archivo es el ejercicio.
- [ ] `projects/validator-lib/src/test/validation-engine.spec.ts` — El topic pide TDD/pruebas: este archivo es el ejercicio.

## Lo que falta y tenes que completar

### 1. Referencias colgando (14)

Salieron de un analisis estatico del codigo que SI esta en el repo. Cada una rompe la compilacion:

- [ ] `src/main.ts` — `ErrorHandlerService.handleError`
      Se invoca `handleError` sobre `ErrorHandlerService`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- [ ] `src/main.ts` — `ValidationService.preloadCache`
      Se invoca `preloadCache` sobre `ValidationService`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- [ ] `projects/validator-lib/src/lib/services/validation.service.ts` — `ThirdPartyAdapterService.validateWithIdempotency`
      Se invoca `validateWithIdempotency` sobre `ThirdPartyAdapterService`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- [ ] `projects/validator-lib/src/lib/services/validation.service.ts` — `ThirdPartyAdapterService.validate`
      Se invoca `validate` sobre `ThirdPartyAdapterService`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- [ ] `projects/validator-lib/src/lib/utilities/performance-monitor.ts` — `PerformanceAlert.push`
      Se invoca `push` sobre `PerformanceAlert`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- [ ] `projects/validator-lib/src/test/validation.service.spec.ts` — `ValidationService.validate`
      Se invoca `validate` sobre `ValidationService`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- [ ] `projects/validator-lib/src/test/validation.service.spec.ts` — `ValidationService.generateIdempotencyKey`
      Se invoca `generateIdempotencyKey` sobre `ValidationService`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- [ ] `projects/validator-lib/src/test/third-party-adapter.service.spec.ts` — `ThirdPartyAdapterService.validate`
      Se invoca `validate` sobre `ThirdPartyAdapterService`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- [ ] `projects/validator-lib/src/test/third-party-adapter.service.spec.ts` — `ThirdPartyAdapterService.healthCheck`
      Se invoca `healthCheck` sobre `ThirdPartyAdapterService`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- [ ] `projects/validator-lib/src/test/validation-engine.spec.ts` — `ValidationEngine.execute`
      Se invoca `execute` sobre `ValidationEngine`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- [ ] `projects/validator-lib/src/test/validation-engine.spec.ts` — `ValidationRequest.map`
      Se invoca `map` sobre `ValidationRequest`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- [ ] `projects/validator-lib/README.md` — `ValidationService.validate`
      Se invoca `validate` sobre `ValidationService`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- [ ] `projects/validator-lib/README.md` — `ValidationService.validateWithIdempotency`
      Se invoca `validateWithIdempotency` sobre `ValidationService`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- [ ] `projects/validator-lib/package.json` — `@vitest/coverage-c8@1.4.0`
      @vitest/coverage-c8 declara la version 1.4.0, pero el registry de npm respondio que esa version no existe. Es una version inventada: reemplazala por una version publicada real, o si no se conoce con certeza, usa el mecanismo centralizado del ecosistema (BOM/parent/platform/version catalog) y no declares una version individual.

### Presentes (19)

- `tsconfig.json`
- `angular.json`
- `src/main.ts`
- `projects/validator-lib/src/lib/models/validation-request.model.ts`
- `projects/validator-lib/src/lib/models/validation-response.model.ts`
- `projects/validator-lib/src/lib/core/validation-engine.ts`
- `projects/validator-lib/package.json`
- `projects/validator-lib/ng-package.json`
- `projects/validator-lib/src/public-api.ts`
- `projects/validator-lib/src/lib/utilities/idempotency-key-generator.ts`
- `projects/validator-lib/src/lib/services/third-party-adapter.service.ts`
- `projects/validator-lib/src/lib/services/validation.service.ts`
- `projects/validator-lib/src/lib/utilities/error-handler.ts`
- `projects/validator-lib/src/lib/utilities/performance-monitor.ts`
- `projects/validator-lib/src/test/validation.service.spec.ts`
- `projects/validator-lib/src/test/third-party-adapter.service.spec.ts`
- `projects/validator-lib/src/test/validation-engine.spec.ts`
- `projects/validator-lib/README.md`
- `src/index.html`

### Capas del patron declarado

Cada una tiene que existir como directorio real con al menos un archivo. Codigo plano en la raiz no satisface el patron.

- `projects/validator-lib/src/lib`
- `projects/validator-lib/src/lib/core`
- `projects/validator-lib/src/lib/services`
- `projects/validator-lib/src/lib/models`
- `projects/validator-lib/src/lib/utilities`
- `projects/validator-lib/src/test`

## Verificacion

```bash
npm install && npm run build
```

El comando tiene que pasar SIN implementar los archivos de la superficie de practica: solo andamiaje.

Ese comando pasando es la definicion de "terminado" para vos.

## Convenciones que tenes que respetar

- Un solo ecosistema: no declares librerias de otro lenguaje ni mezcles gestores de paquetes.
- Toda libreria que uses tiene que estar declarada en el manifiesto de dependencias.
- Todo import declarado tiene que usarse; todo tipo usado tiene que existir o venir de una dependencia declarada.
- El patron es **modular con separación de responsabilidades (core, services, models, utilities) y patrón adaptador para integración con servicio de terceros**: los contratos (interfaces, puertos) los define la capa interna y los implementa la externa, nunca al revés.
- Los archivos que crees llevan implementacion real, no stubs: sin `TODO`, sin cuerpos vacios, sin `// getters y setters`.

## Contexto del candidato

Sirve para calibrar el nivel del codigo, no para resolver las fases.

- Perfil: Chapter Frontend, Especialidad Desarrollador, Tecnología Angular, Senior
- Brecha que el reto ataca: Da mantienibilidad a un framework/librería/componente público o privado en algún manejador de paquetes (npm).
- Mision: Candidato con experiencia como Senior en Angular, ha completado retos de renderizado web y está preparado para abordar responsabilidades de mantenimiento de librerías.

---

*Generado por Challenge Generator — Pragma. `README.md` tiene el enunciado completo del reto para la persona. `PROMPT_MEJORA.md` es la variante para pegar en un chat, si se prefiere ese flujo.*
