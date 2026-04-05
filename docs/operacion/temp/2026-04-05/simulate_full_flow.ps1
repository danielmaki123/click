# simulate_full_flow.ps1
$API_URL = "http://localhost:3001/api"
$SECRET = "click_mc_secret_2026"

Write-Host "--- Iniciando Simulación de Flujo ManyChat ---" -ForegroundColor Cyan

# 1. Obtener un item válido
$menu = Invoke-RestMethod -Uri "$API_URL/r/casa-antigua/menu"
$itemId = $menu.categories[0].items[0].id

# 2. Crear Orden
$orderBody = @{
    customerName = "Simulación Step 2"
    customerPhone = "99999999"
    items = @(@{ menuItemId = $itemId; quantity = 1 })
} | ConvertTo-Json

$order = Invoke-RestMethod -Method Post -Uri "$API_URL/r/casa-antigua/orders" -ContentType "application/json" -Body $orderBody
$orderId = $order.id
Write-Host "1. Orden Creada: $orderId (Status: PENDING)" -ForegroundColor Green

# Función para llamar al webhook
function Call-MCWebhook($id, $action) {
    $body = @{ orderId = $id; action = $action; secret = $SECRET } | ConvertTo-Json
    return Invoke-RestMethod -Method Post -Uri "$API_URL/webhooks/manychat" -ContentType "application/json" -Body $body
}

# 3. Webhook ACCEPT
$res1 = Call-MCWebhook $orderId "ACCEPT"
Write-Host "2. Webhook ACCEPT: status $($res1.newStatus)" -ForegroundColor Green

# 4. Webhook READY
$res2 = Call-MCWebhook $orderId "READY"
Write-Host "3. Webhook READY: status $($res2.newStatus)" -ForegroundColor Green

# 5. Webhook COMPLETE
$res3 = Call-MCWebhook $orderId "COMPLETE"
Write-Host "4. Webhook COMPLETE: status $($res3.newStatus)" -ForegroundColor Green

Write-Host "--- Simulación Finalizada ---" -ForegroundColor Cyan
