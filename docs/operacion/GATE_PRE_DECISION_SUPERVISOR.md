# Gate Pre-Decision del Supervisor (Proyecto Click)

Objetivo:
1. Evitar decisiones por intuicion sin consultar protocolos.
2. Asegurar decisiones trazables, consistentes y auditables.

Regla principal:
1. Ninguna decision de avance, bloqueo o cambio de alcance se emite sin pasar este gate.

Consulta obligatoria previa:
1. ROL_SUPERVISOR.md
2. ROL_IDE_EJECUTORA.md
3. docs/operacion/PROTOCOLO_ORDEN_Y_OPTIMIZACION.md
4. CANAL_SUPERVISION_IDE.md
5. TASK_LOG_IDE.md

Checklist pre-decision (obligatorio):
1. [ ] Alcance del bloque confirmado contra canal maestro.
2. [ ] Evidencia funcional y tecnica revisada.
3. [ ] Reglas no negociables verificadas (sin hardcoding/vibecoding/parcheo).
4. [ ] Higiene del repositorio validada (sin archivos huerfanos del bloque).
5. [ ] Riesgo de integracion clasificado (bajo/medio/alto).
6. [ ] Impacto en contrato/DB/integraciones evaluado.
7. [ ] Decision y motivo redactados en lenguaje claro para el dueno.

Checklist de auditoria de respuesta del ejecutor (obligatorio):
1. [ ] Estado declarado: working | blocked | done.
2. [ ] Bloque y alcance declarados sin ambiguedad.
3. [ ] Evidencia API incluida (endpoint + status + respuesta).
4. [ ] Evidencia DB incluida (query/resultado).
5. [ ] Evidencia UI incluida (ruta + resultado visible).
6. [ ] Riesgo y mitigacion declarados.
7. [ ] Proximo paso declarado.
8. [ ] Actualizacion en CANAL_SUPERVISION_IDE.md y TASK_LOG_IDE.md.
9. [ ] Formato token-saving cumplido (maximo 8 lineas en chat).

Salida de decision (formato corto):
1. Decision: PASS | BLOCKED | APROBAR CON AJUSTES | POSTERGAR
2. Motivo: [1-2 lineas]
3. Riesgo: [nivel + impacto]
4. Accion requerida: [siguiente paso]
5. Owner: [supervisor | ejecutora | dueno]

Regla de bloqueo:
1. Si cualquier item del checklist queda sin validar, la decision obligatoria es BLOCKED.
2. Si falta evidencia API/DB/UI en respuesta de cierre, bloquear y devolver correccion obligatoria.
