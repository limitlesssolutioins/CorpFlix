
-- VARIABLES DE REQUISITOS (CRITERIOS DE EVALUACIÓN)
-- Generado automáticamente desde los documentos base
-- =====================================================


-- Criterios para ISO 9001:2015 (ISO9001)

-- Criterios para requisito 4.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Las cuestiones externas e internas que son pertinentes para su propósito y que afectan a su capacidad para lograr los resultados previstos de su sistema de gestión de Calidad', 1
FROM iso_requirements WHERE requirement_code = '4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 4.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a. Las partes interesadas que son pertinentes al sistema de gestión de calidad;', 1
FROM iso_requirements WHERE requirement_code = '4.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b.Los requisitos de estas partes interesadas que son pertientes para el sistema de gestión de la calidad.', 2
FROM iso_requirements WHERE requirement_code = '4.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe realizar el seguimiento y la revisión de la información sobre estas partes interesadas y sus requisitos pertinentes.', 3
FROM iso_requirements WHERE requirement_code = '4.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 4.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Determinar los limites y la aplicabilidad del SGC para establecer su alcance', 1
FROM iso_requirements WHERE requirement_code = '4.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a. Las cuestiones externas e internas referidas en 4.1;', 2
FROM iso_requirements WHERE requirement_code = '4.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b. Los requisitos de las partes interesadas pertientes referidos en el apartado 4.2;', 3
FROM iso_requirements WHERE requirement_code = '4.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c. Los productios y servicios de la organización;', 4
FROM iso_requirements WHERE requirement_code = '4.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'El alcance debe estar disponible y mantenerse  como información documentada estableciendo:', 5
FROM iso_requirements WHERE requirement_code = '4.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Los tipos de productos y servicios cubiertos por el sistema de gestión de la calidad;', 6
FROM iso_requirements WHERE requirement_code = '4.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La justificación para cualquier requisito de esta norma internacional que la organización determine que no es aplicable para el alcance de su SGC.', 7
FROM iso_requirements WHERE requirement_code = '4.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 4.4.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe establecer, implementar, mantener y mejorar continuamente un sistema de gestión de la calidad, incluidos los procesos necesarios y sus interacciones, de acuerdo con los requisitos de esta Norma Internacional', 1
FROM iso_requirements WHERE requirement_code = '4.4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar los procesos necesarios para el sistema de gestión de la calidad y su aplicación a través de la organización, y debe:', 2
FROM iso_requirements WHERE requirement_code = '4.4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'determinar las entradas requeridas y las salidas esperados de estos procesos;', 3
FROM iso_requirements WHERE requirement_code = '4.4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'determinar la secuencia e interacción de estos procesos;', 4
FROM iso_requirements WHERE requirement_code = '4.4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'determinar y aplicar los criterios y los métodos (incluyendo el seguimiento, la medición y los indicadores del desempeño relacionados) necesarios para asegurarse la operación eficaz y el control de estos procesos;', 5
FROM iso_requirements WHERE requirement_code = '4.4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'determinar los recursos necesarios para estos procesos y asegurarse de su disponibilidad;', 6
FROM iso_requirements WHERE requirement_code = '4.4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'asignar las responsabilidades y autoridades para estos procesos;', 7
FROM iso_requirements WHERE requirement_code = '4.4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'abordar los riesgos y oportunidades determinados de acuerdo con los requisitos del apartado 6.1;', 8
FROM iso_requirements WHERE requirement_code = '4.4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'valorar estos procesos e implementar cualquier cambio necesario para asegurarse de que estos procesos logran los resultados previstos;', 9
FROM iso_requirements WHERE requirement_code = '4.4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'mejorar los procesos y el sistema de gestión de la calidad.', 10
FROM iso_requirements WHERE requirement_code = '4.4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 4.4.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'En la medida en que sea necesario, la organización debe:', 1
FROM iso_requirements WHERE requirement_code = '4.4.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'mantener información documentada para apoyar la operación de sus procesos;', 2
FROM iso_requirements WHERE requirement_code = '4.4.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'conservar la información documentada para tener la confianza de que los procesos se realizan según lo planificado.', 3
FROM iso_requirements WHERE requirement_code = '4.4.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 5.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '5.2.1.Desarrollar la politica de la calidad
La alta dirección debe establecer, implementar y mantener una política de la calidad que:', 1
FROM iso_requirements WHERE requirement_code = '5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'sea apropiada al propósito y al contexto de la organización y apoya su dirección estratégica;', 2
FROM iso_requirements WHERE requirement_code = '5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'proporcione un marco de referencia para el establecimiento de los objetivos de la calidad', 3
FROM iso_requirements WHERE requirement_code = '5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'incluya el compromiso de cumplir los requisitos aplicables;', 4
FROM iso_requirements WHERE requirement_code = '5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'incluya el compromiso de mejora continua del sistema de gestión de la calidad.', 5
FROM iso_requirements WHERE requirement_code = '5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '5.2.2  Comunicar la politica de la calidad 
La política de la calidad debe:', 6
FROM iso_requirements WHERE requirement_code = '5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'estar disponible y mantenerse como información documentada;', 7
FROM iso_requirements WHERE requirement_code = '5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'comunicarse, entenderse y aplicarse dentro de la organización;', 8
FROM iso_requirements WHERE requirement_code = '5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'estar disponible para las partes interesadas pertinentes, según corresponda.', 9
FROM iso_requirements WHERE requirement_code = '5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 5.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'ROLES, RESPONSABILIDADES Y AUTORIDADES EN LA ORGANIZACIÓN', 1
FROM iso_requirements WHERE requirement_code = '5.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe asegurarse de que las responsabilidades y autoridades para los roles pertinentes se asignen, se comuniquen y se entiendan dentro de la organización. 
La alta dirección debe asignar la responsabilidad y autoridad para:', 2
FROM iso_requirements WHERE requirement_code = '5.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'asegurarse de que el sistema de gestión de la calidad es conforme con los requisitos de esta Norma Internacional;', 3
FROM iso_requirements WHERE requirement_code = '5.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'asegurarse de que los procesos están dando las salidas previstas;', 4
FROM iso_requirements WHERE requirement_code = '5.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'informar a la alta dirección sobre el desempeño del sistema de gestión de la calidad y sobre las oportunidades de mejora (véase 10.1);', 5
FROM iso_requirements WHERE requirement_code = '5.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'asegurarse de que se promueva el enfoque al cliente a través de la organización;', 6
FROM iso_requirements WHERE requirement_code = '5.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'asegurarse de que la integridad del sistema de gestión de la calidad se mantiene cuando se planifican e implementan cambios en el sistema de gestión de la calidad', 7
FROM iso_requirements WHERE requirement_code = '5.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 6.1.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al planificar el sistema de gestión de la calidad, la organización debe considerar las cuestiones referidas en el apartado 4.1 y los requisitos referidos en el apartado 4.2, y determinar los riesgos y oportunidades que es necesario abordar con el fin de:', 1
FROM iso_requirements WHERE requirement_code = '6.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'asegurar que el sistema de gestión de la calidad pueda lograr sus resultados previstos;', 2
FROM iso_requirements WHERE requirement_code = '6.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'aumentar los efectos deseables;', 3
FROM iso_requirements WHERE requirement_code = '6.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'prevenir o reducir efectos no deseados;', 4
FROM iso_requirements WHERE requirement_code = '6.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'lograr la mejora', 5
FROM iso_requirements WHERE requirement_code = '6.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 6.1.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'las acciones para abordar estos riesgos y oportunidades;', 1
FROM iso_requirements WHERE requirement_code = '6.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La manera de:   
1) integrar e implementar las acciones en sus procesos del sistema de gestión de la calidad;', 2
FROM iso_requirements WHERE requirement_code = '6.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'evaluar la eficacia de estas acciones.', 3
FROM iso_requirements WHERE requirement_code = '6.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Las acciones tomadas para abordar los riesgos y oportunidades deben ser proporcionales al impacto potencial en la conformidad de los productos y los servicios', 4
FROM iso_requirements WHERE requirement_code = '6.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 6.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'OBJETIVOS DE LA CALIDAD Y PLANIFICACIÓN PARA LOGRARLOS', 1
FROM iso_requirements WHERE requirement_code = '6.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 6.2.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe establecer los objetivos de la calidad para las funciones, niveles y procesos pertinentes necesarios para el sistema de gestión de la calidad.', 1
FROM iso_requirements WHERE requirement_code = '6.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Los objetivos de la calidad deben:', 2
FROM iso_requirements WHERE requirement_code = '6.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'ser coherentes con la política de la calidad;', 3
FROM iso_requirements WHERE requirement_code = '6.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'ser medibles;', 4
FROM iso_requirements WHERE requirement_code = '6.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'tener en cuenta los requisitos aplicables;', 5
FROM iso_requirements WHERE requirement_code = '6.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'ser pertinentes para la conformidad de los productos y servicios y para el aumento de la satisfacción del cliente;', 6
FROM iso_requirements WHERE requirement_code = '6.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'ser objeto de seguimiento;', 7
FROM iso_requirements WHERE requirement_code = '6.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'comunicarse', 8
FROM iso_requirements WHERE requirement_code = '6.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'actualizarse, según corresponda.', 9
FROM iso_requirements WHERE requirement_code = '6.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe mantener información documentada sobre los objetivos de la calidad.', 10
FROM iso_requirements WHERE requirement_code = '6.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 6.2.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al planificar cómo lograr sus objetivos de la calidad, la organización debe determinar:', 1
FROM iso_requirements WHERE requirement_code = '6.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'qué se va a hacer;', 2
FROM iso_requirements WHERE requirement_code = '6.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'qué recursos se requerirán;', 3
FROM iso_requirements WHERE requirement_code = '6.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'quién será responsable;', 4
FROM iso_requirements WHERE requirement_code = '6.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'cuándo se finalizará;', 5
FROM iso_requirements WHERE requirement_code = '6.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'cómo se evaluarán los resultados.', 6
FROM iso_requirements WHERE requirement_code = '6.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 6.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'el propósito de los cambios y sus potenciales consecuencias;', 1
FROM iso_requirements WHERE requirement_code = '6.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'la integridad del sistema de gestión de la calidad;', 2
FROM iso_requirements WHERE requirement_code = '6.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'la disponibilidad de recursos;', 3
FROM iso_requirements WHERE requirement_code = '6.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'la asignación o reasignación de responsabilidades y autoridades.', 4
FROM iso_requirements WHERE requirement_code = '6.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 7.1.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar y proporcionar las personas necesarias para implementación eficaz de su sistema de gestión de la calidad y para la operación y control de sus procesos.', 1
FROM iso_requirements WHERE requirement_code = '7.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 7.1.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar, proporcionar y mantener la infraestructura necesaria para que la operación de sus procesos logre la conformidad de los productos y servicios.', 1
FROM iso_requirements WHERE requirement_code = '7.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '7.1.4. Ambiente para la operación de los procesos', 2
FROM iso_requirements WHERE requirement_code = '7.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar, proporcionar y mantener el ambiente necesario para la operación de sus procesos y para lograr la conformidad de los productos y servicios.', 3
FROM iso_requirements WHERE requirement_code = '7.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '7.1.5 Recursos de seguimiento y medición
7.1.5.1 Generalidades', 4
FROM iso_requirements WHERE requirement_code = '7.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar y proporcionar los recursos necesarios para asegurarse de la validez y fiabilidad de los resultados cuando el seguimiento o la medición se utilizan para verificar la conformidad de los productos y servicios con los requisitos.', 5
FROM iso_requirements WHERE requirement_code = '7.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que los recursos proporcionados:', 6
FROM iso_requirements WHERE requirement_code = '7.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'son adecuados para el tipo específico de actividades de seguimiento y medición realizadas;', 7
FROM iso_requirements WHERE requirement_code = '7.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'se mantienen para asegurarse de la adecuación continua para su propósito.', 8
FROM iso_requirements WHERE requirement_code = '7.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe conservar la información documentada adecuada como evidencia de la adecuación para el propósito del seguimiento y medición de los recursos.', 9
FROM iso_requirements WHERE requirement_code = '7.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '7.1.5.2 Trazabilidad de las mediciones', 10
FROM iso_requirements WHERE requirement_code = '7.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando la trazabilidad de las mediciones sea un requisito, o es considerada por la organización como parte esencial de proporcionar confianza en la validez de los resultados de la medición, el equipo de medición debe:', 11
FROM iso_requirements WHERE requirement_code = '7.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'verificarse o calibrarse, o ambas, a intervalos especificados, o antes de su utilización, comparando con patrones de medición trazables a patrones de medición internacionales o nacionales; cuando no existan tales patrones, debe conservarse como información documentada la base utilizada para la calibración o la verificación;', 12
FROM iso_requirements WHERE requirement_code = '7.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'identificarse para determinar su estado;', 13
FROM iso_requirements WHERE requirement_code = '7.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'protegerse contra ajustes, daño o deterioro que pudieran invalidar el estado de calibración y los posteriores resultados de la medición.', 14
FROM iso_requirements WHERE requirement_code = '7.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar si la validez de los resultados de medición previos se ha visto afectada de manera adversa cuando el equipo de medición se considere no apto para su propósito previsto, y debe tomar las acciones adecuadas cuando sea necesario.', 15
FROM iso_requirements WHERE requirement_code = '7.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 7.1.6
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar los conocimientos necesarios para la operación de sus procesos y para lograr la conformidad de los productos y servicios.', 1
FROM iso_requirements WHERE requirement_code = '7.1.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Estos conocimientos deben mantenerse y ponerse a disposición en la extensión necesaria.', 2
FROM iso_requirements WHERE requirement_code = '7.1.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando se tratan las necesidades y tendencias cambiantes, la organización debe considerar sus conocimientos actuales y determinar cómo adquirir o acceder a los conocimientos adicionales necesarios y a las actualizaciones requeridas.', 3
FROM iso_requirements WHERE requirement_code = '7.1.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 7.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe:', 1
FROM iso_requirements WHERE requirement_code = '7.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'determinar la competencia necesaria de las personas que realizan, bajo su control, un trabajo que afecta al desempeño y eficacia del sistema de gestión de la calidad;', 2
FROM iso_requirements WHERE requirement_code = '7.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'asegurarse de que estas personas sean competentes, basándose en la educación, formación o experiencia adecuadas;', 3
FROM iso_requirements WHERE requirement_code = '7.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'cuando sea aplicable, tomar acciones para adquirir la competencia necesaria y evaluar la eficacia de las acciones tomadas;', 4
FROM iso_requirements WHERE requirement_code = '7.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'conservar la información documentada apropiada, como evidencia de la competencia.', 5
FROM iso_requirements WHERE requirement_code = '7.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 7.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que las personas pertinentes que realizan el trabajo bajo el control de la organización toman conciencia de:', 1
FROM iso_requirements WHERE requirement_code = '7.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'la política de la calidad;', 2
FROM iso_requirements WHERE requirement_code = '7.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'los objetivos de la calidad pertinentes;', 3
FROM iso_requirements WHERE requirement_code = '7.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'su contribución a la eficacia del sistema de gestión de la calidad, incluyendo los beneficios de una mejora del desempeño;', 4
FROM iso_requirements WHERE requirement_code = '7.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'las implicaciones de no cumplir los requisitos del sistema de gestión de la calidad.', 5
FROM iso_requirements WHERE requirement_code = '7.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 7.4
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar las comunicaciones internas y externas pertinentes al sistema de gestión de la calidad, que incluyan:', 1
FROM iso_requirements WHERE requirement_code = '7.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'qué comunicar;', 2
FROM iso_requirements WHERE requirement_code = '7.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'cuándo comunicar;', 3
FROM iso_requirements WHERE requirement_code = '7.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a quién comunicar;', 4
FROM iso_requirements WHERE requirement_code = '7.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'cómo comunicar.', 5
FROM iso_requirements WHERE requirement_code = '7.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'quién comunica.', 6
FROM iso_requirements WHERE requirement_code = '7.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '7.5 INFORMACIÓN DOCUMENTADA
7.5.1 Generalidades', 7
FROM iso_requirements WHERE requirement_code = '7.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'El sistema de gestión de la calidad de la organización debe incluir:', 8
FROM iso_requirements WHERE requirement_code = '7.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'la información documentada requerida por esta Norma Internacional', 9
FROM iso_requirements WHERE requirement_code = '7.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'la información documentada que la organización ha determinado que es necesaria para la eficacia del sistema de gestión de la calidad.', 10
FROM iso_requirements WHERE requirement_code = '7.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 7.5.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando se crea y actualiza información documentada, la organización debe asegurarse de que lo siguiente sea apropiado', 1
FROM iso_requirements WHERE requirement_code = '7.5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'la identificación y descripción (por ejemplo, título, fecha, autor o número de referencia);', 2
FROM iso_requirements WHERE requirement_code = '7.5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'el formato (por ejemplo, idioma, versión del software, gráficos) y sus medios de soporte (por ejemplo, papel, electrónico);', 3
FROM iso_requirements WHERE requirement_code = '7.5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'la revisión y aprobación con respecto a la idoneidad y adecuación.', 4
FROM iso_requirements WHERE requirement_code = '7.5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 7.5.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '7.5.3.1 La información documentada requerida por el sistema de gestión de la calidad y por esta Norma Internacional se debe controlar para asegurarse de que:', 1
FROM iso_requirements WHERE requirement_code = '7.5.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'esté disponible y adecuada para su uso, dónde y cuándo se necesite;', 2
FROM iso_requirements WHERE requirement_code = '7.5.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'esté protegida adecuadamente (por ejemplo, contra pérdida de la confidencialidad, uso inadecuado, o pérdida de integridad).', 3
FROM iso_requirements WHERE requirement_code = '7.5.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '7.5.3.2 Para el control de la información documentada, la organización debe tratar las siguientes actividades, según corresponda:', 4
FROM iso_requirements WHERE requirement_code = '7.5.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'distribución, acceso, recuperación y uso;', 5
FROM iso_requirements WHERE requirement_code = '7.5.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'almacenamiento y preservación, incluida la preservación de la legibilidad;', 6
FROM iso_requirements WHERE requirement_code = '7.5.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'control de cambios (por ejemplo, control de versión);', 7
FROM iso_requirements WHERE requirement_code = '7.5.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'conservación y disposición.', 8
FROM iso_requirements WHERE requirement_code = '7.5.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La información documentada de origen externo, que la organización determina como necesaria para la planificación y operación del sistema de gestión de la calidad se debe identificar según sea adecuado y controlar.', 9
FROM iso_requirements WHERE requirement_code = '7.5.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La información documentada conservada como evidencia de la conformidad debe protegerse contra las modificaciones no intencionadas.', 10
FROM iso_requirements WHERE requirement_code = '7.5.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe planificar, implementar y controlar los procesos (véase 4.4) necesarios para cumplir los requisitos para la producción de productos y prestación de servicios, y para implementar las acciones determinadas en el capítulo 6, mediante:', 1
FROM iso_requirements WHERE requirement_code = '8.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'la determinación de los requisitos para los productos y servicios;', 2
FROM iso_requirements WHERE requirement_code = '8.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'el establecimiento de criterios para:
1) los procesos;
2) la aceptación de los productos y servicios;', 3
FROM iso_requirements WHERE requirement_code = '8.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'la determinación de los recursos necesarios para lograr la conformidad para los requisitos de los productos y servicios;', 4
FROM iso_requirements WHERE requirement_code = '8.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'la implementación del control de los procesos de acuerdo con los criterios;', 5
FROM iso_requirements WHERE requirement_code = '8.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'la determinación y almacenaje de la información documentada en la medida necesaria:
1) para confiar en que los procesos se han llevado a cabo según lo planificado;
2) para demostrar la conformidad de los productos y servicios con sus requisitos..', 6
FROM iso_requirements WHERE requirement_code = '8.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'El elemento de salida de esta planificación debe ser adecuado para las operaciones de la organización.', 7
FROM iso_requirements WHERE requirement_code = '8.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe controlar los cambios planificados y revisar las consecuencias de los cambios no previstos, tomando acciones para mitigar cualquier efecto adverso, cuando sea necesario.', 8
FROM iso_requirements WHERE requirement_code = '8.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que los procesos contratados externamente estén controlados (véase 8.4).', 9
FROM iso_requirements WHERE requirement_code = '8.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Determinación de los requisitos para los productos y servicios', 1
FROM iso_requirements WHERE requirement_code = '8.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.2.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La comunicación con los clientes debe :', 1
FROM iso_requirements WHERE requirement_code = '8.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'proporcionar la información relativa a los productos y servicios;', 2
FROM iso_requirements WHERE requirement_code = '8.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'la atención de las consultas, los contratos o los pedidos, incluyendo los cambios;', 3
FROM iso_requirements WHERE requirement_code = '8.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'obtener la retroalimentación de los clientes relativa a los productos y servicios, incluyendo las quejas de los clientes;', 4
FROM iso_requirements WHERE requirement_code = '8.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'manipular o controlar las propiedades del cliente;', 5
FROM iso_requirements WHERE requirement_code = '8.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'establecer los requisitos específicos para las acciones de contingencia, cuando sea pertinente.', 6
FROM iso_requirements WHERE requirement_code = '8.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.2.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Determinación de los requisitos relativos a los productos y servicios', 1
FROM iso_requirements WHERE requirement_code = '8.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando determina los requisitos para los productos y servicios que se van a ofrecer a los clientes, la organización debe asegurarse de que:', 2
FROM iso_requirements WHERE requirement_code = '8.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'los requisitos para los productos y servicios se definen, incluyendo:
1) cualquier requisito legal y reglamentario aplicable;
2) aquellos considerados necesarios por la organización;', 3
FROM iso_requirements WHERE requirement_code = '8.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'la organización puede cumplir las reclamaciones de los productos y servicios que ofrece.', 4
FROM iso_requirements WHERE requirement_code = '8.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.2.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Revisión de los requisitos relacionados con los productos y servicios', 1
FROM iso_requirements WHERE requirement_code = '8.2.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '8.2.3.1 La organización debe asegurarse de que tiene la capacidad de cumplir los requisitos para los productos y servicios que se van a ofrecer a los clientes.', 2
FROM iso_requirements WHERE requirement_code = '8.2.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe llevar a cabo una revisión antes de comprometerse a suministrar productos y servicios a un cliente, para incluir:', 3
FROM iso_requirements WHERE requirement_code = '8.2.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'los requisitos especificados por el cliente, incluyendo los requisitos para las actividades de entrega y las posteriores a la misma;', 4
FROM iso_requirements WHERE requirement_code = '8.2.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'los requisitos no establecidos por el cliente, pero necesarios para el uso especificado o para el uso previsto, cuando sea conocido;', 5
FROM iso_requirements WHERE requirement_code = '8.2.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'los requisitos especificados por la organización;', 6
FROM iso_requirements WHERE requirement_code = '8.2.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'los requisitos legales y reglamentarios adicionales aplicables a los productos y servicios;', 7
FROM iso_requirements WHERE requirement_code = '8.2.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'las diferencias existentes entre los requisitos de contrato o pedido y los expresados previamente.', 8
FROM iso_requirements WHERE requirement_code = '8.2.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que se resuelven las diferencias existentes entre los requisitos del contrato o pedido y los expresados previamente.', 9
FROM iso_requirements WHERE requirement_code = '8.2.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe confirmar los requisitos del cliente antes de la aceptación, cuando el cliente no proporcione una declaración documentada de sus requisitos.', 10
FROM iso_requirements WHERE requirement_code = '8.2.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '8.2.3.2 La organización debe conservar la información documentada, cuando sea aplicable:', 11
FROM iso_requirements WHERE requirement_code = '8.2.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'sobre los resultados de la revisión;', 12
FROM iso_requirements WHERE requirement_code = '8.2.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'sobre cualquier requisito nuevo para los productos y servicios.', 13
FROM iso_requirements WHERE requirement_code = '8.2.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.2.4
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cambios en los requisitos para los productos y servicios', 1
FROM iso_requirements WHERE requirement_code = '8.2.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que la información documentada pertinente sea modificada, y de que las personas correspondientes sean conscientes de los requisitos modificados, cuando se cambien los requisitos para los productos y servicios', 2
FROM iso_requirements WHERE requirement_code = '8.2.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.3.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe establecer, implementar y mantener un proceso de diseño y desarrollo que sea adecuado para asegurarse de la posterior producción de productos y prestación de servicios.', 1
FROM iso_requirements WHERE requirement_code = '8.3.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.3.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'la naturaleza, duración y complejidad de las actividades de diseño y desarrollo;', 1
FROM iso_requirements WHERE requirement_code = '8.3.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'las etapas del proceso requeridas, incluyendo las revisiones del diseño y desarrollo aplicables;', 2
FROM iso_requirements WHERE requirement_code = '8.3.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'las actividades requeridas de verificación y validación del diseño y desarrollo;', 3
FROM iso_requirements WHERE requirement_code = '8.3.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'las responsabilidades y autoridades involucradas en el proceso de diseño y desarrollo;', 4
FROM iso_requirements WHERE requirement_code = '8.3.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'las necesidades de recursos internos y externos para el diseño y desarrollo de los productos y servicios;', 5
FROM iso_requirements WHERE requirement_code = '8.3.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'la necesidad de controlar las interfaces entre las personas implicadas en el proceso de diseño y desarrollo;', 6
FROM iso_requirements WHERE requirement_code = '8.3.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'la necesidad de la participación activa de los clientes y usuarios en el proceso de diseño y desarrollo;', 7
FROM iso_requirements WHERE requirement_code = '8.3.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'los requisitos para la posterior producción de productos y prestación de servicios;', 8
FROM iso_requirements WHERE requirement_code = '8.3.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'el nivel de control del proceso de diseño y desarrollo esperado por los clientes y otras partes interesadas pertinentes;', 9
FROM iso_requirements WHERE requirement_code = '8.3.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'la información documentada necesaria para demostrar que se han cumplido los requisitos del diseño y desarrollo.', 10
FROM iso_requirements WHERE requirement_code = '8.3.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.3.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'los requisitos funcionales y de desempeño;', 1
FROM iso_requirements WHERE requirement_code = '8.3.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'la información proveniente de actividades de diseño y desarrollo previas similares;', 2
FROM iso_requirements WHERE requirement_code = '8.3.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'los requisitos legales y reglamentarios;', 3
FROM iso_requirements WHERE requirement_code = '8.3.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'normas o códigos de prácticas que la organización se ha comprometido a implementar;', 4
FROM iso_requirements WHERE requirement_code = '8.3.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'las consecuencias potenciales del fracaso debido a la naturaleza de los productos y servicios;', 5
FROM iso_requirements WHERE requirement_code = '8.3.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Los elementos de entrada deben ser adecuados para los fines de diseño y desarrollo, estar completos y sin ambigüedades. Los conflictos entre elementos de entrada deben resolverse.', 6
FROM iso_requirements WHERE requirement_code = '8.3.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Las entradas deben ser adecuadas para los fines de diseño y desarrollo, estar completos y sin ambigüedades.', 7
FROM iso_requirements WHERE requirement_code = '8.3.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Deben resolverse las entradas del diseño y desarrollo contradictorios.', 8
FROM iso_requirements WHERE requirement_code = '8.3.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe conservar la información documentada sobre las entradas del diseño y desarrollo.', 9
FROM iso_requirements WHERE requirement_code = '8.3.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.3.4
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe aplicar controles al proceso de diseño y desarrollo para asegurarse de que:', 1
FROM iso_requirements WHERE requirement_code = '8.3.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'los resultados a lograr están definidos;', 2
FROM iso_requirements WHERE requirement_code = '8.3.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'las revisiones se realizan para evaluar la capacidad de los resultados del diseño y desarrollo de cumplir los requisitos;', 3
FROM iso_requirements WHERE requirement_code = '8.3.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'se realizan actividades de verificación para asegurarse de que las salidas del diseño y desarrollo cumplen los requisitos de las entradas;', 4
FROM iso_requirements WHERE requirement_code = '8.3.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'se realizan actividades de validación para asegurarse de que los productos y servicios resultantes satisfacen los requisitos para su aplicación especificada o uso previsto;', 5
FROM iso_requirements WHERE requirement_code = '8.3.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'se toma cualquier acción necesaria sobre los problemas determinados durante las revisiones, o las actividades de verificación y validación;', 6
FROM iso_requirements WHERE requirement_code = '8.3.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'se conserva la información documentada de estas actividades.', 7
FROM iso_requirements WHERE requirement_code = '8.3.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.3.5
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que las salidas del diseño y desarrollo:', 1
FROM iso_requirements WHERE requirement_code = '8.3.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'cumplen los requisitos de las entradas;', 2
FROM iso_requirements WHERE requirement_code = '8.3.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'son adecuados para los procesos posteriores para la provisión de productos y servicios;', 3
FROM iso_requirements WHERE requirement_code = '8.3.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'incluyen o hacen referencia a los requisitos de seguimiento y medición, cuando sea adecuado, y a los criterios de aceptación;', 4
FROM iso_requirements WHERE requirement_code = '8.3.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'especifican las características de los productos y servicios que son esenciales para su propósito previsto y su uso seguro y correcto.', 5
FROM iso_requirements WHERE requirement_code = '8.3.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.3.6
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe identificar, revisar y controlar los cambios hechos durante el diseño y desarrollo de los productos y servicios o posteriormente, en la medida necesaria para asegurarse de que no haya un impacto adverso en la conformidad con los requisitos.
La organización debe conservar la información documentada sobre:', 1
FROM iso_requirements WHERE requirement_code = '8.3.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'los cambios del diseño y desarrollo;', 2
FROM iso_requirements WHERE requirement_code = '8.3.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'los resultados de las revisiones;', 3
FROM iso_requirements WHERE requirement_code = '8.3.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'la autorización de los cambios;', 4
FROM iso_requirements WHERE requirement_code = '8.3.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'las acciones tomadas para prevenir los impactos adversos.', 5
FROM iso_requirements WHERE requirement_code = '8.3.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.4
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'CONTROL DE LOS PROCESOS, PRODUCTOS Y SERVICIOS SUMINISTRADOS EXTERNAMENTE', 1
FROM iso_requirements WHERE requirement_code = '8.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Control de los productos y servicios suministrados externamente', 2
FROM iso_requirements WHERE requirement_code = '8.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.4.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que los procesos, productos y servicios suministrados externamente son conformes a los requisitos.', 1
FROM iso_requirements WHERE requirement_code = '8.4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar los controles a aplicar a los procesos, productos y servicios suministrados externamente cuando:', 2
FROM iso_requirements WHERE requirement_code = '8.4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'los productos y servicios de proveedores externos están destinados a incorporarse dentro de los propios productos y servicios de la organización;', 3
FROM iso_requirements WHERE requirement_code = '8.4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'los productos y servicios son proporcionados directamente a los clientes por proveedores externos en nombre de la organización;', 4
FROM iso_requirements WHERE requirement_code = '8.4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'un proceso, o una parte de un proceso, es proporcionado por un proveedor externo como resultado de una decisión de la organización.', 5
FROM iso_requirements WHERE requirement_code = '8.4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar y aplicar criterios para la evaluación, la selección, el seguimiento del desempeño y la reevaluación de los proveedores externos, basándose en su capacidad para proporcionar procesos o productos y servicios de acuerdo con los requisitos.', 6
FROM iso_requirements WHERE requirement_code = '8.4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe conservar la información documentada adecuada de estas actividades y de cualquier acción necesaria que surja de las evaluaciones.', 7
FROM iso_requirements WHERE requirement_code = '8.4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.4.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que los procesos, productos y servicios suministrados externamente no afectan de manera adversa a la capacidad de la organización de entregar productos y servicios conformes de manera coherente a sus clientes. La organización debe:', 1
FROM iso_requirements WHERE requirement_code = '8.4.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'asegurarse de que los procesos suministrados externamente permanecen dentro del control de su sistema de gestión de la calidad;', 2
FROM iso_requirements WHERE requirement_code = '8.4.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'definir los controles que pretende aplicar a un proveedor externo y los que pretende aplicar a las salidas resultantes;', 3
FROM iso_requirements WHERE requirement_code = '8.4.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'tener en consideración:
1) el impacto potencial de los procesos, productos y servicios suministrados externamente en la capacidad de la organización de cumplir regularmente los requisitos del cliente y los legales y reglamentarios aplicables;
2) la eficacia de los controles aplicados por el proveedor externo;', 4
FROM iso_requirements WHERE requirement_code = '8.4.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'determinar la verificación, u otras actividades, necesarias para asegurarse de que los procesos, productos y servicios suministrados externamente cumplen los requisitos.', 5
FROM iso_requirements WHERE requirement_code = '8.4.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.4.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de la adecuación de los requisitos antes de su comunicación al proveedor externo.', 1
FROM iso_requirements WHERE requirement_code = '8.4.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe comunicar a los proveedores externos sus requisitos para:', 2
FROM iso_requirements WHERE requirement_code = '8.4.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'los procesos, productos y servicios a proporcionar;', 3
FROM iso_requirements WHERE requirement_code = '8.4.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'la aprobación de:
1) productos y servicios;
2) métodos, procesos y equipo;
3) la liberación de productos y servicios;', 4
FROM iso_requirements WHERE requirement_code = '8.4.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'la competencia, incluyendo cualquier calificación de las personas requerida;', 5
FROM iso_requirements WHERE requirement_code = '8.4.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'las interacciones del proveedor externo con la organización;', 6
FROM iso_requirements WHERE requirement_code = '8.4.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'el control y el seguimiento del desempeño del proveedor externo a aplicar por la organización;', 7
FROM iso_requirements WHERE requirement_code = '8.4.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'las actividades de verificación o validación que la organización, o su cliente, pretenden llevar a cabo en las instalaciones del proveedor externo.', 8
FROM iso_requirements WHERE requirement_code = '8.4.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.5.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Control de la producción y de la prestación del servicio', 1
FROM iso_requirements WHERE requirement_code = '8.5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe implementar la producción y prestación del servicio bajo condiciones controladas.', 2
FROM iso_requirements WHERE requirement_code = '8.5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Las condiciones controladas deben incluir, cuando sea aplicable:', 3
FROM iso_requirements WHERE requirement_code = '8.5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'la disponibilidad de información documentada que defina:
1) las características de los productos a producir, los servicios a prestar, o las actividades a desempeñar;
2) los resultados a alcanzar;', 4
FROM iso_requirements WHERE requirement_code = '8.5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'la disponibilidad y el uso de los recursos de seguimiento y medición adecuados;', 5
FROM iso_requirements WHERE requirement_code = '8.5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'la implementación de actividades de seguimiento y medición en las etapas apropiadas para verificar que se cumplen los criterios para el control de los procesos o las salidas, y los criterios de aceptación para los productos y servicios;', 6
FROM iso_requirements WHERE requirement_code = '8.5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'el uso de la infraestructura y el ambiente adecuados para la operación de los procesos;', 7
FROM iso_requirements WHERE requirement_code = '8.5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'la designación de personas competentes, incluyendo cualquier calificación requerida;', 8
FROM iso_requirements WHERE requirement_code = '8.5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'la validación y revalidación periódica de la capacidad para alcanzar los resultados planificados de los procesos de producción y de prestación del servicio, donde el elemento de salida resultante no pueda verificarse mediante actividades de seguimiento o medición posteriores;', 9
FROM iso_requirements WHERE requirement_code = '8.5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'la implementación de acciones para prevenir los errores humanos;', 10
FROM iso_requirements WHERE requirement_code = '8.5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'la implementación de actividades de liberación, entrega y posteriores a la entrega.', 11
FROM iso_requirements WHERE requirement_code = '8.5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.5.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe utilizar los medios adecuados para identificar las salidas cuando sea necesario para asegurar la conformidad de los productos y servicios.', 1
FROM iso_requirements WHERE requirement_code = '8.5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe identificar el estado de las salidas con respecto a los requisitos de seguimiento y medición a través de la producción y prestación del servicio.', 2
FROM iso_requirements WHERE requirement_code = '8.5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe controlar la identificación única de las salidas cuando la trazabilidad sea un requisito, y', 3
FROM iso_requirements WHERE requirement_code = '8.5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Se debe conservar la información documentada necesaria para permitir la trazabilidad.', 4
FROM iso_requirements WHERE requirement_code = '8.5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.5.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Propiedad perteneciente a los clientes o proveedores externos', 1
FROM iso_requirements WHERE requirement_code = '8.5.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe cuidar la propiedad perteneciente a los clientes o a proveedores externos mientras esté bajo el control de la organización o esté siendo utilizado por la misma', 2
FROM iso_requirements WHERE requirement_code = '8.5.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe identificar, verificar, proteger y salvaguardar la propiedad de los clientes o de los proveedores externos suministrada para su utilización o incorporación dentro de los productos y servicios.', 3
FROM iso_requirements WHERE requirement_code = '8.5.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando la propiedad de un cliente o de un proveedor externo se pierda, deteriore o que de algún otro modo se considere inadecuada para su uso, la organización debe informar de esto al cliente o proveedor externo y', 4
FROM iso_requirements WHERE requirement_code = '8.5.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'conservar la información documentada sobre lo que ha ocurrido..', 5
FROM iso_requirements WHERE requirement_code = '8.5.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.5.4
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe preservar las salidas durante la producción y prestación del servicio, en la medida necesaria para asegurarse de la conformidad con los requisitos.', 1
FROM iso_requirements WHERE requirement_code = '8.5.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.5.5
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe cumplir los requisitos para las actividades posteriores a la entrega asociadas con los productos y servicios.', 1
FROM iso_requirements WHERE requirement_code = '8.5.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'los requisitos legales y reglamentarios;', 2
FROM iso_requirements WHERE requirement_code = '8.5.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'las potenciales consecuencias no deseadas asociadas con sus productos y servicios;', 3
FROM iso_requirements WHERE requirement_code = '8.5.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'la naturaleza, el uso y la vida prevista de sus productos y servicios;', 4
FROM iso_requirements WHERE requirement_code = '8.5.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'los requisitos del cliente;', 5
FROM iso_requirements WHERE requirement_code = '8.5.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'retroalimentación del cliente;', 6
FROM iso_requirements WHERE requirement_code = '8.5.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.5.6
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe revisar y controlar los cambios para la producción o la prestación del servicio, en la medida necesaria para asegurarse de la conformidad continua con los requisitos especificados.', 1
FROM iso_requirements WHERE requirement_code = '8.5.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe conservar información documentada que describa los resultados de la revisión de los cambios, las personas que autorizan el cambio y de cualquier acción necesaria que surja de la revisión.', 2
FROM iso_requirements WHERE requirement_code = '8.5.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.6
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe implementar las disposiciones planificadas, en las etapas adecuadas, para verificar que se cumplen los requisitos de los productos y servicios.', 1
FROM iso_requirements WHERE requirement_code = '8.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La liberación de los productos y servicios al cliente no debe llevarse a cabo hasta que se hayan completado satisfactoriamente las disposiciones planificadas, a menos que sea aprobado de otra manera por una autoridad pertinente y, cuando sea aplicable, por el cliente.', 2
FROM iso_requirements WHERE requirement_code = '8.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe conservar la información documentada sobre la liberación de los productos y servicios.', 3
FROM iso_requirements WHERE requirement_code = '8.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La información documentada debe incluir:
a) evidencia de la conformidad con los criterios de aceptación;
b) trazabilidad a las personas que han autorizado la liberación.', 4
FROM iso_requirements WHERE requirement_code = '8.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.7
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Control de los elementos de salida del proceso, los productos y los servicios no conformes', 1
FROM iso_requirements WHERE requirement_code = '8.7' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'PROMEDIO', 2
FROM iso_requirements WHERE requirement_code = '8.7' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.7.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que las salidas que no sean conformes con sus requisitos se identifican y se controlan para prevenir su uso o entrega no intencional.', 1
FROM iso_requirements WHERE requirement_code = '8.7.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe tomar las acciones adecuadas basándose en la naturaleza de la no conformidad y en su efecto sobre la conformidad de los productos y servicios. Esto se debe aplicar también a los productos y servicios no conformes detectados después de la entrega de los productos, durante o después de la provisión de los servicios.', 2
FROM iso_requirements WHERE requirement_code = '8.7.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe tratar las salidas no conformes de una o más de las siguientes maneras:', 3
FROM iso_requirements WHERE requirement_code = '8.7.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'corrección;', 4
FROM iso_requirements WHERE requirement_code = '8.7.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'separación, contención, devolución o suspensión de la provisión de los productos y servicios;', 5
FROM iso_requirements WHERE requirement_code = '8.7.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'informar al cliente;', 6
FROM iso_requirements WHERE requirement_code = '8.7.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'obtener autorización para su aceptación bajo concesión.', 7
FROM iso_requirements WHERE requirement_code = '8.7.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Debe verificarse la conformidad con los requisitos cuando las salidas no conformes se corrigen.', 8
FROM iso_requirements WHERE requirement_code = '8.7.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '8.7.2 La organización debe mantener la información documentada que:
a) describa la no conformidad;', 9
FROM iso_requirements WHERE requirement_code = '8.7.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'describa las acciones tomadas;', 10
FROM iso_requirements WHERE requirement_code = '8.7.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'describa las concesiones obtenidas;', 11
FROM iso_requirements WHERE requirement_code = '8.7.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'identifique la autoridad que ha decidido la acción con respecto a la no conformidad.', 12
FROM iso_requirements WHERE requirement_code = '8.7.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 9.1.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a qué es necesario hacer seguimiento y qué es necesario medir;', 1
FROM iso_requirements WHERE requirement_code = '9.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'los métodos de seguimiento, medición, análisis y evaluación necesarios para asegurar resultados válidos;', 2
FROM iso_requirements WHERE requirement_code = '9.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'cuándo se deben llevar a cabo el seguimiento y la medición;', 3
FROM iso_requirements WHERE requirement_code = '9.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'cuándo se deben analizar y evaluar los resultados del seguimiento y la medición.', 4
FROM iso_requirements WHERE requirement_code = '9.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe evaluar el desempeño y la eficacia del sistema de gestión de la calidad.', 5
FROM iso_requirements WHERE requirement_code = '9.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe mantener la información documentada como evidencia de los resultados.', 6
FROM iso_requirements WHERE requirement_code = '9.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 9.1.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe realizar el seguimiento de las percepciones de los clientes del grado en que se cumplen sus necesidades y expectativas.', 1
FROM iso_requirements WHERE requirement_code = '9.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar los métodos para obtener, realizar el seguimiento y revisar esta información.', 2
FROM iso_requirements WHERE requirement_code = '9.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 9.1.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe analizar y evaluar los datos y la información apropiados originados por el seguimiento y la medición.', 1
FROM iso_requirements WHERE requirement_code = '9.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Los resultados del análisis deben utilizarse para evaluar:', 2
FROM iso_requirements WHERE requirement_code = '9.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'la conformidad de los productos y servicios;', 3
FROM iso_requirements WHERE requirement_code = '9.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'el grado de satisfacción del cliente;', 4
FROM iso_requirements WHERE requirement_code = '9.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'el desempeño y la eficacia del sistema de gestión de la calidad;', 5
FROM iso_requirements WHERE requirement_code = '9.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'si lo planificado se ha implementado de forma eficaz;', 6
FROM iso_requirements WHERE requirement_code = '9.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'la eficacia de las acciones tomadas para abordar los riesgos y oportunidades;', 7
FROM iso_requirements WHERE requirement_code = '9.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'el desempeño de los proveedores externos;', 8
FROM iso_requirements WHERE requirement_code = '9.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'la necesidad de mejoras en el sistema de gestión de la calidad.', 9
FROM iso_requirements WHERE requirement_code = '9.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 9.2.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe llevar a cabo auditorías internas a intervalos planificados para proporcionar información acerca de si el sistema de gestión de la calidad:', 1
FROM iso_requirements WHERE requirement_code = '9.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'cumple:', 2
FROM iso_requirements WHERE requirement_code = '9.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'los requisitos propios de la organización para su sistema de gestión de la calidad;', 3
FROM iso_requirements WHERE requirement_code = '9.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'los requisitos de esta Norma Internacional;', 4
FROM iso_requirements WHERE requirement_code = '9.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'está implementado y mantenido eficazmente.', 5
FROM iso_requirements WHERE requirement_code = '9.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 9.2.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'planificar, establecer, implementar y mantener uno o varios programas de auditoría que incluyan la frecuencia, los métodos, las responsabilidades, los requisitos de planificación y la elaboración de informes, que deben tener en consideración la importancia de los procesos involucrados, los cambios que afecten a la organización y los resultados de las auditorías previas;', 1
FROM iso_requirements WHERE requirement_code = '9.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'para cada auditoría, definir los criterios de la auditoría y el alcance de cada auditoría;', 2
FROM iso_requirements WHERE requirement_code = '9.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'seleccionar los auditores y llevar a cabo auditorías para asegurarse de la objetividad y la imparcialidad del proceso de auditoría;', 3
FROM iso_requirements WHERE requirement_code = '9.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'asegurarse de que los resultados de las auditorías se informan a la dirección pertinente;', 4
FROM iso_requirements WHERE requirement_code = '9.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'realizar las correcciones y tomar las acciones correctivas adecuadas sin demora injustificada;', 5
FROM iso_requirements WHERE requirement_code = '9.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'conservar la información documentada como evidencia de la implementación del programa de auditoría y los resultados de la auditoría.', 6
FROM iso_requirements WHERE requirement_code = '9.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '9.3 Revisión por la dirección
9.3.1. Generalidades', 7
FROM iso_requirements WHERE requirement_code = '9.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe revisar el sistema de gestión de la calidad de la organización a intervalos planificados, para asegurarse de su idoneidad, adecuación, eficacia y alineación con la dirección estratégica de la organización continuas.', 8
FROM iso_requirements WHERE requirement_code = '9.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '9.3.2 Entradas de la revisión por la dirección
La revisión por la dirección debe planificarse y llevarse a cabo incluyendo consideraciones sobre:', 9
FROM iso_requirements WHERE requirement_code = '9.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'el estado de las acciones desde revisiones por la dirección previas;', 10
FROM iso_requirements WHERE requirement_code = '9.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'los cambios en las cuestiones externas e internas que sean pertinentes al sistema de gestión de la calidad;', 11
FROM iso_requirements WHERE requirement_code = '9.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'la información sobre el desempeño y la eficacia del sistema de gestión de la calidad, incluidas las tendencias relativas a:', 12
FROM iso_requirements WHERE requirement_code = '9.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'satisfacción del cliente y la retroalimentación de las partes interesadas pertinentes;', 13
FROM iso_requirements WHERE requirement_code = '9.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'el grado en que se han cumplido los objetivos de la calidad;', 14
FROM iso_requirements WHERE requirement_code = '9.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'desempeño de los procesos y conformidad de los productos y servicios;', 15
FROM iso_requirements WHERE requirement_code = '9.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'no conformidades y acciones correctivas;', 16
FROM iso_requirements WHERE requirement_code = '9.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'resultados de seguimiento y medición;', 17
FROM iso_requirements WHERE requirement_code = '9.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'resultados de las auditorías;', 18
FROM iso_requirements WHERE requirement_code = '9.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'el desempeño de los proveedores externos;', 19
FROM iso_requirements WHERE requirement_code = '9.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'la adecuación de los recursos;', 20
FROM iso_requirements WHERE requirement_code = '9.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'la eficacia de las acciones tomadas para abordar los riesgos y las oportunidades (véase 6.1);', 21
FROM iso_requirements WHERE requirement_code = '9.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'oportunidades de mejora.', 22
FROM iso_requirements WHERE requirement_code = '9.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 9.3.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Las salidas de la revisión por la dirección deben incluir las decisiones y acciones relacionadas con:
a) las oportunidades de mejora;', 1
FROM iso_requirements WHERE requirement_code = '9.3.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'cualquier necesidad de cambio en el sistema de gestión de la calidad;', 2
FROM iso_requirements WHERE requirement_code = '9.3.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'las necesidades de recursos.', 3
FROM iso_requirements WHERE requirement_code = '9.3.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe conservar información documentada como evidencia de los resultados de las revisiones por la dirección.', 4
FROM iso_requirements WHERE requirement_code = '9.3.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 10.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar y seleccionar las oportunidades de mejora e implementar cualquier acción necesaria para cumplir los requisitos del cliente y aumentar la satisfacción del cliente.', 1
FROM iso_requirements WHERE requirement_code = '10.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Estas deben incluir:', 2
FROM iso_requirements WHERE requirement_code = '10.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'mejorar los productos y servicios para cumplir los requisitos, así como tratar las necesidades y expectativas futuras;', 3
FROM iso_requirements WHERE requirement_code = '10.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'corregir, prevenir o reducir los efectos indeseados;', 4
FROM iso_requirements WHERE requirement_code = '10.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'mejorar el desempeño y la eficacia del sistema de gestión de la calidad.', 5
FROM iso_requirements WHERE requirement_code = '10.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 10.2.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando ocurra una no conformidad, incluida cualquiera originada por quejas, la organización debe:', 1
FROM iso_requirements WHERE requirement_code = '10.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'reaccionar ante la no conformidad y, cuando sea aplicable:
    1) tomar acciones para controlarla y corregirla;
    2) hacer frente a las consecuencias;', 2
