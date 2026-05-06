# Plan: Gestión de Soporte Avanzado y Autogestión de Inquilinos (SaaS)

## 1. Contexto y Problema
Actualmente, los requerimientos técnicos de los clientes (cambio de logos, ajustes de impuestos, activación de módulos, reglas de negocio) requieren cambios manuales en el código y despliegues (Git push). El objetivo es pasar a un modelo de **"Configuración sobre Código"**.

## 2. Arquitectura de Configuración Dinámica

### 2.1. Base de Datos Global (`src/data/saas_support.db`)
Añadir una nueva tabla para centralizar las reglas de negocio de cada empresa:
- **Tabla `tenant_settings`**:
  - `company_id` (TEXT, FK)
  - `setting_key` (TEXT: 'LOGO_URL', 'PRIMARY_COLOR', 'TAX_RATE', 'PAYROLL_DAYS', etc.)
  - `setting_value` (TEXT/JSON)
  - `category` (TEXT: 'IDENTITY', 'FINANCE', 'HR', 'SYSTEM')
  - `updated_at` (TIMESTAMP)

### 2.2. Servicio de Inyección de Contexto (`src/lib/tenantSettings.ts`)
Crear un servicio que:
- Consulte la caché o la DB global al cargar la aplicación.
- Proporcione una función `getSetting(companyId, key, defaultValue)` para usar en los componentes.

## 3. Herramientas para el Agente (Dashboard de Soporte)
Ubicación: `/src/app/administracion/soporte/gestion-clientes`

### 3.1. Editor de Identidad Visual
- Formulario para subir el logo (ISOLOGO.png) y guardarlo en `public/uploads/logos/[companyId].png`.
- Selector de colores de marca (CSS Variables dinámicas) que se inyectan en el `layout.tsx`.

### 3.2. Configuración de Reglas de Negocio (Business Rules)
- **Finanzas**: Editar tasa de IVA (16% -> 19%), moneda (COP), retenciones.
- **Gestión Humana**: Días de prestaciones, tipos de contrato permitidos, alertas de vencimiento.

### 3.3. Control de Módulos (Feature Flags)
- Interfaz de "Switches" para habilitar/deshabilitar módulos completos por cliente (Riesgos, Auditoría, Salud Mental, Turnos).

## 4. Flujo de Trabajo (Mañana)
1. **Crear tabla `tenant_settings`** y poblarla con valores iniciales de las empresas existentes.
2. **Implementar el Servicio de Configuración** en el backend.
3. **Refactorizar el Header y Sidebar** para que el logo y el nombre de la empresa vengan de la base de datos, no de archivos estáticos.
4. **Construir el formulario de edición** en el panel de soporte para que los agentes puedan realizar estos cambios con un clic.

---
*Guardado el 20 de marzo de 2026 para continuación de sesión.*
