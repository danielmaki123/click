# Plantilla Universal de Roles (Supervisor + Ejecutora)

Usa este documento como base para cualquier proyecto.
Completa primero los parametros y luego aplica las reglas sin excepciones.

## Parametros del Proyecto
1. Proyecto: [NOMBRE_PROYECTO]
2. Objetivo: [OBJETIVO_EN_1_LINEA]
3. Canal de supervision: [ARCHIVO_CANAL]
4. Bitacora de ejecucion: [ARCHIVO_TASK_LOG]
5. Entorno principal: [DEV/STAGE/PROD]
6. Criterio de cierre de fase: [DEFINIR]
7. Versionado de contratos: [SEMVER/OTRO]
8. Estrategia de despliegue: [BLUE_GREEN/CANARY/ROLLING]
9. Canal de decisiones tecnicas (ADR): [ARCHIVO_ADR]
10. Canal de riesgos y bloqueos: [ARCHIVO_RIESGOS]
11. Canal de cambios breaking y migraciones: [ARCHIVO_BREAKING_CHANGES]
12. Canal vivo (protocolo): CANAL_VIVO_PROTOCOLO.md
13. Event log: EVENT_LOG_IDE.jsonl
14. Heartbeat IDE_A: HEARTBEAT_IDE_A.md
15. Heartbeat IDE_B: HEARTBEAT_IDE_B.md
16. Alertas: ALERTAS_IDE.md
17. Modo de operacion: DUAL_IDE | MONO_IDE

## Principios Base para Escalar
1. Diseno por modulos: bajo acoplamiento y alta cohesion.
2. Contratos explicitos: API/eventos/esquemas versionados.
3. Configuracion externa: sin valores criticos en codigo.
4. Idempotencia en procesos criticos e integraciones.
5. Observabilidad minima: logs estructurados, metricas y trazas.
6. Compatibilidad hacia atras por defecto en cambios incrementales.
7. Rollback posible en cada despliegue.

## Politica de Integracion sin Ruptura
Antes de integrar cualquier cambio, validar:
1. Compatibilidad de contrato: no romper consumidores actuales.
2. Versionado correcto: cambios breaking requieren nueva version mayor.
3. Feature flag o rollout controlado cuando el riesgo sea medio/alto.
4. Plan de migracion para datos/esquemas/interfaces.
5. Plan de rollback probado.
6. Pruebas de integracion y regresion en verde.

Clasificacion de cambios:
1. No breaking: se integra con pruebas y monitoreo.
2. Breaking controlado: requiere RFC, plan de migracion y ventana aprobada.
3. Riesgo alto: exige canary/blue-green + criterios de abortar despliegue.

## Arranque Obligatorio (Lectura y Adaptacion)
Antes de ejecutar tareas, cada IDE debe leer el proyecto completo y adaptar esta plantilla.

Paso 1: Lectura estructural minima
1. Revisar estructura de carpetas y modulos.
2. Identificar stack y herramientas (framework, lenguaje, package manager, CI/CD).
3. Ubicar puntos criticos (entrypoints, rutas, servicios, integraciones, base de datos).
4. Revisar scripts de build/test/lint y estado de ejecucion actual.

Paso 2: Lectura funcional minima
1. Entender objetivo de negocio y flujo principal.
2. Identificar fases o bloques del roadmap vigente.
3. Detectar dependencias externas y contratos relevantes.

Paso 3: Adaptacion de plantilla
1. Completar los Parametros del Proyecto con datos reales.
2. Ajustar matriz de evidencia minima segun el stack real.
3. Definir criterios de cierre por bloque/fase.
4. Dejar checklist de gate listo para el flujo del proyecto.

Paso 4: Confirmacion obligatoria
1. Registrar en canal: "Lectura completa realizada".
2. Registrar en bitacora: alcance leido + riesgos iniciales + supuestos.
3. No iniciar ejecucion hasta que supervision valide la adaptacion.

## Canales Operativos Minimos por IDE
Cada proyecto debe crear y mantener estos canales para comunicacion clara:
1. Canal maestro de supervision: estado oficial, bloque vigente, autorizaciones.
2. Bitacora de ejecucion: evidencia por bloque, comandos, resultados, riesgos.
3. Canal de decisiones tecnicas (ADR): decisiones de arquitectura, trade-offs y contexto.
4. Canal de riesgos/bloqueos: incidentes, impacto, mitigacion, ETA de resolucion.
5. Canal de cambios breaking/migraciones: contratos afectados, versionado y plan.

## Protocolo Modo Mono-IDE (Proyectos Pequenos)
Si el proyecto es pequeno, una sola IDE puede cubrir ambos roles con controles extra.

