import requests
import json

API_TOKEN = "ea308f9d57a2cc041a8bd87a4e16c680a9ff748f196dccca69b99c3d521b31f5"
BASE_URL = "http://76.13.250.83:3000/api/trpc"
HEADERS = {
    "Authorization": f"Bearer {API_TOKEN}",
    "Content-Type": "application/json"
}

def call_api(procedure, data):
    url = f"{BASE_URL}/{procedure}"
    response = requests.post(url, headers=HEADERS, json={"json": data})
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    return response.json()

# Probar editService
call_api("services.compose.editService", {
    "projectName": "postgres",
    "serviceName": "andrea-stack",
    "compose": "version: '3.8'\nservices:\n  test:\n    image: nginx"
})
