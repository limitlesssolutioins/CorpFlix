# Definición de Nuevos Tipos de Riesgo

Este documento define los criterios y catálogos para los tres nuevos tipos de riesgo que se agregarán al módulo de gestión de riesgos de CorpFlix.

---

## 1. Riesgos de Ciberseguridad

### Definición
Riesgos relacionados con la protección de activos de información, infraestructura tecnológica, y datos de la organización contra amenazas digitales.

### Consecuencias Específicas (Escala 1-5)

| Nivel | Consecuencia | Descripción |
|-------|--------------|-------------|
| 1. Insignificante | Mínima afectación a activos no críticos sin pérdida de datos | Afectación menor a sistemas no críticos, sin impacto operacional, sin pérdida de datos sensibles. |
| 2. Baja | Afectación a sistemas secundarios con impacto operacional menor | Interrupción temporal de servicios no críticos, exposición mínima de datos no sensibles, recuperación en menos de 24 horas. |
| 3. Media | Compromiso de sistemas importantes con pérdida parcial de datos | Interrupción de servicios importantes, pérdida parcial de datos operacionales, tiempo de recuperación de 1-3 días, posible notificación a clientes. |
| 4. Alta | Compromiso significativo de sistemas críticos con pérdida de datos sensibles | Interrupción de operaciones críticas, pérdida de datos sensibles o de clientes, daño reputacional, sanciones regulatorias, tiempo de recuperación de 3-7 días. |
| 5. Significativa | Compromiso total con pérdida catastrófica de datos e inhabilitación prolongada | Pérdida total de sistemas críticos, filtración masiva de datos, interrupción completa de operaciones por más de 7 días, daño reputacional severo, demandas legales significativas. |

### Catálogo de Riesgos de Ciberseguridad

| Tipo | Descripción | Causado Por | Impacto/Consecuencia |
|------|-------------|-------------|----------------------|
| ACCESO NO AUTORIZADO | Acceso a sistemas o datos por personas no autorizadas | Contraseñas débiles, falta de autenticación multifactor, credenciales comprometidas, gestión inadecuada de accesos | Robo de información, alteración de datos, pérdida de confidencialidad, daño reputacional |
| RANSOMWARE | Cifrado malicioso de información crítica de la organización | Falta de backups, vulnerabilidades sin parchear, falta de capacitación en phishing, ausencia de segmentación de red | Pérdida de información, paralización de operaciones, extorsión, daño reputacional, pérdidas económicas |
| PHISHING Y INGENIERÍA SOCIAL | Engaño a usuarios para obtener credenciales o información sensible | Falta de capacitación del personal, ausencia de filtros de correo, falta de cultura de seguridad | Compromiso de credenciales, pérdida de información, fraude financiero, acceso no autorizado |
| PÉRDIDA/FILTRACIÓN DE DATOS | Exposición no autorizada de información confidencial o personal | Configuraciones inseguras, falta de cifrado, errores humanos, controles de acceso inadecuados | Sanciones regulatorias (GDPR, LOPD), demandas legales, daño reputacional, pérdida de clientes |
| MALWARE Y VIRUS | Infección de sistemas con software malicioso | Antivirus desactualizado, navegación insegura, dispositivos USB no autorizados, falta de políticas de seguridad | Pérdida de datos, degradación del rendimiento, robo de información, uso de recursos para botnets |
| ATAQUES DDoS | Denegación de servicio por saturación de recursos | Falta de protección DDoS, infraestructura sin dimensionamiento adecuado, exposición pública de servicios | Interrupción de servicios, pérdida de disponibilidad, impacto en clientes, pérdidas económicas |
| VULNERABILIDADES SIN PARCHEAR | Explotación de debilidades conocidas en software | Gestión inadecuada de parches, falta de inventario de activos, ausencia de proceso de actualización | Compromiso de sistemas, escalación de privilegios, pérdida de datos, acceso no autorizado |
| INSIDER THREATS | Amenazas internas por empleados maliciosos o negligentes | Falta de controles de acceso, ausencia de monitoreo, gestión inadecuada de privilegios, cultura de seguridad deficiente | Robo de información, sabotaje, fraude, filtración de secretos comerciales |
| SHADOW IT | Uso de tecnologías no autorizadas o no gestionadas | Falta de políticas, procesos de aprobación lentos, desconocimiento de riesgos | Pérdida de control sobre datos, brechas de seguridad, incumplimiento regulatorio |
| BACKUP/RECUPERACIÓN INADECUADA | Fallas en procesos de respaldo y recuperación de datos | Backups no probados, almacenamiento inadecuado, frecuencia insuficiente, falta de plan de DR | Pérdida permanente de datos, imposibilidad de recuperación ante incidentes, paralización prolongada |

