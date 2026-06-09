# Proyecto Lidus

Lidus es una plataforma integral SaaS (Software as a Service) diseñada para la gestión humana y el direccionamiento estratégico en el mercado colombiano. Combina automatización de procesos, inteligencia artificial y cumplimiento normativo en una sola interfaz.

## Estructura de la Suscripción

A partir de la sesión actual, Lidus opera bajo un modelo de **Suscripción Única (Lidus Total)**.

- **Precio de Lanzamiento:** $50.000 COP / mes (Tiempo limitado).
- **Alcance:** Acceso ilimitado a todos los módulos y herramientas.

## Módulos y Servicios Principales

### 1. Gestión Humana y Nómina
- **Gestión de Talento Humano:** Administración integral de personal, registro de perfiles, liquidación de nómina y prestaciones sociales bajo normativa colombiana.
- **Turnos y Asistencia:** Control en tiempo real, turnos rotativos y cálculo automático de recargos.
- **Salud Mental:** Evaluación de riesgo psicosocial y herramientas de bienestar organizacional.

### 2. Auditorías y diagnósticos de normas legales e internacionales
- **Auditorías y Diagnósticos:** Soporte para evaluación de cumplimiento en Calidad, Gestión Ambiental y Seguridad y Salud.
- **Res. 0312:** Cumplimiento de estándares mínimos del Ministerio de Trabajo (SGSST).
- **Gestión de Riesgos:** Generación automática de matrices y planes de acción con Inteligencia Artificial.
- **Gestión de Procesos:** Mapeo, diagramación y documentación técnica de la operación corporativa.

### 3. Ingeniería Financiera
- **Diagnóstico Financiero:** Evaluación cualitativa y cuantitativa de la salud financiera, ratios de liquidez y rentabilidad.
- **Proyección de Renta:** Simulador de impuestos y proyección de utilidades netas bajo normativa colombiana.

### 4. Direccionamiento Estratégico
- **Indicadores:** Visualización de métricas clave (KPIs) de asistencia, financieros y operativos.
- **Soporte:** Sistema de tickets integrado para atención al cliente.

### 5. Control Maestro (Back-office)
- **Gestión Estructural:** Panel administrativo para crear, editar y eliminar categorías de auditoría, normas legales, capítulos y listas de chequeo.
- **Estandarización:** Herramienta centralizada para escalar la plataforma con nuevas normativas sin intervención directa en código.

## Stack Tecnológico
- **Frontend:** React.js + Next.js (App Router).
- **Estilos:** Tailwind CSS.
- **Backend:** Node.js (API Routes).
- **IA:** Integración con modelos de inteligencia artificial avanzados para análisis y generación de contenido.
- **Infraestructura:** Despliegue en VPS (GoDaddy) con flujo de trabajo vía GitHub.

## Notas de Sesión (2026-06-09)
- Simplificación del modelo de precios a una sola suscripción de lanzamiento ($50k).
- Actualización de terminología en Landing Page ("Suscripción" en lugar de "Planes").
- Reemplazo de "ISO/BPM" por lenguaje de normas legales e internacionales y procesos.
- Rediseño del módulo de Auditoría con interfaz tipo "App Mobile" (cuadrícula de iconos).
- Implementación del **Control Maestro** para gestión dinámica de auditorías y normativas.
- Creación de este documento estructural (`PROYECTO.md`).
- **Seguridad e Integración del Portal de Control & Soporte Maestro:**
  - Se desacopló por completo el "Control Maestro" de la barra lateral estándar para que los usuarios finales no puedan visualizarlo ni acceder a él.
  - Se convirtió en un portal autónomo de pantalla completa (`FULL_SCREEN_PATHS` en Layout) accesible en `/administracion/control-maestro` protegido por credenciales de soporte independientes (`soporte@lidus.co` / `LidusSoporte2026!`).
  - Se integró el **Soporte en Vivo** (chat WebSocket bidireccional permanente y visualización de tickets fallback) y la **Administración de Licencias & Suscripciones** de todas las empresas.
  - Se elevó la gestión de **Categorías de Auditoría** (`AuditCategory`) a una tabla e interfaz de primer nivel (CRUD completo con modal interactivo), lo que permite agrupar y visualizar dinámicamente las normas por categoría en la cuadrícula de auditorías.
