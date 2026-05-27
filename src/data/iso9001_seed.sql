
-- VARIABLES DE REQUISITOS PARA ISO 9001:2015 EXTRAÍDOS DEL EXCEL

-- Criterios para requisito 4.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar: las cuestiones externas e internas que son pertinentes para su propósito y que afectan a su capacidad para lograr los resultados previstos de su sistema de gestión de Calidad', 1
FROM iso_requirements 
WHERE requirement_code = '4.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 4.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar: las partes interesadas que son pertinentes al sistema de gestión de calidad;', 1
FROM iso_requirements 
WHERE requirement_code = '4.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar: los requisitos de estas partes interesadas que son pertientes para el sistema de gestión de la calidad.', 2
FROM iso_requirements 
WHERE requirement_code = '4.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe realizar el seguimiento y la revisión de la información sobre estas partes interesadas y sus requisitos pertinentes.', 3
FROM iso_requirements 
WHERE requirement_code = '4.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 4.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Determinar los limites y la aplicabilidad del SGC para establecer su alcance', 1
FROM iso_requirements 
WHERE requirement_code = '4.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando se determina este alcance, la organización debe considerar: las cuestiones externas e internas referidas en 4.1;', 2
FROM iso_requirements 
WHERE requirement_code = '4.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando se determina este alcance, la organización debe considerar: los requisitos de las partes interesadas pertientes referidos en el apartado 4.2;', 3
FROM iso_requirements 
WHERE requirement_code = '4.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando se determina este alcance, la organización debe considerar: los productios y servicios de la organización;', 4
FROM iso_requirements 
WHERE requirement_code = '4.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'El alcance debe estar disponible y mantenerse  como información documentada estableciendo: los tipos de productos y servicios cubiertos por el sistema de gestión de la calidad;', 5
FROM iso_requirements 
WHERE requirement_code = '4.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'El alcance debe estar disponible y mantenerse  como información documentada estableciendo: la justificación para cualquier requisito de esta norma internacional que la organización determine que no es aplicable para el alcance de su SGC.', 6
FROM iso_requirements 
WHERE requirement_code = '4.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 4.4.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe establecer, implementar, mantener y mejorar continuamente un sistema de gestión de la calidad, incluidos los procesos necesarios y sus interacciones, de acuerdo con los requisitos de esta Norma Internacional', 1
FROM iso_requirements 
WHERE requirement_code = '4.4.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar los procesos necesarios para el sistema de gestión de la calidad y su aplicación a través de la organización, y debe: determinar las entradas requeridas y las salidas esperados de estos procesos;', 2
FROM iso_requirements 
WHERE requirement_code = '4.4.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar los procesos necesarios para el sistema de gestión de la calidad y su aplicación a través de la organización, y debe: determinar la secuencia e interacción de estos procesos;', 3
FROM iso_requirements 
WHERE requirement_code = '4.4.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar los procesos necesarios para el sistema de gestión de la calidad y su aplicación a través de la organización, y debe: determinar y aplicar los criterios y los métodos (incluyendo el seguimiento, la medición y los indicadores del desempeño relacionados) necesarios para asegurarse la operación eficaz y el control de estos procesos;', 4
FROM iso_requirements 
WHERE requirement_code = '4.4.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar los procesos necesarios para el sistema de gestión de la calidad y su aplicación a través de la organización, y debe: determinar los recursos necesarios para estos procesos y asegurarse de su disponibilidad;', 5
FROM iso_requirements 
WHERE requirement_code = '4.4.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar los procesos necesarios para el sistema de gestión de la calidad y su aplicación a través de la organización, y debe: asignar las responsabilidades y autoridades para estos procesos;', 6
FROM iso_requirements 
WHERE requirement_code = '4.4.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar los procesos necesarios para el sistema de gestión de la calidad y su aplicación a través de la organización, y debe: abordar los riesgos y oportunidades determinados de acuerdo con los requisitos del apartado 6.1;', 7
FROM iso_requirements 
WHERE requirement_code = '4.4.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar los procesos necesarios para el sistema de gestión de la calidad y su aplicación a través de la organización, y debe: valorar estos procesos e implementar cualquier cambio necesario para asegurarse de que estos procesos logran los resultados previstos;', 8
FROM iso_requirements 
WHERE requirement_code = '4.4.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar los procesos necesarios para el sistema de gestión de la calidad y su aplicación a través de la organización, y debe: mejorar los procesos y el sistema de gestión de la calidad.', 9
FROM iso_requirements 
WHERE requirement_code = '4.4.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 4.4.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'En la medida en que sea necesario, la organización debe: mantener información documentada para apoyar la operación de sus procesos;', 1
FROM iso_requirements 
WHERE requirement_code = '4.4.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'En la medida en que sea necesario, la organización debe: conservar la información documentada para tener la confianza de que los procesos se realizan según lo planificado.', 2
FROM iso_requirements 
WHERE requirement_code = '4.4.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 5.1.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe demostrar liderazgo y compromiso con respecto al Sistema de gestión de la Calidad: asumiendo la rendición de cuentas de la eficacia del sistema de gestión de la calidad;', 1
FROM iso_requirements 
WHERE requirement_code = '5.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe demostrar liderazgo y compromiso con respecto al Sistema de gestión de la Calidad: asegurando que se establezcan para el sistema de gestión de la calidad la política de la calidad y los objetivos de la calidad y que éstos sean compatibles con el contexto y la dirección estratégica de la organización;;', 2
FROM iso_requirements 
WHERE requirement_code = '5.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe demostrar liderazgo y compromiso con respecto al Sistema de gestión de la Calidad: asegurando la integración de los requisitos del sistema de gestión de la calidad en los procesos de negocio de la organización;', 3
FROM iso_requirements 
WHERE requirement_code = '5.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe demostrar liderazgo y compromiso con respecto al Sistema de gestión de la Calidad: promoviendo el uso del enfoque basado en procesos y el pensamiento basado en riesgos;', 4
FROM iso_requirements 
WHERE requirement_code = '5.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe demostrar liderazgo y compromiso con respecto al Sistema de gestión de la Calidad: asegurando que los recursos necesarios para el sistema de gestión de la calidad estén disponibles;', 5
FROM iso_requirements 
WHERE requirement_code = '5.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe demostrar liderazgo y compromiso con respecto al Sistema de gestión de la Calidad: comunicando la importancia de una gestión de la calidad eficaz y conforme con los requisitos del sistema de gestión de la calidad;', 6
FROM iso_requirements 
WHERE requirement_code = '5.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe demostrar liderazgo y compromiso con respecto al Sistema de gestión de la Calidad: asegurando que el sistema de gestión de la calidad logre los resultados previstos;', 7
FROM iso_requirements 
WHERE requirement_code = '5.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe demostrar liderazgo y compromiso con respecto al Sistema de gestión de la Calidad: comprometiendo, dirigiendo y apoyando a las personas, para contribuir a la eficacia del sistema de gestión de la calidad;', 8
FROM iso_requirements 
WHERE requirement_code = '5.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe demostrar liderazgo y compromiso con respecto al Sistema de gestión de la Calidad: promoviendo la mejora;', 9
FROM iso_requirements 
WHERE requirement_code = '5.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe demostrar liderazgo y compromiso con respecto al Sistema de gestión de la Calidad: apoyando otros roles pertinentes de la dirección, para demostrar su liderazgo aplicado a sus áreas de responsabilidad.', 10
FROM iso_requirements 
WHERE requirement_code = '5.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 5.1.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe demostrar liderazgo y compromiso con respecto al enfoque al cliente asegurándose de que: se determinan, se comprenden y se cumplen de manera coherente los requisitos del cliente y los legales y reglamentarios aplicables;', 1
FROM iso_requirements 
WHERE requirement_code = '5.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe demostrar liderazgo y compromiso con respecto al enfoque al cliente asegurándose de que: se determinan y se tratan los riesgos y oportunidades que pueden afectar a la conformidad de los productos y los servicios y a la capacidad de aumentar la satisfacción del cliente;', 2
FROM iso_requirements 
WHERE requirement_code = '5.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe demostrar liderazgo y compromiso con respecto al enfoque al cliente asegurándose de que: se mantiene el enfoque en aumentar la satisfacción del cliente.', 3
FROM iso_requirements 
WHERE requirement_code = '5.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 5.2.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe establecer, implementar y mantener una política de la calidad que: sea apropiada al propósito y al contexto de la organización y apoya su dirección estratégica;', 1
FROM iso_requirements 
WHERE requirement_code = '5.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe establecer, implementar y mantener una política de la calidad que: proporcione un marco de referencia para el establecimiento de los objetivos de la calidad', 2
FROM iso_requirements 
WHERE requirement_code = '5.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe establecer, implementar y mantener una política de la calidad que: incluya el compromiso de cumplir los requisitos aplicables;', 3
FROM iso_requirements 
WHERE requirement_code = '5.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe establecer, implementar y mantener una política de la calidad que: incluya el compromiso de mejora continua del sistema de gestión de la calidad.', 4
FROM iso_requirements 
WHERE requirement_code = '5.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 5.2.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La política de la calidad debe: estar disponible y mantenerse como información documentada;', 1
FROM iso_requirements 
WHERE requirement_code = '5.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La política de la calidad debe: comunicarse, entenderse y aplicarse dentro de la organización;', 2
FROM iso_requirements 
WHERE requirement_code = '5.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La política de la calidad debe: estar disponible para las partes interesadas pertinentes, según corresponda.', 3
FROM iso_requirements 
WHERE requirement_code = '5.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 5.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe asegurarse de que las responsabilidades y autoridades para los roles pertinentes se asignen, se comuniquen y se entiendan dentro de la organización.', 1
FROM iso_requirements 
WHERE requirement_code = '5.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe asignar la responsabilidad y autoridad para: asegurarse de que el sistema de gestión de la calidad es conforme con los requisitos de esta Norma Internacional;', 2
FROM iso_requirements 
WHERE requirement_code = '5.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe asignar la responsabilidad y autoridad para: asegurarse de que los procesos están dando las salidas previstas;', 3
FROM iso_requirements 
WHERE requirement_code = '5.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe asignar la responsabilidad y autoridad para: informar a la alta dirección sobre el desempeño del sistema de gestión de la calidad y sobre las oportunidades de mejora (véase 10.1);', 4
FROM iso_requirements 
WHERE requirement_code = '5.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe asignar la responsabilidad y autoridad para: asegurarse de que se promueva el enfoque al cliente a través de la organización;', 5
FROM iso_requirements 
WHERE requirement_code = '5.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe asignar la responsabilidad y autoridad para: asegurarse de que la integridad del sistema de gestión de la calidad se mantiene cuando se planifican e implementan cambios en el sistema de gestión de la calidad', 6
FROM iso_requirements 
WHERE requirement_code = '5.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 6.1.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al planificar el sistema de gestión de la calidad, la organización debe considerar las cuestiones referidas en el apartado 4.1 y los requisitos referidos en el apartado 4.2, y determinar los riesgos y oportunidades que es necesario abordar con el fin de: asegurar que el sistema de gestión de la calidad pueda lograr sus resultados previstos;', 1
FROM iso_requirements 
WHERE requirement_code = '6.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al planificar el sistema de gestión de la calidad, la organización debe considerar las cuestiones referidas en el apartado 4.1 y los requisitos referidos en el apartado 4.2, y determinar los riesgos y oportunidades que es necesario abordar con el fin de: aumentar los efectos deseables;', 2
FROM iso_requirements 
WHERE requirement_code = '6.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al planificar el sistema de gestión de la calidad, la organización debe considerar las cuestiones referidas en el apartado 4.1 y los requisitos referidos en el apartado 4.2, y determinar los riesgos y oportunidades que es necesario abordar con el fin de: prevenir o reducir efectos no deseados;', 3
FROM iso_requirements 
WHERE requirement_code = '6.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al planificar el sistema de gestión de la calidad, la organización debe considerar las cuestiones referidas en el apartado 4.1 y los requisitos referidos en el apartado 4.2, y determinar los riesgos y oportunidades que es necesario abordar con el fin de: lograr la mejora', 4
FROM iso_requirements 
WHERE requirement_code = '6.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 6.1.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe planificar: las acciones para abordar estos riesgos y oportunidades;', 1
FROM iso_requirements 
WHERE requirement_code = '6.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) La manera de: integrar e implementar las acciones en sus procesos del sistema de gestión de la calidad;', 2
FROM iso_requirements 
WHERE requirement_code = '6.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) La manera de: evaluar la eficacia de estas acciones.', 3
FROM iso_requirements 
WHERE requirement_code = '6.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Las acciones tomadas para abordar los riesgos y oportunidades deben ser proporcionales al impacto potencial en la conformidad de los productos y los servicios', 4
FROM iso_requirements 
WHERE requirement_code = '6.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 6.2.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe establecer los objetivos de la calidad para las funciones, niveles y procesos pertinentes necesarios para el sistema de gestión de la calidad.', 1
FROM iso_requirements 
WHERE requirement_code = '6.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Los objetivos de la calidad deben: ser coherentes con la política de la calidad;', 2
FROM iso_requirements 
WHERE requirement_code = '6.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Los objetivos de la calidad deben: ser medibles;', 3
FROM iso_requirements 
WHERE requirement_code = '6.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Los objetivos de la calidad deben: tener en cuenta los requisitos aplicables;', 4
FROM iso_requirements 
WHERE requirement_code = '6.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Los objetivos de la calidad deben: ser pertinentes para la conformidad de los productos y servicios y para el aumento de la satisfacción del cliente;', 5
FROM iso_requirements 
WHERE requirement_code = '6.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Los objetivos de la calidad deben: ser objeto de seguimiento;', 6
FROM iso_requirements 
WHERE requirement_code = '6.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Los objetivos de la calidad deben: comunicarse', 7
FROM iso_requirements 
WHERE requirement_code = '6.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Los objetivos de la calidad deben: actualizarse, según corresponda.', 8
FROM iso_requirements 
WHERE requirement_code = '6.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe mantener información documentada sobre los objetivos de la calidad.', 9
FROM iso_requirements 
WHERE requirement_code = '6.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 6.2.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al planificar cómo lograr sus objetivos de la calidad, la organización debe determinar: qué se va a hacer;', 1
FROM iso_requirements 
WHERE requirement_code = '6.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al planificar cómo lograr sus objetivos de la calidad, la organización debe determinar: qué recursos se requerirán;', 2
FROM iso_requirements 
WHERE requirement_code = '6.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al planificar cómo lograr sus objetivos de la calidad, la organización debe determinar: quién será responsable;', 3
FROM iso_requirements 
WHERE requirement_code = '6.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al planificar cómo lograr sus objetivos de la calidad, la organización debe determinar: cuándo se finalizará;', 4
FROM iso_requirements 
WHERE requirement_code = '6.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al planificar cómo lograr sus objetivos de la calidad, la organización debe determinar: cómo se evaluarán los resultados.', 5
FROM iso_requirements 
WHERE requirement_code = '6.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 6.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando la organización determine la necesidad de cambios en el sistema de gestión de la calidad, estos cambios se deben llevar a cabo de manera planificada y sistemática (véase 4.4).', 1
FROM iso_requirements 
WHERE requirement_code = '6.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe considerar: el propósito de los cambios y sus potenciales consecuencias;', 2
FROM iso_requirements 
WHERE requirement_code = '6.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe considerar: la integridad del sistema de gestión de la calidad;', 3
FROM iso_requirements 
WHERE requirement_code = '6.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe considerar: la disponibilidad de recursos;', 4
FROM iso_requirements 
WHERE requirement_code = '6.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe considerar: la asignación o reasignación de responsabilidades y autoridades.', 5
FROM iso_requirements 
WHERE requirement_code = '6.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 7.1.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar y proporcionar los recursos necesarios para el establecimiento, implementación, mantenimiento y mejora continua del sistema de gestión de la calidad.', 1
FROM iso_requirements 
WHERE requirement_code = '7.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe considerar: las capacidades y limitaciones de los recursos internos existentes;', 2
FROM iso_requirements 
WHERE requirement_code = '7.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe considerar: qué se necesita obtener de los proveedores externos.', 3
FROM iso_requirements 
WHERE requirement_code = '7.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 7.1.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar y proporcionar las personas necesarias para implementación eficaz de su sistema de gestión de la calidad y para la operación y control de sus procesos.', 1
FROM iso_requirements 
WHERE requirement_code = '7.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 7.1.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar, proporcionar y mantener la infraestructura necesaria para que la operación de sus procesos logre la conformidad de los productos y servicios.', 1
FROM iso_requirements 
WHERE requirement_code = '7.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 7.1.4
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar, proporcionar y mantener el ambiente necesario para la operación de sus procesos y para lograr la conformidad de los productos y servicios.', 1
FROM iso_requirements 
WHERE requirement_code = '7.1.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 7.1.5.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar y proporcionar los recursos necesarios para asegurarse de la validez y fiabilidad de los resultados cuando el seguimiento o la medición se utilizan para verificar la conformidad de los productos y servicios con los requisitos.', 1
FROM iso_requirements 
WHERE requirement_code = '7.1.5.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que los recursos proporcionados: son adecuados para el tipo específico de actividades de seguimiento y medición realizadas;', 2
FROM iso_requirements 
WHERE requirement_code = '7.1.5.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que los recursos proporcionados: se mantienen para asegurarse de la adecuación continua para su propósito.', 3
FROM iso_requirements 
WHERE requirement_code = '7.1.5.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe conservar la información documentada adecuada como evidencia de la adecuación para el propósito del seguimiento y medición de los recursos.', 4
FROM iso_requirements 
WHERE requirement_code = '7.1.5.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 7.1.5.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando la trazabilidad de las mediciones sea un requisito, o es considerada por la organización como parte esencial de proporcionar confianza en la validez de los resultados de la medición, el equipo de medición debe: verificarse o calibrarse, o ambas, a intervalos especificados, o antes de su utilización, comparando con patrones de medición trazables a patrones de medición internacionales o nacionales; cuando no existan tales patrones, debe conservarse como información documentada la base utilizada para la calibración o la verificación;', 1
FROM iso_requirements 
WHERE requirement_code = '7.1.5.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando la trazabilidad de las mediciones sea un requisito, o es considerada por la organización como parte esencial de proporcionar confianza en la validez de los resultados de la medición, el equipo de medición debe: identificarse para determinar su estado;', 2
FROM iso_requirements 
WHERE requirement_code = '7.1.5.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando la trazabilidad de las mediciones sea un requisito, o es considerada por la organización como parte esencial de proporcionar confianza en la validez de los resultados de la medición, el equipo de medición debe: protegerse contra ajustes, daño o deterioro que pudieran invalidar el estado de calibración y los posteriores resultados de la medición.', 3
FROM iso_requirements 
WHERE requirement_code = '7.1.5.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar si la validez de los resultados de medición previos se ha visto afectada de manera adversa cuando el equipo de medición se considere no apto para su propósito previsto, y debe tomar las acciones adecuadas cuando sea necesario.', 4
FROM iso_requirements 
WHERE requirement_code = '7.1.5.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 7.1.6
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar los conocimientos necesarios para la operación de sus procesos y para lograr la conformidad de los productos y servicios.', 1
FROM iso_requirements 
WHERE requirement_code = '7.1.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Estos conocimientos deben mantenerse y ponerse a disposición en la extensión necesaria.', 2
FROM iso_requirements 
WHERE requirement_code = '7.1.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando se tratan las necesidades y tendencias cambiantes, la organización debe considerar sus conocimientos actuales y determinar cómo adquirir o acceder a los conocimientos adicionales necesarios y a las actualizaciones requeridas.', 3
FROM iso_requirements 
WHERE requirement_code = '7.1.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 7.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe: determinar la competencia necesaria de las personas que realizan, bajo su control, un trabajo que afecta al desempeño y eficacia del sistema de gestión de la calidad;', 1
FROM iso_requirements 
WHERE requirement_code = '7.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe: asegurarse de que estas personas sean competentes, basándose en la educación, formación o experiencia adecuadas;', 2
FROM iso_requirements 
WHERE requirement_code = '7.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe: cuando sea aplicable, tomar acciones para adquirir la competencia necesaria y evaluar la eficacia de las acciones tomadas;', 3
FROM iso_requirements 
WHERE requirement_code = '7.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe: conservar la información documentada apropiada, como evidencia de la competencia.', 4
FROM iso_requirements 
WHERE requirement_code = '7.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 7.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que las personas pertinentes que realizan el trabajo bajo el control de la organización toman conciencia de: la política de la calidad;', 1
FROM iso_requirements 
WHERE requirement_code = '7.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que las personas pertinentes que realizan el trabajo bajo el control de la organización toman conciencia de: los objetivos de la calidad pertinentes;', 2
FROM iso_requirements 
WHERE requirement_code = '7.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que las personas pertinentes que realizan el trabajo bajo el control de la organización toman conciencia de: su contribución a la eficacia del sistema de gestión de la calidad, incluyendo los beneficios de una mejora del desempeño;', 3
FROM iso_requirements 
WHERE requirement_code = '7.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que las personas pertinentes que realizan el trabajo bajo el control de la organización toman conciencia de: las implicaciones de no cumplir los requisitos del sistema de gestión de la calidad.', 4
FROM iso_requirements 
WHERE requirement_code = '7.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 7.4
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar las comunicaciones internas y externas pertinentes al sistema de gestión de la calidad, que incluyan: qué comunicar;', 1
FROM iso_requirements 
WHERE requirement_code = '7.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar las comunicaciones internas y externas pertinentes al sistema de gestión de la calidad, que incluyan: cuándo comunicar;', 2
FROM iso_requirements 
WHERE requirement_code = '7.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar las comunicaciones internas y externas pertinentes al sistema de gestión de la calidad, que incluyan: a quién comunicar;', 3
FROM iso_requirements 
WHERE requirement_code = '7.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar las comunicaciones internas y externas pertinentes al sistema de gestión de la calidad, que incluyan: cómo comunicar.', 4
FROM iso_requirements 
WHERE requirement_code = '7.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar las comunicaciones internas y externas pertinentes al sistema de gestión de la calidad, que incluyan: quién comunica.', 5
FROM iso_requirements 
WHERE requirement_code = '7.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 7.5.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'El sistema de gestión de la calidad de la organización debe incluir: la información documentada requerida por esta Norma Internacional', 1
FROM iso_requirements 
WHERE requirement_code = '7.5.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'El sistema de gestión de la calidad de la organización debe incluir: la información documentada que la organización ha determinado que es necesaria para la eficacia del sistema de gestión de la calidad.', 2
FROM iso_requirements 
WHERE requirement_code = '7.5.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 7.5.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando se crea y actualiza información documentada, la organización debe asegurarse de que lo siguiente sea apropiado', 1
FROM iso_requirements 
WHERE requirement_code = '7.5.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'la identificación y descripción (por ejemplo, título, fecha, autor o número de referencia);', 2
FROM iso_requirements 
WHERE requirement_code = '7.5.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'el formato (por ejemplo, idioma, versión del software, gráficos) y sus medios de soporte (por ejemplo, papel, electrónico);', 3
FROM iso_requirements 
WHERE requirement_code = '7.5.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'la revisión y aprobación con respecto a la idoneidad y adecuación.', 4
FROM iso_requirements 
WHERE requirement_code = '7.5.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 7.5.3.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La información documentada requerida por el sistema de gestión de la calidad y por esta Norma Internacional se debe controlar para asegurarse de que: esté disponible y adecuada para su uso, dónde y cuándo se necesite;', 1
FROM iso_requirements 
WHERE requirement_code = '7.5.3.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La información documentada requerida por el sistema de gestión de la calidad y por esta Norma Internacional se debe controlar para asegurarse de que: esté protegida adecuadamente (por ejemplo, contra pérdida de la confidencialidad, uso inadecuado, o pérdida de integridad).', 2
FROM iso_requirements 
WHERE requirement_code = '7.5.3.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 7.5.3.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Para el control de la información documentada, la organización debe tratar las siguientes actividades, según corresponda: distribución, acceso, recuperación y uso;', 1
FROM iso_requirements 
WHERE requirement_code = '7.5.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Para el control de la información documentada, la organización debe tratar las siguientes actividades, según corresponda: almacenamiento y preservación, incluida la preservación de la legibilidad;', 2
FROM iso_requirements 
WHERE requirement_code = '7.5.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Para el control de la información documentada, la organización debe tratar las siguientes actividades, según corresponda: control de cambios (por ejemplo, control de versión);', 3
FROM iso_requirements 
WHERE requirement_code = '7.5.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Para el control de la información documentada, la organización debe tratar las siguientes actividades, según corresponda: conservación y disposición.', 4
FROM iso_requirements 
WHERE requirement_code = '7.5.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La información documentada de origen externo, que la organización determina como necesaria para la planificación y operación del sistema de gestión de la calidad se debe identificar según sea adecuado y controlar.', 5
FROM iso_requirements 
WHERE requirement_code = '7.5.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La información documentada conservada como evidencia de la conformidad debe protegerse contra las modificaciones no intencionadas.', 6
FROM iso_requirements 
WHERE requirement_code = '7.5.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe planificar, implementar y controlar los procesos (véase 4.4) necesarios para cumplir los requisitos para la producción de productos y prestación de servicios, y para implementar las acciones determinadas en el capítulo 6, mediante: la determinación de los requisitos para los productos y servicios;', 1
FROM iso_requirements 
WHERE requirement_code = '8.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) el establecimiento de criterios para: los procesos;', 2
FROM iso_requirements 
WHERE requirement_code = '8.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) el establecimiento de criterios para: la aceptación de los productos y servicios;', 3
FROM iso_requirements 
WHERE requirement_code = '8.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) el establecimiento de criterios para: la determinación de los recursos necesarios para lograr la conformidad para los requisitos de los productos y servicios;', 4
FROM iso_requirements 
WHERE requirement_code = '8.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) el establecimiento de criterios para: la implementación del control de los procesos de acuerdo con los criterios;', 5
FROM iso_requirements 
WHERE requirement_code = '8.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'e) la determinación y almacenaje de la información documentada en la medida necesaria: para confiar en que los procesos se han llevado a cabo según lo planificado;', 6
FROM iso_requirements 
WHERE requirement_code = '8.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'e) la determinación y almacenaje de la información documentada en la medida necesaria: para demostrar la conformidad de los productos y servicios con sus requisitos..', 7
FROM iso_requirements 
WHERE requirement_code = '8.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'El elemento de salida de esta planificación debe ser adecuado para las operaciones de la organización.', 8
FROM iso_requirements 
WHERE requirement_code = '8.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe controlar los cambios planificados y revisar las consecuencias de los cambios no previstos, tomando acciones para mitigar cualquier efecto adverso, cuando sea necesario.', 9
FROM iso_requirements 
WHERE requirement_code = '8.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que los procesos contratados externamente estén controlados (véase 8.4).', 10
FROM iso_requirements 
WHERE requirement_code = '8.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.2.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La comunicación con los clientes debe : proporcionar la información relativa a los productos y servicios;', 1
FROM iso_requirements 
WHERE requirement_code = '8.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La comunicación con los clientes debe : la atención de las consultas, los contratos o los pedidos, incluyendo los cambios;', 2
FROM iso_requirements 
WHERE requirement_code = '8.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La comunicación con los clientes debe : obtener la retroalimentación de los clientes relativa a los productos y servicios, incluyendo las quejas de los clientes;', 3
FROM iso_requirements 
WHERE requirement_code = '8.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La comunicación con los clientes debe : manipular o controlar las propiedades del cliente;', 4
FROM iso_requirements 
WHERE requirement_code = '8.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La comunicación con los clientes debe : establecer los requisitos específicos para las acciones de contingencia, cuando sea pertinente.', 5
FROM iso_requirements 
WHERE requirement_code = '8.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.2.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) los requisitos para los productos y servicios se definen, incluyendo: cualquier requisito legal y reglamentario aplicable;', 1
FROM iso_requirements 
WHERE requirement_code = '8.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) los requisitos para los productos y servicios se definen, incluyendo: aquellos considerados necesarios por la organización;', 2
FROM iso_requirements 
WHERE requirement_code = '8.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) los requisitos para los productos y servicios se definen, incluyendo: la organización puede cumplir las reclamaciones de los productos y servicios que ofrece.', 3
FROM iso_requirements 
WHERE requirement_code = '8.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.2.3.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que tiene la capacidad de cumplir los requisitos para los productos y servicios que se van a ofrecer a los clientes.', 1
FROM iso_requirements 
WHERE requirement_code = '8.2.3.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe llevar a cabo una revisión antes de comprometerse a suministrar productos y servicios a un cliente, para incluir: los requisitos especificados por el cliente, incluyendo los requisitos para las actividades de entrega y las posteriores a la misma;', 2
FROM iso_requirements 
WHERE requirement_code = '8.2.3.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe llevar a cabo una revisión antes de comprometerse a suministrar productos y servicios a un cliente, para incluir: los requisitos no establecidos por el cliente, pero necesarios para el uso especificado o para el uso previsto, cuando sea conocido;', 3
FROM iso_requirements 
WHERE requirement_code = '8.2.3.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe llevar a cabo una revisión antes de comprometerse a suministrar productos y servicios a un cliente, para incluir: los requisitos especificados por la organización;', 4
FROM iso_requirements 
WHERE requirement_code = '8.2.3.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe llevar a cabo una revisión antes de comprometerse a suministrar productos y servicios a un cliente, para incluir: los requisitos legales y reglamentarios adicionales aplicables a los productos y servicios;', 5
FROM iso_requirements 
WHERE requirement_code = '8.2.3.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe llevar a cabo una revisión antes de comprometerse a suministrar productos y servicios a un cliente, para incluir: las diferencias existentes entre los requisitos de contrato o pedido y los expresados previamente.', 6
FROM iso_requirements 
WHERE requirement_code = '8.2.3.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que se resuelven las diferencias existentes entre los requisitos del contrato o pedido y los expresados previamente.', 7
FROM iso_requirements 
WHERE requirement_code = '8.2.3.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe confirmar los requisitos del cliente antes de la aceptación, cuando el cliente no proporcione una declaración documentada de sus requisitos.', 8
FROM iso_requirements 
WHERE requirement_code = '8.2.3.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.2.3.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe conservar la información documentada, cuando sea aplicable: sobre los resultados de la revisión;', 1
FROM iso_requirements 
WHERE requirement_code = '8.2.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe conservar la información documentada, cuando sea aplicable: sobre cualquier requisito nuevo para los productos y servicios.', 2
FROM iso_requirements 
WHERE requirement_code = '8.2.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.2.4
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que la información documentada pertinente sea modificada, y de que las personas correspondientes sean conscientes de los requisitos modificados, cuando se cambien los requisitos para los productos y servicios', 1
FROM iso_requirements 
WHERE requirement_code = '8.2.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.3.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe establecer, implementar y mantener un proceso de diseño y desarrollo que sea adecuado para asegurarse de la posterior producción de productos y prestación de servicios.', 1
FROM iso_requirements 
WHERE requirement_code = '8.3.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.3.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al determinar las etapas y controles para el diseño y desarrollo, la organización debe considerar: la naturaleza, duración y complejidad de las actividades de diseño y desarrollo;', 1
FROM iso_requirements 
WHERE requirement_code = '8.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al determinar las etapas y controles para el diseño y desarrollo, la organización debe considerar: las etapas del proceso requeridas, incluyendo las revisiones del diseño y desarrollo aplicables;', 2
FROM iso_requirements 
WHERE requirement_code = '8.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al determinar las etapas y controles para el diseño y desarrollo, la organización debe considerar: las actividades requeridas de verificación y validación del diseño y desarrollo;', 3
FROM iso_requirements 
WHERE requirement_code = '8.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al determinar las etapas y controles para el diseño y desarrollo, la organización debe considerar: las responsabilidades y autoridades involucradas en el proceso de diseño y desarrollo;', 4
FROM iso_requirements 
WHERE requirement_code = '8.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al determinar las etapas y controles para el diseño y desarrollo, la organización debe considerar: las necesidades de recursos internos y externos para el diseño y desarrollo de los productos y servicios;', 5
FROM iso_requirements 
WHERE requirement_code = '8.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al determinar las etapas y controles para el diseño y desarrollo, la organización debe considerar: la necesidad de controlar las interfaces entre las personas implicadas en el proceso de diseño y desarrollo;', 6
FROM iso_requirements 
WHERE requirement_code = '8.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al determinar las etapas y controles para el diseño y desarrollo, la organización debe considerar: la necesidad de la participación activa de los clientes y usuarios en el proceso de diseño y desarrollo;', 7
FROM iso_requirements 
WHERE requirement_code = '8.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al determinar las etapas y controles para el diseño y desarrollo, la organización debe considerar: los requisitos para la posterior producción de productos y prestación de servicios;', 8
FROM iso_requirements 
WHERE requirement_code = '8.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al determinar las etapas y controles para el diseño y desarrollo, la organización debe considerar: el nivel de control del proceso de diseño y desarrollo esperado por los clientes y otras partes interesadas pertinentes;', 9
FROM iso_requirements 
WHERE requirement_code = '8.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al determinar las etapas y controles para el diseño y desarrollo, la organización debe considerar: la información documentada necesaria para demostrar que se han cumplido los requisitos del diseño y desarrollo.', 10
FROM iso_requirements 
WHERE requirement_code = '8.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.3.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar los requisitos esenciales para los tipos específicos de productos y servicios que se van a diseñar y desarrollar.', 1
FROM iso_requirements 
WHERE requirement_code = '8.3.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe considerar: los requisitos funcionales y de desempeño;', 2
FROM iso_requirements 
WHERE requirement_code = '8.3.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe considerar: la información proveniente de actividades de diseño y desarrollo previas similares;', 3
FROM iso_requirements 
WHERE requirement_code = '8.3.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe considerar: los requisitos legales y reglamentarios;', 4
FROM iso_requirements 
WHERE requirement_code = '8.3.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe considerar: normas o códigos de prácticas que la organización se ha comprometido a implementar;', 5
FROM iso_requirements 
WHERE requirement_code = '8.3.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe considerar: las consecuencias potenciales del fracaso debido a la naturaleza de los productos y servicios;', 6
FROM iso_requirements 
WHERE requirement_code = '8.3.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Los elementos de entrada deben ser adecuados para los fines de diseño y desarrollo, estar completos y sin ambigüedades. Los conflictos entre elementos de entrada deben resolverse.', 7
FROM iso_requirements 
WHERE requirement_code = '8.3.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Las entradas deben ser adecuadas para los fines de diseño y desarrollo, estar completos y sin ambigüedades.', 8
FROM iso_requirements 
WHERE requirement_code = '8.3.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Deben resolverse las entradas del diseño y desarrollo contradictorios.', 9
FROM iso_requirements 
WHERE requirement_code = '8.3.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe conservar la información documentada sobre las entradas del diseño y desarrollo.', 10
FROM iso_requirements 
WHERE requirement_code = '8.3.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.3.4
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe aplicar controles al proceso de diseño y desarrollo para asegurarse de que: los resultados a lograr están definidos;', 1
FROM iso_requirements 
WHERE requirement_code = '8.3.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe aplicar controles al proceso de diseño y desarrollo para asegurarse de que: las revisiones se realizan para evaluar la capacidad de los resultados del diseño y desarrollo de cumplir los requisitos;', 2
FROM iso_requirements 
WHERE requirement_code = '8.3.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe aplicar controles al proceso de diseño y desarrollo para asegurarse de que: se realizan actividades de verificación para asegurarse de que las salidas del diseño y desarrollo cumplen los requisitos de las entradas;', 3
FROM iso_requirements 
WHERE requirement_code = '8.3.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe aplicar controles al proceso de diseño y desarrollo para asegurarse de que: se realizan actividades de validación para asegurarse de que los productos y servicios resultantes satisfacen los requisitos para su aplicación especificada o uso previsto;', 4
FROM iso_requirements 
WHERE requirement_code = '8.3.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe aplicar controles al proceso de diseño y desarrollo para asegurarse de que: se toma cualquier acción necesaria sobre los problemas determinados durante las revisiones, o las actividades de verificación y validación;', 5
FROM iso_requirements 
WHERE requirement_code = '8.3.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe aplicar controles al proceso de diseño y desarrollo para asegurarse de que: se conserva la información documentada de estas actividades.', 6
FROM iso_requirements 
WHERE requirement_code = '8.3.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.3.5
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que las salidas del diseño y desarrollo: cumplen los requisitos de las entradas;', 1
FROM iso_requirements 
WHERE requirement_code = '8.3.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que las salidas del diseño y desarrollo: son adecuados para los procesos posteriores para la provisión de productos y servicios;', 2
FROM iso_requirements 
WHERE requirement_code = '8.3.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que las salidas del diseño y desarrollo: incluyen o hacen referencia a los requisitos de seguimiento y medición, cuando sea adecuado, y a los criterios de aceptación;', 3
FROM iso_requirements 
WHERE requirement_code = '8.3.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que las salidas del diseño y desarrollo: especifican las características de los productos y servicios que son esenciales para su propósito previsto y su uso seguro y correcto.', 4
FROM iso_requirements 
WHERE requirement_code = '8.3.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.3.6
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe identificar, revisar y controlar los cambios hechos durante el diseño y desarrollo de los productos y servicios o posteriormente, en la medida necesaria para asegurarse de que no haya un impacto adverso en la conformidad con los requisitos.', 1
FROM iso_requirements 
WHERE requirement_code = '8.3.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe conservar la información documentada sobre: los cambios del diseño y desarrollo;', 2
FROM iso_requirements 
WHERE requirement_code = '8.3.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe conservar la información documentada sobre: los resultados de las revisiones;', 3
FROM iso_requirements 
WHERE requirement_code = '8.3.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe conservar la información documentada sobre: la autorización de los cambios;', 4
FROM iso_requirements 
WHERE requirement_code = '8.3.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe conservar la información documentada sobre: las acciones tomadas para prevenir los impactos adversos.', 5
FROM iso_requirements 
WHERE requirement_code = '8.3.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.4.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que los procesos, productos y servicios suministrados externamente son conformes a los requisitos.', 1
FROM iso_requirements 
WHERE requirement_code = '8.4.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar los controles a aplicar a los procesos, productos y servicios suministrados externamente cuando: los productos y servicios de proveedores externos están destinados a incorporarse dentro de los propios productos y servicios de la organización;', 2
FROM iso_requirements 
WHERE requirement_code = '8.4.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar los controles a aplicar a los procesos, productos y servicios suministrados externamente cuando: los productos y servicios son proporcionados directamente a los clientes por proveedores externos en nombre de la organización;', 3
FROM iso_requirements 
WHERE requirement_code = '8.4.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar los controles a aplicar a los procesos, productos y servicios suministrados externamente cuando: un proceso, o una parte de un proceso, es proporcionado por un proveedor externo como resultado de una decisión de la organización.', 4
FROM iso_requirements 
WHERE requirement_code = '8.4.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar y aplicar criterios para la evaluación, la selección, el seguimiento del desempeño y la reevaluación de los proveedores externos, basándose en su capacidad para proporcionar procesos o productos y servicios de acuerdo con los requisitos.', 5
FROM iso_requirements 
WHERE requirement_code = '8.4.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe conservar la información documentada adecuada de estas actividades y de cualquier acción necesaria que surja de las evaluaciones.', 6
FROM iso_requirements 
WHERE requirement_code = '8.4.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.4.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que los procesos, productos y servicios suministrados externamente no afectan de manera adversa a la capacidad de la organización de entregar productos y servicios conformes de manera coherente a sus clientes. La organización debe: asegurarse de que los procesos suministrados externamente permanecen dentro del control de su sistema de gestión de la calidad;', 1
FROM iso_requirements 
WHERE requirement_code = '8.4.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que los procesos, productos y servicios suministrados externamente no afectan de manera adversa a la capacidad de la organización de entregar productos y servicios conformes de manera coherente a sus clientes. La organización debe: definir los controles que pretende aplicar a un proveedor externo y los que pretende aplicar a las salidas resultantes;', 2
FROM iso_requirements 
WHERE requirement_code = '8.4.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) tener en consideración: el impacto potencial de los procesos, productos y servicios suministrados externamente en la capacidad de la organización de cumplir regularmente los requisitos del cliente y los legales y reglamentarios aplicables;', 3
FROM iso_requirements 
WHERE requirement_code = '8.4.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) tener en consideración: la eficacia de los controles aplicados por el proveedor externo;', 4
FROM iso_requirements 
WHERE requirement_code = '8.4.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) tener en consideración: determinar la verificación, u otras actividades, necesarias para asegurarse de que los procesos, productos y servicios suministrados externamente cumplen los requisitos.', 5
FROM iso_requirements 
WHERE requirement_code = '8.4.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.4.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de la adecuación de los requisitos antes de su comunicación al proveedor externo.', 1
FROM iso_requirements 
WHERE requirement_code = '8.4.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe comunicar a los proveedores externos sus requisitos para: los procesos, productos y servicios a proporcionar;', 2
FROM iso_requirements 
WHERE requirement_code = '8.4.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) la aprobación de: productos y servicios;', 3
FROM iso_requirements 
WHERE requirement_code = '8.4.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) la aprobación de: métodos, procesos y equipo;', 4
FROM iso_requirements 
WHERE requirement_code = '8.4.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) la aprobación de: la liberación de productos y servicios;', 5
FROM iso_requirements 
WHERE requirement_code = '8.4.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) la aprobación de: la competencia, incluyendo cualquier calificación de las personas requerida;', 6
FROM iso_requirements 
WHERE requirement_code = '8.4.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) la aprobación de: las interacciones del proveedor externo con la organización;', 7
FROM iso_requirements 
WHERE requirement_code = '8.4.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) la aprobación de: el control y el seguimiento del desempeño del proveedor externo a aplicar por la organización;', 8
FROM iso_requirements 
WHERE requirement_code = '8.4.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) la aprobación de: las actividades de verificación o validación que la organización, o su cliente, pretenden llevar a cabo en las instalaciones del proveedor externo.', 9
FROM iso_requirements 
WHERE requirement_code = '8.4.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.5.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe implementar la producción y prestación del servicio bajo condiciones controladas.', 1
FROM iso_requirements 
WHERE requirement_code = '8.5.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) la disponibilidad de información documentada que defina: las características de los productos a producir, los servicios a prestar, o las actividades a desempeñar;', 2
FROM iso_requirements 
WHERE requirement_code = '8.5.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) la disponibilidad de información documentada que defina: los resultados a alcanzar;', 3
FROM iso_requirements 
WHERE requirement_code = '8.5.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) la disponibilidad de información documentada que defina: la disponibilidad y el uso de los recursos de seguimiento y medición adecuados;', 4
FROM iso_requirements 
WHERE requirement_code = '8.5.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) la disponibilidad de información documentada que defina: la implementación de actividades de seguimiento y medición en las etapas apropiadas para verificar que se cumplen los criterios para el control de los procesos o las salidas, y los criterios de aceptación para los productos y servicios;', 5
FROM iso_requirements 
WHERE requirement_code = '8.5.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) la disponibilidad de información documentada que defina: el uso de la infraestructura y el ambiente adecuados para la operación de los procesos;', 6
FROM iso_requirements 
WHERE requirement_code = '8.5.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) la disponibilidad de información documentada que defina: la designación de personas competentes, incluyendo cualquier calificación requerida;', 7
FROM iso_requirements 
WHERE requirement_code = '8.5.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) la disponibilidad de información documentada que defina: la validación y revalidación periódica de la capacidad para alcanzar los resultados planificados de los procesos de producción y de prestación del servicio, donde el elemento de salida resultante no pueda verificarse mediante actividades de seguimiento o medición posteriores;', 8
FROM iso_requirements 
WHERE requirement_code = '8.5.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) la disponibilidad de información documentada que defina: la implementación de acciones para prevenir los errores humanos;', 9
FROM iso_requirements 
WHERE requirement_code = '8.5.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) la disponibilidad de información documentada que defina: la implementación de actividades de liberación, entrega y posteriores a la entrega.', 10
FROM iso_requirements 
WHERE requirement_code = '8.5.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.5.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe utilizar los medios adecuados para identificar las salidas cuando sea necesario para asegurar la conformidad de los productos y servicios.', 1
FROM iso_requirements 
WHERE requirement_code = '8.5.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe identificar el estado de las salidas con respecto a los requisitos de seguimiento y medición a través de la producción y prestación del servicio.', 2
FROM iso_requirements 
WHERE requirement_code = '8.5.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe controlar la identificación única de las salidas cuando la trazabilidad sea un requisito, y', 3
FROM iso_requirements 
WHERE requirement_code = '8.5.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Se debe conservar la información documentada necesaria para permitir la trazabilidad.', 4
FROM iso_requirements 
WHERE requirement_code = '8.5.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.5.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe cuidar la propiedad perteneciente a los clientes o a proveedores externos mientras esté bajo el control de la organización o esté siendo utilizado por la misma', 1
FROM iso_requirements 
WHERE requirement_code = '8.5.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe identificar, verificar, proteger y salvaguardar la propiedad de los clientes o de los proveedores externos suministrada para su utilización o incorporación dentro de los productos y servicios.', 2
FROM iso_requirements 
WHERE requirement_code = '8.5.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando la propiedad de un cliente o de un proveedor externo se pierda, deteriore o que de algún otro modo se considere inadecuada para su uso, la organización debe informar de esto al cliente o proveedor externo y', 3
FROM iso_requirements 
WHERE requirement_code = '8.5.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'conservar la información documentada sobre lo que ha ocurrido..', 4
FROM iso_requirements 
WHERE requirement_code = '8.5.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.5.4
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe preservar las salidas durante la producción y prestación del servicio, en la medida necesaria para asegurarse de la conformidad con los requisitos.', 1
FROM iso_requirements 
WHERE requirement_code = '8.5.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.5.5
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe cumplir los requisitos para las actividades posteriores a la entrega asociadas con los productos y servicios.', 1
FROM iso_requirements 
WHERE requirement_code = '8.5.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al determinar el alcance de las actividades posteriores a la entrega que se requieren, la organización debe considerar: los requisitos legales y reglamentarios;', 2
FROM iso_requirements 
WHERE requirement_code = '8.5.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al determinar el alcance de las actividades posteriores a la entrega que se requieren, la organización debe considerar: las potenciales consecuencias no deseadas asociadas con sus productos y servicios;', 3
FROM iso_requirements 
WHERE requirement_code = '8.5.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al determinar el alcance de las actividades posteriores a la entrega que se requieren, la organización debe considerar: la naturaleza, el uso y la vida prevista de sus productos y servicios;', 4
FROM iso_requirements 
WHERE requirement_code = '8.5.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al determinar el alcance de las actividades posteriores a la entrega que se requieren, la organización debe considerar: los requisitos del cliente;', 5
FROM iso_requirements 
WHERE requirement_code = '8.5.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al determinar el alcance de las actividades posteriores a la entrega que se requieren, la organización debe considerar: retroalimentación del cliente;', 6
FROM iso_requirements 
WHERE requirement_code = '8.5.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.5.6
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe revisar y controlar los cambios para la producción o la prestación del servicio, en la medida necesaria para asegurarse de la conformidad continua con los requisitos especificados.', 1
FROM iso_requirements 
WHERE requirement_code = '8.5.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe conservar información documentada que describa los resultados de la revisión de los cambios, las personas que autorizan el cambio y de cualquier acción necesaria que surja de la revisión.', 2
FROM iso_requirements 
WHERE requirement_code = '8.5.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.6
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe implementar las disposiciones planificadas, en las etapas adecuadas, para verificar que se cumplen los requisitos de los productos y servicios.', 1
FROM iso_requirements 
WHERE requirement_code = '8.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La liberación de los productos y servicios al cliente no debe llevarse a cabo hasta que se hayan completado satisfactoriamente las disposiciones planificadas, a menos que sea aprobado de otra manera por una autoridad pertinente y, cuando sea aplicable, por el cliente.', 2
FROM iso_requirements 
WHERE requirement_code = '8.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe conservar la información documentada sobre la liberación de los productos y servicios.', 3
FROM iso_requirements 
WHERE requirement_code = '8.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La información documentada debe incluir: evidencia de la conformidad con los criterios de aceptación;', 4
FROM iso_requirements 
WHERE requirement_code = '8.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La información documentada debe incluir: trazabilidad a las personas que han autorizado la liberación.', 5
FROM iso_requirements 
WHERE requirement_code = '8.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.7
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Control de los elementos de salida del proceso, los productos y los servicios no conformes', 1
FROM iso_requirements 
WHERE requirement_code = '8.7' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.7.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que las salidas que no sean conformes con sus requisitos se identifican y se controlan para prevenir su uso o entrega no intencional.', 1
FROM iso_requirements 
WHERE requirement_code = '8.7.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe tomar las acciones adecuadas basándose en la naturaleza de la no conformidad y en su efecto sobre la conformidad de los productos y servicios. Esto se debe aplicar también a los productos y servicios no conformes detectados después de la entrega de los productos, durante o después de la provisión de los servicios.', 2
FROM iso_requirements 
WHERE requirement_code = '8.7.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe tratar las salidas no conformes de una o más de las siguientes maneras: corrección;', 3
FROM iso_requirements 
WHERE requirement_code = '8.7.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe tratar las salidas no conformes de una o más de las siguientes maneras: separación, contención, devolución o suspensión de la provisión de los productos y servicios;', 4
FROM iso_requirements 
WHERE requirement_code = '8.7.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe tratar las salidas no conformes de una o más de las siguientes maneras: informar al cliente;', 5
FROM iso_requirements 
WHERE requirement_code = '8.7.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe tratar las salidas no conformes de una o más de las siguientes maneras: obtener autorización para su aceptación bajo concesión.', 6
FROM iso_requirements 
WHERE requirement_code = '8.7.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Debe verificarse la conformidad con los requisitos cuando las salidas no conformes se corrigen.', 7
FROM iso_requirements 
WHERE requirement_code = '8.7.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.7.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe mantener la información documentada que: describa la no conformidad;', 1
FROM iso_requirements 
WHERE requirement_code = '8.7.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe mantener la información documentada que: describa las acciones tomadas;', 2
FROM iso_requirements 
WHERE requirement_code = '8.7.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe mantener la información documentada que: describa las concesiones obtenidas;', 3
FROM iso_requirements 
WHERE requirement_code = '8.7.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe mantener la información documentada que: identifique la autoridad que ha decidido la acción con respecto a la no conformidad.', 4
FROM iso_requirements 
WHERE requirement_code = '8.7.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 9.1.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar: a qué es necesario hacer seguimiento y qué es necesario medir;', 1
FROM iso_requirements 
WHERE requirement_code = '9.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar: los métodos de seguimiento, medición, análisis y evaluación necesarios para asegurar resultados válidos;', 2
FROM iso_requirements 
WHERE requirement_code = '9.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar: cuándo se deben llevar a cabo el seguimiento y la medición;', 3
FROM iso_requirements 
WHERE requirement_code = '9.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar: cuándo se deben analizar y evaluar los resultados del seguimiento y la medición.', 4
FROM iso_requirements 
WHERE requirement_code = '9.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe evaluar el desempeño y la eficacia del sistema de gestión de la calidad.', 5
FROM iso_requirements 
WHERE requirement_code = '9.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe mantener la información documentada como evidencia de los resultados.', 6
FROM iso_requirements 
WHERE requirement_code = '9.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 9.1.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe realizar el seguimiento de las percepciones de los clientes del grado en que se cumplen sus necesidades y expectativas.', 1
FROM iso_requirements 
WHERE requirement_code = '9.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar los métodos para obtener, realizar el seguimiento y revisar esta información.', 2
FROM iso_requirements 
WHERE requirement_code = '9.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 9.1.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe analizar y evaluar los datos y la información apropiados originados por el seguimiento y la medición.', 1
FROM iso_requirements 
WHERE requirement_code = '9.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Los resultados del análisis deben utilizarse para evaluar: la conformidad de los productos y servicios;', 2
FROM iso_requirements 
WHERE requirement_code = '9.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Los resultados del análisis deben utilizarse para evaluar: el grado de satisfacción del cliente;', 3
FROM iso_requirements 
WHERE requirement_code = '9.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Los resultados del análisis deben utilizarse para evaluar: el desempeño y la eficacia del sistema de gestión de la calidad;', 4
FROM iso_requirements 
WHERE requirement_code = '9.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Los resultados del análisis deben utilizarse para evaluar: si lo planificado se ha implementado de forma eficaz;', 5
FROM iso_requirements 
WHERE requirement_code = '9.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Los resultados del análisis deben utilizarse para evaluar: la eficacia de las acciones tomadas para abordar los riesgos y oportunidades;', 6
FROM iso_requirements 
WHERE requirement_code = '9.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Los resultados del análisis deben utilizarse para evaluar: el desempeño de los proveedores externos;', 7
FROM iso_requirements 
WHERE requirement_code = '9.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Los resultados del análisis deben utilizarse para evaluar: la necesidad de mejoras en el sistema de gestión de la calidad.', 8
FROM iso_requirements 
WHERE requirement_code = '9.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 9.2.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) cumple: los requisitos propios de la organización para su sistema de gestión de la calidad;', 1
FROM iso_requirements 
WHERE requirement_code = '9.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) cumple: los requisitos de esta Norma Internacional;', 2
FROM iso_requirements 
WHERE requirement_code = '9.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) cumple: está implementado y mantenido eficazmente.', 3
FROM iso_requirements 
WHERE requirement_code = '9.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 9.2.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe: planificar, establecer, implementar y mantener uno o varios programas de auditoría que incluyan la frecuencia, los métodos, las responsabilidades, los requisitos de planificación y la elaboración de informes, que deben tener en consideración la importancia de los procesos involucrados, los cambios que afecten a la organización y los resultados de las auditorías previas;', 1
FROM iso_requirements 
WHERE requirement_code = '9.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe: para cada auditoría, definir los criterios de la auditoría y el alcance de cada auditoría;', 2
FROM iso_requirements 
WHERE requirement_code = '9.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe: seleccionar los auditores y llevar a cabo auditorías para asegurarse de la objetividad y la imparcialidad del proceso de auditoría;', 3
FROM iso_requirements 
WHERE requirement_code = '9.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe: asegurarse de que los resultados de las auditorías se informan a la dirección pertinente;', 4
FROM iso_requirements 
WHERE requirement_code = '9.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe: realizar las correcciones y tomar las acciones correctivas adecuadas sin demora injustificada;', 5
FROM iso_requirements 
WHERE requirement_code = '9.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe: conservar la información documentada como evidencia de la implementación del programa de auditoría y los resultados de la auditoría.', 6
FROM iso_requirements 
WHERE requirement_code = '9.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 9.3.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe revisar el sistema de gestión de la calidad de la organización a intervalos planificados, para asegurarse de su idoneidad, adecuación, eficacia y alineación con la dirección estratégica de la organización continuas.', 1
FROM iso_requirements 
WHERE requirement_code = '9.3.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 9.3.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La revisión por la dirección debe planificarse y llevarse a cabo incluyendo consideraciones sobre: el estado de las acciones desde revisiones por la dirección previas;', 1
FROM iso_requirements 
WHERE requirement_code = '9.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La revisión por la dirección debe planificarse y llevarse a cabo incluyendo consideraciones sobre: los cambios en las cuestiones externas e internas que sean pertinentes al sistema de gestión de la calidad;', 2
FROM iso_requirements 
WHERE requirement_code = '9.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) la información sobre el desempeño y la eficacia del sistema de gestión de la calidad, incluidas las tendencias relativas a: satisfacción del cliente y la retroalimentación de las partes interesadas pertinentes;', 3
FROM iso_requirements 
WHERE requirement_code = '9.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) la información sobre el desempeño y la eficacia del sistema de gestión de la calidad, incluidas las tendencias relativas a: el grado en que se han cumplido los objetivos de la calidad;', 4
FROM iso_requirements 
WHERE requirement_code = '9.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) la información sobre el desempeño y la eficacia del sistema de gestión de la calidad, incluidas las tendencias relativas a: desempeño de los procesos y conformidad de los productos y servicios;', 5
FROM iso_requirements 
WHERE requirement_code = '9.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) la información sobre el desempeño y la eficacia del sistema de gestión de la calidad, incluidas las tendencias relativas a: no conformidades y acciones correctivas;', 6
FROM iso_requirements 
WHERE requirement_code = '9.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) la información sobre el desempeño y la eficacia del sistema de gestión de la calidad, incluidas las tendencias relativas a: resultados de seguimiento y medición;', 7
FROM iso_requirements 
WHERE requirement_code = '9.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) la información sobre el desempeño y la eficacia del sistema de gestión de la calidad, incluidas las tendencias relativas a: resultados de las auditorías;', 8
FROM iso_requirements 
WHERE requirement_code = '9.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) la información sobre el desempeño y la eficacia del sistema de gestión de la calidad, incluidas las tendencias relativas a: el desempeño de los proveedores externos;', 9
FROM iso_requirements 
WHERE requirement_code = '9.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) la información sobre el desempeño y la eficacia del sistema de gestión de la calidad, incluidas las tendencias relativas a: la adecuación de los recursos;', 10
FROM iso_requirements 
WHERE requirement_code = '9.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) la información sobre el desempeño y la eficacia del sistema de gestión de la calidad, incluidas las tendencias relativas a: la eficacia de las acciones tomadas para abordar los riesgos y las oportunidades (véase 6.1);', 11
FROM iso_requirements 
WHERE requirement_code = '9.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) la información sobre el desempeño y la eficacia del sistema de gestión de la calidad, incluidas las tendencias relativas a: oportunidades de mejora.', 12
FROM iso_requirements 
WHERE requirement_code = '9.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 9.3.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Las salidas de la revisión por la dirección deben incluir las decisiones y acciones relacionadas con: las oportunidades de mejora;', 1
FROM iso_requirements 
WHERE requirement_code = '9.3.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Las salidas de la revisión por la dirección deben incluir las decisiones y acciones relacionadas con: cualquier necesidad de cambio en el sistema de gestión de la calidad;', 2
FROM iso_requirements 
WHERE requirement_code = '9.3.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Las salidas de la revisión por la dirección deben incluir las decisiones y acciones relacionadas con: las necesidades de recursos.', 3
FROM iso_requirements 
WHERE requirement_code = '9.3.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe conservar información documentada como evidencia de los resultados de las revisiones por la dirección.', 4
FROM iso_requirements 
WHERE requirement_code = '9.3.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 10.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar y seleccionar las oportunidades de mejora e implementar cualquier acción necesaria para cumplir los requisitos del cliente y aumentar la satisfacción del cliente.', 1
FROM iso_requirements 
WHERE requirement_code = '10.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Estas deben incluir: mejorar los productos y servicios para cumplir los requisitos, así como tratar las necesidades y expectativas futuras;', 2
FROM iso_requirements 
WHERE requirement_code = '10.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Estas deben incluir: corregir, prevenir o reducir los efectos indeseados;', 3
FROM iso_requirements 
WHERE requirement_code = '10.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Estas deben incluir: mejorar el desempeño y la eficacia del sistema de gestión de la calidad.', 4
FROM iso_requirements 
WHERE requirement_code = '10.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 10.2.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) reaccionar ante la no conformidad y, cuando sea aplicable: tomar acciones para controlarla y corregirla;', 1
FROM iso_requirements 
WHERE requirement_code = '10.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) reaccionar ante la no conformidad y, cuando sea aplicable: hacer frente a las consecuencias;', 2
FROM iso_requirements 
WHERE requirement_code = '10.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) evaluar la necesidad de acciones para eliminar las causas de la no conformidad, con el fin de que no vuelva a ocurrir ni ocurra en otra parte, mediante: la revisión y el análisis de la no conformidad;', 3
FROM iso_requirements 
WHERE requirement_code = '10.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) evaluar la necesidad de acciones para eliminar las causas de la no conformidad, con el fin de que no vuelva a ocurrir ni ocurra en otra parte, mediante: la determinación de las causas de la no conformidad;', 4
FROM iso_requirements 
WHERE requirement_code = '10.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) evaluar la necesidad de acciones para eliminar las causas de la no conformidad, con el fin de que no vuelva a ocurrir ni ocurra en otra parte, mediante: la determinación de si existen no conformidades similares, o que potencialmente podrían ocurrir;', 5
FROM iso_requirements 
WHERE requirement_code = '10.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) evaluar la necesidad de acciones para eliminar las causas de la no conformidad, con el fin de que no vuelva a ocurrir ni ocurra en otra parte, mediante: implementar cualquier acción necesaria;', 6
FROM iso_requirements 
WHERE requirement_code = '10.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) evaluar la necesidad de acciones para eliminar las causas de la no conformidad, con el fin de que no vuelva a ocurrir ni ocurra en otra parte, mediante: revisar la eficacia de cualquier acción correctiva tomada;', 7
FROM iso_requirements 
WHERE requirement_code = '10.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) evaluar la necesidad de acciones para eliminar las causas de la no conformidad, con el fin de que no vuelva a ocurrir ni ocurra en otra parte, mediante: si es necesario, actualizar los riesgos y oportunidades determinados durante la planificación;', 8
FROM iso_requirements 
WHERE requirement_code = '10.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) evaluar la necesidad de acciones para eliminar las causas de la no conformidad, con el fin de que no vuelva a ocurrir ni ocurra en otra parte, mediante: si es necesario, hacer cambios al sistema de gestión de la calidad.', 9
FROM iso_requirements 
WHERE requirement_code = '10.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Las acciones correctivas deben ser adecuadas a los efectos de las no conformidades encontradas.', 10
FROM iso_requirements 
WHERE requirement_code = '10.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 10.2.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe conservar información documentada, como evidencia de: la naturaleza de las no conformidades y cualquier acción posterior tomada;', 1
FROM iso_requirements 
WHERE requirement_code = '10.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe conservar información documentada, como evidencia de: los resultados de cualquier acción correctiva.', 2
FROM iso_requirements 
WHERE requirement_code = '10.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 10.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe mejorar continuamente la idoneidad, adecuación y eficacia del sistema de gestión de la calidad.', 1
FROM iso_requirements 
WHERE requirement_code = '10.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe considerar los resultados del análisis y la evaluación, y las salidas de la revisión por la dirección, para determinar si hay necesidades u oportunidades que deben tratarse como parte de la mejora continua.', 2
FROM iso_requirements 
WHERE requirement_code = '10.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