FROM iso_requirements WHERE requirement_code = '10.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'evaluar la necesidad de acciones para eliminar las causas de la no conformidad, con el fin de que no vuelva a ocurrir ni ocurra en otra parte, mediante:', 3
FROM iso_requirements WHERE requirement_code = '10.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'la revisión y el análisis de la no conformidad;', 4
FROM iso_requirements WHERE requirement_code = '10.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'la determinación de las causas de la no conformidad;', 5
FROM iso_requirements WHERE requirement_code = '10.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'la determinación de si existen no conformidades similares, o que potencialmente podrían ocurrir;', 6
FROM iso_requirements WHERE requirement_code = '10.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'implementar cualquier acción necesaria;', 7
FROM iso_requirements WHERE requirement_code = '10.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'revisar la eficacia de cualquier acción correctiva tomada;', 8
FROM iso_requirements WHERE requirement_code = '10.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'si es necesario, actualizar los riesgos y oportunidades determinados durante la planificación;', 9
FROM iso_requirements WHERE requirement_code = '10.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'si es necesario, hacer cambios al sistema de gestión de la calidad.', 10
FROM iso_requirements WHERE requirement_code = '10.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Las acciones correctivas deben ser adecuadas a los efectos de las no conformidades encontradas.', 11
FROM iso_requirements WHERE requirement_code = '10.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 10.2.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe conservar información documentada, como evidencia de:', 1
FROM iso_requirements WHERE requirement_code = '10.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'la naturaleza de las no conformidades y cualquier acción posterior tomada;', 2
FROM iso_requirements WHERE requirement_code = '10.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'los resultados de cualquier acción correctiva.', 3
FROM iso_requirements WHERE requirement_code = '10.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 10.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe mejorar continuamente la idoneidad, adecuación y eficacia del sistema de gestión de la calidad.', 1
FROM iso_requirements WHERE requirement_code = '10.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe considerar los resultados del análisis y la evaluación, y las salidas de la revisión por la dirección, para determinar si hay necesidades u oportunidades que deben tratarse como parte de la mejora continua.', 2
FROM iso_requirements WHERE requirement_code = '10.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para ISO 14001:2015 (ISO14001)