---

## 2. Riesgos Financieros

### Definición
Riesgos que pueden afectar la situación económica, flujo de caja, rentabilidad, y sostenibilidad financiera de la organización.

### Consecuencias Específicas (Escala 1-5)

| Nivel | Consecuencia | Descripción |
|-------|--------------|-------------|
| 1. Insignificante | Impacto menor al 1% del presupuesto operativo | Pérdida económica menor, sin impacto en flujo de caja, sin afectación a operaciones normales. |
| 2. Baja | Impacto del 1-5% del presupuesto operativo | Pérdida económica moderada, afectación menor al flujo de caja, puede requerir ajustes en presupuesto. |
| 3. Media | Impacto del 5-15% del presupuesto operativo | Pérdida económica significativa, impacto notable en flujo de caja, requiere medidas de ajuste, posible reducción de inversiones. |
| 4. Alta | Impacto del 15-30% del presupuesto operativo | Pérdida económica severa, crisis de liquidez, posible incumplimiento de obligaciones, reducción de personal, suspensión de proyectos. |
| 5. Significativa | Impacto superior al 30% del presupuesto o riesgo de insolvencia | Pérdida catastrófica, riesgo de quiebra, incapacidad de cumplir obligaciones financieras, cierre de operaciones. |

### Catálogo de Riesgos Financieros

| Tipo | Descripción | Causado Por | Impacto/Consecuencia |
|------|-------------|-------------|----------------------|
| FRAUDE FINANCIERO | Apropiación indebida de fondos o manipulación contable | Falta de controles internos, segregación inadecuada de funciones, ausencia de auditorías, conducta ética indeseable | Detrimento patrimonial, sanciones legales, pérdida de imagen, desconfianza de inversionistas |
| LIQUIDEZ | Insuficiencia de efectivo para cumplir obligaciones a corto plazo | Mala planificación del flujo de caja, retrasos en cobros, concentración de pagos, crecimiento no planificado | Incumplimiento con proveedores, deterioro de relaciones comerciales, insolvencia, quiebra |
| CRÉDITO/CARTERA | Incumplimiento de clientes en pago de obligaciones | Políticas de crédito inadecuadas, falta de análisis de clientes, ausencia de garantías, crisis económica | Pérdida de ingresos esperados, afectación al flujo de caja, incremento de provisiones, reducción de rentabilidad |
| TASA DE CAMBIO | Fluctuaciones adversas en tipos de cambio | Exposición a moneda extranjera, falta de cobertura, volatilidad del mercado | Pérdida en transacciones internacionales, incremento de costos, reducción de márgenes |
| TASA DE INTERÉS | Cambios adversos en tasas de interés | Deuda con tasa variable, falta de cobertura, decisiones de política monetaria | Incremento en costo de financiamiento, reducción de rentabilidad, afectación a inversiones |
| CONCENTRACIÓN DE CLIENTES | Dependencia excesiva de pocos clientes | Falta de diversificación, contratos de largo plazo sin respaldo, mercado limitado | Pérdida catastrófica de ingresos si se pierde cliente clave, vulnerabilidad estratégica |
| CONCENTRACIÓN DE PROVEEDORES | Dependencia de proveedores únicos o limitados | Mercado con pocos proveedores, falta de plan de contingencia, contratos sin alternativas | Interrupción de operaciones, incremento de costos, pérdida de poder de negociación |
| COSTOS OPERATIVOS | Incremento no planificado de gastos operativos | Inflación, ineficiencias operativas, falta de control de costos, aumento de salarios | Reducción de márgenes, pérdida de rentabilidad, necesidad de ajustes presupuestarios |
| INVERSIONES FALLIDAS | Pérdida en proyectos de inversión o activos | Análisis inadecuado de viabilidad, cambios en mercado, ejecución deficiente, sobrecostos | Pérdida de capital, reducción de patrimonio, afectación a flujo de caja |
| INCUMPLIMIENTO TRIBUTARIO | Errores o fraude en obligaciones fiscales | Desconocimiento normativo, errores contables, falta de asesoría, evasión deliberada | Sanciones fiscales, intereses moratorios, procesos legales, pérdida de imagen |
| OBSOLESCENCIA DE ACTIVOS | Pérdida de valor de activos por cambios tecnológicos o de mercado | Falta de plan de renovación, cambios tecnológicos acelerados, mala planificación | Reducción de eficiencia, pérdida de competitividad, necesidad de inversión no planificada |

