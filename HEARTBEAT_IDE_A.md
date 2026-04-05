# Heartbeat IDE_A

Ultima actualizacion: 2026-04-05T00:00:00Z

Formato:
1. TIME
2. STATE
3. BLOCK
4. ETA
5. NEXT

Estado actual:
1. TIME: 2026-04-05T00:00:00Z
2. STATE: working
3. BLOCK: BOOTSTRAP
4. ETA: 5m
5. NEXT: Sincronizar evento de cierre

Reglas:
1. Actualizar cada 2-5 min si STATE=working.
2. Si STATE=blocked, actualizar de inmediato y levantar alerta.
3. Si no hay update > 10 min, supervisor revisa bloqueo silencioso.