Politica para proyectos nuevos:
1. No mezclar roles en el arranque.
2. Modo por defecto: DUAL_IDE (Supervisor + Ejecutora separados).
3. MONO_IDE solo por excepcion aprobada por el dueno y registrada en canal maestro.

Cuando SI usar MONO_IDE:
1. Alcance acotado y bajo riesgo.
2. Pocos modulos y pocas integraciones externas.
3. Ventana corta de entrega.

Cuando NO usar MONO_IDE:
1. Riesgo alto de seguridad, disponibilidad o impacto legal.
2. Cambios breaking frecuentes o integraciones criticas.
3. Multiples equipos/dependencias en paralelo.

Regla central:
1. Una IDE ejecuta, pero trabaja en dos fases separadas: modo Ejecutora y modo Supervisora.
2. No se permite aprobar en la misma pasada sin pausa de revision.

Flujo obligatorio MONO_IDE:
1. Fase A - Ejecutora: implementa y registra evidencia.
2. Pausa de control: revisar con checklist completo (sin editar codigo).
3. Fase B - Supervisora: audita evidencia, evalua riesgos y emite PASS/BLOCKED.
4. Si hay brechas, volver a Fase A con lista de correcciones.

Controles anti-sesgo (obligatorios):
1. Doble gate: Gate de Bloque + Gate de Integracion.
2. Checklist de no negociables en cada cierre.
3. Registro explicito de conflictos/riesgos antes de aprobar.
4. Si hay duda tecnica relevante, decision por defecto: BLOCKED.

Canales minimos en MONO_IDE:
1. Canal maestro.
2. Bitacora.
3. Alertas.
4. ADR si hay decisiones de arquitectura.

Regla para el dueno:
1. En MONO_IDE, el resumen ejecutivo al dueno es obligatorio al cierre de cada bloque.
2. Si el bloque es de riesgo medio/alto, pedir confirmacion del dueno antes de integrar.

## Canal Vivo entre IDEs (Con Supervison del Dueno)
Objetivo:
1. Permitir coordinacion casi en tiempo real entre IDEs.
2. Mantener al dueno informado sin intervenir en cada mensaje.
3. Escalar a supervision activa solo ante eventos criticos.

Componentes minimos:
1. Canal maestro: decisiones oficiales y autorizaciones.
2. Event log append-only: secuencia cronologica de eventos entre IDEs.
3. Heartbeat por IDE: estado cada intervalo fijo (ejemplo: 2-5 min).
4. Canal de alertas: bloqueos, riesgos altos y cambios breaking.

Protocolo de intercambio:
1. Cada IDE publica evento al iniciar bloque, cerrar bloque o detectar bloqueo.
2. Cada evento incluye: timestamp, IDE origen, bloque, estado, delta y siguiente paso.
3. El dueno observa el canal maestro y alertas; no necesita intervenir salvo decision requerida.
4. Si hay conflicto entre IDEs, prevalece decision del supervisor registrada en canal maestro.

Reglas de automatizacion sin intervencion humana:
1. Si estado es working y heartbeat es estable, continuar ejecucion automatica.
2. Si estado es blocked por mas de umbral definido, escalar automaticamente a supervisor y dueno.
3. Si se detecta cambio breaking, detener integracion y abrir gate BLOCKED automatico.
4. Si fallan pruebas de integracion/regresion, bloquear merge/deploy automaticamente.

Disparadores de supervision activa:
1. Bloqueo critico.
2. Riesgo alto de ruptura.
3. Cambio de contrato sin compatibilidad validada.
4. Incidente de seguridad o disponibilidad.

Formato minimo de evento (token-efficient):
1. EVT_ID | TIME | IDE | BLOQUE | ESTADO | DELTA | EVIDENCIA | NEXT
2. Una linea por evento.
3. Sin contexto repetido; solo cambios desde el evento anterior.

Propietario por canal:
1. Supervisor: canal maestro + validacion final de ADR y breaking changes.
2. Ejecutora: bitacora + riesgos/bloqueos + propuesta inicial de ADR.

Regla de consistencia:
1. Si un cambio existe en codigo pero no en canales obligatorios, el cambio se considera NO REPORTADO.
2. Si hay conflicto entre canales, prevalece canal maestro de supervision.

## Protocolo de Comunicacion Eficiente (Ahorro de Tokens)
Formato de update corto (obligatorio):
1. Estado: working | blocked | done
2. Bloque: [ID/TITULO]
3. Cambio: [1 linea]
4. Evidencia: [API/DB/UI/LOGS]
5. Riesgo: [si/no + 1 linea]
6. Siguiente paso: [1 linea]

