# Mejora y Mantenimiento de una Librería Angular

Como desarrollador Senior en Angular, tu tarea es mejorar la mantenibilidad de una librería existente en un manejador de paquetes (npm). La librería en cuestión es utilizada por varios proyectos internos y debe ser robusta, eficiente y fácil de mantener. La librería actual maneja la interacción con un servicio de terceros para la validación de datos en tiempo real. Debes asegurarte de que la librería sea idempotente en sus operaciones de validación, maneje adecuadamente los errores de red y sea eficiente en el uso de recursos. La librería debe ser capaz de procesar al menos 100 solicitudes por segundo con una latencia máxima de 200ms.

## Informacion General

| Campo | Valor |
|-------|-------|
| **Tema** | Mantenibilidad framework/librería/componente |
| **Nivel** | senior-l2 |
| **Tipo** | practical |
| **Tiempo estimado** | 20 horas |

## Fases del Reto

### Fase 0: Configuración del Proyecto

**Objetivo:** Obtener el proyecto base funcional enviando el Código Base a un asistente de IA, que lo analizará, corregirá errores y generará un ZIP listo para usar.

**Tiempo estimado:** 15-30 minutos

**Instrucciones:**

- Asegúrate de tener instalado para ejecutar el proyecto: Node.js 18+, npm, VS Code o similar.
- Copia todo el contenido del campo **Código Base** de este reto — incluyendo el texto de instrucciones que aparece al inicio.
- Abre un asistente de IA (Claude en claude.ai, ChatGPT o Gemini — se recomienda Claude), pega el contenido copiado en el chat y envíalo.
- El asistente analizará los archivos, corregirá errores y generará un archivo ZIP descargable. Descárgalo y extráelo en la carpeta donde quieras trabajar.
- Ejecuta `npm install && npm run build` (o `npm start`). Si no hay errores, estás listo.

**Entregable:** El proyecto compila/arranca sin errores.

<details>
<summary>Pistas de conocimiento</summary>

- Copia el Código Base completo incluyendo el texto de instrucciones al inicio — esas instrucciones le indican al asistente exactamente qué hacer con los archivos.
- Si el asistente no genera el ZIP automáticamente al terminar el análisis, escríbele: "genera el ZIP ahora".
- Si el proyecto tiene errores al arrancar, comparte el mensaje de error con el mismo asistente para que lo corrija.

</details>

### Fase 1: Evaluación y Documentación

**Objetivo:** Evaluar la librería existente y documentar sus funcionalidades y limitaciones.

**Tiempo estimado:** 5 horas

**Instrucciones:**

- Revisar el código fuente de la librería y documentar sus funcionalidades principales.
- Identificar y documentar las limitaciones y puntos de mejora.
- Asegurarte de que la documentación incluya ejemplos de uso y casos de prueba.

**Entregable:** Documentación completa de la librería existente con ejemplos de uso y casos de prueba.

<details>
<summary>Pistas de conocimiento</summary>

- Considera las mejores prácticas para la documentación de código.
- Piensa en cómo los usuarios de la librería podrían interactuar con ella.

</details>

### Fase 2: Mejora de Idempotencia y Manejo de Errores

**Objetivo:** Mejorar la idempotencia de las operaciones de validación y manejar adecuadamente los errores de red.

**Tiempo estimado:** 8 horas

**Instrucciones:**

- Implementar mejoras para asegurar que las operaciones de validación sean idempotentes.
- Añadir manejo de errores de red y asegurar que la librería pueda recuperarse de fallos temporales.
- Verificar que la librería cumpla con el umbral de 100 solicitudes por segundo con una latencia máxima de 200ms.

**Entregable:** Librería mejorada con idempotencia en las operaciones de validación y manejo adecuado de errores de red.

<details>
<summary>Pistas de conocimiento</summary>

- Considera cómo puedes usar claves de idempotencia para asegurar que las operaciones sean idempotentes.
- Piensa en estrategias para manejar errores de red y asegurar la recuperación de la librería.

</details>

### Fase 3: Optimización y Pruebas

**Objetivo:** Optimizar la librería para mejorar su eficiencia y realizar pruebas exhaustivas.

**Tiempo estimado:** 7 horas

**Instrucciones:**

- Optimizar el código de la librería para mejorar su eficiencia.
- Realizar pruebas unitarias y de integración para asegurar que la librería funcione correctamente en diferentes escenarios.
- Verificar que la librería cumpla con el umbral de 100 solicitudes por segundo con una latencia máxima de 200ms.

**Entregable:** Librería optimizada y pruebas unitarias y de integración realizadas.

<details>
<summary>Pistas de conocimiento</summary>

- Considera técnicas de optimización de código.
- Piensa en diferentes escenarios de prueba para asegurar la robustez de la librería.

</details>

## Dimensiones Evaluadas

- **queEs**: ¿Qué es la idempotencia y por qué es importante en las operaciones de validación?
- **paraQueSirve**: ¿Para qué sirve el manejo de errores de red en la librería?
- **comoSeUsa**: ¿Cómo se usa la librería en un proyecto Angular?
- **erroresComunes**: ¿Cuáles son los errores comunes que pueden ocurrir al usar la librería y cómo se pueden evitar?
- **queDecisionesImplica**: ¿Qué decisiones implica la optimización de la librería para mejorar su eficiencia?

## Criterios de Evaluacion

- Documentación completa de la librería existente con ejemplos de uso y casos de prueba.
- Librería mejorada con idempotencia en las operaciones de validación y manejo adecuado de errores de red.
- Librería optimizada y pruebas unitarias y de integración realizadas.

## Como trabajar con un asistente de IA

Hay dos caminos, elegi uno:

- **AGENTS.md** (recomendado) — instrucciones nativas del repo. Abri esta carpeta con tu agente local (Claude Code, Cursor, Codex, Copilot, Gemini) y las carga solo. Sabe que archivos faltan y con que comando se verifica, y completa el scaffold escribiendo en disco.
- **PROMPT_MEJORA.md** — para copiar y pegar en un chat (claude.ai, ChatGPT). Devuelve un ZIP con el proyecto. Sirve si no tenes un agente en el IDE.

Ninguno de los dos resuelve las fases del reto: eso es tu trabajo.

## Verificacion

El proyecto esta listo para trabajar cuando este comando corre sin errores:

```bash
npm install && npm run build
```

---

*Reto generado automaticamente por Challenge Generator - Pragma*