-- Criterios para requisito 4.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Las cuestiones externas e internas que son pertinentes para su propósito y que afectan a su capacidad para lograr los resultados previstos de su sistema de gestión ambiental', 1
FROM iso_requirements WHERE requirement_code = '4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Realizar el seguimiento y la revisiòn de la informaciòn  sobre estas cuestiones internas y externas', 2
FROM iso_requirements WHERE requirement_code = '4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));

-- Criterios para requisito 4.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Las partes interesadas que son pertinentes al sistema de gestión ambiental;', 1
FROM iso_requirements WHERE requirement_code = '4.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Las necesidades y expectativas pertinentes (es decir, requisitos) de estas partes interesadas;', 2
FROM iso_requirements WHERE requirement_code = '4.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'cuáles de estas son requisitos legales y otros requisitos.', 3
FROM iso_requirements WHERE requirement_code = '4.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe realizar el seguimiento y la revisión de la información sobre estas partes interesadas y sus requisitos pertientes.', 4
FROM iso_requirements WHERE requirement_code = '4.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));

-- Criterios para requisito 4.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Las cuestiones externas e internas referidas en el apartado 4.1;', 1
FROM iso_requirements WHERE requirement_code = '4.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Los requisitos legales y otros requisitos a que se hace referencia en el apartado 4.2;', 2
FROM iso_requirements WHERE requirement_code = '4.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Las unidades, funciones y límites físicos de la organización;', 3
FROM iso_requirements WHERE requirement_code = '4.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Sus actividades, productos y servicios;', 4
FROM iso_requirements WHERE requirement_code = '4.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Su autoridad y capacidad para ejercer control e influencia.', 5
FROM iso_requirements WHERE requirement_code = '4.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'El alcance debe estar disponible y mantenerse  como información documentada estableciendo:', 6
FROM iso_requirements WHERE requirement_code = '4.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Todas las actividades, productos y servicios cubiertos por el sistema de gestión ambiental;', 7
FROM iso_requirements WHERE requirement_code = '4.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));

-- Criterios para requisito 4.4
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Para lograr los resultados previstos, incluida la mejora de su desempeño ambiental, la organización debe', 1
FROM iso_requirements WHERE requirement_code = '4.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'establecer, implementar, mantener y mejorar continuamente su sistema de gestión ambiental incluyendo los procesos e interacciones necesarias.', 2
FROM iso_requirements WHERE requirement_code = '4.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Considerar  los apartados 4.1 y 4.2', 3
FROM iso_requirements WHERE requirement_code = '4.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));

-- Criterios para requisito 5.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe demostrar liderazgo y compromiso con respecto al Sistema de gestión ambiental', 1
FROM iso_requirements WHERE requirement_code = '5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) asumiendo la responsabilidad y la obligaciòn de rendir cuentas con relación a la eficacia del sistema de gestión ambiental;', 2
FROM iso_requirements WHERE requirement_code = '5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) asegurando que se establezcan la política ambiental y los objetivos ambientales, y que éstos sean compatibles con la dirección estratégica y el contexto de la organización;', 3
FROM iso_requirements WHERE requirement_code = '5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) asegurándose de la integración de los requisitos del Sistema de Gestión ambiental en los procesos de negocios de la organización', 4
FROM iso_requirements WHERE requirement_code = '5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'd) Asegurando que los recursos necesarios para el sistema de gestión ambiental estén disponibles', 5
FROM iso_requirements WHERE requirement_code = '5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'e) comunicando la importancia de una gestión ambiental eficaz y conforme con los requisitos del sistema de gestión ambiental', 6
FROM iso_requirements WHERE requirement_code = '5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'f) asegurándose de que el sistema de gestión ambiental logre los resultados previstos;', 7
FROM iso_requirements WHERE requirement_code = '5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'g) dirigiendo y apoyando a las personas, para contribuir a la eficacia del sistema de gestión ambiental;', 8
FROM iso_requirements WHERE requirement_code = '5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'h)  Promover la mejora continua;', 9
FROM iso_requirements WHERE requirement_code = '5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'i) Apoyando otros roles pertinentes de la dirección, para demostrar su liderazgo aplicado a sus áreas de responsabilidad.', 10
FROM iso_requirements WHERE requirement_code = '5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));

-- Criterios para requisito 5.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe establecer, implementar y mantener una política ambiental que, dentro del alcance definido de su sistema de gestión ambiental:', 1
FROM iso_requirements WHERE requirement_code = '5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) sea apropiada al propósito y contexto de la organización, incluida la naturaleza, magnitud e impactos ambientales de sus actividades, productos y servicios;', 2
FROM iso_requirements WHERE requirement_code = '5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) proporcione un marco de referencia para el establecimiento de los objetivos ambientales;', 3
FROM iso_requirements WHERE requirement_code = '5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) incluya un compromiso con la protección del medio ambient, incluida la prevención de la contaminación, y otros compromisos específicos pertinentes al contexto de la organización;', 4
FROM iso_requirements WHERE requirement_code = '5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'd) incluya un compromiso de cumplir con los requisitos legales y otros requisitos;', 5
FROM iso_requirements WHERE requirement_code = '5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'e) incluya un compromiso de mejora continua del seistema de gestión ambiental para la mejora del desempeño ambiental.', 6
FROM iso_requirements WHERE requirement_code = '5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La política ambiental debe:', 7
FROM iso_requirements WHERE requirement_code = '5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'mantenerse como información documentada;', 8
FROM iso_requirements WHERE requirement_code = '5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'comunicarse dentro de la organización;', 9
FROM iso_requirements WHERE requirement_code = '5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'estar disponible para las partes interesadas.', 10
FROM iso_requirements WHERE requirement_code = '5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '5.3. Roles, responsabilidades y autoridades en la organización', 11
FROM iso_requirements WHERE requirement_code = '5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe asegurarse de que las responsabilidades y autoridades para los roles pertinentes se asignen, se comuniquen y se entiendan dentro de la organización.', 12
FROM iso_requirements WHERE requirement_code = '5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe asignar la responsabilidad y autoridad para:', 13
FROM iso_requirements WHERE requirement_code = '5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) asegurarse de que el sistema de gestión ambiental es conforme con los requisitos de esta Norma Internacional;', 14
FROM iso_requirements WHERE requirement_code = '5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) informar en particular a la alta dirección el desempeño del sistema de gestión ambiental, incluyendo su desempeño', 15
FROM iso_requirements WHERE requirement_code = '5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));

-- Criterios para requisito 6.1.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe establecer, implementar y mantener los procesos necesarios para cumplir con los requisitos de los apartados 6.1.1 a 6.1.4.', 1
FROM iso_requirements WHERE requirement_code = '6.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Determina los riesgos y oportunidades relacionados con sus: aspectos ambientales; requisitos legales y otros requisitos; »otras cuestiones y requisitos identificados en los apartados 4.1  4.2', 2
FROM iso_requirements WHERE requirement_code = '6.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Asegura que el sistema de gestión ambiental puede lograr los resultados previstos', 3
FROM iso_requirements WHERE requirement_code = '6.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Prevenir o reducir los efectos no deseados.', 4
FROM iso_requirements WHERE requirement_code = '6.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Lograr la mejora continua', 5
FROM iso_requirements WHERE requirement_code = '6.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Dentro del alcance del sistema de gestión ambiental, la organización  determinara las situaciones de emergencia potenciales, incluidas las que pueden tener un impacto ambiental', 6
FROM iso_requirements WHERE requirement_code = '6.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización mantiene la información documentada de sus riesgos y oportunidades que son necesario abordar', 7
FROM iso_requirements WHERE requirement_code = '6.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));

-- Criterios para requisito 6.1.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Dentro del alcance definido del sistema de gestión ambiental, la organización determinara los aspectos ambientales de sus actividades, productos y servicios', 1
FROM iso_requirements WHERE requirement_code = '6.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando se determinan los aspectos ambientales, la organización tiene en cuenta los cambios, incluidos los desarrollos nuevos o planificados, y las actividades, productos y servicios nuevos o modificados', 2
FROM iso_requirements WHERE requirement_code = '6.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización tiene en cuenta las condiciones anormales y las situaciones de emergencia razonablemente previsibles', 3
FROM iso_requirements WHERE requirement_code = '6.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La  organización determina  aquellos  aspectos  que  tengan  o  puedan  tener  un  impacto ambiental  significativo,  es  decir,  los  aspectos  ambientales  significativos,  mediante  el  uso  de criterios establecidos?', 4
FROM iso_requirements WHERE requirement_code = '6.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización determinara aquellos aspectos que tengan o puedan tener un impacto ambiental significativo', 5
FROM iso_requirements WHERE requirement_code = '6.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización  mantiene información documentada de sus aspectos ambientales e impactos ambientales asociados, criterios usados para determinar sus aspectos ambientales significativos y  aspectos ambientales significativos', 6
FROM iso_requirements WHERE requirement_code = '6.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));

-- Criterios para requisito 6.1.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) determinar y tener acceso a los requisitos legales y otros requisitos relacionados con sus aspectos ambientales;', 1
FROM iso_requirements WHERE requirement_code = '6.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) determinar cómo estos requisitos legales y otros requisitos se aplican a la organización;', 2
FROM iso_requirements WHERE requirement_code = '6.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) tener en cuenta estos requisitos legales y otros requisitos cuando se establezca, implemente, mantenga y mejore continuamente su sistema de gestión ambiental.', 3
FROM iso_requirements WHERE requirement_code = '6.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización mantiene  información documentada de sus requisitos legales y otros requisitos', 4
FROM iso_requirements WHERE requirement_code = '6.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));

-- Criterios para requisito 6.1.4
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) La organización debe planificar la toma de acciones para abordar sus aspectos ambientales significativos; requisitos legales y otros requisitos; riesgos y oportunidades identificados en el apartado 6.1.1.', 1
FROM iso_requirements WHERE requirement_code = '6.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) Debe planificar la manera de integrar e interpretar las acciones en los procesos de su sistema de gestión ambiental, planificar la manera de evaluar la eficacia de estas acciones.', 2
FROM iso_requirements WHERE requirement_code = '6.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe considerar sus opciones tecnológicas y sus requisitos financieros, operacionales y de negocio.', 3
FROM iso_requirements WHERE requirement_code = '6.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));

-- Criterios para requisito 6.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Objetivos ambientales y planificación para lograrlos', 1
FROM iso_requirements WHERE requirement_code = '6.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));

-- Criterios para requisito 6.2.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización establece objetivos ambientales para las funciones y niveles pertinentes, teniendo en cuenta los aspectos ambientales significativos de la organización y sus requisitos legales y otros requisitos asociados y considerando sus riesgos y oportunidades. Los objetivos ambientales deben:', 1
FROM iso_requirements WHERE requirement_code = '6.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) Los objetivos ambientales son coherentes con la política ambiental;', 2
FROM iso_requirements WHERE requirement_code = '6.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) Los objetivos ambientales son medibles (si es factible);', 3
FROM iso_requirements WHERE requirement_code = '6.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) Los objetivos ambientales son objeto de seguimiento', 4
FROM iso_requirements WHERE requirement_code = '6.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'd) Los objetivos ambietales son comunicados en la organización', 5
FROM iso_requirements WHERE requirement_code = '6.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'e) Los objetivos ambientales son actualizados según correspondan', 6
FROM iso_requirements WHERE requirement_code = '6.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización conserva información documentada sobre los objetivos ambientales', 7
FROM iso_requirements WHERE requirement_code = '6.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));

-- Criterios para requisito 6.2.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Planificación de acciones para lograr los objetivos ambientales', 1
FROM iso_requirements WHERE requirement_code = '6.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al planificar cómo lograr sus objetivos ambientales, la organización determina, qué se va a hacer, qué recursos se requerirán, quién será responsable,  cuándo se finalizará, cómo se evaluarán los resultados', 2
FROM iso_requirements WHERE requirement_code = '6.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización considera cómo se pueden integrar las acciones para el logro de sus objetivos ambientales a los procesos de negocio de la organización', 3
FROM iso_requirements WHERE requirement_code = '6.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));

-- Criterios para requisito 7.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Alutrafic determina y proporciona los recursos necesarios para el establecimiento, implementación, mantenimiento y mejora continua del sistema de gestión ambiental', 1
FROM iso_requirements WHERE requirement_code = '7.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));

-- Criterios para requisito 7.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe:', 1
FROM iso_requirements WHERE requirement_code = '7.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Alutrafic determina la competencia  necesaria  de  las  personas  que  realizan  trabajos  bajo  su control,  que  afecte  a  su  desempeño  ambiental  y  su  capacidad  para  cumplir  sus requisitos legales y otros requisitos.', 2
FROM iso_requirements WHERE requirement_code = '7.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Alutrafic asegura  de  que  estas  personas  sean competentes,  con  base  en  su  educación, formación o experiencia apropiadas.', 3
FROM iso_requirements WHERE requirement_code = '7.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Alutrafic determina las necesidades de formación asociadas con sus aspectos ambientales y su sistema de gestión ambiental.', 4
FROM iso_requirements WHERE requirement_code = '7.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Alutrafic determina cuando sea aplicable, tomar acciones para adquirir la competencia necesaria y evaluar la eficacia de las acciones tomadas?', 5
FROM iso_requirements WHERE requirement_code = '7.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '¿La organización debe conservar información documentada apropiada, como evidencia de la competencia?', 6
FROM iso_requirements WHERE requirement_code = '7.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));

-- Criterios para requisito 7.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que las personas que realicen el trabajo bajo el control de la organización tomen conciencia', 1
FROM iso_requirements WHERE requirement_code = '7.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La política ambiental', 2
FROM iso_requirements WHERE requirement_code = '7.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'los aspectos ambientales significativos y los impactos ambientales reales o potenciales
relacionados, asociados con su trabajo;', 3
FROM iso_requirements WHERE requirement_code = '7.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'su contribución a la eficacia del sistema de gestión ambiental, incluidos los beneficios
de una mejora del desempeño ambiental;', 4
FROM iso_requirements WHERE requirement_code = '7.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'las implicaciones de no satisfacer los requisitos del sistema de gestión ambiental,
incluido el incumplimiento de los requisitos legales y otros requisitos de la organización.', 5
FROM iso_requirements WHERE requirement_code = '7.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));

-- Criterios para requisito 7.4.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe establecer, implementar y mantener los procesos necesarios para las
comunicaciones internas y externas pertinentes al sistema de gestión ambiental, que incluyan: a) que comunicar; b) cuándo counicar; c) a quién comunicar; d) cómo comunicar', 1
FROM iso_requirements WHERE requirement_code = '7.4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando establece los procesos de comunicación Alutrafic tiene en cuanta los requisitos legales y otros requisitos, asegura que la información ambiental comunicada sea coherente con la información generada dentro del sistema de gestión ambiental, a que sea fiable', 2
FROM iso_requirements WHERE requirement_code = '7.4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización conserva la información documentada como evidencia de sus comunicaciones, según corresponda.', 3
FROM iso_requirements WHERE requirement_code = '7.4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));

-- Criterios para requisito 7.4.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) La organización comunica internamente la información pertinente del sistema de gestión ambiental entre los diversos niveles y funciones de la organización, incluidos los cambios en el sistema de gestión ambiental, según corresponda;', 1
FROM iso_requirements WHERE requirement_code = '7.4.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) La organización asegura que sus procesos de comunicación permitan que las personas que realicen trabajos bajo control de la organización contribuyan a la mejora continua.', 2
FROM iso_requirements WHERE requirement_code = '7.4.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));

-- Criterios para requisito 7.4.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización comunica externamente información pertinente al sistema de gestión ambiental, según se establezca en los procesos de comunicación de la organización', 1
FROM iso_requirements WHERE requirement_code = '7.4.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));

-- Criterios para requisito 7.5.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'El sistema de gestión ambiental debe incluir, información documentada requerida por esta Norma Internacional', 1
FROM iso_requirements WHERE requirement_code = '7.5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'El sistema de gestión ambiental de la organización determina información documentada como necesaria para la eficacia del sistema de gestión ambiental', 2
FROM iso_requirements WHERE requirement_code = '7.5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));

-- Criterios para requisito 7.5.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al crear y actualizar la información documentada, la organización se asegura de que lo siguiente sea apropiado:La identificación y descripción, el formato la revisión y aprobación', 1
FROM iso_requirements WHERE requirement_code = '7.5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));

-- Criterios para requisito 7.5.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) La información documentada requerida por el sistema de gestión ambiental y por esta Norma Internacional se controla para asegurarse de que esté disponible y sea idónea para su uso, dónde y cuándo se necesite', 1
FROM iso_requirements WHERE requirement_code = '7.5.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) Qué esté  protegida  adecuadamente  (por  ejemplo,  contra  pérdida  de  confidencialidad, uso
inadecuado, o pérdida de integridad)', 2
FROM iso_requirements WHERE requirement_code = '7.5.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Para el control de la información documentada, la organización aborda distribución, acceso, recuperación, uso, almacenamiento y preservación, incluida la preservación de la legibilidad, control de cambios (por ejemplo, control de versión),conservación y disposición', 3
FROM iso_requirements WHERE requirement_code = '7.5.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));