---

## 3. Riesgos de Seguridad Vial

### Definición
Riesgos asociados con el uso de vehículos y desplazamientos del personal de la organización, que puedan resultar en accidentes de tránsito con consecuencias para personas, propiedad o la operación.

### Consecuencias Específicas (Escala 1-5)

| Nivel | Consecuencia | Descripción |
|-------|--------------|-------------|
| 1. Insignificante | Incidente sin lesiones ni daños materiales significativos | Incidente menor sin lesiones, daños materiales mínimos (rasguños, abolladuras menores), sin afectación operacional. |
| 2. Baja | Lesiones leves o daños materiales menores | Lesiones leves que requieren primeros auxilios, daños materiales reparables en menos de 3 días, incapacidad de 1-2 días. |
| 3. Media | Lesiones moderadas o daños materiales significativos | Lesiones que requieren hospitalización sin secuelas permanentes, incapacidad de 3-30 días, daños materiales significativos, pérdida temporal de vehículo. |
| 4. Alta | Lesiones graves con secuelas o daños materiales severos | Lesiones graves con incapacidad permanente parcial, hospitalización prolongada, pérdida total de vehículo, afectación severa a operaciones, demandas legales. |
| 5. Significativa | Una o más fatalidades | Muerte de uno o más personas, trauma organizacional severo, investigaciones legales, sanciones, pérdida total de imagen corporativa. |

### Catálogo de Riesgos de Seguridad Vial