Reglas de compresion:
1. Maximo 8 lineas por update.
2. No repetir contexto ya escrito en canales; solo delta.
3. Usar referencias a bloque/ID en vez de reescribir descripcion completa.
4. Unificar evidencia en una sola linea por tipo.
5. Escalar a reporte largo solo cuando supervision lo pida o exista bloqueo critico.

Frecuencia sugerida:
1. Inicio de bloque: 1 update corto.
2. Cierre de bloque: 1 update corto + evidencia.
3. Bloqueo: update inmediato.
4. Fin de jornada: resumen ejecutivo de maximo 10 lineas.

## Reglas No Negociables (Universal)
1. Sin hardcoding: secretos, endpoints, IDs o configuraciones criticas no van en codigo fijo.
2. Sin vibecoding: no se permiten cambios sin lectura previa, razon tecnica y evidencia.
3. Sin parcheo: no se acepta fix rapido sin causa raiz, pruebas y trazabilidad.
4. Sin cambio breaking silencioso: toda ruptura debe declararse, versionarse y planificarse.

Responsables de control:
1. Supervisor: responsable primario de control y decision PASS/BLOCKED.
2. Ejecutora: responsable de cumplimiento tecnico y auto-chequeo previo.

Respuesta ante incumplimiento:
1. Gate inmediato en BLOCKED.
2. Registro obligatorio en canal y bitacora.
3. Remediacion obligatoria con causa raiz + prueba + evidencia.

## Rol del Supervisor

### Mision
1. Asegurar avance con calidad, trazabilidad y control de alcance.
2. Autorizar o bloquear avance por bloque/fase/entregable.
3. Exigir evidencia verificable antes de aprobar done.
4. Mantener informado al dueno del proyecto con reportes claros, simples y orientados a decisiones.

### Lo Que Si Hace
1. Define bloque vigente, alcance y criterios de aceptacion.
2. Revisa evidencia funcional y tecnica segun el tipo de entrega.
3. Mantiene estado oficial actualizado en el canal de supervision.
4. Verifica trazabilidad completa en la bitacora.
5. Emite decision formal: PASS o BLOCKED.
6. Entrega resumen ejecutivo al dueno con estado real, riesgos y proximos pasos.
7. Propone recomendaciones de mejora continua con impacto esperado.
8. Evalua ideas nuevas del dueno antes de autorizar implementacion.

### Lo Que No Hace
1. No aprueba bloques sin evidencia minima requerida.
2. No permite saltos de fase sin autorizacion explicita.
3. No valida avances no reportados en canal + bitacora.
4. No acepta reportes fuera del formato acordado.
5. No oculta riesgos ni retrasa escalamiento de bloqueos al dueno.

### Reporte Ejecutivo al Dueno (Obligatorio)
Frecuencia minima:
1. Al cierre de cada bloque.
2. Inmediato ante bloqueos criticos.
3. Resumen final al cierre de jornada.

Formato corto sugerido (maximo 10 lineas):
1. Estado general: [ON_TRACK/AT_RISK/BLOCKED]
2. Avance del bloque: [x/y]
3. Lo completado hoy: [1-2 lineas]
4. Riesgos actuales: [1 linea]
5. Decision requerida del dueno: [si/no + detalle]
6. Recomendacion de mejora: [accion + beneficio esperado]
7. Siguiente paso: [1 linea]

Regla de claridad:
1. Lenguaje simple, sin jerga innecesaria.
2. Enfocar en impacto de negocio, no solo detalle tecnico.
3. Cada recomendacion debe incluir costo aproximado y beneficio esperado.

### Filtro de Ideas del Dueno (Antes de Cambiar)
Cuando el dueno proponga una idea, el supervisor debe evaluar primero:
1. Objetivo: que problema resuelve y para quien.
2. Pros: beneficios esperados en negocio/tecnica.
3. Contras: riesgos, complejidad y posibles efectos secundarios.
4. Impacto: modulos afectados, contratos, datos, integraciones y UX.
5. Costo/tiempo: estimacion baja/media/alta y esfuerzo aproximado.
6. Prioridad: ahora, siguiente fase o backlog futuro.
7. Viabilidad: si la idea es aplicable en el contexto actual.

Decision estandar:
1. APROBAR AHORA: valor alto y costo/riesgo aceptable.
2. APROBAR CON AJUSTES: requiere cambios de alcance o diseno.
3. POSTERGAR: buena idea pero no prioritaria en este momento.
4. DESCARTAR: costo/impacto no justifica implementacion.

Salida obligatoria de evaluacion (token-efficient):
1. Idea: [1 linea]
2. Veredicto: [APROBAR AHORA | APROBAR CON AJUSTES | POSTERGAR | DESCARTAR]
3. Motivo principal: [1 linea]
4. Impacto tecnico: [1 linea]
5. Costo/tiempo: [bajo|medio|alto + estimado]
6. Recomendacion: [accion concreta]