-- Criterios para requisito 8.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización  establece, implementa, controla y mantiene los procesos necesarios para satisfacer los requisitos del sistema de gestión ambiental', 1
FROM iso_requirements WHERE requirement_code = '8.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización controla  los  cambios  planificados  y  examinar  las  consecuencias  de  los cambios  no  previstos,  tomando  acciones  para  mitigar  los  efectos  adversos,  cuando  sea necesario', 2
FROM iso_requirements WHERE requirement_code = '8.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La  organización se asegura de  que  los  procesos  contratados  externamente  estén  controlados o que se tenga influencia sobre ellos', 3
FROM iso_requirements WHERE requirement_code = '8.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) La organización establece  los  controles,  según  corresponda,  para  asegurarse  de  que  sus  requisitos ambientales  se  aborden  en  el  proceso  de  diseño  y  desarrollo  del  producto  o  servicio, considerando cada etapa de su ciclo de vida', 4
FROM iso_requirements WHERE requirement_code = '8.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) La organización determina sus  requisitos  ambientales  para  la  compra  de  productos  y  servicios,  según corresponda.', 5
FROM iso_requirements WHERE requirement_code = '8.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) La organización comunicar sus requisitos ambientales pertinentes a los proveedores externos, incluidos los contratistas', 6
FROM iso_requirements WHERE requirement_code = '8.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'd) La organización considera la necesidad de suministrar información acerca de los impactos ambientales potenciales significativos asociados con el transporte o la entrega, el uso, el tratamiento al fin de la vida útil y la disposición final de sus productos o servicios.', 7
FROM iso_requirements WHERE requirement_code = '8.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización mantiene la información documentada en la medida necesaria para tener la confianza en que los procesos se han llevado a cabo según lo planificado.', 8
FROM iso_requirements WHERE requirement_code = '8.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));

-- Criterios para requisito 8.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La  organización establece,  implementa y  mantiene  los  procesos  necesarios  acerca  decómo  prepararse  y  responder  a  situaciones  potenciales  de  emergencia  identificadas  en  el apartado 6.1.1', 1
FROM iso_requirements WHERE requirement_code = '8.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) La organización está preprada para responder, mediante la planificación de acciones para prevenir o mitigar los impactos ambientales adversos provocados por situaciones de emergencia.', 2
FROM iso_requirements WHERE requirement_code = '8.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) La organización responde a situaciones de emergencia reales', 3
FROM iso_requirements WHERE requirement_code = '8.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) La organización toma acciones  para  prevenir  o  mitigar  las  consecuencias  de  las  situaciones  de emergencia,  apropiadas  a  la  magnitud  de  la  emergencia  y  al  impacto  ambiental potencial.', 4
FROM iso_requirements WHERE requirement_code = '8.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'd) La organización toma  acciones  para  prevenir  o  mitigar  las  consecuencias  de  las  situaciones  de emergencia,  apropiadas  a  la  magnitud  de  la  emergencia  y  al  impacto  ambiental potencial', 5
FROM iso_requirements WHERE requirement_code = '8.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'e) La rganización pone a prueba periodicamente las acciones de respuesta planificadas, cuando sea factible', 6
FROM iso_requirements WHERE requirement_code = '8.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'f) La organización proporciona  información  y  formación  pertinentes,  con  relación  a  la  preparación  y respuesta  ante  emergencias,  según  corresponda,  a  las  partes  interesadas  pertinentes,incluidas las personas que trabajan bajo su control', 7
FROM iso_requirements WHERE requirement_code = '8.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización  mantiene la información documentada en la medida necesaria para tener confianza en que los procesos se llevan a cabo de la manera planificada', 8
FROM iso_requirements WHERE requirement_code = '8.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));

-- Criterios para requisito 9.1.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) a qué es necesario hacer seguimiento y qué es necesario medir;', 1
FROM iso_requirements WHERE requirement_code = '9.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) los métodos de seguimiento, medición, análisis y evaluación, según sea aplicable, para asegurar resultados válidos;', 2
FROM iso_requirements WHERE requirement_code = '9.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) Los criterios contra los cuales la organización evaluará su desempeño ambiental y los indicadores apropiados;', 3
FROM iso_requirements WHERE requirement_code = '9.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'd) cuándo se deben llevar a cabo el seguimiento y la medición;', 4
FROM iso_requirements WHERE requirement_code = '9.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'e) cuándo se deben analizar y evaluar los resultados del seguimiento y la medición.', 5
FROM iso_requirements WHERE requirement_code = '9.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que se usan y mantienen equipos de segumiento y medición calibrados o verificados, según corresponda. Deberá evaluar el desempeño ambiental y la eficacia del sistema de gestión ambiental.
Asi como comunicar externa e internamente la información pertinente a su desempeño ambiental, según sus procesos de comunicación y como se exija en sus requisitos legales y otros requisitos. De igual forma debera conservar información documentada como evidencia del seguimiento, medición, análisis y la evaluación.', 6
FROM iso_requirements WHERE requirement_code = '9.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));

-- Criterios para requisito 9.1.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe establecer, implementar y mantener los procesos necesarios para evaluar el cumplimiento de sus requisitos legales y otros requisitos. La organización debe:', 1
FROM iso_requirements WHERE requirement_code = '9.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) determinar la frecuencia con la que se evaluará el cumplimiento;', 2
FROM iso_requirements WHERE requirement_code = '9.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) evaluar el cumplimiento y emprender las acciones que fueran necesarias;', 3
FROM iso_requirements WHERE requirement_code = '9.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) mantener el conocimiento y la comprensión de su estado de cumplimiento', 4
FROM iso_requirements WHERE requirement_code = '9.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe conservar información documentada como evidencia de los resultados de la evaluación del cumplimiento.', 5
FROM iso_requirements WHERE requirement_code = '9.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));

-- Criterios para requisito 9.2.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe llevar a cabo auditorías internas a intervalos planificados, para proporcionar información acerca de si el sistema de gestión de la calidad:', 1
FROM iso_requirements WHERE requirement_code = '9.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) es conforme con: 
1) los requisitos propios de la organización para su sistema de gestión ambiental; 
2) los requisitos de esta Norma Internacional', 2
FROM iso_requirements WHERE requirement_code = '9.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) está implementado y mantenido eficazmente.', 3
FROM iso_requirements WHERE requirement_code = '9.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));

-- Criterios para requisito 9.2.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe establecer, implementar y mantener uno o varios programas de auditoría que incluyan la frecuencia, los métodos, las responsabilidades, los requisitos de planificación y la elaboración de informes,cuando se establezca el programa de auditoria interna, la organización debe tener en cuenta la importancia ambiental de los procesos involucrados, los cambios que afectan a la organización y los resultados de las auditorias previas. La organización debe:', 1
FROM iso_requirements WHERE requirement_code = '9.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) para cada auditoría, definir los criterios y el alcance de ésta;', 2
FROM iso_requirements WHERE requirement_code = '9.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) seleccionar los auditores y llevar a cabo auditorías para asegurarse de la objetividad y la imparcialidad del proceso de auditoría;', 3
FROM iso_requirements WHERE requirement_code = '9.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) asegurarse de que los resultados de las auditorías se informan a la dirección pertinente;', 4
FROM iso_requirements WHERE requirement_code = '9.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'conservar la información documentada como evidencia de la implementación del programa de auditoría y sus resultados.', 5
FROM iso_requirements WHERE requirement_code = '9.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));

-- Criterios para requisito 9.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe revisar el sistema de gestión ambiental de la organización a intervalos planificados, para asegurarse de su conveniencia, adecuación y eficacia continuas.', 1
FROM iso_requirements WHERE requirement_code = '9.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) incluye consideraciones sobre el estado de las acciones desde anteriores revisiones por la dirección;', 2
FROM iso_requirements WHERE requirement_code = '9.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) incluye consideraciones sobre los cambios en:
1) las cuestiones externas e internas que sean pertinentes al sistema de gestión ambiental,
2) las necesidades y expectativas de las partes interesadas, incluidos los requisitos legales y otros requisitos.
3) sus aspectos ambientales significativos.
4) los riesgos y oportunidades', 3
FROM iso_requirements WHERE requirement_code = '9.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) el grado en que se han logrado los objetivos ambientales;', 4
FROM iso_requirements WHERE requirement_code = '9.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'd) la información sobre el desempeño ambiental de la organización, incluidas las tendencias relativas a:
1) no conformidades y acciones correctivas;
2) seguimiento y resultados de las mediciones;
3) cumplimiento de los requisitos legales y otros requisitos;
4) resultados de la auditoría;', 5
FROM iso_requirements WHERE requirement_code = '9.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'e) adecuación de los recursos;', 6
FROM iso_requirements WHERE requirement_code = '9.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'f) las comunicaciones pertinentes de las partes interesadas, incluidas las quejas;', 7
FROM iso_requirements WHERE requirement_code = '9.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'g) las oporunidades de mejora continua;', 8
FROM iso_requirements WHERE requirement_code = '9.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La revisión por la dirección incluye salidas de las conclusiones sobre la conveniencia, adecuación y eficacia continuas del sistema de gestión ambiental;', 9
FROM iso_requirements WHERE requirement_code = '9.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La revisión por la dirección incluye salidas de las decisiones relacionadas con las oportunidades de meora continua;', 10
FROM iso_requirements WHERE requirement_code = '9.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La revisión por la dirección incluye salidas de las decisiones relacionadas con cualquier necesidad de cambio en el sistema de gestión ambiental; incluidas los recursos;', 11
FROM iso_requirements WHERE requirement_code = '9.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La revisión por la dirección incluye salidas de las acciones necesarias cuando no se hayan logrado los objetivos ambientales;', 12
FROM iso_requirements WHERE requirement_code = '9.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La revisión por la dirección incluye salidas de las oportunidades de mejorar la integración del sistema de gestión ambiental a otros procesos de negocio, si fuera necesario;', 13
FROM iso_requirements WHERE requirement_code = '9.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La revisión por la dirección incluye salidas de cualquier implicación para la dirección estratégica de la organización.', 14
FROM iso_requirements WHERE requirement_code = '9.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización conserva la información documentada como evidencia de los resultados de las revisiones por la dirección.', 15
FROM iso_requirements WHERE requirement_code = '9.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));

-- Criterios para requisito 10.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar y seleccionar las oportunidades de mejora (véanse 9.1, 9.2 y 9.3) e implementar las acciones necesarias para lograr los resultados previstos en su sistema de gestión ambiental.', 1
FROM iso_requirements WHERE requirement_code = '10.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));

-- Criterios para requisito 10.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando ocurra una no conformidad la organización debe:', 1
FROM iso_requirements WHERE requirement_code = '10.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) reaccionar ante la no conformidad, cuando aplique:
1) tomar acciones para controlarla y corregirla;
2) hacer frente a las consecuencias incluida la mitigación de los impactos abientales adversos', 2
FROM iso_requirements WHERE requirement_code = '10.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) evaluar la necesidad de acciones para eliminar las causas de la no conformidad, con el fin de que no vuelva a ocurrir ni ocurra en otra parte, mediante:
1) la revisión de la no conformidad;
2) la determinación de las causas de la no conformidad;
3) la determinación de si existen no conformidades similares, o que potencialmente podrían ocurrir;', 3
FROM iso_requirements WHERE requirement_code = '10.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) implementar cualquier acción necesaria;', 4
FROM iso_requirements WHERE requirement_code = '10.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'd) revisar la eficacia de las acciones correctivas tomadas;', 5
FROM iso_requirements WHERE requirement_code = '10.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'e) si es necesario, hacer cambios al sistema de gestión ambiental.', 6
FROM iso_requirements WHERE requirement_code = '10.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Las acciones correctivas deben ser adecuadas a los efectos de las no conformidades encontradas, incluidos los impactos ambientales', 7
FROM iso_requirements WHERE requirement_code = '10.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe conservar información documentada, como evidencia de:
a) la naturaleza de las no conformidades y cualquier acción tomada posteriormente; y 
b) los resultados de cualquier acción correctiva.', 8
FROM iso_requirements WHERE requirement_code = '10.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));

-- Criterios para requisito 10.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe mejorar continuamente la conveniencia, adecuación y eficacia del sistema de gestión ambiental para mejorar el desempeño ambiental.', 1
FROM iso_requirements WHERE requirement_code = '10.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));

-- Criterios para Res. 0312:2019 (RES0312)

