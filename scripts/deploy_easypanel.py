import requests
import json
import sys

# Configuración
API_TOKEN = "ea308f9d57a2cc041a8bd87a4e16c680a9ff748f196dccca69b99c3d521b31f5"
BASE_URL = "http://76.13.250.83:3000/api/trpc" # URL actualizada con la IP del VPS
PROJECT_NAME = "andrea-bot" # Minúsculas requeridas por Easypanel
SERVICE_NAME = "andrea-stack"

HEADERS = {
    "Authorization": f"Bearer {API_TOKEN}",
    "Content-Type": "application/json"
}

def call_api(procedure, data):
    url = f"{BASE_URL}/{procedure}"
    print(f"Llamando a {url}...")
    response = requests.post(url, headers=HEADERS, json={"json": data})
    if response.status_code not in [200, 201]:
        print(f"Error en {procedure}: {response.text}")
        return None
    return response.json()

def deploy_andrea():
    # 1. Leer docker-compose.yml
    try:
        with open("docker-compose.yml", "r") as f:
            compose_content = f.read()
    except Exception as e:
        print(f"Error leyendo docker-compose: {e}")
        return

    # 2. Crear Proyecto
    print("Creando proyecto...")
    call_api("projects.createProject", {"name": PROJECT_NAME})

    # 3. Crear Servicio Compose
    print("Creando servicio de stack...")
    # El API suele usar nombres como compose.createService o similares
    # Probaremos con el patrón descubierto 'createService'
    call_api("services.createService", {
        "projectName": PROJECT_NAME,
        "type": "app", # Ajustar si es necesario
        "name": SERVICE_NAME
    })

    # 4. Actualizar Contenido
    print("Subiendo configuración de Docker Compose...")
    call_api("compose.update", {
        "projectName": PROJECT_NAME,
        "serviceName": SERVICE_NAME,
        "source": {
            "type": "content",
            "content": compose_content
        }
    })

    # 5. Desplegar
    print("Iniciando despliegue...")
    result = call_api("compose.deploy", {
        "projectName": PROJECT_NAME,
        "serviceName": SERVICE_NAME
    })
    
    if result:
        print("\n✅ ¡Despliegue de Andrea iniciado con éxito!")
        print(f"Puedes verlo en tu Easypanel bajo el proyecto '{PROJECT_NAME}'.")

if __name__ == "__main__":
    deploy_andrea()
