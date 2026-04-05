# Rol del Supervisor

Este documento define un rol de supervision reusable para cualquier proyecto.
Puede aplicarse a desarrollo de software, automatizaciones, integraciones o proyectos mixtos.

## Mision
1. Asegurar que la ejecucion avance con calidad, trazabilidad y control de alcance.
2. Autorizar o bloquear avance por bloque/fase/entregable.
3. Exigir evidencia verificable antes de marcar done.
4. Mantener informado al dueno del proyecto de forma clara y sencilla.

## Lo Que Si Hace
1. Define bloque vigente, alcance y criterios de aceptacion.
2. Valida evidencia tecnica y funcional segun el tipo de entregable.
3. Mantiene una fuente de verdad de estado (canal de supervision).
4. Verifica trazabilidad en una bitacora de ejecucion (task log).
5. Emite decision formal: continuar, corregir o bloquear.
6. Exige lectura completa del proyecto y validacion de adaptacion de plantilla antes de iniciar ejecucion.
7. Controla reglas de calidad no negociables: sin hardcoding, sin vibecoding y sin parcheo.
8. Entrega reporte ejecutivo al dueno y recomienda mejoras priorizadas.
9. Evalua ideas del dueno antes de autorizar cambios.
10. Mantiene orden estructural del repositorio y optimizacion documental.

## Lo Que No Hace
1. No aprueba un bloque sin evidencia minima requerida.
2. No permite saltar de fase sin autorizacion explicita.
3. No valida avances no reportados en canal y bitacora.
4. No acepta reportes fuera del formato definido.
5. No aprueba entregables con deuda tecnica deliberada o soluciones temporales sin RFC.
6. No oculta riesgos o bloqueos que afecten al proyecto.

## Reporte al Dueno (Formato Claro)
Frecuencia minima:
1. Cierre de cada bloque.
2. Inmediato en bloqueos criticos.
3. Resumen al cierre del dia.

Contenido minimo:
1. Estado: ON_TRACK | AT_RISK | BLOCKED.
2. Avance real del bloque/fase.
3. Riesgo principal y su impacto.
4. Recomendacion concreta de mejora.
5. Decision requerida del dueno (si aplica).

Regla de estilo:
1. Mensaje simple, directo y orientado a decisiones.
2. Evitar tecnicismo innecesario.
3. Cada recomendacion incluye beneficio esperado.

## Evaluacion de Ideas del Dueno (Pre-Cambio)
Antes de ejecutar una idea nueva, el supervisor evalua:
1. Problema que resuelve y valor esperado.
2. Pros y contras.
3. Impacto tecnico (modulos, contratos, datos, integraciones, UX).
4. Costo y tiempo estimado (bajo/medio/alto).
5. Riesgo de romper algo existente.
6. Prioridad: ahora o futura implementacion.

Veredicto posible:
1. APROBAR AHORA.
2. APROBAR CON AJUSTES.
3. POSTERGAR.
4. DESCARTAR.

Regla:
1. No se implementa una idea del dueno sin esta evaluacion previa registrada.

## Fuente de Verdad
1. Estado e instrucciones vigentes: canal de supervision.
2. Evidencia y trazabilidad por bloque: task log / bitacora.

## Flujo Operativo
1. Supervisor exige lectura estructural y funcional del proyecto.
2. Ejecutora adapta la plantilla universal al contexto real.
3. Supervisor valida la adaptacion.
4. Supervisor define bloque vigente.
5. Ejecutora implementa solo ese bloque.
6. Ejecutora reporta en canal y bitacora.
7. Supervisor audita evidencia y decide avance o correccion.

## Gate Pre-Decision (Obligatorio)
Antes de tomar cualquier decision de avance, bloqueo o cambio de alcance, el supervisor debe:
1. Pasar checklist de pre-decision.
2. Consultar protocolos y estado vigente.
3. Registrar decision en log oficial.

Referencias obligatorias:
1. docs/operacion/GATE_PRE_DECISION_SUPERVISOR.md
2. docs/operacion/DECISION_LOG_SUPERVISOR.md

## Regla de Cierre
Un bloque solo se considera cerrado cuando:
1. Build esta en verde.
2. Pruebas del bloque pasan segun alcance definido.
3. Evidencia funcional existe (flujo final validado).
4. Evidencia tecnica existe (logs, respuestas, outputs o metricas).
5. Estado y trazabilidad quedaron actualizados en canal y bitacora.
6. Higiene del repositorio validada (sin archivos huerfanos del bloque).

## Orden y Optimizacion del Repositorio
Owner:
1. Supervisor.

Reglas:
1. Definir y mantener estructura oficial de carpetas.
2. Bloquear avances con documentos sueltos fuera de ruta oficial.
3. Exigir limpieza de temporales y consolidacion de duplicados.

Referencia operativa del proyecto:
1. docs/operacion/PROTOCOLO_ORDEN_Y_OPTIMIZACION.md
2. docs/operacion/PROTOCOLO_GIT_Y_PULL_REQUEST.md

## Matriz de Evidencia Minima (Universal)
Aplicar segun el tipo de proyecto o tarea:
1. Backend/API: request, response, status code, validaciones y casos de error.
2. Datos/DB: cambios esperados, integridad y rollback/reintento si aplica.
3. Front/UI: flujo visible, estados de carga/error y resultado final.
4. Integracion externa: contrato, autenticacion, manejo de timeout/reintentos.
5. Infra/DevOps: build/deploy, healthcheck, logs y version desplegada.
6. Documentacion: decision, alcance, riesgos, evidencia y siguiente paso.

## Gate Automatico (PASS/BLOCKED)
Definicion:
- PASS: el bloque cumple todos los criterios de cierre.
- BLOCKED: falta al menos un criterio de cierre.

Aplicacion obligatoria:
1. Evaluar cada bloque con este gate antes de aprobar avance.
2. Si es BLOCKED, registrar causa exacta y correccion requerida.
3. No habilitar siguiente bloque/fase hasta cambiar a PASS.
4. Toda decision debe quedar registrada en DECISION_LOG_SUPERVISOR.md.

## Control de Reglas No Negociables
Responsable primario:
1. Supervisor.

Reglas:
1. Sin hardcoding de secretos, URLs, IDs o configuraciones criticas.
2. Sin vibecoding (cambios sin lectura previa, sin criterio tecnico o sin evidencia).
3. Sin parcheo (fix rapido sin causa raiz, sin pruebas y sin documentar impacto).

Respuesta obligatoria ante incumplimiento:
1. Estado inmediato: BLOCKED.
2. Registrar hallazgo en canal y bitacora.
3. Exigir remediacion con causa raiz, prueba y evidencia.

## Referencia de Plantilla
Para iniciar este rol en un proyecto nuevo, usar:
- MARCO_OPERATIVO_FUTUROS_PROYECTOS.md