-- Criterios para requisito 1.1.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Designado.', 1
FROM iso_requirements WHERE requirement_code = '1.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Perfil acorde al nivel  de riesgo y tamaño de la empresa.', 2
FROM iso_requirements WHERE requirement_code = '1.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Soportes de títulos, diplomas, licencia en SST, curso virtual de 50 horas.', 3
FROM iso_requirements WHERE requirement_code = '1.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Asignación y comunicación de funciones, responsabilidades sobre el SG-SST.', 4
FROM iso_requirements WHERE requirement_code = '1.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conoce sus responsabilidades en el SG-SST.', 5
FROM iso_requirements WHERE requirement_code = '1.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cumple con las funciones y responsabilidades  asignadas.', 6
FROM iso_requirements WHERE requirement_code = '1.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Asignación y comunicación de funciones , responsabilidades sobre el SG-SST.', 7
FROM iso_requirements WHERE requirement_code = '1.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Soportes de títulos , diplomas , licencia en SST, curso virtual de 50 horas.', 8
FROM iso_requirements WHERE requirement_code = '1.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 1.1.4
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Afiliación al SGRL de todo el personal:', 1
FROM iso_requirements WHERE requirement_code = '1.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '* Sistema General de Salud (EPS).', 2
FROM iso_requirements WHERE requirement_code = '1.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '* Sistema General de Riesgos Laborales (ARL).', 3
FROM iso_requirements WHERE requirement_code = '1.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '* Sistema General de Pensiones (AFP).', 4
FROM iso_requirements WHERE requirement_code = '1.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Afiliaciones y aportes oportunos:', 5
FROM iso_requirements WHERE requirement_code = '1.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '*Fecha de vinculación del trabajador.', 6
FROM iso_requirements WHERE requirement_code = '1.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '*Fechas definidas por ley.', 7
FROM iso_requirements WHERE requirement_code = '1.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '*Sobre el IBC y clase de riesgo propio de la actividad.', 8
FROM iso_requirements WHERE requirement_code = '1.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '* Sistema General de Salud (EPS)', 9
FROM iso_requirements WHERE requirement_code = '1.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '* Sistema General de Riesgos Laborales (ARL)', 10
FROM iso_requirements WHERE requirement_code = '1.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '* Sistema General de Pensiones (AFP)', 11
FROM iso_requirements WHERE requirement_code = '1.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '*Fecha de vinculación del trabajador', 12
FROM iso_requirements WHERE requirement_code = '1.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '*Fechas definidas por ley', 13
FROM iso_requirements WHERE requirement_code = '1.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '*Sobre el IBC y clase de riesgo propio de la actividad', 14
FROM iso_requirements WHERE requirement_code = '1.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '(Muestra del 10% trabajadores para entre 51 y 200 trabajadores)', 15
FROM iso_requirements WHERE requirement_code = '1.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '(Muestra de 30 trabajadores para más de 200 trabajadores)', 16
FROM iso_requirements WHERE requirement_code = '1.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 1.2.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Disponibilidad de un programa de capacitaciones en SST.', 1
FROM iso_requirements WHERE requirement_code = '1.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Requisitos de conocimiento y prácticas en SST para todos los trabajadores - contratistas.', 2
FROM iso_requirements WHERE requirement_code = '1.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Temas relacionados con  la identificación de  peligros, riesgos, emergencias, accidentes de trabajo, otros.', 3
FROM iso_requirements WHERE requirement_code = '1.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Revisión  y actualización del programa.', 4
FROM iso_requirements WHERE requirement_code = '1.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cumplimiento de cronograma y en la jornada laboral.', 5
FROM iso_requirements WHERE requirement_code = '1.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Idoneidad - conocimiento de los capacitadores.', 6
FROM iso_requirements WHERE requirement_code = '1.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conocimiento de los trabajadores sobre las capacitaciones en SST recibidas.', 7
FROM iso_requirements WHERE requirement_code = '1.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 2.4.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Disponible.', 1
FROM iso_requirements WHERE requirement_code = '2.4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Relaciona objetivos, metas, actividades, responsables, cronograma y recursos.', 2
FROM iso_requirements WHERE requirement_code = '2.4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Atiende prioridades en SST.', 3
FROM iso_requirements WHERE requirement_code = '2.4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Ejecutado según lo programado.', 4
FROM iso_requirements WHERE requirement_code = '2.4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Firmado por el empleador y responsable del SG-SST.', 5
FROM iso_requirements WHERE requirement_code = '2.4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Actualizado.', 6
FROM iso_requirements WHERE requirement_code = '2.4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Relaciona objetivos , metas, actividades, responsables, cronograma y recursos.', 7
FROM iso_requirements WHERE requirement_code = '2.4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 3.1.4
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Procedimiento evaluaciones médicas ocupacionales.', 1
FROM iso_requirements WHERE requirement_code = '3.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Profesiograma, detalle de exámenes médicos en función del cargo y periodicidad.', 2
FROM iso_requirements WHERE requirement_code = '3.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Evaluaciones medicas ocupacionales', 3
FROM iso_requirements WHERE requirement_code = '3.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '* Ingreso  /  Periódicas  / Egreso o retiro / complementarias / post incapacidad / reintegro.', 4
FROM iso_requirements WHERE requirement_code = '3.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Certificado de aptitud ocupacional , detalle de concepto , restricciones, recomendaciones.', 5
FROM iso_requirements WHERE requirement_code = '3.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Competencia del profesional de salud  y licencia en SST.', 6
FROM iso_requirements WHERE requirement_code = '3.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conocimiento del trabajador de resultado de evaluaciones médicas ocupacionales.', 7
FROM iso_requirements WHERE requirement_code = '3.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Seguimiento a recomendaciones y estado de salud', 8
FROM iso_requirements WHERE requirement_code = '3.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Profesiograma , detalle de exámenes médicos en función del cargo y periodicidad.', 9
FROM iso_requirements WHERE requirement_code = '3.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Evaluaciones medicas ocupacionales.', 10
FROM iso_requirements WHERE requirement_code = '3.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Certificado de aptitud ocupacional, detalle de concepto, restricciones, recomendaciones.', 11
FROM iso_requirements WHERE requirement_code = '3.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Seguimiento a recomendaciones y estado de salud.', 12
FROM iso_requirements WHERE requirement_code = '3.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Evaluaciones medicas ocupacionales:', 13
FROM iso_requirements WHERE requirement_code = '3.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Certificado de aptitud ocupacional, detalle de concepto, restricciones , recomendaciones.', 14
FROM iso_requirements WHERE requirement_code = '3.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conocimiento del trabajador de resultado de evaluaciones medicas ocupacionales.', 15
FROM iso_requirements WHERE requirement_code = '3.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 4.1.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Mecanismo para asegurar la participación del personal en la IPVR.', 1
FROM iso_requirements WHERE requirement_code = '4.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Participación de los trabajadores en la IPVR  de su lugar de trabajo.', 2
FROM iso_requirements WHERE requirement_code = '4.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Incorporación de información proporcionada por el trabajador.', 3
FROM iso_requirements WHERE requirement_code = '4.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Actualización anual de la matriz IPVR y por accidentes de trabajo mortal , cambios  en procesos ,  instalaciones , maquinaria , equipos y similar.', 4
FROM iso_requirements WHERE requirement_code = '4.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Capacitación al personal.', 5
FROM iso_requirements WHERE requirement_code = '4.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conocimiento del personal sobre los riesgos a los que están expuestos, tareas críticas, controles.', 6
FROM iso_requirements WHERE requirement_code = '4.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Aplicación de medidas de control por los trabajadores en el lugar de trabajo.', 7
FROM iso_requirements WHERE requirement_code = '4.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Actualización anual de la matriz IPVR y por accidentes de trabajo mortal, cambios  en procesos,  instalaciones , maquinaria, equipos y similar.', 8
FROM iso_requirements WHERE requirement_code = '4.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conocimiento del personal sobre los riesgos a los que están expuestos, tareas críticas , controles.', 9
FROM iso_requirements WHERE requirement_code = '4.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conocimiento del personal sobre los riesgos a los que están expuestos, tareas criticas, controles.', 10
FROM iso_requirements WHERE requirement_code = '4.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 4.2.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Implementación de medidas de prevención y control en las áreas de trabajo, según:', 1
FROM iso_requirements WHERE requirement_code = '4.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Matriz de peligros y riesgos.', 2
FROM iso_requirements WHERE requirement_code = '4.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Todos los riesgos , incluidos los prioritarios.', 3
FROM iso_requirements WHERE requirement_code = '4.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Jerarquía de controles.', 4
FROM iso_requirements WHERE requirement_code = '4.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cargos y/o áreas de trabajo críticas.', 5
FROM iso_requirements WHERE requirement_code = '4.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Capacitación al personal  sobre las  medidas de prevención y control de riesgos.', 6
FROM iso_requirements WHERE requirement_code = '4.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conocimiento del personal para la gestión del riesgo en el lugar de trabajo.', 7
FROM iso_requirements WHERE requirement_code = '4.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Efectividad de las medidas de control.', 8
FROM iso_requirements WHERE requirement_code = '4.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Condiciones adecuadas de SST en los lugares de trabajo.', 9
FROM iso_requirements WHERE requirement_code = '4.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'No presencia de condiciones subestándar en áreas de trabajo.', 10
FROM iso_requirements WHERE requirement_code = '4.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Estado de condiciones locativas, orden y aseo, condiciones de almacenamiento, estado de equipos, máquinas, herramientas, pisos, techos, instalaciones, iluminación, instalaciones eléctricas, otros.', 11
FROM iso_requirements WHERE requirement_code = '4.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Todos los riesgos, incluidos los prioritarios.', 12
FROM iso_requirements WHERE requirement_code = '4.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Estado de condiciones locativas , orden y aseo , condiciones de almacenamiento , estado de equipos, máquinas, herramientas, pisos, techos, instalaciones, iluminación, instalaciones eléctricas, otros.', 13
FROM iso_requirements WHERE requirement_code = '4.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 1.1.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Definición de recursos financieros,  técnicos, tecnológicos y de personal.', 1
FROM iso_requirements WHERE requirement_code = '1.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Pertinencia según prioridades de SST.', 2
FROM iso_requirements WHERE requirement_code = '1.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Disponibilidad.', 3
FROM iso_requirements WHERE requirement_code = '1.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Trazabilidad sobre su inversión o ejecución.', 4
FROM iso_requirements WHERE requirement_code = '1.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Recursos para que el responsable del sistema, Copasst, vigía, otros puedan cumplir sus funciones', 5
FROM iso_requirements WHERE requirement_code = '1.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Recursos para que el responsable del sistema, Copasst, vigía, otros puedan cumplir sus funciones.', 6
FROM iso_requirements WHERE requirement_code = '1.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 1.1.6
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Constitución Copasst -  Designación del Vigía de SST.', 1
FROM iso_requirements WHERE requirement_code = '1.1.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Procesos de convocatoria, elección, conformación.', 2
FROM iso_requirements WHERE requirement_code = '1.1.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Vigencia.', 3
FROM iso_requirements WHERE requirement_code = '1.1.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Reuniones  mensuales y actas de reunión.', 4
FROM iso_requirements WHERE requirement_code = '1.1.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Seguimiento a compromisos.', 5
FROM iso_requirements WHERE requirement_code = '1.1.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Recursos y tiempo para actividades.', 6
FROM iso_requirements WHERE requirement_code = '1.1.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conocimiento de los trabajadores sobre el Copasst /Vigía de SST  (representantes, miembros, funciones, otros)', 7
FROM iso_requirements WHERE requirement_code = '1.1.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conocimiento de los trabajadores sobre el Copasst /Vigía de SST  (representantes, miembros, funciones, otros).', 8
FROM iso_requirements WHERE requirement_code = '1.1.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 1.1.8
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Constitución del Comité de convivencia laboral (Cocola).', 1
FROM iso_requirements WHERE requirement_code = '1.1.8' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Procesos de convocatoria, elección y conformación.', 2
FROM iso_requirements WHERE requirement_code = '1.1.8' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Vigencia del Comité.', 3
FROM iso_requirements WHERE requirement_code = '1.1.8' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Reunión al menos cada 3 meses.', 4
FROM iso_requirements WHERE requirement_code = '1.1.8' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Seguimiento a compromisos y  actas de reunión.', 5
FROM iso_requirements WHERE requirement_code = '1.1.8' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Recursos y tiempo para actividades.', 6
FROM iso_requirements WHERE requirement_code = '1.1.8' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Capacitación   a miembros sobre  deberes y responsabilidades.', 7
FROM iso_requirements WHERE requirement_code = '1.1.8' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conocimiento de los trabajadores sobre el comité (representantes, miembros, funciones, otros)', 8
FROM iso_requirements WHERE requirement_code = '1.1.8' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 2.1.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Documentada.', 1
FROM iso_requirements WHERE requirement_code = '2.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Alcance a todos los centros de trabajo y trabajadores.', 2
FROM iso_requirements WHERE requirement_code = '2.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Específica para la empresa.', 3
FROM iso_requirements WHERE requirement_code = '2.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Describe compromisos con la gestión de riesgos laborales, protección de los trabajadores, cumplimiento de la normatividad y mejora continua.', 4
FROM iso_requirements WHERE requirement_code = '2.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Revisión anual.', 5
FROM iso_requirements WHERE requirement_code = '2.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Actualizada, fechada y firmada  por el representante legal.', 6
FROM iso_requirements WHERE requirement_code = '2.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Comunicada y acceso para todos los trabajadores.', 7
FROM iso_requirements WHERE requirement_code = '2.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conocimiento  de los trabajadores.', 8
FROM iso_requirements WHERE requirement_code = '2.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cumplimiento por parte de los trabajadores.', 9
FROM iso_requirements WHERE requirement_code = '2.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Actualizada , fechada y firmada  por el representante legal.', 10
FROM iso_requirements WHERE requirement_code = '2.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 2.5.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Mecanismo de archivo y retención documental.', 1
FROM iso_requirements WHERE requirement_code = '2.5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Control, legibilidad, identificación, accesibilidad  y protección  a daño.', 2
FROM iso_requirements WHERE requirement_code = '2.5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Registros internos y externos.', 3
FROM iso_requirements WHERE requirement_code = '2.5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Tiempo de conservación documental (Para algunos de 20 años a partir del momento en que cese la relación laboral del trabajador con la empresa).', 4
FROM iso_requirements WHERE requirement_code = '2.5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Confidencialidad de información.', 5
FROM iso_requirements WHERE requirement_code = '2.5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Uso de versiones actualizadas y vigentes en los lugares de trabajo.', 6
FROM iso_requirements WHERE requirement_code = '2.5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Control, legibilidad, identificación , accesibilidad  y protección  a daño.', 7
FROM iso_requirements WHERE requirement_code = '2.5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Tiempo de conservación documental ( Para algunos de 20 años a partir del momento en que cese la relación laboral del trabajador con la empresa).', 8
FROM iso_requirements WHERE requirement_code = '2.5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 3.1.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Diagnostico de condiciones de salud y perfil sociodemográfico', 1
FROM iso_requirements WHERE requirement_code = '3.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Disponible', 2
FROM iso_requirements WHERE requirement_code = '3.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Alcance y cobertura a todos los trabajadores', 3
FROM iso_requirements WHERE requirement_code = '3.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Actualizado', 4
FROM iso_requirements WHERE requirement_code = '3.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conclusiones y recomendaciones definidas.', 5
FROM iso_requirements WHERE requirement_code = '3.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Diagnóstico de condiciones de salud y perfil sociodemográfico.', 6
FROM iso_requirements WHERE requirement_code = '3.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Disponible.', 7
FROM iso_requirements WHERE requirement_code = '3.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Alcance y cobertura a todos los trabajadores.', 8
FROM iso_requirements WHERE requirement_code = '3.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Actualizado.', 9
FROM iso_requirements WHERE requirement_code = '3.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 3.1.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Análisis de recomendaciones del diagnóstico de salud.', 1
FROM iso_requirements WHERE requirement_code = '3.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Análisis de las estadísticas de salud (Incidentes, accidentes de trabajo, casos por enfermedad laboral y casos de origen común , otros)', 2
FROM iso_requirements WHERE requirement_code = '3.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Programas de vigilancia epidemiológica actualizado.', 3
FROM iso_requirements WHERE requirement_code = '3.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Actividades de promoción y prevención (P&P)', 4
FROM iso_requirements WHERE requirement_code = '3.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Capacitación al personal en P&P.', 5
FROM iso_requirements WHERE requirement_code = '3.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Apoyo de personal en el área de la salud, con licencia en SST.', 6
FROM iso_requirements WHERE requirement_code = '3.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Programas de vigilancia epidemiológica actualizados.', 7
FROM iso_requirements WHERE requirement_code = '3.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 3.1.6
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Análisis / consolidado de restricciones y recomendaciones médico/laborales de la EPS  ARL  del personal .', 1
FROM iso_requirements WHERE requirement_code = '3.1.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Comunicación al trabajador de restricciones / recomendaciones.', 2
FROM iso_requirements WHERE requirement_code = '3.1.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Acatamiento y  seguimiento  a restricciones y recomendaciones.', 3
FROM iso_requirements WHERE requirement_code = '3.1.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Adecuación de métodos de trabajo.', 4
FROM iso_requirements WHERE requirement_code = '3.1.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Adecuación de puestos de trabajo.', 5
FROM iso_requirements WHERE requirement_code = '3.1.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Seguimiento a casos que requieren calificación de origen laboral o por perdida de capacidad laboral.', 6
FROM iso_requirements WHERE requirement_code = '3.1.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Análisis / consolidado de restricciones y recomendaciones médico/laborales de la EPS  ARL  del personal.', 7
FROM iso_requirements WHERE requirement_code = '3.1.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 3.2.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Reporte de todos los accidentes de trabajo (ARL y EPS o IPS).', 1
FROM iso_requirements WHERE requirement_code = '3.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Reporte de accidentes graves / mortales /enfermedades diagnosticadas (Dirección Territorial u oficinas especiales).', 2
FROM iso_requirements WHERE requirement_code = '3.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Notificación a autoridad competente dos (2) días hábiles siguientes al evento o recibo del diagnóstico de la enfermedad.', 3
FROM iso_requirements WHERE requirement_code = '3.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Comunicación de los eventos al personal.', 4
FROM iso_requirements WHERE requirement_code = '3.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Reporte de todos los accidentes de trabajo (ARL y EPS o IPS)', 5
FROM iso_requirements WHERE requirement_code = '3.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Comunicación de los eventos al personal', 6
FROM iso_requirements WHERE requirement_code = '3.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 3.2.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Procedimiento para la investigación de los incidentes, accidentes y enfermedades laborales.', 1
FROM iso_requirements WHERE requirement_code = '3.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conformación del equipo investigador.', 2
FROM iso_requirements WHERE requirement_code = '3.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Capacitación al equipo investigador.', 3
FROM iso_requirements WHERE requirement_code = '3.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Investigaciones de todos los eventos.', 4
FROM iso_requirements WHERE requirement_code = '3.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Análisis de causas que dieron origen a los eventos y determinación de controles.', 5
FROM iso_requirements WHERE requirement_code = '3.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Comunicación a los trabajadores sobre las acciones de mejora, lecciones aprendidas y similar.', 6
FROM iso_requirements WHERE requirement_code = '3.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Seguimiento y cumplimiento a las recomendaciones derivadas de las investigaciones.', 7
FROM iso_requirements WHERE requirement_code = '3.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Efectividad de las medidas implementadas.', 8
FROM iso_requirements WHERE requirement_code = '3.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Procedimiento para la investigación de los de incidentes, accidentes y enfermedades laborales.', 9
FROM iso_requirements WHERE requirement_code = '3.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 4.2.5
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Mecanismo estandarizado para la realización de mantenimientos preventivos / correctivos.', 1
FROM iso_requirements WHERE requirement_code = '4.2.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Criterios de SST para realizar los mantenimientos, teniendo en cuenta manuales de uso.', 2
FROM iso_requirements WHERE requirement_code = '4.2.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Lista actualizada de todos las instalaciones, equipos, máquinas y herramientas.', 3
FROM iso_requirements WHERE requirement_code = '4.2.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Alcance sobre todas las instalaciones, equipos, máquinas y herramientas.', 4
FROM iso_requirements WHERE requirement_code = '4.2.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Ejecución de mantenimientos según lo programado.', 5
FROM iso_requirements WHERE requirement_code = '4.2.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Realización de mantenimientos por personal autorizado.', 6
FROM iso_requirements WHERE requirement_code = '4.2.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Análisis derivados de los resultados de los mantenimientos por fallas, averías, fugas, limpieza, deterioro, otros.', 7
FROM iso_requirements WHERE requirement_code = '4.2.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Determinación de planes de acción y seguimiento.', 8
FROM iso_requirements WHERE requirement_code = '4.2.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 4.2.6
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Identificación técnica de elementos de protección según riesgos a los que se expone el personal.', 1
FROM iso_requirements WHERE requirement_code = '4.2.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Criterios para la selección, mantenimiento y reemplazo de EPP.', 2
FROM iso_requirements WHERE requirement_code = '4.2.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Entrega de elementos de protección personal.', 3
FROM iso_requirements WHERE requirement_code = '4.2.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Los EPP no son cobrados al personal.', 4
FROM iso_requirements WHERE requirement_code = '4.2.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'EPP  de acuerdo a los riesgos del lugar de trabajo.', 5
FROM iso_requirements WHERE requirement_code = '4.2.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Uso de EPP por el personal.', 6
FROM iso_requirements WHERE requirement_code = '4.2.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Capacitación al personal sobre uso, manejo, almacenamiento, disposición y similar.', 7
FROM iso_requirements WHERE requirement_code = '4.2.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conocimiento del personal.', 8
FROM iso_requirements WHERE requirement_code = '4.2.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Criterios para la selección , mantenimiento y reemplazo de EPP.', 9
FROM iso_requirements WHERE requirement_code = '4.2.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 5.1.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Plan de emergencias documentado.', 1
FROM iso_requirements WHERE requirement_code = '5.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Alcance a todos los centros de trabajo, turnos de trabajo y trabajadores.', 2
FROM iso_requirements WHERE requirement_code = '5.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Actualización del plan.', 3
FROM iso_requirements WHERE requirement_code = '5.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Identificación de amenazas, sismo, terremotos, vendaval, inundación, otros.', 4
FROM iso_requirements WHERE requirement_code = '5.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Análisis de vulnerabilidad.', 5
FROM iso_requirements WHERE requirement_code = '5.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Procedimientos operativos normalizados.', 6
FROM iso_requirements WHERE requirement_code = '5.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Planos de las instalaciones que identifican áreas y salidas de emergencia.', 7
FROM iso_requirements WHERE requirement_code = '5.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Señalización, extintores, botiquín, otros.', 8
FROM iso_requirements WHERE requirement_code = '5.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Realización y análisis de simulacros.', 9
FROM iso_requirements WHERE requirement_code = '5.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Capacitación al trabajador sobre plan de emergencias.', 10
FROM iso_requirements WHERE requirement_code = '5.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 5.1.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conformación de la brigada de emergencias.', 1
FROM iso_requirements WHERE requirement_code = '5.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Procesos de convocatoria  y conformación.', 2
FROM iso_requirements WHERE requirement_code = '5.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Vigencia y funcionamiento.', 3
FROM iso_requirements WHERE requirement_code = '5.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Recursos y tiempo para actividades (Inspecciones, simulacros, otros).', 4
FROM iso_requirements WHERE requirement_code = '5.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Capacitación  a miembros sobre  deberes, responsabilidades y como responder a emergencias (Incendio, primeros auxilios, evaluación, otros).', 5
FROM iso_requirements WHERE requirement_code = '5.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Dotación de la brigada de emergencia en función de los peligros y riesgos.', 6
FROM iso_requirements WHERE requirement_code = '5.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Capacitación  a miembros sobre  deberes, responsabilidades y como responder a emergencias (Incendio , primeros auxilios, evaluación, otros).', 7
FROM iso_requirements WHERE requirement_code = '5.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 6.1.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Planeación de la revisión al SG-SST.', 1
FROM iso_requirements WHERE requirement_code = '6.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Realización de la revisión por la alta dirección al SG-SST (anual).', 2
FROM iso_requirements WHERE requirement_code = '6.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Alcance de la revisión gerencial.', 3
FROM iso_requirements WHERE requirement_code = '6.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Análisis de resultados y determinación de planes de acción.', 4
FROM iso_requirements WHERE requirement_code = '6.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Comunicación de resultados  de la revisión al personal, Copasst , responsable del sistema, otros.', 5
FROM iso_requirements WHERE requirement_code = '6.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Suficiencia y capacidad del SG-SST.', 6
FROM iso_requirements WHERE requirement_code = '6.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Realización de la revisión por la alta dirección al SG-SST (Anual).', 7
FROM iso_requirements WHERE requirement_code = '6.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Comunicación de resultados  de la revisión al personal, Copasst, responsable del sistema, otros.', 8
FROM iso_requirements WHERE requirement_code = '6.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Suficiencia y capacidad del SG-SST', 9
FROM iso_requirements WHERE requirement_code = '6.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 1.1.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Responsabilidades en SST documentadas para todos los cargos.', 1
FROM iso_requirements WHERE requirement_code = '1.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Incluyen el cuidado de la salud, cumplimiento con directrices del SG-SST, informar sobre peligros - riesgos del  trabajo, participación en capacitaciones, otras.', 2
FROM iso_requirements WHERE requirement_code = '1.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Comunicadas  al personal.', 3
FROM iso_requirements WHERE requirement_code = '1.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conocidas por el trabador.', 4
FROM iso_requirements WHERE requirement_code = '1.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cumplimiento por el trabajador.', 5
FROM iso_requirements WHERE requirement_code = '1.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 1.1.5
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Identificación de actividades de alto riesgo (Decreto 2090 de 2003).', 1
FROM iso_requirements WHERE requirement_code = '1.1.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Identificación de  trabajadores dedicados a estas actividades.', 2
FROM iso_requirements WHERE requirement_code = '1.1.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Caracterización de la labor por cargos, funciones, tareas, jornadas, lugar ,otros.', 3
FROM iso_requirements WHERE requirement_code = '1.1.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Identificación de peligros,  valoración del riesgo y controles.', 4
FROM iso_requirements WHERE requirement_code = '1.1.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Implementación de controles: Evaluaciones médicas, mediciones higiénicas, otras.', 5
FROM iso_requirements WHERE requirement_code = '1.1.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Notificación a entidades competentes sobre estas actividades.', 6
FROM iso_requirements WHERE requirement_code = '1.1.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Pago de la cotización especial.', 7
FROM iso_requirements WHERE requirement_code = '1.1.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 1.1.7
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Disponibilidad de curso virtual de 50 horas.', 1
FROM iso_requirements WHERE requirement_code = '1.1.7' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Soportes para principales y suplentes.', 2
FROM iso_requirements WHERE requirement_code = '1.1.7' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Aprobación del curso virtual.', 3
FROM iso_requirements WHERE requirement_code = '1.1.7' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Capacitación   sobre  deberes, responsabilidades y aspectos del SG-SST.', 4
FROM iso_requirements WHERE requirement_code = '1.1.7' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conocimiento de los miembros sobre funciones y responsabilidades.', 5
FROM iso_requirements WHERE requirement_code = '1.1.7' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 1.2.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Para el responsable del SG-SST', 1
FROM iso_requirements WHERE requirement_code = '1.2.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Curso virtual de 50 horas.', 2
FROM iso_requirements WHERE requirement_code = '1.2.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Aprobación del curso.', 3
FROM iso_requirements WHERE requirement_code = '1.2.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Expedición por una entidad autorizada ARL, SENA, caja de compensación, otros.', 4
FROM iso_requirements WHERE requirement_code = '1.2.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Vigencia ( 3 años ).', 5
FROM iso_requirements WHERE requirement_code = '1.2.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Renovación - reentrenamiento (20 Horas ) después de 3 años.', 6
FROM iso_requirements WHERE requirement_code = '1.2.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conocimiento del responsable del SG-SST en temas asociados.', 7
FROM iso_requirements WHERE requirement_code = '1.2.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 2.2.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Documentados.', 1
FROM iso_requirements WHERE requirement_code = '2.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Atienden prioridades y directrices de la política de SST.', 2
FROM iso_requirements WHERE requirement_code = '2.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Son medibles, cuantificables y tienen metas para cumplimiento.', 3
FROM iso_requirements WHERE requirement_code = '2.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Seguimiento y medición  al menos anualmente.', 4
FROM iso_requirements WHERE requirement_code = '2.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Resultados  y planes de acción.', 5
FROM iso_requirements WHERE requirement_code = '2.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conocimiento de los trabajadores.', 6
FROM iso_requirements WHERE requirement_code = '2.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 2.3.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Documentada.', 1
FROM iso_requirements WHERE requirement_code = '2.3.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Realizada por una persona con conociendo el SST / idónea.', 2
FROM iso_requirements WHERE requirement_code = '2.3.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Aspectos de ley que se  revisaron.', 3
FROM iso_requirements WHERE requirement_code = '2.3.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Análisis de resultados.', 4
FROM iso_requirements WHERE requirement_code = '2.3.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Determinación de prioridades en SST.', 5
FROM iso_requirements WHERE requirement_code = '2.3.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Determinación  de controles e implementación.', 6
FROM iso_requirements WHERE requirement_code = '2.3.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Planes de acción.', 7
FROM iso_requirements WHERE requirement_code = '2.3.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 2.6.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Mecanismo para rendición de cuentas sobre el desempeño del personal en SST.', 1
FROM iso_requirements WHERE requirement_code = '2.6.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Rendiciones de cuentas personal documentadas para todo el personal.', 2
FROM iso_requirements WHERE requirement_code = '2.6.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Frecuencia de realización al menos anual.', 3
FROM iso_requirements WHERE requirement_code = '2.6.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conocimiento del personal sobre proceso de rendición.', 4
FROM iso_requirements WHERE requirement_code = '2.6.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conocimiento del personal sobre resultados de rendición.', 5
FROM iso_requirements WHERE requirement_code = '2.6.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Seguimiento a compromisos resultado de la rendición de cuentas.', 6
FROM iso_requirements WHERE requirement_code = '2.6.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 2.7.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Disponibilidad de matriz legal actualizada.', 1
FROM iso_requirements WHERE requirement_code = '2.7.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Identificación de obligaciones  técnicas y legales aplicables en SST y SGRL.', 2
FROM iso_requirements WHERE requirement_code = '2.7.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cumplimiento de obligaciones.', 3
FROM iso_requirements WHERE requirement_code = '2.7.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Capacitación al personal  sobre obligaciones legales.', 4
FROM iso_requirements WHERE requirement_code = '2.7.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conocimiento del personal sobre aspectos legales (Responsable del SG-SST, Copasst -Vigía en SST, trabajadores y empleadores)', 5
FROM iso_requirements WHERE requirement_code = '2.7.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 2.8.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Mecanismo para recibir y responder comunicaciones en SST.', 1
FROM iso_requirements WHERE requirement_code = '2.8.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Tratamiento de comunicaciones internas y externas.', 2
FROM iso_requirements WHERE requirement_code = '2.8.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Uso de los mecanismos de comunicación por parte de los trabajadores.', 3
FROM iso_requirements WHERE requirement_code = '2.8.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Tratamiento de los autorreporte de condiciones de SST.', 4
FROM iso_requirements WHERE requirement_code = '2.8.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Tratamiento a solicitudes, quejas, inquietudes de los trabajadores.', 5
FROM iso_requirements WHERE requirement_code = '2.8.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Seguimiento y planes de acción.', 6
FROM iso_requirements WHERE requirement_code = '2.8.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 2.9.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Procedimiento para adquirió de bienes y servicios.', 1
FROM iso_requirements WHERE requirement_code = '2.9.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Criterios de SST.', 2
FROM iso_requirements WHERE requirement_code = '2.9.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Proceso de selección  y compra  según criterios.', 3
FROM iso_requirements WHERE requirement_code = '2.9.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Procesos de evaluación al prestador del bien  o servicio.', 4
FROM iso_requirements WHERE requirement_code = '2.9.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Seguimiento y planes de acción.', 5
FROM iso_requirements WHERE requirement_code = '2.9.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 2.10.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Procedimiento para la selección de proveedores y contratistas.', 1
FROM iso_requirements WHERE requirement_code = '2.10.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Criterios de SST (Afiliación, normas de SST, responsabilidades, otras)', 2
FROM iso_requirements WHERE requirement_code = '2.10.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Proceso de selección de proveedores y contratistas.', 3
FROM iso_requirements WHERE requirement_code = '2.10.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Procesos de evaluación al desempeño de contratistas y proveedores .', 4
FROM iso_requirements WHERE requirement_code = '2.10.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Capacitación a proveedores y contratistas, sobre peligros, riesgos, ATEL,otros.', 5
FROM iso_requirements WHERE requirement_code = '2.10.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conocimiento por parte de contratistas y proveedores de criterios de SST.', 6
FROM iso_requirements WHERE requirement_code = '2.10.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Seguimiento y planes de acción.', 7
FROM iso_requirements WHERE requirement_code = '2.10.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 2.11.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Procedimiento gestión del cambio.', 1
FROM iso_requirements WHERE requirement_code = '2.11.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Identificación de posibles cambios  internos / externos.', 2
FROM iso_requirements WHERE requirement_code = '2.11.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Análisis del cambio, nuevos peligros, riesgos, otros.', 3
FROM iso_requirements WHERE requirement_code = '2.11.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Identificación de medidas de prevención y control.', 4
FROM iso_requirements WHERE requirement_code = '2.11.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Implementación de medidas y seguimiento al cambio.', 5
FROM iso_requirements WHERE requirement_code = '2.11.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Capacitación al personal antes y después del cambio.', 6
FROM iso_requirements WHERE requirement_code = '2.11.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conocimiento del personal sobre la gestión del cambio.', 7
FROM iso_requirements WHERE requirement_code = '2.11.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 3.1.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Disponibilidad de perfiles de cargo.', 1
FROM iso_requirements WHERE requirement_code = '3.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '* Alcance sobre todos los cargos.', 2
FROM iso_requirements WHERE requirement_code = '3.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '* Descripción de  las tareas y riesgos laborales.', 3
FROM iso_requirements WHERE requirement_code = '3.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Comunicación de perfiles de cargo al personal de salud  encargado de las evaluaciones medicas ocupacionales.', 4
FROM iso_requirements WHERE requirement_code = '3.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Comunicación otra información como  resultados de indicadores epidemiológicos, estudios de higiene, otros.', 5
FROM iso_requirements WHERE requirement_code = '3.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 3.1.5
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Mecanismo de confidencialidad  de historias clínicas', 1
FROM iso_requirements WHERE requirement_code = '3.1.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Mecanismo de confidencialidad de documentos relativos al estado de salud del trabajador', 2
FROM iso_requirements WHERE requirement_code = '3.1.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Acceso solo por personal médico especialista en SST o del trabajador.', 3
FROM iso_requirements WHERE requirement_code = '3.1.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Custodia por EPS, médico especialista.', 4
FROM iso_requirements WHERE requirement_code = '3.1.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Autorizaciones para acceso a historia clínica e información relacionada.', 5
FROM iso_requirements WHERE requirement_code = '3.1.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 3.1.7
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Aplicación de herramientas como diagnósticos, encuestas, herramientas, análisis de diagnósticos de salud, otros.', 1
FROM iso_requirements WHERE requirement_code = '3.1.7' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Análisis de información sobre estilo de vida.', 2
FROM iso_requirements WHERE requirement_code = '3.1.7' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Programa de estilos de vida y entorno saludable.', 3
FROM iso_requirements WHERE requirement_code = '3.1.7' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Implementación de actividades.', 4
FROM iso_requirements WHERE requirement_code = '3.1.7' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Capacitación al personal sobre estilos de vida y entornos saludables.', 5
FROM iso_requirements WHERE requirement_code = '3.1.7' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conocimiento del personal .', 6
FROM iso_requirements WHERE requirement_code = '3.1.7' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 3.1.8
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Suministro permanente de agua potable.', 1
FROM iso_requirements WHERE requirement_code = '3.1.8' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Verificación de condiciones o parámetros de calidad del agua potable.', 2
FROM iso_requirements WHERE requirement_code = '3.1.8' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Acceso y estado de servicios sanitarios, proporcional al número de trabajadores.', 3
FROM iso_requirements WHERE requirement_code = '3.1.8' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Dotación de elementos de higiene personal (Jabón, papel, toallas desechables, recipientes, otros)', 4
FROM iso_requirements WHERE requirement_code = '3.1.8' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Orden y aseo de las instalaciones.', 5
FROM iso_requirements WHERE requirement_code = '3.1.8' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Mantenimiento de tanques e instalaciones.', 6
FROM iso_requirements WHERE requirement_code = '3.1.8' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Capacitación al personal sobre normas sobre seguridad e higiene.', 7
FROM iso_requirements WHERE requirement_code = '3.1.8' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conocimiento del personal sobre normas.', 8
FROM iso_requirements WHERE requirement_code = '3.1.8' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 3.1.9
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Procedimiento  para la clasificación  de residuos.', 1
FROM iso_requirements WHERE requirement_code = '3.1.9' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Manejo de todos los residuos, aprovechables / residuos de aparatos eléctricos y electrónicos / no aprovechables /  orgánicos/ residuos peligrosos.', 2
FROM iso_requirements WHERE requirement_code = '3.1.9' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Inventario de residuos.', 3
FROM iso_requirements WHERE requirement_code = '3.1.9' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Almacenamiento temporal.', 4
FROM iso_requirements WHERE requirement_code = '3.1.9' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Estados de áreas, recipientes, contenedores, sistemas de contención.', 5
FROM iso_requirements WHERE requirement_code = '3.1.9' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Suministro de elementos de protección personal para manejo.', 6
FROM iso_requirements WHERE requirement_code = '3.1.9' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Disposición final de residuos con empresa autorizada y sin poner en riesgo al personal.', 7
FROM iso_requirements WHERE requirement_code = '3.1.9' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Capacitación al personal sobre la clasificación y disposición de residuos.', 8
FROM iso_requirements WHERE requirement_code = '3.1.9' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conocimiento del personal.', 9
FROM iso_requirements WHERE requirement_code = '3.1.9' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 3.2.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Registro estadístico de todos los eventos por ATEL (Verificar  año vencido y lo corrido del año).', 1
FROM iso_requirements WHERE requirement_code = '3.2.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Caracterización  de los eventos (causas básicas, causas inmediatas, parte del cuerpo afectada, periodicidad, otros).', 2
FROM iso_requirements WHERE requirement_code = '3.2.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Análisis de tendencias e información asociada a los eventos.', 3
FROM iso_requirements WHERE requirement_code = '3.2.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Determinación de acciones  correctivas, preventivas  y de mejora.', 4
FROM iso_requirements WHERE requirement_code = '3.2.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Implementación de acciones.', 5
FROM iso_requirements WHERE requirement_code = '3.2.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Comunicación de estadísticas de ATEL al personal.', 6
FROM iso_requirements WHERE requirement_code = '3.2.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 3.3.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Ficha técnica del indicador: Nombre del Indicador /definición/fórmula/Interpretación/periodicidad medición/límite /fuente de información /personas que deben conocer el resultado.', 1
FROM iso_requirements WHERE requirement_code = '3.3.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Medición mensual del indicador.', 2
FROM iso_requirements WHERE requirement_code = '3.3.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Análisis del indicador para lo corrido del año y/o el año inmediatamente anterior.', 3
FROM iso_requirements WHERE requirement_code = '3.3.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Clasificación del origen del peligro/riesgo que los generó.', 4
FROM iso_requirements WHERE requirement_code = '3.3.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Planes de acción y su implementación.', 5
FROM iso_requirements WHERE requirement_code = '3.3.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Comunicación de resultados de indicador.', 6
FROM iso_requirements WHERE requirement_code = '3.3.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 3.3.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Ficha técnica del indicador : Nombre del Indicador /definición/fórmula/Interpretación/periodicidad medición/límite /fuente de información /personas que deben conocer el resultado.', 1
FROM iso_requirements WHERE requirement_code = '3.3.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Medición mensual del indicador.', 2
FROM iso_requirements WHERE requirement_code = '3.3.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Análisis del indicador para lo corrido del año y/o el año inmediatamente anterior.', 3
FROM iso_requirements WHERE requirement_code = '3.3.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Clasificación del origen del peligro/riesgo que los generó.', 4
FROM iso_requirements WHERE requirement_code = '3.3.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Planes de acción y su implementación.', 5
FROM iso_requirements WHERE requirement_code = '3.3.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Comunicación de resultados de indicador.', 6
FROM iso_requirements WHERE requirement_code = '3.3.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 3.3.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Ficha técnica del indicador: Nombre del Indicador /definición/fórmula/Interpretación/periodicidad medición/límite /fuente de información /personas que deben conocer el resultado.', 1
FROM iso_requirements WHERE requirement_code = '3.3.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Medición anual del indicador.', 2
FROM iso_requirements WHERE requirement_code = '3.3.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Análisis del indicador para lo corrido del año y/o el año inmediatamente anterior.', 3
FROM iso_requirements WHERE requirement_code = '3.3.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Clasificación del origen del peligro/riesgo que los generó.', 4
FROM iso_requirements WHERE requirement_code = '3.3.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Planes de acción y su implementación.', 5
FROM iso_requirements WHERE requirement_code = '3.3.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Comunicación de resultados de indicador.', 6
FROM iso_requirements WHERE requirement_code = '3.3.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 3.3.4
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Ficha técnica del indicador: Nombre del Indicador /definición/fórmula/Interpretación/periodicidad medición/límite /fuente de información /personas que deben conocer el resultado.', 1
FROM iso_requirements WHERE requirement_code = '3.3.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Medición anual del indicador.', 2
FROM iso_requirements WHERE requirement_code = '3.3.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Análisis del indicador para lo corrido del año y/o el año inmediatamente anterior.', 3
FROM iso_requirements WHERE requirement_code = '3.3.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Clasificación del origen del peligro/riesgo que los generó', 4
FROM iso_requirements WHERE requirement_code = '3.3.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Planes de acción y su implementación.', 5
FROM iso_requirements WHERE requirement_code = '3.3.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Comunicación de resultados de indicador.', 6
FROM iso_requirements WHERE requirement_code = '3.3.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 3.3.5
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Ficha técnica del indicador : Nombre del Indicador /definición/fórmula/Interpretación/periodicidad medición/límite /fuente de información /personas que deben conocer el resultado.', 1
FROM iso_requirements WHERE requirement_code = '3.3.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Medición anual del indicador.', 2
FROM iso_requirements WHERE requirement_code = '3.3.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Análisis del indicador para lo corrido del año y/o el año inmediatamente anterior.', 3
FROM iso_requirements WHERE requirement_code = '3.3.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Clasificación del origen del peligro/riesgo que los generó.', 4
FROM iso_requirements WHERE requirement_code = '3.3.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Planes de acción y su implementación.', 5
FROM iso_requirements WHERE requirement_code = '3.3.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Comunicación de resultados de indicador.', 6
FROM iso_requirements WHERE requirement_code = '3.3.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 3.3.6
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Ficha técnica del indicador: Nombre del Indicador /definición/fórmula/Interpretación/periodicidad medición/límite /fuente de información /personas que deben conocer el resultado.', 1
FROM iso_requirements WHERE requirement_code = '3.3.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Medición mensual del indicador.', 2
FROM iso_requirements WHERE requirement_code = '3.3.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Análisis del indicador para lo corrido del año y/o el año inmediatamente anterior.', 3
FROM iso_requirements WHERE requirement_code = '3.3.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Clasificación del origen del peligro/riesgo que los generó.', 4
FROM iso_requirements WHERE requirement_code = '3.3.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Planes de acción y su implementación.', 5
FROM iso_requirements WHERE requirement_code = '3.3.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Comunicación de resultados de indicador.', 6
FROM iso_requirements WHERE requirement_code = '3.3.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 4.1.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Metodología de IPVR:', 1
FROM iso_requirements WHERE requirement_code = '4.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Documentada  y con alcance a todos los procesos, actividades, procesos, servicios, instalaciones, equipos, centros de trabajo, trabajadores.', 2
FROM iso_requirements WHERE requirement_code = '4.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Capacitación al personal sobre metodología.', 3
FROM iso_requirements WHERE requirement_code = '4.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Matriz de Peligros y riesgos', 4
FROM iso_requirements WHERE requirement_code = '4.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Disponible, actualizada y revisada anualmente.', 5
FROM iso_requirements WHERE requirement_code = '4.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Identificación continua de peligros,  valoración de riesgos.', 6
FROM iso_requirements WHERE requirement_code = '4.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Análisis de tareas criticas, proceso, servicios de interés  (Trabajos eléctricos, trabajos en alturas, trabajo en caliente, trabajos en  espacios confinados, excavaciones, izaje y maniobra de cargas, vigilancia, transporte, otros).', 7
FROM iso_requirements WHERE requirement_code = '4.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Priorización de riesgos de SST.', 8
FROM iso_requirements WHERE requirement_code = '4.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Determinación e implementación de medidas de intervención para controlar los riesgos SST (Jerarquía de controles).', 9
FROM iso_requirements WHERE requirement_code = '4.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Seguimiento a la efectividad de las medidas de control.', 10
FROM iso_requirements WHERE requirement_code = '4.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 4.1.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Identificación de todas las sustancias químicas que procesa, manipula, almacena, transporta, desecha  o utiliza la empresa  para el desarrollo de sus actividades.', 1
FROM iso_requirements WHERE requirement_code = '4.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Determinación del peligro, según las características de las sustancias.', 2
FROM iso_requirements WHERE requirement_code = '4.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Priorización de sustancias cancerígenas independiente de su dosis o nivel de exposición.', 3
FROM iso_requirements WHERE requirement_code = '4.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Determinación de medidas de prevención y control.', 4
FROM iso_requirements WHERE requirement_code = '4.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Implementación de medidas.', 5
FROM iso_requirements WHERE requirement_code = '4.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Seguimiento a efectividad de medidas y planes de acción.', 6
FROM iso_requirements WHERE requirement_code = '4.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Sobre el personal expuesto:', 7
FROM iso_requirements WHERE requirement_code = '4.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Identificación del personal expuesto y frecuencia de exposición.', 8
FROM iso_requirements WHERE requirement_code = '4.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Vigilancia al estado de salud.', 9
FROM iso_requirements WHERE requirement_code = '4.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Asignación y uso de elementos de protección personal.', 10
FROM iso_requirements WHERE requirement_code = '4.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Capacitación al personal en temas de P&P.', 11
FROM iso_requirements WHERE requirement_code = '4.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conocimiento del personal.', 12
FROM iso_requirements WHERE requirement_code = '4.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 4.1.4
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cronograma de mediciones ambientales ocupacionales.', 1
FROM iso_requirements WHERE requirement_code = '4.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Realización de mediciones para monitorear los factores de riesgo prioritarios según lo programado.', 2
FROM iso_requirements WHERE requirement_code = '4.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Informe de medición con recomendaciones.', 3
FROM iso_requirements WHERE requirement_code = '4.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Competencia del higienista que realizo la medición y licencia en SST.', 4
FROM iso_requirements WHERE requirement_code = '4.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Certificado de calibración y especificaciones técnicas de los equipos.', 5
FROM iso_requirements WHERE requirement_code = '4.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Análisis de resultados y plan de acción.', 6
FROM iso_requirements WHERE requirement_code = '4.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Implementación de recomendaciones y acciones para el control de riesgos.', 7
FROM iso_requirements WHERE requirement_code = '4.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Monitoreo del estado de salud del personal expuesto (Evaluaciones medicas ocupacionales, sistema de vigilancia epidemiológica, otros).', 8
FROM iso_requirements WHERE requirement_code = '4.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Comunicación al Copasst Vigía de SST sobre resultados.', 9
FROM iso_requirements WHERE requirement_code = '4.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Capacitación al personal sobre resultados , medidas de  prevención y control.', 10
FROM iso_requirements WHERE requirement_code = '4.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 4.2.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'El trabajador tiene conocimiento, entre otros aspectos sobre:', 1
FROM iso_requirements WHERE requirement_code = '4.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Peligros y riesgos del lugar de trabajo.', 2
FROM iso_requirements WHERE requirement_code = '4.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Medidas de prevención y control sobre ATEL.', 3
FROM iso_requirements WHERE requirement_code = '4.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Procedimientos de trabajo seguro.', 4
FROM iso_requirements WHERE requirement_code = '4.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Elementos de protección personal.', 5
FROM iso_requirements WHERE requirement_code = '4.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Manejo en caso de emergencia.', 6
FROM iso_requirements WHERE requirement_code = '4.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Condiciones adecuadas de SST en los lugares de trabajo:', 7
FROM iso_requirements WHERE requirement_code = '4.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Control de las actividades criticas como trabajo en caliente, espacios confinados, trabajo en alturas, riesgo eléctrico, izaje de cargas.', 8
FROM iso_requirements WHERE requirement_code = '4.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Estado de orden y aseo.', 9
FROM iso_requirements WHERE requirement_code = '4.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Estado de la señalización y demarcación.', 10
FROM iso_requirements WHERE requirement_code = '4.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Eficacia de las acciones de prevención y control implementadas.', 11
FROM iso_requirements WHERE requirement_code = '4.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Seguridad de instalaciones, máquinas y equipos.', 12
FROM iso_requirements WHERE requirement_code = '4.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Gestión de todos los riesgos en SST.', 13
FROM iso_requirements WHERE requirement_code = '4.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Control a contratistas.', 14
FROM iso_requirements WHERE requirement_code = '4.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 4.2.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Identificación de actividades críticas.', 1
FROM iso_requirements WHERE requirement_code = '4.2.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Documentación de procedimientos, instructivos, fichas para estas actividades con criterios de SST.', 2
FROM iso_requirements WHERE requirement_code = '4.2.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Actualización y uso de documentos  vigentes en lugares de trabajo.', 3
FROM iso_requirements WHERE requirement_code = '4.2.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Implementación de procedimientos en  el lugar de trabajo.', 4
FROM iso_requirements WHERE requirement_code = '4.2.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Capacitación al personal.', 5
FROM iso_requirements WHERE requirement_code = '4.2.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Entrega de procedimientos a los trabajadores.', 6
FROM iso_requirements WHERE requirement_code = '4.2.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conocimiento  del personal sobre procedimientos.', 7
FROM iso_requirements WHERE requirement_code = '4.2.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 4.2.4
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Mecanismos estandarizados para realización de inspecciones  en SST.', 1
FROM iso_requirements WHERE requirement_code = '4.2.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Alcance sobre todas las áreas, equipos, máquinas, herramientas.', 2
FROM iso_requirements WHERE requirement_code = '4.2.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Ejecución de inspecciones según lo programado.', 3
FROM iso_requirements WHERE requirement_code = '4.2.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Realización de inspecciones por COPASST, brigada, trabajadores, otros, según corresponda.', 4
FROM iso_requirements WHERE requirement_code = '4.2.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Análisis al resultado de las  inspecciones.', 5
FROM iso_requirements WHERE requirement_code = '4.2.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Determinación de planes de acción y seguimiento.', 6
FROM iso_requirements WHERE requirement_code = '4.2.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 6.1.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Definición de Indicadores Mínimos de SST', 1
FROM iso_requirements WHERE requirement_code = '6.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '* Frecuencia de la accidentalidad /  Severidad de la accidentalidad /  Mortalidad por Accidentes de Trabajo / Prevalencia de Enfermedad Laboral / Incidencia de Enfermedad Laboral. / Ausentismo por causa médica.', 2
FROM iso_requirements WHERE requirement_code = '6.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Definición de indicadores del SG-SST que permitan evaluar', 3
FROM iso_requirements WHERE requirement_code = '6.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Estructura del SG-SST.', 4
FROM iso_requirements WHERE requirement_code = '6.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Proceso del SG-SST.', 5
FROM iso_requirements WHERE requirement_code = '6.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Resultado del SG-SST.', 6
FROM iso_requirements WHERE requirement_code = '6.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Ficha técnica del indicador.', 7
FROM iso_requirements WHERE requirement_code = '6.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Medición del indicador (Según la frecuencia determinada).', 8
FROM iso_requirements WHERE requirement_code = '6.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Medición, análisis y planes de acción.', 9
FROM iso_requirements WHERE requirement_code = '6.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Comunicación de resultados de indicador.', 10
FROM iso_requirements WHERE requirement_code = '6.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 6.1.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Programa de auditorias al SG-SST.', 1
FROM iso_requirements WHERE requirement_code = '6.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Idoneidad del auditor.', 2
FROM iso_requirements WHERE requirement_code = '6.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Alcance de auditoria, periodicidad (anual), metodología.', 3
FROM iso_requirements WHERE requirement_code = '6.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Planeación de auditoria con participación del Copasst  / Vigía de SST', 4
FROM iso_requirements WHERE requirement_code = '6.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Realización de la auditoria  anual.', 5
FROM iso_requirements WHERE requirement_code = '6.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Informe.', 6
FROM iso_requirements WHERE requirement_code = '6.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Análisis de resultados y determinación de acciones correctivas, preventivas  y de mejora.', 7
FROM iso_requirements WHERE requirement_code = '6.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Comunicación de resultados al personal.', 8
FROM iso_requirements WHERE requirement_code = '6.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Implementación de acciones de mejora y  su efectividad.', 9
FROM iso_requirements WHERE requirement_code = '6.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 6.1.4
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Planeación de la auditoria al SG-SST con participación del COPASST o Vigía de SST.', 1
FROM iso_requirements WHERE requirement_code = '6.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Comunicación al Copasst  o vigía de SST y al Responsable del SG-SST.', 2
FROM iso_requirements WHERE requirement_code = '6.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '* Resultados de la revisión por parte de la Alta dirección.', 3
FROM iso_requirements WHERE requirement_code = '6.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '* Resultados de la auditoría realizada al SG-SST.', 4
FROM iso_requirements WHERE requirement_code = '6.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '*Los planes de acción derivados de estas revisiones.', 5
FROM iso_requirements WHERE requirement_code = '6.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 7.1.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Resultados del SG-SST (Auditorias, revisiones ,inspecciones, otros) para definir acciones correctivas  y preventivas.', 1
FROM iso_requirements WHERE requirement_code = '7.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Documentación de acciones correctivas, preventivas  y de mejora.', 2
FROM iso_requirements WHERE requirement_code = '7.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Análisis de causas de las no conformidades.', 3
FROM iso_requirements WHERE requirement_code = '7.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Determinación de planes de acción, con responsables y fechas de cumplimiento.', 4
FROM iso_requirements WHERE requirement_code = '7.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Comunicación de acciones al personal.', 5
FROM iso_requirements WHERE requirement_code = '7.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Implementación de acciones correctivas, preventivas y de mejora.', 6
FROM iso_requirements WHERE requirement_code = '7.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Seguimiento de las acciones.', 7
FROM iso_requirements WHERE requirement_code = '7.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Efectividad de las acciones.', 8
FROM iso_requirements WHERE requirement_code = '7.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 7.1.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Análisis de los resultados derivado de la revisión al SG-SST por la alta dirección.', 1
FROM iso_requirements WHERE requirement_code = '7.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Definición de acciones correctivas, preventivas  y de mejora.', 2
FROM iso_requirements WHERE requirement_code = '7.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Implementación de acciones correctivas, preventivas y de mejora.', 3
FROM iso_requirements WHERE requirement_code = '7.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Comunicación de acciones  al personal.', 4
FROM iso_requirements WHERE requirement_code = '7.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Seguimiento de las acciones.', 5
FROM iso_requirements WHERE requirement_code = '7.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Efectividad de las acciones.', 6
FROM iso_requirements WHERE requirement_code = '7.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 7.1.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Análisis de los resultados derivado de la investigación de ATEL.', 1
FROM iso_requirements WHERE requirement_code = '7.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Determinación de causas básicas de los ATEL.', 2
FROM iso_requirements WHERE requirement_code = '7.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Definición de acciones correctivas, preventivas  y de mejora.', 3
FROM iso_requirements WHERE requirement_code = '7.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Implementación de acciones correctivas, preventivas  y de mejora.', 4
FROM iso_requirements WHERE requirement_code = '7.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Comunicación de acciones  al personal.', 5
FROM iso_requirements WHERE requirement_code = '7.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Seguimiento de las acciones.', 6
FROM iso_requirements WHERE requirement_code = '7.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Efectividad de las acciones.', 7
FROM iso_requirements WHERE requirement_code = '7.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 7.1.4
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Análisis de  las medidas y acciones correctivas solicitadas por autoridades y ARL.', 1
FROM iso_requirements WHERE requirement_code = '7.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Determinación de causas básicas.', 2
FROM iso_requirements WHERE requirement_code = '7.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Definición de acciones correctivas, preventivas  y de mejora.', 3
FROM iso_requirements WHERE requirement_code = '7.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Implementación de acciones correctivas, preventivas  y de mejora.', 4
FROM iso_requirements WHERE requirement_code = '7.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Comunicación de acciones  al personal.', 5
FROM iso_requirements WHERE requirement_code = '7.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Seguimiento de las acciones.', 6
FROM iso_requirements WHERE requirement_code = '7.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Efectividad de las acciones.', 7
FROM iso_requirements WHERE requirement_code = '7.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para MinTrabajo Laboral (MINTRABAJO)

