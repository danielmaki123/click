# Auditoria: Conflicto de Resolucion ESM/Prisma en Monorepo

Fecha: 2026-04-04
Auditor: Supervisor tecnico
Alcance: Validar si los cambios recientes realmente resolvieron el conflicto ESM + Prisma.

## Dictamen Ejecutivo
Estado: NO RESUELTO.

El conflicto mejoro en algunos puntos de ESM (imports type-only y extension .js en API), pero el sistema sigue bloqueado por dos causas principales:
1) Build raiz del monorepo falla por configuracion de workspaces.
2) API no compila por referencias a cliente Prisma generado que no existe en la ruta esperada.

## Evidencia Verificada

### 1) Build raiz falla
Comando ejecutado:
- npm run build (raiz)

Resultado:
- turbo no resuelve workspaces por falta de campo packageManager en package.json.

Archivo relacionado:
- package.json (raiz): no contiene packageManager.

### 2) API build falla
Comando ejecutado:
- npm run build en apps/api

Errores confirmados:
- TS7006 en map/filter por parametros implicitos any en apps/api/src/routes/menu.ts.
- TS2307: no encuentra modulos en packages/database/src/index.ts:
  - ./generated/client/index.cjs
  - ./generated/client/index.js

### 3) Estado de generacion Prisma
- schema.prisma declara output personalizado:
  output = "../src/generated/client"
- En packages/database/src solo existe index.ts.
- No existe carpeta packages/database/src/generated/client en el estado auditado.

### 4) Riesgo de seguridad aun presente
- Conexion de BD hardcodeada en schema.prisma con credenciales reales.
- Esto viola buenas practicas de secretos por entorno y complica despliegues.

## Analisis Tecnico

A) Lo que SI se avanzo
- Ajuste ESM en API importando menuRoutes con extension .js.
- Uso de import type para FastifyInstance.
- Cambio de prisma a db como cliente compartido.

B) Lo que sigue roto
- Estrategia de export en packages/database/src/index.ts depende de artefactos generados no presentes.
- La API depende del paquete database y por eso cae compilacion aunque el codigo de rutas exista.
- Monorepo no puede orquestar build por falta de packageManager en raiz.

## Causa Raiz Probable
1) Se cambio el punto de entrada de database a cliente generado custom, pero no se aseguro pipeline de generacion previa (prisma generate) ni persistencia de artifacts.
2) Se aplico un ajuste parcial de ESM en API sin cerrar completamente tipado estricto en menu.ts.
3) La configuracion de Turborepo raiz sigue incompleta para resolver workspaces de forma estable.

## Severidad
- Critico: build raiz roto.
- Alto: API build rota por Prisma generated client ausente.
- Medio: any implicitos en ruta menu.
- Critico (seguridad): credenciales en schema.prisma.

## Criterio para considerar RESUELTO
Debe cumplirse todo:
1) Build raiz exitoso (npm run build en raiz).
2) Build API exitoso (npm run build en apps/api).
3) Ruta de cliente Prisma estable y reproducible (con generate validado).
4) Sin credenciales hardcodeadas en schema.prisma.
5) Evidencia de comandos y salida incluida en reporte de IDE ejecutora.

## Preguntas obligatorias para IDE ejecutora
1) Donde y cuando se ejecuta prisma generate en el flujo real de build?
2) Por que no existe packages/database/src/generated/client si schema declara ese output?
3) Cual es el plan exacto para que database exporte cliente compatible ESM/TS sin depender de rutas inexistentes?
4) Que correccion puntual haras para cerrar TS7006 sin debilitar strict mode?
5) En que commit/entrega moveras DATABASE_URL a env por entorno y eliminaras hardcode?

## Decision de supervision
No aprobar cierre de conflicto ESM/Prisma hasta completar evidencia tecnica de los 5 criterios de resolucion.