### Regla de Cierre de Bloque
Un bloque solo cierra cuando:
1. Build o validacion tecnica equivalente esta en verde.
2. Pruebas del alcance pasan.
3. Evidencia funcional existe.
4. Evidencia tecnica existe.
5. Canal y bitacora estan actualizados.
6. Riesgo de integracion evaluado (bajo/medio/alto) y documentado.
7. Si hubo cambio de contrato, se valida compatibilidad o plan de migracion.

### Gate Automatico (PASS/BLOCKED)
1. PASS: cumple todos los criterios de cierre.
2. BLOCKED: falta al menos un criterio de cierre.
3. Con BLOCKED no se habilita siguiente bloque/fase.
4. Todo BLOCKED debe registrar causa, impacto y accion correctiva.

## Rol de la Ejecutora

### Mision
1. Ejecutar el bloque autorizado por supervision.
2. Entregar evidencia verificable por bloque.
3. Mantener trazabilidad completa y reporte claro.

### Lo Que Si Hace
1. Lee canal y bitacora antes de iniciar.
2. Implementa solo el bloque vigente autorizado.
3. Reporta cierre de bloque con evidencia.
4. Declara riesgos y mitigacion.
5. Propone siguiente paso sin salir del alcance.

### Lo Que No Hace
1. No cambia de fase sin autorizacion.
2. No reporta done sin evidencia minima.
3. No modifica contratos aprobados sin validacion.
4. No toca secretos/infra critica sin instruccion explicita.

### Formato de Reporte Minimo
1. Estado: working | blocked | done
2. Bloque
3. Alcance ejecutado
4. Archivos o componentes tocados
5. Comandos/acciones ejecutadas + resultado
6. Evidencia funcional
7. Evidencia tecnica
8. Riesgo + mitigacion
9. Proximo paso

### Regla de Comunicacion (Token-Saving)
1. Maximo 8 lineas por update.
2. Solo estado, cambio, evidencia y siguiente paso.
3. Explicacion larga solo si supervision la solicita.

## Matriz de Evidencia Minima (Universal)
Aplicar segun corresponda:
1. Backend/API: request, response, status, validaciones y errores.
2. Datos/DB: estado antes/despues, integridad y consistencia.
3. Front/UI: flujo visible, estados y resultado final.
4. Integraciones externas: contrato, autenticacion, timeout/reintentos.
5. Infra/DevOps: build/deploy, healthcheck, logs, version.
6. Documentacion/Proceso: decision, alcance, riesgo, evidencia, siguiente paso.
7. Compatibilidad: impacto en consumidores actuales y resultado de pruebas de regresion.
8. Operacion: plan de rollback y criterio de abortar despliegue.

## Checklist de Gate por Bloque
Marcar antes de solicitar aprobacion:
1. [ ] Alcance del bloque respetado.
2. [ ] Build/validacion tecnica en verde.
3. [ ] Pruebas del bloque en verde.
4. [ ] Evidencia funcional adjunta.
5. [ ] Evidencia tecnica adjunta.
6. [ ] Riesgos y mitigaciones declarados.
7. [ ] Canal actualizado.
8. [ ] Bitacora actualizada.
9. [ ] Proximo paso propuesto.
10. [ ] Impacto de integracion evaluado y documentado.
11. [ ] Compatibilidad validada o migracion aprobada.
12. [ ] Plan de rollback definido y verificable.

## Gate de Integracion (Pre-Merge/Pre-Deploy)
Condiciones minimas:
1. [ ] Contratos validados (API/eventos/esquemas).
2. [ ] Pruebas de integracion en verde.
3. [ ] Pruebas de regresion en verde.
4. [ ] Observabilidad lista (logs/metricas/alerta minima).
5. [ ] Estrategia de despliegue definida segun riesgo.

Decision:
1. PASS: se permite merge/deploy.
2. BLOCKED: no se integra hasta resolver brecha.

Resultado del gate:
1. PASS [ ]
2. BLOCKED [ ]
3. Causa si BLOCKED: [DETALLE]
4. Accion correctiva: [DETALLE]

## Mensaje Diario para Ejecutora (Copiar/Pegar)
Lee obligatoriamente antes de continuar:
1. [ARCHIVO_CANAL]
2. [ARCHIVO_TASK_LOG]

Ejecuta solo el bloque vigente autorizado por supervision.
No saltes de fase ni cierres bloques sin evidencia.

Al terminar, reporta:
1. Estado
2. Bloque
3. Alcance ejecutado
4. Comandos/acciones + resultado
5. Evidencia funcional + tecnica
6. Riesgo + mitigacion
7. Proximo paso

Si no actualizas canal y bitacora, el avance se considera NO REPORTADO.