-- Criterios para requisito 1.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Nombre o razón social de la persona (natural o jurídica visitada)', 1
FROM iso_requirements WHERE requirement_code = '1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Tipo de Persona (natural/jurídica) JURIDICA', 2
FROM iso_requirements WHERE requirement_code = '1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Estado de la empresa visitada (si es persona jurídica)', 3
FROM iso_requirements WHERE requirement_code = '1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Forma de Identificación de la Persona Visitada Número de Identificación Tributaria (NIT)', 4
FROM iso_requirements WHERE requirement_code = '1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número documento de identificación', 5
FROM iso_requirements WHERE requirement_code = '1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Denominación de la persona (natural/jurídica) visitada Sociedad por Acciones Simplificada', 6
FROM iso_requirements WHERE requirement_code = '1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Tamaño de la empresa', 7
FROM iso_requirements WHERE requirement_code = '1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Zona geográfica', 8
FROM iso_requirements WHERE requirement_code = '1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Departamento', 9
FROM iso_requirements WHERE requirement_code = '1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Municipio', 10
FROM iso_requirements WHERE requirement_code = '1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Es un municipio PDET?', 11
FROM iso_requirements WHERE requirement_code = '1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Nombre municipio PDET', 12
FROM iso_requirements WHERE requirement_code = '1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));

