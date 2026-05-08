# Andrea: Personal AI Agent
Sistema de inteligencia artificial autónomo basado en Hermes Agent y Ollama.

## Arquitectura
- **Orquestador:** [Hermes Agent](https://github.com/nousresearch/hermes-agent)
- **Motor LLM:** [Ollama](https://ollama.com/) (Llama 3.2 3B)
- **Despliegue:** Docker / Easypanel

## Estructura
- `.hermes/`: Configuración de la personalidad (SOUL.md) y memoria.
- `docker-compose.yml`: Definición de servicios para el VPS.

## Setup
Este proyecto está diseñado para ser desplegado automáticamente en Easypanel.
1. El servicio `ollama` descarga automáticamente el modelo llama3.2.
2. El servicio `andrea` se conecta al gateway de Telegram.

---
*Proyecto Andrea - Automatizado por Gemini CLI*
