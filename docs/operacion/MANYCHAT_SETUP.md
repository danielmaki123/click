# Configuración de ManyChat Pro (Proyecto Click)

Este documento detalla la configuración necesaria para integrar ManyChat con el backend de Click.

## 1. Variables de Entorno
Se requiere la siguiente variable en el entorno de producción y desarrollo:
- `MANYCHAT_WEBHOOK_SECRET`: Secreto compartido para validar los webhooks recibidos. Valor actual: `click_mc_secret_2026`.

## 2. Contrato del Webhook
- **Endpoint**: `POST /api/webhooks/manychat`
- **Acciones Soportadas**:
  - `ACCEPT`: Pasa el pedido de `PENDING` a `ACCEPTED`.
  - `REJECT`: Rechaza el pedido.
  - `READY`: Pasa el pedido a `READY` (Producto Listo).
  - `COMPLETE`: Marca como `COMPLETED` (Entregado).

## 3. Mapeo de Campos ManyChat
ManyChat debe enviar un JSON con los siguientes campos obligatorios:
```json
{
  "orderId": "{{id_del_pedido}}",
  "action": "ACCEPT|REJECT|READY|COMPLETE",
  "secret": "click_mc_secret_2026"
}
```

## 4. Obtención de Datos de Pedido
ManyChat puede obtener el resumen formateado para WhatsApp consumiendo el campo `whatsappSummary` retornado por:
- `POST /api/r/:slug/orders` (en la creación).
- `GET /api/r/:slug/orders/:orderNumber` (para consulta posterior).

## 5. Pruebas de Integración
Se recomienda el uso del script `docs/operacion/temp/2026-04-05/simulate_full_flow.ps1` para validar transiciones sin necesidad de ManyChat activo.