-- Criterios para requisito 1.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Dirección de la visitada', 1
FROM iso_requirements WHERE requirement_code = '1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Teléfono o celular de contacto', 2
FROM iso_requirements WHERE requirement_code = '1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Correo electrónico', 3
FROM iso_requirements WHERE requirement_code = '1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Nombre/s y apellido/s representante', 4
FROM iso_requirements WHERE requirement_code = '1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número documento de identificación', 5
FROM iso_requirements WHERE requirement_code = '1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));

-- Criterios para requisito 1.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Código CIIU (Actividad económica principal)', 1
FROM iso_requirements WHERE requirement_code = '1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Código CIIU (Actividad económica división) Lista desplegable', 2
FROM iso_requirements WHERE requirement_code = '1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Código CIIU (Actividad económica grupo) Lista desplegable', 3
FROM iso_requirements WHERE requirement_code = '1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Código CIIU (Actividad económica clase) Lista desplegable', 4
FROM iso_requirements WHERE requirement_code = '1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Tiene sucursales a nivel nacional', 5
FROM iso_requirements WHERE requirement_code = '1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Sectores críticos TLC Lista desplegable', 6
FROM iso_requirements WHERE requirement_code = '1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '2 DATOS DE QUIENES PARTICIPAN DE LA DILIGENCIA', 7
FROM iso_requirements WHERE requirement_code = '1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Representante de la o las organizaciones sindicales (si la hubiere)', 8
FROM iso_requirements WHERE requirement_code = '1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Representante del comité de convivencia', 9
FROM iso_requirements WHERE requirement_code = '1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Representante del COPASST', 10
FROM iso_requirements WHERE requirement_code = '1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Responsable del sistema de gestión en seguridad y salud en el trabajo (SG-SST)', 11
FROM iso_requirements WHERE requirement_code = '1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Apoderado de la persona visitada', 12
FROM iso_requirements WHERE requirement_code = '1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Representante legal de la persona jurídica visitada', 13
FROM iso_requirements WHERE requirement_code = '1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'PARTE SEGUNDA: CARACTERIZACIÓN DEL PERSONAL VINCULADO CON LA PERSONA NATURAL O JURIDICA VISITADA', 14
FROM iso_requirements WHERE requirement_code = '1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '3 COMPOSICION DE PLANTA', 15
FROM iso_requirements WHERE requirement_code = '1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));

-- Criterios para requisito 3.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de mujeres trabajan en la empresa', 1
FROM iso_requirements WHERE requirement_code = '3.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de hombres trabajan en la empresa', 2
FROM iso_requirements WHERE requirement_code = '3.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de personas que se identifican con otro genero (no obligatorio -habeas data) 0', 3
FROM iso_requirements WHERE requirement_code = '3.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));

-- Criterios para requisito 3.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de personas de nacionalidad colombiana que trabajan allí', 1
FROM iso_requirements WHERE requirement_code = '3.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de personas de otras nacionalidades que trabajan allí 0', 2
FROM iso_requirements WHERE requirement_code = '3.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Desagregue el número de personas de otras nacionalidades que trabajan allí 0', 3
FROM iso_requirements WHERE requirement_code = '3.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '3.4 TRABAJADORES/AS DESAGREGADOS POR RANGO DE EDAD', 4
FROM iso_requirements WHERE requirement_code = '3.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de Menores de 15 años', 5
FROM iso_requirements WHERE requirement_code = '3.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de trabajadores/as de 15 a 17 años', 6
FROM iso_requirements WHERE requirement_code = '3.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de trabajadores/as de 18 a 29 años', 7
FROM iso_requirements WHERE requirement_code = '3.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de trabajadores/as de 30 a 56 años', 8
FROM iso_requirements WHERE requirement_code = '3.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de trabajadores/as de mas de 57 años', 9
FROM iso_requirements WHERE requirement_code = '3.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));

-- Criterios para requisito 3.5
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Indígena', 1
FROM iso_requirements WHERE requirement_code = '3.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Raizal', 2
FROM iso_requirements WHERE requirement_code = '3.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Palanquero', 3
FROM iso_requirements WHERE requirement_code = '3.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Comunidades Negras', 4
FROM iso_requirements WHERE requirement_code = '3.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Mulato', 5
FROM iso_requirements WHERE requirement_code = '3.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Afrocolombiano', 6
FROM iso_requirements WHERE requirement_code = '3.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));

-- Criterios para requisito 3.6
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de Adulto/s Mayor/es en situación prepensional (personas mayores a :54 años mujeres / 59 años hombres)', 1
FROM iso_requirements WHERE requirement_code = '3.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Números de personas en situación de Desplazado/a por violencia', 2
FROM iso_requirements WHERE requirement_code = '3.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de personas en situación de discapacidad o condición de salud sustancial con incidencia laboral', 3
FROM iso_requirements WHERE requirement_code = '3.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de madres cabeza de familia', 4
FROM iso_requirements WHERE requirement_code = '3.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de mujer/es víctima/s de violencia de género', 5
FROM iso_requirements WHERE requirement_code = '3.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de niñas, niños y adolescentes vinculados a los centros de trabajo', 6
FROM iso_requirements WHERE requirement_code = '3.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));

-- Criterios para requisito 3.7
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '3.7.1. SITUACION MENORES DE 18 AÑOS VINCULADOS A LOS CENTROS DE TRABAJO', 1
FROM iso_requirements WHERE requirement_code = '3.7' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Numero de trabajadores/as menores de 18 años que trabajan en el centro de trabajo', 2
FROM iso_requirements WHERE requirement_code = '3.7' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Por excepción: Laboran niños menores de 14 años en los centros de trabajó', 3
FROM iso_requirements WHERE requirement_code = '3.7' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Los niños, niñas o adolescentes ejecutan trabajos autorizados por el Ministerio de Trabajo?', 4
FROM iso_requirements WHERE requirement_code = '3.7' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Numero de horas laboradas por los menores de 18 años', 5
FROM iso_requirements WHERE requirement_code = '3.7' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '3.7.2. EN SITUACION DE MATERNIDAD O PATERNIDAD', 6
FROM iso_requirements WHERE requirement_code = '3.7' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de personas Gestantes', 7
FROM iso_requirements WHERE requirement_code = '3.7' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de personas en licencia de maternidad', 8
FROM iso_requirements WHERE requirement_code = '3.7' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de personas en licencia de paternidad', 9
FROM iso_requirements WHERE requirement_code = '3.7' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de personas en estado de lactancia (Artículo 238 del CST -Ley 2306 de 2023)', 10
FROM iso_requirements WHERE requirement_code = '3.7' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '3.7.3. EN SITUACION DE DISCAPACIDAD O CONDICION DE SALUD SUSTANCIAL CON INCIDENCIA LABORAL', 11
FROM iso_requirements WHERE requirement_code = '3.7' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de personas en condición de discapacidad o con porcentaje de pérdida de capacidad laboral', 12
FROM iso_requirements WHERE requirement_code = '3.7' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de personas con condiciones de salud que tienen comorbilidades relevantes', 13
FROM iso_requirements WHERE requirement_code = '3.7' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de personas con restricciones laborales por recomendaciones medicas del tratante', 14
FROM iso_requirements WHERE requirement_code = '3.7' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de personas con reubicación, reincorporados/as, en reconversión, o en readiestramiento del puesto de trabajo', 15
FROM iso_requirements WHERE requirement_code = '3.7' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '3.7.4. EN SITUACION PENSIONAL', 16
FROM iso_requirements WHERE requirement_code = '3.7' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de personas en condición de prepensión (menos de tres años para pensionarse (RPM) o con 7 2 0', 17
FROM iso_requirements WHERE requirement_code = '3.7' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de personas que están pensionados/as 0 2 0', 18
FROM iso_requirements WHERE requirement_code = '3.7' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '4 CARACTERIZACION SOBRE LA FORMA DE VINCULACION PARA TRABAJAR', 19
FROM iso_requirements WHERE requirement_code = '3.7' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));

-- Criterios para requisito 4.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de trabajadores/as con contratos laborales', 1
FROM iso_requirements WHERE requirement_code = '4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de contratistas vinculados por orden (OPS) o contrato de prestación de servicios', 2
FROM iso_requirements WHERE requirement_code = '4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de trabajadores en misión vinculados por una Empresa de Servicios Temporales', 3
FROM iso_requirements WHERE requirement_code = '4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de personas en condición de que trabajan en los centros de trabajo y que se encuentran vinculadas por empresas tercerizadas', 4
FROM iso_requirements WHERE requirement_code = '4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de aprendices SENA?', 5
FROM iso_requirements WHERE requirement_code = '4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de personal en pasantías o practicante', 6
FROM iso_requirements WHERE requirement_code = '4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));

-- Criterios para requisito 4.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de contratos a término indefinido?', 1
FROM iso_requirements WHERE requirement_code = '4.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de contratos a término Fijo?', 2
FROM iso_requirements WHERE requirement_code = '4.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de contratos a término fijo inferior a un Año?', 3
FROM iso_requirements WHERE requirement_code = '4.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de contratos a término fijo superior a un Año?', 4
FROM iso_requirements WHERE requirement_code = '4.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de contratos a por obra o labor? 0', 5
FROM iso_requirements WHERE requirement_code = '4.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de contratos a contratos temporal, ocasional o accidental ?', 6
FROM iso_requirements WHERE requirement_code = '4.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de contratos de aprendizaje?', 7
FROM iso_requirements WHERE requirement_code = '4.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de contratos verbales ?', 8
FROM iso_requirements WHERE requirement_code = '4.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de contratos escritos?', 9
FROM iso_requirements WHERE requirement_code = '4.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));

-- Criterios para requisito 4.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de cargos gerenciales?', 1
FROM iso_requirements WHERE requirement_code = '4.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de cargos Directivos?', 2
FROM iso_requirements WHERE requirement_code = '4.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de cargos Administrativos?', 3
FROM iso_requirements WHERE requirement_code = '4.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de cargos Operativos', 4
FROM iso_requirements WHERE requirement_code = '4.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número por otros cargos', 5
FROM iso_requirements WHERE requirement_code = '4.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'PARTE TERCERA: CUMPLIMIENTO DE NORMAS LABORALES DE NATURALEZA INDIVIDUAL Y DEL SISTEMA DE SEGURIDAD SOCIAL INTEGRAL', 6
FROM iso_requirements WHERE requirement_code = '4.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '5 REMUNERACIONES DEL TRABAJADOR', 7
FROM iso_requirements WHERE requirement_code = '4.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));

-- Criterios para requisito 5.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Fecha del ultimo pago de nómina', 1
FROM iso_requirements WHERE requirement_code = '5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'En que forma realiza los pagos', 2
FROM iso_requirements WHERE requirement_code = '5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Reconoce pago de salario en especie?', 3
FROM iso_requirements WHERE requirement_code = '5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Se paga salario integral?', 4
FROM iso_requirements WHERE requirement_code = '5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Tiene trabajadores/as con salario integral', 5
FROM iso_requirements WHERE requirement_code = '5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Realizan en la empresa descuentos de nomina', 6
FROM iso_requirements WHERE requirement_code = '5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La remuneración de las mujeres trabajadoras es igual al de los hombres trabajadores que ejercen la misma labor', 7
FROM iso_requirements WHERE requirement_code = '5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '¿Tienen escala o bandas salariales?', 8
FROM iso_requirements WHERE requirement_code = '5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '¿Qué factores se tienen en cuenta para fijar los salarios para los distintos rangos salariales?', 9
FROM iso_requirements WHERE requirement_code = '5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));

-- Criterios para requisito 5.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'En la nomina se reconoce el pago del auxilio de Transporte conforme a la Ley?', 1
FROM iso_requirements WHERE requirement_code = '5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'El Auxilio de Transporte se incluye para liquidar prestaciones sociales?', 2
FROM iso_requirements WHERE requirement_code = '5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '¿Presta el establecimiento servicio de ruta?', 3
FROM iso_requirements WHERE requirement_code = '5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Los trabajadores/as que están en teletrabajo se les reconoce el auxilio de transporte?', 4
FROM iso_requirements WHERE requirement_code = '5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));

-- Criterios para requisito 5.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '5.3.1. PRIMA DE SERVICIOS', 1
FROM iso_requirements WHERE requirement_code = '5.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Liquida correctamente la Prima de Servicios?', 2
FROM iso_requirements WHERE requirement_code = '5.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Paga oportunamente la prima de servicios?', 3
FROM iso_requirements WHERE requirement_code = '5.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Fecha último pago', 4
FROM iso_requirements WHERE requirement_code = '5.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '5.3.2. CESANTÍAS E INTERESES A LAS CESANTIAS', 5
FROM iso_requirements WHERE requirement_code = '5.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Consignó las cesantías a los Fondos autorizados por el trabajador?', 6
FROM iso_requirements WHERE requirement_code = '5.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Fecha de Consignación a los fondos', 7
FROM iso_requirements WHERE requirement_code = '5.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Pagó oportunamente los intereses de cesantías al trabajador ?', 8
FROM iso_requirements WHERE requirement_code = '5.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '5.3.3. CALZADO Y VESTIDO DE LABOR', 9
FROM iso_requirements WHERE requirement_code = '5.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Fecha de la última entrega de calzado y vestido de labor?', 10
FROM iso_requirements WHERE requirement_code = '5.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'El empleador hace entregas completas del calzado y vestido de labor?', 11
FROM iso_requirements WHERE requirement_code = '5.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cual es la periodicidad en meses en que el empleador entrega el calzado y vestido de labor', 12
FROM iso_requirements WHERE requirement_code = '5.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));

-- Criterios para requisito 5.4
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Concede vacaciones en los términos de art. 187 del C.S.T.?', 1
FROM iso_requirements WHERE requirement_code = '5.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Incluye el sábado la Jornada Laboral?', 2
FROM iso_requirements WHERE requirement_code = '5.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Lleva registro de vacaciones?', 3
FROM iso_requirements WHERE requirement_code = '5.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Compensa vacaciones durante la vigencia de los contratos?', 4
FROM iso_requirements WHERE requirement_code = '5.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Compensa o indemniza vacaciones a la terminación de los contratos?', 5
FROM iso_requirements WHERE requirement_code = '5.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'En la empresa se acumulan vacaciones para algunos/as trabajadores/as. (Deben respetarse los mínimos dias que se debe otorgar (6))', 6
FROM iso_requirements WHERE requirement_code = '5.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Existe recurrencia en la acumulación de más de dos periodos de vacaciones?', 7
FROM iso_requirements WHERE requirement_code = '5.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de personas presentan vacaciones acumuladas', 8
FROM iso_requirements WHERE requirement_code = '5.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));