| Tipo | Descripción | Causado Por | Impacto/Consecuencia |
|------|-------------|-------------|----------------------|
| ACCIDENTE DE TRÁNSITO | Colisión, volcamiento u otro incidente vial | Exceso de velocidad, distracción, incumplimiento de normas, condiciones viales adversas, fallas mecánicas | Lesiones o muerte, daños materiales, pérdidas económicas, responsabilidad legal, afectación de imagen |
| FATIGA DEL CONDUCTOR | Somnolencia o cansancio durante la conducción | Jornadas extendidas, falta de descanso, turnos nocturnos, trayectos largos sin pausas | Reducción de reflejos, riesgo de accidente, lesiones, muerte |
| CONDUCCIÓN BAJO EFECTOS | Conducción bajo influencia de alcohol, drogas o medicamentos | Falta de políticas, ausencia de controles, cultura organizacional deficiente | Accidentes graves, fatalidades, responsabilidad penal y civil, pérdida de imagen |
| DISTRACCIÓN AL VOLANTE | Uso de celular, comer, o distracciones durante la conducción | Falta de políticas de uso de dispositivos, ausencia de cultura de seguridad, presión por responder comunicaciones | Colisiones, lesiones, daños materiales, responsabilidad legal |
| EXCESO DE VELOCIDAD | Conducción a velocidades superiores a las permitidas | Presión por cumplir horarios, falta de supervisión, ausencia de telemetría, cultura de riesgo | Accidentes severos, lesiones graves o fatalidades, sanciones legales, pérdida de vehículos |
| MANTENIMIENTO INADECUADO | Vehículos en mal estado mecánico o de seguridad | Falta de programa de mantenimiento preventivo, ausencia de inspecciones, reducción de costos inadecuada | Fallas mecánicas durante operación, accidentes, lesiones, costos de reparación elevados |
| CONDICIONES CLIMÁTICAS ADVERSAS | Conducción en lluvia intensa, neblina, tormentas | Falta de capacitación en conducción defensiva, ausencia de protocolos de suspensión de viaje, presión por cumplir agenda | Pérdida de control del vehículo, colisiones, volcamientos, lesiones o muerte |
| CONDICIONES VIALES DEFICIENTES | Vías en mal estado, sin señalización adecuada | Rutas mal seleccionadas, falta de reconocimiento previo, ausencia de alternativas | Daños al vehículo, accidentes, lesiones, retrasos operacionales |
| CARGA INADECUADA | Transporte de carga mal asegurada o sobrepeso | Falta de capacitación en aseguramiento de carga, presión por optimizar viajes, ausencia de inspección | Pérdida de estabilidad, volcamiento, caída de carga, daños a terceros, accidentes |
| CONDUCTOR NO COMPETENTE | Personal sin licencia adecuada o capacitación insuficiente | Falta de verificación de documentos, ausencia de programa de capacitación en conducción defensiva | Accidentes por impericia, responsabilidad legal de la organización, sanciones |
| ESTRÉS Y PRESIÓN LABORAL | Conducción bajo presión por cumplir tiempos o metas | Planificación inadecuada de rutas y tiempos, cultura de urgencia, falta de recursos | Conducción riesgosa, exceso de velocidad, fatiga, accidentes |
| AGRESIÓN VIAL | Conflictos con otros conductores o peatones | Falta de cultura de respeto, estrés del conductor, ausencia de capacitación en manejo de conflictos | Accidentes por maniobras agresivas, lesiones, implicaciones legales |

---

## Implementación en el Sistema

### Configuración de Consecuencias por Categoría

Cada categoría de riesgo tendrá su propia escala de consecuencias:

**Tabla: `consequence_criteria`**
```sql
CREATE TABLE consequence_criteria (
  id INT PRIMARY KEY AUTO_INCREMENT,
  category_id INT NOT NULL,
  level INT NOT NULL, -- 1-5
  name VARCHAR(50), -- 'Insignificante', 'Baja', 'Media', 'Alta', 'Significativa'
  description TEXT,
  FOREIGN KEY (category_id) REFERENCES risk_categories(id),
  UNIQUE KEY (category_id, level)
);
```

### Uso en Evaluación de Riesgos

Cuando un usuario evalúa un riesgo:
1. Selecciona la **Probabilidad** (1-5, universal para todas las categorías)
2. Selecciona la **Consecuencia** (1-5, con descripción específica según la categoría del riesgo)
3. El sistema calcula automáticamente: **Riesgo Inherente = Probabilidad × Consecuencia** (1-25)
4. Aplica el **Factor de Conversión** según la tabla de criterios
5. Usuario define **Controles** y su **Eficacia** (1-5)
6. Sistema calcula **Riesgo Residual** aplicando la eficacia de controles
7. Determina el **Nivel Final**: Aceptable / Alerta / No Aceptable

### Ventaja del Enfoque

- **Flexibilidad**: Cada tipo de riesgo (Calidad, SST, Ambiental, Ciberseguridad, Financiero, Seguridad Vial) tiene consecuencias específicas relevantes a su dominio
- **Consistencia**: Se mantiene el mismo framework de evaluación (5×5, factores de conversión, etc.) para facilitar comparación
- **Valor Real**: Las descripciones específicas ayudan a los evaluadores a tomar decisiones más precisas
- **Escalabilidad**: Fácil agregar nuevas categorías en el futuro
