$API_URL = "http://localhost:3001/api"
$SLUG = "casa-antigua"
$SECRET = "click_mc_secret_2026"

Write-Host "--- Verificando Step 5 (Polling API) ---" -ForegroundColor Cyan

# 1. Crear Orden
$menu = Invoke-RestMethod -Uri "$API_URL/r/$SLUG/menu"
$itemId = $menu.categories[0].items[0].id
$orderBody = @{
    customerName = "E2E Step 5 User"
    customerPhone = "12345678"
    items = @(@{ menuItemId = $itemId; quantity = 1 })
} | ConvertTo-Json
$order = Invoke-RestMethod -Method Post -Uri "$API_URL/r/$SLUG/orders" -ContentType "application/json" -Body $orderBody
$orderId = $order.id
$orderNumber = $order.orderNumber
Write-Host "1. Orden #$orderNumber creada (Status: $($order.status))" -ForegroundColor Green

# 2. Verificar GET Status Inicial
$status0 = Invoke-RestMethod -Uri "$API_URL/r/$SLUG/orders/$orderNumber"
Write-Host "2. GET Status Inicial: $($status0.status)" -ForegroundColor Green

# 3. Webhook ACCEPT y verificar GET
$bodyAccept = @{ orderId = $orderId; action = "ACCEPT"; secret = $SECRET } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "$API_URL/webhooks/manychat" -ContentType "application/json" -Body $bodyAccept | Out-Null
$status1 = Invoke-RestMethod -Uri "$API_URL/r/$SLUG/orders/$orderNumber"
Write-Host "3. GET Status tras ACCEPT: $($status1.status)" -ForegroundColor Green

# 4. Webhook READY y verificar GET
$bodyReady = @{ orderId = $orderId; action = "READY"; secret = $SECRET } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "$API_URL/webhooks/manychat" -ContentType "application/json" -Body $bodyReady | Out-Null
$status2 = Invoke-RestMethod -Uri "$API_URL/r/$SLUG/orders/$orderNumber"
Write-Host "4. GET Status tras READY: $($status2.status)" -ForegroundColor Green

Write-Host "--- Verificación E2E Step 5 Finalizada ---" -ForegroundColor Cyan
