# Canal Vivo entre IDEs - Protocolo Operativo

Objetivo:
1. Coordinar IDE_A e IDE_B casi en tiempo real.
2. Mantener supervision del dueno sin intervencion constante.
3. Escalar solo por excepcion (riesgo/bloqueo/ruptura).

Canales obligatorios:
1. EVENT_LOG_IDE.jsonl (eventos append-only).
2. HEARTBEAT_IDE_A.md (estado periodico IDE_A).
3. HEARTBEAT_IDE_B.md (estado periodico IDE_B).
4. ALERTAS_IDE.md (incidentes y escalamiento).

Reglas de escritura:
1. Un evento = una linea.
2. Solo delta (no repetir contexto).
3. Formato corto y estable.
4. UTC recomendado para timestamps.

Formato de evento (jsonl):
1. {"evt_id":"...","time":"...","ide":"IDE_A|IDE_B","block":"...","state":"working|blocked|done","delta":"...","evidence":"...","next":"..."}

Frecuencia:
1. Evento en inicio de bloque.
2. Evento en cierre de bloque.
3. Evento inmediato en bloqueo.
4. Heartbeat cada 2-5 min mientras state=working.

Escalamiento automatico:
1. BLOCKED > 10 min: registrar alerta y notificar supervisor/dueno.
2. Riesgo HIGH: registrar alerta inmediata.
3. Cambio breaking no validado: gate BLOCKED inmediato.
4. Fallo integracion/regresion: bloquear merge/deploy.

Rol del dueno:
1. Monitoreo pasivo de ALERTAS_IDE.md y resumenes en canal maestro.
2. Intervencion solo cuando haya decision requerida.

Resumen ejecutivo sugerido (dueno):
1. Estado general: ON_TRACK | AT_RISK | BLOCKED
2. Ultimo bloque cerrado
3. Riesgo principal
4. Decision requerida
5. Siguiente paso
