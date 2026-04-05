# Alertas IDE (Supervisor + Dueno)

Este canal concentra solo alertas y escalamiento.
No usar para reportes normales.

Severidades:
1. LOW: riesgo menor, sin impacto inmediato.
2. MEDIUM: riesgo moderado, requiere seguimiento.
3. HIGH: riesgo alto, posible bloqueo o ruptura.
4. CRITICAL: incidente activo, requiere decision urgente.

Formato de alerta:
1. ALERT_ID
2. TIME
3. IDE
4. SEVERITY
5. TIPO (bloqueo|breaking|seguridad|regresion|infra)
6. IMPACTO
7. ACCION INMEDIATA
8. DECISION REQUERIDA (si/no + detalle)
9. OWNER (quien resuelve)
10. ETA

Plantilla:
1. ALERT_ID: ALT-0001
2. TIME: 2026-04-05T00:00:00Z
3. IDE: IDE_A
4. SEVERITY: HIGH
5. TIPO: bloqueo
6. IMPACTO: Se detiene avance del bloque actual.
7. ACCION INMEDIATA: Gate BLOCKED y analisis de causa raiz.
8. DECISION REQUERIDA: no
9. OWNER: IDE_A
10. ETA: 30m

Reglas de escalamiento:
1. HIGH o CRITICAL: notificar supervisor/dueno inmediatamente.
2. CRITICAL: pausar integracion/deploy hasta resolucion.
3. Si bloqueo > 10 min sin progreso: elevar severidad a HIGH.