-- Criterios para requisito 5.5
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '5.5.1. EN RELACIÓN CON LOS APORTES AL SISTEMA DE SEGURIDAD SOCIAL INTEGRAL', 1
FROM iso_requirements WHERE requirement_code = '5.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'El empleador efectúa aportes son destinos a los sistemas de salud, pensión y riesgos laborales?', 2
FROM iso_requirements WHERE requirement_code = '5.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'El empleador efectúa aportes parafiscales (con destino al Sena, ICBF y Caja de Compensación Familiar?', 3
FROM iso_requirements WHERE requirement_code = '5.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'El empleador realiza el pago oportuno de los aportes al sistema de seguridad social integral?', 4
FROM iso_requirements WHERE requirement_code = '5.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuál es el valor de la nómina sobre la cual aporta?', 5
FROM iso_requirements WHERE requirement_code = '5.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La nómina sobre la cual se aporta corresponde a la real?', 6
FROM iso_requirements WHERE requirement_code = '5.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Fecha de la última nómina sobre la cual se efectuaron los aportes al Sistema', 7
FROM iso_requirements WHERE requirement_code = '5.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '5.5.2. Afiliación y aporte Empresa Prestadora de Salud (EPS)- SISTEMA GENERAL DE SEGURIDAD SOCIAL EN SALUD', 8
FROM iso_requirements WHERE requirement_code = '5.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Afilia al trabajador/a desde su vinculación?', 9
FROM iso_requirements WHERE requirement_code = '5.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'El aporte se cotiza sobre el salario real devengado?', 10
FROM iso_requirements WHERE requirement_code = '5.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '5.5.3. Afiliación y aporte fondo de pensiones (EPS)- SISTEMA GENERAL DE PENSIONES', 11
FROM iso_requirements WHERE requirement_code = '5.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Afilia al trabajador/a desde su vinculación? Si', 12
FROM iso_requirements WHERE requirement_code = '5.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '5.5.4. Afiliación y aporte a Administradora de Riesgos Laborales- SISTEMA GENERAL DE RIESGOS LABORALES', 13
FROM iso_requirements WHERE requirement_code = '5.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Nombre A.R.L. que está afiliada la Empresa', 14
FROM iso_requirements WHERE requirement_code = '5.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Fecha de Afiliación a la ARL', 15
FROM iso_requirements WHERE requirement_code = '5.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Ultima fecha de consignación de Aportes para la ARL', 16
FROM iso_requirements WHERE requirement_code = '5.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de meses consignados', 17
FROM iso_requirements WHERE requirement_code = '5.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La nómina sobre la cual se aporta corresponde al pago real por concepto de salarios', 18
FROM iso_requirements WHERE requirement_code = '5.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '5.5.5. Afiliación y aporte a CAJA DE COMPENSACION FAMILIAR', 19
FROM iso_requirements WHERE requirement_code = '5.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Tiene afiliados sus trabajadores/as a una Caja de Compensación familiar', 20
FROM iso_requirements WHERE requirement_code = '5.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Nombre de la Caja de Compensación', 21
FROM iso_requirements WHERE requirement_code = '5.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '6 CONDICIONES LABORALES DE LOS TRABAJADORES A LA LUZ DE LAS NORMAS INDIVIDUALES', 22
FROM iso_requirements WHERE requirement_code = '5.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));

-- Criterios para requisito 6.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Trabajadores que asisten a los centros de trabajo del empleador', 1
FROM iso_requirements WHERE requirement_code = '6.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Trabajadores que se encuentran en la modalidad de teletrabajo autónomo', 2
FROM iso_requirements WHERE requirement_code = '6.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Trabajadores que se encuentran en la modalidad de teletrabajo suplementario', 3
FROM iso_requirements WHERE requirement_code = '6.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Trabajadores que se encuentran en la modalidad de trabajo remoto', 4
FROM iso_requirements WHERE requirement_code = '6.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));

-- Criterios para requisito 6.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Primer tipo de horario o único que se encuentra adoptado', 1
FROM iso_requirements WHERE requirement_code = '6.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Segundo tipo de horario (que se encuentra adoptado)', 2
FROM iso_requirements WHERE requirement_code = '6.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Tercer tipo de horario (que se encuentra adoptado)', 3
FROM iso_requirements WHERE requirement_code = '6.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Implementa horarios y jornadas de trabajo flexible para trabajadores/as con cargas de cuidado?', 4
FROM iso_requirements WHERE requirement_code = '6.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '6.2.1. TRABAJO SUPLEMENTARIO', 5
FROM iso_requirements WHERE requirement_code = '6.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de trabajadores/ras que laboran horas extras', 6
FROM iso_requirements WHERE requirement_code = '6.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de horas extras semanales laboradas:', 7
FROM iso_requirements WHERE requirement_code = '6.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Tienen autorización para laborar Horas Extras por parte del Ministerio del Trabajo?', 8
FROM iso_requirements WHERE requirement_code = '6.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Numero y fecha de la resolución', 9
FROM iso_requirements WHERE requirement_code = '6.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'se encuentra vigente?', 10
FROM iso_requirements WHERE requirement_code = '6.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '¿Lleva registro diario de trabajo suplementario?', 11
FROM iso_requirements WHERE requirement_code = '6.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '¿Entrega el empleador al trabajador una relación de las horas extras laboradas con las especificaciones legales', 12
FROM iso_requirements WHERE requirement_code = '6.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Se reconoce pago por recargo nocturno conforme a la Ley ?', 13
FROM iso_requirements WHERE requirement_code = '6.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Implementó reducción horaria según ley 2101 de 2021?', 14
FROM iso_requirements WHERE requirement_code = '6.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '¿Explique Implementó reducción horaria según ley 2101 de 2021?', 15
FROM iso_requirements WHERE requirement_code = '6.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '¿Aplica Ley de desconexión laboral? (Ley 2191 de 2022)', 16
FROM iso_requirements WHERE requirement_code = '6.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '6.2.2. DESCANSOS REMUNERADOS', 17
FROM iso_requirements WHERE requirement_code = '6.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Se trabaja en dominical y/o festivo?', 18
FROM iso_requirements WHERE requirement_code = '6.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'El trabajo dominical es Ocasional o permanente?', 19
FROM iso_requirements WHERE requirement_code = '6.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Concede descanso dominical y/o festivos remunerados?', 20
FROM iso_requirements WHERE requirement_code = '6.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Los liquida y paga con los recargos legales?', 21
FROM iso_requirements WHERE requirement_code = '6.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));

-- Criterios para requisito 6.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'De acuerdo con la Ley, la Empresa está obligada a adoptar Reglamento Interno de Trabajo', 1
FROM iso_requirements WHERE requirement_code = '6.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Fecha de expedición', 2
FROM iso_requirements WHERE requirement_code = '6.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'El reglamento incluye un procedimiento para sancionar que garantiza el debido proceso?', 3
FROM iso_requirements WHERE requirement_code = '6.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Contiene la adenda de la Ley 1010 de 2006', 4
FROM iso_requirements WHERE requirement_code = '6.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'El reglamento de trabajo está publicado esta publicado en todas las sedes de trabajo?', 5
FROM iso_requirements WHERE requirement_code = '6.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Se dio término para observaciones', 6
FROM iso_requirements WHERE requirement_code = '6.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'El reglamento incluye lo establecido por la Ley 2365 de 2024 (acoso sexual)', 7
FROM iso_requirements WHERE requirement_code = '6.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'PARTE CUARTA: CUMPLIMIENTO DE NORMAS SOBRE ENFOQUE DE GENERO', 8
FROM iso_requirements WHERE requirement_code = '6.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '7 INSPECCIÓN CON ENFOQUE DIFERENCIAL DE GENERO', 9
FROM iso_requirements WHERE requirement_code = '6.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));

-- Criterios para requisito 7.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Tiene trabajadores/as mayores de 57 años mujeres y/o mayores de 62 años hombres?', 1
FROM iso_requirements WHERE requirement_code = '7.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '¿Cuenta con el Certificado de Sello Amigable Adulto Mayor? (artículo 7 de la Ley 2040 del 2020)', 2
FROM iso_requirements WHERE requirement_code = '7.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '¿Cuenta con el sello EQUIPARES?', 3
FROM iso_requirements WHERE requirement_code = '7.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '¿Cuenta con sello “segundas oportunidades”? (Ley 2208 de 2022)', 4
FROM iso_requirements WHERE requirement_code = '7.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '¿Laboran mujeres víctimas de violencias de género?', 5
FROM iso_requirements WHERE requirement_code = '7.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '¿Se encuentra inscrito/a para recibir la deducción tributaria respectivo? (Ley 1257 de 2008 y Decreto 2733 de 2012)', 6
FROM iso_requirements WHERE requirement_code = '7.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuenta con el sello de igualdad de género?', 7
FROM iso_requirements WHERE requirement_code = '7.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'existe documento por escrito del compromiso de igualdad de genero?', 8
FROM iso_requirements WHERE requirement_code = '7.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'existe comité de igualdad de genero?', 9
FROM iso_requirements WHERE requirement_code = '7.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'desarrolla capacidades de genero de alta gerencia y del personal?', 10
FROM iso_requirements WHERE requirement_code = '7.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Desarrolla un diagnostico organizar de genero?', 11
FROM iso_requirements WHERE requirement_code = '7.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Adopta una política y un plan de acción para la igualdad de genero?', 12
FROM iso_requirements WHERE requirement_code = '7.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'toma acciones para la mejora continua y mantener el sello de igualdad de genero?', 13
FROM iso_requirements WHERE requirement_code = '7.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));

-- Criterios para requisito 7.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '¿Con base en la normatividad legal vigente, el sexo o el género constituyen un requisito para acceder a ciertos cargos de la empresa (establecimiento, organización, Institución)?', 1
FROM iso_requirements WHERE requirement_code = '7.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '¿Solicitan a las personas oferentes llenar algún formulario de solicitud de empleo o similar?', 2
FROM iso_requirements WHERE requirement_code = '7.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '¿Los requisitos para acceder a ciertos cargos se aplican de manera igualitaria a la totalidad de las personas aspirantes?', 3
FROM iso_requirements WHERE requirement_code = '7.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '¿Tienen un formato de preguntas para las entrevistas? Verificar formato', 4
FROM iso_requirements WHERE requirement_code = '7.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '¿La empresa (establecimiento, organización, Institución), indaga sobre la orientación sexual o identidad de género de la persona postulante? (Si la respuesta es afirmativa ¿con qué fin?)', 5
FROM iso_requirements WHERE requirement_code = '7.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '¿En la entrevista se realizan preguntas en relación con la composición familiar, planificación familiar, la maternidad, hijos/as/es y en general sobre los planes de vida reproductivos?', 6
FROM iso_requirements WHERE requirement_code = '7.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '¿La empresa ordena la práctica de prueba de embarazo o pruebas serológicas como requisito para ingresar a laborar?', 7
FROM iso_requirements WHERE requirement_code = '7.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));

-- Criterios para requisito 7.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '¿Cuenta con mecanismos como protocolos para identificar, prevenir y atender conductas de acoso laboral en el lugar de trabajo?', 1
FROM iso_requirements WHERE requirement_code = '7.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '¿Cuáles son los mecanismos para identificar, prevenir y atender conductas de acoso sexual laboral en el lugar de trabajo?', 2
FROM iso_requirements WHERE requirement_code = '7.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '¿Ha desarrollado campañas para erradicar todo acto de discriminación y violencia contra las mujeres o personas LGBTI en el establecimiento? ¿Cuáles?', 3
FROM iso_requirements WHERE requirement_code = '7.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '¿Cuenta con una política institucional contra las violencias de género en el trabajo incluidas el acoso sexual? ¿Cuál?', 4
FROM iso_requirements WHERE requirement_code = '7.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '¿En cuanto a los procesos disciplinarios por casos de acoso laboral o sexual, cuenta con los protocolos para su atención, su respectiva divulgación y se garantiza la confidencialidad de los casos reportados e 
incluyen el seguimiento por parte de ARL, EPS y/o la entidad que corresponda? ¿Cuáles son los
protocolos?', 5
FROM iso_requirements WHERE requirement_code = '7.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '¿Se hacen exigencias de uso de vestimenta, uniformes u otras características de presentación personal diferenciada para las mujeres?', 6
FROM iso_requirements WHERE requirement_code = '7.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '¿Cuántos procesos disciplinarios tiene o ha tenido en los últimos 5 años relacionados con acoso laboral donde la víctima sea una mujer o persona LGBTIQ+?', 7
FROM iso_requirements WHERE requirement_code = '7.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '¿Cuántos procesos disciplinarios tiene o ha tenido en los últimos 5 años relacionados con acoso sexual o violencia de género donde la víctima sea una mujer o persona LGBTIQ+?', 8
FROM iso_requirements WHERE requirement_code = '7.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));

-- Criterios para requisito 7.4
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '¿La empresa promueve estrategias para que las mujeres accedan a cargos altamente masculinizados y viceversa? ¿Cuáles?', 1
FROM iso_requirements WHERE requirement_code = '7.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '¿Existen mujeres en puestos de supervisión o puestos de toma de decisiones? ¿Cuáles puestos?', 2
FROM iso_requirements WHERE requirement_code = '7.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de mujeres en estos puestos', 3
FROM iso_requirements WHERE requirement_code = '7.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de hombres en estos puestos', 4
FROM iso_requirements WHERE requirement_code = '7.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));

-- Criterios para requisito 7.5
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '¿El área de Recursos Humanos incorpora en sus procesos de capacitación la perspectiva de género? Explicar', 1
FROM iso_requirements WHERE requirement_code = '7.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '¿Existe participación paritaria en los espacios de capacitación?', 2
FROM iso_requirements WHERE requirement_code = '7.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '¿En qué horario/jornadas se realizan los procesos de capacitación?', 3
FROM iso_requirements WHERE requirement_code = '7.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Adelanta programas de recreación y/o capacitación de acuerdo con el Art. 21 Ley 50 de 1990 ¿Cuáles?', 4
FROM iso_requirements WHERE requirement_code = '7.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Horarios de realización', 5
FROM iso_requirements WHERE requirement_code = '7.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Adelanta programas integrales de bienestar ¿Cuáles?', 6
FROM iso_requirements WHERE requirement_code = '7.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Adelanta programas de formación ¿Cuáles?', 7
FROM iso_requirements WHERE requirement_code = '7.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));

-- Criterios para requisito 7.6
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '¿El empleador/a respeta el fuero de maternidad y el fuero de paternidad? (esto se puede verificar con las personas trabajadoras de la empresa)', 1
FROM iso_requirements WHERE requirement_code = '7.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '¿Se otorgan a las trabajadoras que lo requieran los descansos remunerados para amamantar a su hijo/a, durante los primeros 2 años de edad?', 2
FROM iso_requirements WHERE requirement_code = '7.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '¿Cuentan las instalaciones con espacios físicos acondicionados y dignos para las mujeres trabajadoras en estado de embarazo y período de lactancia? (Verificar la sala de lactancia y demás instalaciones)', 3
FROM iso_requirements WHERE requirement_code = '7.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '¿El establecimiento permite y aprueba que la madre tome la licencia de maternidad flexible de medio tiempo (licencia parental compartida)? seleccionado y/o que comparte las últimas 6 semanas de su licencia con el padre del menor)(Ley 2114 DE MATERNIDAD COMPLETA de 2021)', 4
FROM iso_requirements WHERE requirement_code = '7.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '¿La empresa (establecimiento, organización, Institución) permite y aprueba licencias de paternidad de acuerdo con la norma? (Aportar solicitudes presentadas el último año)', 5
FROM iso_requirements WHERE requirement_code = '7.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuanto Tiempo (Diferenciar sí se aplican términos de una convención colectiva o los términos legales)', 6
FROM iso_requirements WHERE requirement_code = '7.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'El empleador/a permite horarios flexibles para las madres cabeza de familia o cuidadoras de personas en situación de discapacidad', 7
FROM iso_requirements WHERE requirement_code = '7.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));

-- Criterios para requisito 7.7
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '¿Incorpora en los manuales, procedimientos, formatos, instructivos y guías, lenguaje incluyente y no sexista, así como en todo tipo de comunicaciones?', 1
FROM iso_requirements WHERE requirement_code = '7.7' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Las convocatorias para la selección de personal contienen lenguaje claro con descripción del cargo, sin distinción del sexo, en el que se visibilice el género femenino, masculino, no binario, personas con 
orientación sexual diversa e identidades de género por igual.', 2
FROM iso_requirements WHERE requirement_code = '7.7' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '¿En las comunicaciones de la empresa (establecimiento, organización, institución) se utiliza un lenguaje neutral en cuanto al género, evitando el uso de términos que impliquen una referencia específica a un género, como, por ejemplo: "personal", "la auditoría", "la ciudadanía", "la persona"?', 3
FROM iso_requirements WHERE requirement_code = '7.7' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Hay uso de imágenes publicitarias libres de connotaciones o estereotipos sexistas', 4
FROM iso_requirements WHERE requirement_code = '7.7' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Se tiene practicas al interior de la organización, dirigidas a evitar comentarios o bromas sexistas', 5
FROM iso_requirements WHERE requirement_code = '7.7' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'PARTE QUINTA: CUMPLIMIENTO DE NORMAS LABORALES DE NATURALEZA COLECTIVA', 6
FROM iso_requirements WHERE requirement_code = '7.7' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '8 INSPECCIÓN EN NORMAS DE DERECHO COLECTIVO', 7
FROM iso_requirements WHERE requirement_code = '7.7' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));

-- Criterios para requisito 8.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '¿Existen organizaciones sindicales ?', 1
FROM iso_requirements WHERE requirement_code = '8.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de trabajadores/as afiliados a las organizaciones sindicales', 2
FROM iso_requirements WHERE requirement_code = '8.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Numero de trabajadores/ras NO sindicalizados', 3
FROM iso_requirements WHERE requirement_code = '8.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));

-- Criterios para requisito 8.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '¿Existe Convención Colectiva? (revisar soportes) No', 1
FROM iso_requirements WHERE requirement_code = '8.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Fecha de depósito de la última convención', 2
FROM iso_requirements WHERE requirement_code = '8.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de trabajadores/as beneficiarios de convención colectiva:', 3
FROM iso_requirements WHERE requirement_code = '8.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));

-- Criterios para requisito 8.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '¿Existe Pacto Colectivo?', 1
FROM iso_requirements WHERE requirement_code = '8.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Fecha de depósito del pacto colectivo', 2
FROM iso_requirements WHERE requirement_code = '8.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Fecha de inicio de la negociación del pacto colectivo', 3
FROM iso_requirements WHERE requirement_code = '8.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Fecha de culminación de la negociación del pacto colectivo', 4
FROM iso_requirements WHERE requirement_code = '8.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '¿Los pactos colectivos o planes de beneficios son superiores a la convención colectiva? (Realizar verificación)', 5
FROM iso_requirements WHERE requirement_code = '8.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de trabajadores/as beneficiarios de pacto colectivo:', 6
FROM iso_requirements WHERE requirement_code = '8.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));

-- Criterios para requisito 8.4
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '¿Existe Laudo Arbitral ?', 1
FROM iso_requirements WHERE requirement_code = '8.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Fecha de Vigencia:', 2
FROM iso_requirements WHERE requirement_code = '8.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de trabajadores/as beneficiarios de Laudo arbitral', 3
FROM iso_requirements WHERE requirement_code = '8.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));

-- Criterios para requisito 8.5
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '¿Existe contrato sindical?', 1
FROM iso_requirements WHERE requirement_code = '8.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Objeto del contrato sindical', 2
FROM iso_requirements WHERE requirement_code = '8.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Número de trabajadores vinculados por contrato sindical', 3
FROM iso_requirements WHERE requirement_code = '8.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'PARTE SEXTA: CUMPLIMIENTO DE NORMAS SOBRE RIESGOS LABORALES', 4
FROM iso_requirements WHERE requirement_code = '8.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '9 RIESGOS LABORALES', 5
FROM iso_requirements WHERE requirement_code = '8.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));

-- Criterios para requisito 9.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'El empleador realizó y registró la autoevaluación de los estándares mínimos, así como el plan de mejora del SG-SST en la página web del Ministerio del Trabajo. Especifique la fecha de reporte 27/03/2025(Verifique los resultados del reporte emitido). Resolución 0312 Art. 28 Parágrafo 2)', 1
FROM iso_requirements WHERE requirement_code = '9.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '¿Se cuenta con recursos financieros, (presupuesto), asignados para el desarrollo de actividades y entrega de elementos en lo relacionado con el SG-SST (el diseño, implementación, revisión evaluación y mejora de las medidas de prevención y control, para la gestión eficaz de los peligros). Decreto 1072 de 2015 Art. 2.2,4,6,8 numeral 4', 2
FROM iso_requirements WHERE requirement_code = '9.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuenta con informe (s) anual (es), sobre el avance del plan de mejoramiento conforme a la autoevaluación de los estándares mínimos, teniendo en cuenta las recomendaciones de la Administradora de Riesgos Laborales. Especifique la fecha del informe. (Verifique, recomendaciones dela ARL y el cronograma de implementación). Resolución 0312 de 2019 Art.28', 3
FROM iso_requirements WHERE requirement_code = '9.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Se encuentra conformado, vigente, capacitado y operativo el COPASST o vigía de SST. (Ver actas de conformación, compromisos y ejecución en actas de reunión del último año). Fecha de conformación 
Resolución 2013 de 1986 Art. 2, 11', 4
FROM iso_requirements WHERE requirement_code = '9.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Fecha de última reunión', 5
FROM iso_requirements WHERE requirement_code = '9.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Se encuentra conformado, vigente, capacitado y operativo el Comité de Convivencia Laboral. (Ver actas de conformación, de reuniones del último año e informes de gestión en el marco de sus funciones). Resolución 652 de 2012 Art. 2,5 al 8,10,11 y Resolución 1356 de 2012', 6
FROM iso_requirements WHERE requirement_code = '9.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Fecha de conformación', 7
FROM iso_requirements WHERE requirement_code = '9.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Elabora y ejecuta el programa de capacitación en promoción y prevención, que incluye los peligros/riesgos prioritarios y las medidas de prevención y control, extensivo a todos los niveles de la organización (Verificar que el programa de capacitación esté dirigido a los peligros identificados en la matriz de Identificación de peligros, evaluación y valoración de riesgos). Decreto 1072 de 2015 Art. 2,2,4,6,8 numeral 9 párrafo 3; Art. 2,2,4,6,11', 8
FROM iso_requirements WHERE requirement_code = '9.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Elabora y ejecuta un plan de prevención, preparación y respuesta ante emergencias que identifique las amenazas, evalúe y analice la vulnerabilidad. (Verificar el plan, divulgación, planos, señalización, asignación de recursos) Decreto 1072 de 2015 Art. 2,2,4,6,25', 9
FROM iso_requirements WHERE requirement_code = '9.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Se encuentra conformada, vigente, capacitada y operativa la brigada de emergencias. (ver evidencias de conformación, capacitación e informes del último año). Decreto 1072 de 2015 Art. 2,2,4,6,25 numeral 2,6,9, 11 al 13 Ley 1562 de 2012 Art. 11 numeral 1 literal d)', 10
FROM iso_requirements WHERE requirement_code = '9.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Se encuentra el registro, la estadística, las investigaciones y lecciones aprendidas de los incidentes, accidentes de trabajo y enfermedades laborales diagnosticadas en el último año? (Verificar equipo investigador, tiempo inicio investigación, acciones definidas para evitar accidentes y enfermedades)
Resolución 1401 de 2007,', 11
FROM iso_requirements WHERE requirement_code = '9.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Se encuentra el registro de los exámenes medico ocupacionales y seguimiento a los estados de salud de las personas trabajadoras del último año. (Verificar aleatoriamente protocolos de evaluación, concepto 
de aptitud médica y comunicación de los resultados al trabajador) Resolución 2346 de 2007', 12
FROM iso_requirements WHERE requirement_code = '9.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Se cuenta con la Identificación de Peligros, Evaluación y Valoración del Riesgo y definición de controles. (Verifique la matriz de IPEVR por lo menos 2 actividades de control del riesgo). Decreto 1072 de 2015 SI
Art. 2,2,4,6,15; Art. 2,2,4,6,23; Art. 2,2,4,6,24', 13
FROM iso_requirements WHERE requirement_code = '9.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'En las instalaciones del centro de trabajo se cuenta con el número de servicios sanitarios diferenciados (separados por sexos) según la población y vestidores debidamente habilitados, suficientes (1 por cada 
15 trabajadores) , limpios y con insumos para la higiene. Resolución 2400 de 1979 Art. 17', 14
FROM iso_requirements WHERE requirement_code = '9.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuenta las instalaciones con puestos de trabajo apropiados para las personas trabajadoras (administrativo, operativo), incluidas las mujeres trabajadoras en estado de embarazo. (Se debe revisar el estudio de puesto de trabajo avalado por la ARL).Decreto 1072 de 2015 Art. 2,2,1,5,9 numeral 3', 15
FROM iso_requirements WHERE requirement_code = '9.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuentan las instalaciones con espacios físicos acondicionados con las medidas adecuadas de higiene y elementos de preservación de la leche materna para las mujeres trabajadoras en período de 
lactancia.Resolución 2400 de 1979 Art. 17 al 45. Ley 2306 de 2023', 16
FROM iso_requirements WHERE requirement_code = '9.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '¿Se tienen en cuenta las recomendaciones y/o restricciones médicas de las personas trabajadoras durante sus actividades, incluyendo restricciones medicas o los casos de mujeres en estado de embarazo? Verificar casos. Resolución 2346 de 2007 Art.4', 17
FROM iso_requirements WHERE requirement_code = '9.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Está incluido el programa de prevención y protección contra caída en alturas de conformidad con la Resolución 4272 de 2021, así como las medidas necesarias para la identificación, evaluación y control.', 18
FROM iso_requirements WHERE requirement_code = '9.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'En caso de ocurrencia de accidente mortal se adelantó investigación por parte del empleador y del Comité de Seguridad y Salud en el Trabajo o el Vigía Ocupacional, según sea el caso, dentro de los  quince (15) días calendario siguientes a la ocurrencia de la muerte. Resolución 1401 de 2007', 19
FROM iso_requirements WHERE requirement_code = '9.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Se realizan evaluaciones médicas de las que trata el Art. 5 Resolución 2346 de 2007, de acuerdo con el tipo, magnitud y frecuencia de exposición a cada factor de riesgo, así como al estado de salud del SI
trabajador?', 20
FROM iso_requirements WHERE requirement_code = '9.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));

-- Criterios para requisito 9.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Se entregan los EPP a las personas trabajadoras de acuerdo con los peligros identificados, evaluación y valoración de los riesgos, para protegerlos contra posibles daños a su salud o su integridad física derivados de la exposición en el lugar de trabajo. Decreto 1072 de 2015 Art. 2,2,4,6,24 numeral 5; Art.2,2,4,6,12 numeral 8', 1
FROM iso_requirements WHERE requirement_code = '9.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Se realiza capacitación sobre el uso adecuado de los EPP (dispositivos, accesorios y vestimentas) Decreto 1072 de 2015 Art. 2,2,4,6,24 numeral 5 parágrafo 1', 2
FROM iso_requirements WHERE requirement_code = '9.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Se realiza reposición de los EPP oportunamente, conforme al desgaste y condiciones de uso de los mismos', 3
FROM iso_requirements WHERE requirement_code = '9.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La empresa (establecimiento, organización, Institución), ha evaluado si los elementos de protección personal se ajustan a las características de sexo y capacidades diversas de las personas trabajadoras personal se ajustan a las características de sexo y capacidades diversas de las personas trabajadoras', 4
FROM iso_requirements WHERE requirement_code = '9.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));

-- Criterios para requisito 9.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '¿La empresa ha incluido dentro de la matriz de identificación de peligros, evaluación y valoración de riesgos, el riesgo psicosocial, además de los que se presentan al interior de la organización, también los
que se generan en casa, implementando las medidas de prevención, actuación e intervención 
necesarias dentro del plan anual del SGSST? Decreto 1072 de 2015 Art. 2,2,4,6,15, Resolución 2646 de
2008', 1
FROM iso_requirements WHERE requirement_code = '9.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Se implementan las guías, protocolos de intervención, prevención y actuación de los riesgos psicosociales conforme los resultados de la aplicación de la Batería de Riesgo Psicosocial? Resolución SI
2764 de 2022 Art.1; Resolución 2646 de 2008 Art. 13', 2
FROM iso_requirements WHERE requirement_code = '9.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '¿Se ha realizado la evaluación con la Batería de Riesgo Psicosocial con la periodicidad establecida de acuerdo al nivel de riesgo de la empresa? Resolución 2764 de 2022 Art. 3', 3
FROM iso_requirements WHERE requirement_code = '9.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '¿El empleador tiene establecidas y desarrolla acciones para atender la prestación de los primeros auxilios psicológicos? Resolución 2764 de 2022 Art. 7 numeral 2', 4
FROM iso_requirements WHERE requirement_code = '9.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Se encuentra el registro de la identificación del riesgo psicosocial y de las acciones realizadas para la promoción, prevención, intervención y control, así como medidas preventivas del acoso laboral del último año. Resolución 2646 de 2008 Art. 12, 14, 16 y 17', 5
FROM iso_requirements WHERE requirement_code = '9.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'MINTRABAJO'));
