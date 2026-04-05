$API_URL = "http://localhost:3001/api"
$menu = Invoke-RestMethod -Uri "$API_URL/r/casa-antigua/menu"
$itemId = $menu.categories[0].items[0].id
$orderBody = @{
    customerName = "Test Template Step 3"
    customerPhone = "12345678"
    items = @(@{ menuItemId = $itemId; quantity = 2 })
} | ConvertTo-Json
$res = Invoke-RestMethod -Method Post -Uri "$API_URL/r/casa-antigua/orders" -ContentType "application/json" -Body $orderBody
Write-Host "--- WhatsApp Summary ---"
Write-Host $res.whatsappSummary
